import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'

type LoginBody = {
  email?: string
  password?: string
  role?: 'student' | 'teacher'
}

function toTeacherPayload(user: {
  id: number
  name: string | null
  email: string
  createdAt: Date
}) {
  return {
    id: String(user.id),
    name: user.name ?? 'ครูผู้สอน',
    email: user.email,
    role: 'teacher' as const,
    createdAt: user.createdAt.toISOString(),
  }
}

function toStudentPayload(user: {
  id: number
  name: string | null
  email: string
  createdAt: Date
  progress: Array<{
    lessonId: string
    score: number | null
    completed: boolean
  }>
}) {
  const mappedProgress = user.progress
    .map((item) => {
      const numericLessonId = Number.parseInt(item.lessonId, 10)
      if (Number.isNaN(numericLessonId)) return null

      return {
        lessonId: numericLessonId,
        completed: item.completed,
        score: item.score ?? 0,
      }
    })
    .filter((item): item is { lessonId: number; completed: boolean; score: number } => Boolean(item))

  const totalScore = mappedProgress.reduce((sum, item) => sum + item.score, 0)
  const completedLessonIds = mappedProgress
    .filter((item) => item.completed)
    .map((item) => item.lessonId)
  const maxCompleted = completedLessonIds.length > 0 ? Math.max(...completedLessonIds) : 0
  const currentLesson = Math.min(maxCompleted + 1, 18)

  return {
    id: String(user.id),
    name: user.name ?? '',
    email: user.email,
    role: 'student',
    studentId: String(user.id),
    createdAt: user.createdAt.toISOString(),
    progress: mappedProgress,
    totalScore,
    currentLesson,
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody
    const email = body.email?.trim().toLowerCase() ?? ''
    const password = body.password ?? ''
    const expectedRole = body.role

    if (!email || !password) {
      return NextResponse.json(
        { message: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 },
      )
    }

    const teacherLoginEmail =
      process.env.TEACHER_LOGIN_EMAIL?.trim().toLowerCase() ??
      'wipatsasicha0702@gmail.com'
    const teacherLoginPassword =
      process.env.TEACHER_LOGIN_PASSWORD ?? 'Wicha0702'
    const teacherDisplayName = process.env.TEACHER_LOGIN_NAME?.trim() || 'ครูผู้สอน'

    if (expectedRole === 'teacher') {
      if (email === teacherLoginEmail && password === teacherLoginPassword) {
        // Allow teacher login even if database is temporarily unavailable.
        return NextResponse.json({
          message: 'เข้าสู่ระบบสำเร็จ',
          user: {
            id: 'teacher-env',
            name: teacherDisplayName,
            email: teacherLoginEmail,
            role: 'teacher',
            createdAt: new Date().toISOString(),
          },
        })
      }

      return NextResponse.json(
        { message: 'อีเมลหรือรหัสผ่านครูไม่ถูกต้อง' },
        { status: 401 },
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        progress: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 },
      )
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json(
        { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 },
      )
    }

    const normalizedRole = user.role.toUpperCase() === 'TEACHER' ? 'teacher' : 'student'
    if (expectedRole && normalizedRole !== expectedRole) {
      return NextResponse.json(
        { message: 'ประเภทผู้ใช้ไม่ตรงกับบัญชีนี้' },
        { status: 403 },
      )
    }

    if (normalizedRole === 'teacher') {
      return NextResponse.json({
        message: 'เข้าสู่ระบบสำเร็จ',
        user: toTeacherPayload(user),
      })
    }

    return NextResponse.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      user: toStudentPayload(user),
    })
  } catch (error) {
    console.error('Login error:', error)

    return NextResponse.json(
      { message: 'ไม่สามารถเข้าสู่ระบบได้' },
      { status: 500 },
    )
  }
}
