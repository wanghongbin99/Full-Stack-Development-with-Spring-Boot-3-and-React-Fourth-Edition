import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const masterPolicies = await prisma.masterPolicy.findMany({
      include: {
        holder: true,
        policies: true,
      },
    });
    return new Response(JSON.stringify(masterPolicies), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching master policies:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch master policies', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const masterPolicy = await prisma.masterPolicy.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
      include: {
        holder: true,
        policies: true,
      },
    });
    return new Response(JSON.stringify(masterPolicy), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error creating master policy:', error);
    return new Response(JSON.stringify({ message: 'Failed to create master policy', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
