import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const masterPolicy = await prisma.masterPolicy.findUnique({
      where: { id },
      include: {
        holder: true,
        policies: true,
      },
    });

    if (!masterPolicy) {
      return new Response(JSON.stringify({ message: 'Master Policy not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify(masterPolicy), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching master policy:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch master policy', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedMasterPolicy = await prisma.masterPolicy.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: {
        holder: true,
        policies: true,
      },
    });

    return new Response(JSON.stringify(updatedMasterPolicy), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error updating master policy:', error);
    return new Response(JSON.stringify({ message: 'Failed to update master policy', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
