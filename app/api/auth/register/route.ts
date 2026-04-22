import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'

type RegisterBody = {
  name?: string
  email?: string
  password?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterBody
    const name = body.name?.trim() ?? ''
    const email = body.email?.trim().toLowerCase() ?? ''
    const password = body.password ?? ''

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
        { status: 400 },
      )
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json(
        { message: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 409 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'STUDENT',
      },
    })

    return NextResponse.json({
      message: 'ลงทะเบียนสำเร็จ',
      user: {
        id: String(user.id),
        name: user.name ?? '',
        email: user.email,
        role: 'student',
        studentId: String(user.id),
        createdAt: user.createdAt.toISOString(),
        progress: [],
        totalScore: 0,
        currentLesson: 1,
      },
    })
  } catch (error) {
    console.error('Register error:', error)

    return NextResponse.json(
      { message: 'ไม่สามารถลงทะเบียนได้' },
      { status: 500 },
    )
  }
}
