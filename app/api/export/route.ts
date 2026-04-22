import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        progress: {
          orderBy: [{ lessonId: 'asc' }],
        },
      },
      orderBy: [{ id: 'asc' }],
    })

    const userRows = users.map((user) => ({
      userId: user.id,
      email: user.email,
      name: user.name ?? '',
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    }))

    const progressRows = users.flatMap((user) =>
      user.progress.map((progress) => ({
        userId: user.id,
        studentName: user.name ?? '',
        email: user.email,
        lessonId: progress.lessonId,
        score: progress.score,
        completed: progress.completed,
        expectedUpdatedAt: progress.updatedAt.toISOString(),
      })),
    )

    const workbook = XLSX.utils.book_new()
    const usersSheet = XLSX.utils.json_to_sheet(userRows)
    const progressSheet = XLSX.utils.json_to_sheet(progressRows)

    XLSX.utils.book_append_sheet(workbook, usersSheet, 'Users')
    XLSX.utils.book_append_sheet(workbook, progressSheet, 'Progress')

    const fileBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    }) as Buffer

    const fileName = `student-progress-${new Date().toISOString().slice(0, 10)}.xlsx`

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Export error:', error)

    return NextResponse.json(
      { message: 'ไม่สามารถ export ข้อมูลได้' },
      { status: 500 },
    )
  }
}
