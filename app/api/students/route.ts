import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { mapStudentRecord } from '@/lib/progress-mappers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
      include: {
        progress: {
          orderBy: [{ updatedAt: 'desc' }],
        },
      },
      orderBy: [{ id: 'asc' }],
    })

    return NextResponse.json({
      students: users.map((user) => mapStudentRecord(user)),
    })
  } catch (error) {
    console.error('Students fetch error:', error)

    return NextResponse.json(
      { message: 'ไม่สามารถโหลดข้อมูลนักเรียนได้' },
      { status: 500 },
    )
  }
}