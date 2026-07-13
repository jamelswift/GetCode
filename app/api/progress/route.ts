import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

type ProgressBody = {
  userId?: string | number
  lessonId?: string | number
  score?: number
  completed?: boolean
  submissionData?: unknown
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProgressBody

    const userId = Number.parseInt(String(body.userId ?? ''), 10)
    const lessonIdRaw = body.lessonId
    const lessonId = typeof lessonIdRaw === 'number' ? String(lessonIdRaw) : String(lessonIdRaw ?? '').trim()

    if (!Number.isFinite(userId) || !lessonId) {
      return NextResponse.json(
        { message: 'ข้อมูล userId หรือ lessonId ไม่ถูกต้อง' },
        { status: 400 },
      )
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json(
        { message: 'ไม่พบผู้ใช้ที่ต้องการบันทึกความคืบหน้า' },
        { status: 404 },
      )
    }

    const score = typeof body.score === 'number' ? body.score : null
    const completed = Boolean(body.completed)
    const submissionData =
      body.submissionData === null || body.submissionData === undefined
        ? Prisma.DbNull
        : (body.submissionData as Prisma.InputJsonValue)

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        score,
        completed,
        submittedAt: new Date(),
        submissionData,
      },
      create: {
        userId,
        lessonId,
        score,
        completed,
        submittedAt: new Date(),
        submissionData,
      },
    })

    return NextResponse.json({
      message: 'บันทึกความคืบหน้าสำเร็จ',
      progress: {
        userId,
        lessonId: progress.lessonId,
        score: progress.score,
        completed: progress.completed,
        submittedAt: progress.submittedAt.toISOString(),
        teacherFeedback: progress.teacherFeedback,
        submissionData: progress.submissionData,
        updatedAt: progress.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Progress save error:', error)

    return NextResponse.json(
      { message: 'ไม่สามารถบันทึกความคืบหน้าได้' },
      { status: 500 },
    )
  }
}
