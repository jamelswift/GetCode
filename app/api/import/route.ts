import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

type ProgressRow = {
  userId: string | number
  lessonId: string | number
  score?: string | number | null
  completed?: string | number | boolean | null
  expectedUpdatedAt?: string | null
}

type ParsedRow = {
  rowNumber: number
  userId: number
  lessonId: string
  score: number | null
  completed: boolean
  expectedUpdatedAt: Date | null
}

type InvalidIssue = {
  rowNumber: number
  reason: string
}

type StaleIssue = {
  rowNumber: number
  userId: number
  lessonId: string
  reason: string
  currentUpdatedAt?: string
  expectedUpdatedAt?: string | null
}

function toInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value)
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseInt(value, 10)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

function toLessonId(value: unknown): string | null {
  if (typeof value === 'string' && value.trim() !== '') return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(Math.trunc(value))
  return null
}

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return ['true', '1', 'yes', 'y', 'ผ่าน', 'completed'].includes(normalized)
  }
  return false
}

function toDate(value: unknown): Date | null {
  if (typeof value !== 'string' || value.trim() === '') return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const action = formData.get('action') === 'commit' ? 'commit' : 'preview'

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: 'ไม่พบไฟล์ Excel ที่อัปโหลด' },
        { status: 400 },
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(Buffer.from(arrayBuffer), { type: 'buffer' })

    const progressSheetName = workbook.SheetNames.find(
      (name) => name.toLowerCase() === 'progress',
    )

    if (!progressSheetName) {
      return NextResponse.json(
        { message: 'ไม่พบชีตชื่อ Progress ในไฟล์ Excel' },
        { status: 400 },
      )
    }

    const progressSheet = workbook.Sheets[progressSheetName]
    const rows = XLSX.utils.sheet_to_json<ProgressRow>(progressSheet, {
      defval: null,
      raw: false,
    })

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'ไม่พบข้อมูลในชีต Progress' },
        { status: 400 },
      )
    }

    const invalidIssues: InvalidIssue[] = []
    const staleIssues: StaleIssue[] = []
    const validRows: ParsedRow[] = []
    let toCreateCount = 0
    let toUpdateCount = 0
    let createdCount = 0
    let updatedCount = 0

    for (const [index, row] of rows.entries()) {
      const rowNumber = index + 2
      const userId = toInt(row.userId)
      const lessonId = toLessonId(row.lessonId)
      const score = toInt(row.score)
      const completed = toBoolean(row.completed)
      const expectedUpdatedAt = toDate(row.expectedUpdatedAt)

      if (userId === null || lessonId === null) {
        invalidIssues.push({
          rowNumber,
          reason: 'userId หรือ lessonId ไม่ถูกต้อง',
        })
        continue
      }

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        invalidIssues.push({
          rowNumber,
          reason: `ไม่พบผู้ใช้ userId=${userId}`,
        })
        continue
      }

      const existing = await prisma.progress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
      })

      if (existing) {
        toUpdateCount += 1

        if (!expectedUpdatedAt) {
          staleIssues.push({
            rowNumber,
            userId,
            lessonId,
            reason: 'แถวนี้มีข้อมูลเดิมในระบบ แต่ไม่มี expectedUpdatedAt สำหรับเช็กข้อมูลทับ',
            currentUpdatedAt: existing.updatedAt.toISOString(),
            expectedUpdatedAt: row.expectedUpdatedAt ?? null,
          })
          continue
        }

        if (existing.updatedAt.getTime() !== expectedUpdatedAt.getTime()) {
          staleIssues.push({
            rowNumber,
            userId,
            lessonId,
            reason: 'ข้อมูลในระบบถูกแก้ไขไปแล้ว (stale)',
            currentUpdatedAt: existing.updatedAt.toISOString(),
            expectedUpdatedAt: expectedUpdatedAt.toISOString(),
          })
          continue
        }
      } else {
        toCreateCount += 1
      }

      validRows.push({
        rowNumber,
        userId,
        lessonId,
        score,
        completed,
        expectedUpdatedAt,
      })
    }

    if (action === 'commit') {
      for (const row of validRows) {
        const existing = await prisma.progress.findUnique({
          where: {
            userId_lessonId: {
              userId: row.userId,
              lessonId: row.lessonId,
            },
          },
        })

        if (existing) {
          await prisma.progress.update({
            where: {
              userId_lessonId: {
                userId: row.userId,
                lessonId: row.lessonId,
              },
            },
            data: {
              score: row.score,
              completed: row.completed,
            },
          })
          updatedCount += 1
        } else {
          await prisma.progress.create({
            data: {
              userId: row.userId,
              lessonId: row.lessonId,
              score: row.score,
              completed: row.completed,
            },
          })
          createdCount += 1
        }
      }
    }

    const skippedStaleCount = staleIssues.length
    const skippedInvalidCount = invalidIssues.length

    const payload = {
      message:
        action === 'preview'
          ? 'วิเคราะห์ไฟล์เรียบร้อย (ยังไม่บันทึกข้อมูล)'
          : 'นำเข้าข้อมูลสำเร็จ',
      action,
      summary: {
        totalRows: rows.length,
        toCreateCount,
        toUpdateCount,
        canApplyCount: validRows.length,
        createdCount,
        updatedCount,
        skippedStaleCount,
        skippedInvalidCount,
      },
      issues: {
        stale: staleIssues.slice(0, 20),
        invalid: invalidIssues.slice(0, 20),
      },
    }

    return NextResponse.json(payload)
  } catch (error) {
    console.error('Import error:', error)

    return NextResponse.json(
      { message: 'ไม่สามารถนำเข้าข้อมูลจาก Excel ได้' },
      { status: 500 },
    )
  }
}
