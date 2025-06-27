// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('请输入邮箱和密码')
        }

        // 查找用户
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user?.password) {
          throw new Error('用户不存在')
        }

        // 比较密码
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('密码错误')
        }

        return user // 返回用户对象表示认证成功
      }
    })
  ],
  pages: {
    signIn: '/auth/signin' // 可选：自定义登录页面路径
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' // 推荐使用 JWT 来管理 session
  },
  callbacks: {
    async session({ session, user }) {
      // 将用户信息添加到 session 中
      if (user) {
        session.user = user
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }