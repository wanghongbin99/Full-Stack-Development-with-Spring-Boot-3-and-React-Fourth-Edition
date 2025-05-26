// app/api/policies/route.ts
import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const policies = await prisma.policy.findMany({
    include: {
      vehicle: true
    }
  })
  return Response.json(policies)
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  const policy = await prisma.policy.create({
    data,
    include: {
      vehicle: true
    }
  })
  return Response.json(policy)
}