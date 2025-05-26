import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma  } from '@/lib/db'

export async function POST(req: Request) {
  try {
    console.log('Received request body:', req.body);
    const body = await req.json()
    const { email, password, firstName, lastName, phone, role } = body

    // 验证邮箱是否已存在
    const existingUser = await prisma .user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '邮箱已被注册' },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await prisma .user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('[REGISTER_ERROR]', error)
    return NextResponse.json(
      { error: '注册时发生错误，请稍后重试' },
      { status: 500 }
    )
  }
}