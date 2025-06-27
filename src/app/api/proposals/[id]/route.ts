import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    const updatedProposal = await prisma.proposal.update({
      where: { id },
      data: { status },
    });

    return new Response(JSON.stringify(updatedProposal), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error updating proposal:', error);
    return new Response(JSON.stringify({ message: 'Failed to update proposal', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
