import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const proposal = await prisma.proposal.create({
      data: {
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        policyType: data.policyType,
        coverageLevel: data.coverageLevel,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        notes: data.notes || null,
        status: 'PENDING', // Default status
      },
    });
    return new Response(JSON.stringify(proposal), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return new Response(JSON.stringify({ message: 'Failed to create proposal', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function GET() {
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        customer: true,
        vehicle: true,
      },
    });
    return new Response(JSON.stringify(proposals), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch proposals', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
