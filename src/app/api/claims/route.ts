import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const claims = await prisma.claim.findMany({
      include: {
        policy: true,
        adjuster: true,
      },
    });
    return new Response(JSON.stringify(claims), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch claims', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const claim = await prisma.claim.create({
      data: {
        ...data,
        incidentDate: new Date(data.incidentDate),
        reportDate: new Date(data.reportDate),
        estimatedDamage: data.estimatedDamage ? parseFloat(data.estimatedDamage) : undefined,
        claimAmount: data.claimAmount ? parseFloat(data.claimAmount) : undefined,
        settlementAmount: data.settlementAmount ? parseFloat(data.settlementAmount) : undefined,
        settlementDate: data.settlementDate ? new Date(data.settlementDate) : undefined,
      },
      include: {
        policy: true,
        adjuster: true,
      },
    });

    // Update NCD if claim is approved/settled (simplified logic)
    if (claim.status === 'APPROVED' || claim.status === 'SETTLED') {
      const policy = await prisma.policy.findUnique({
        where: { id: claim.policyId },
        select: { customerId: true },
      });

      if (policy && policy.customerId) {
        await prisma.user.update({
          where: { id: policy.customerId },
          data: {
            ncdYears: 0, // Reset NCD years
            lastClaimDate: new Date(),
          },
        });
      }
    }

    return new Response(JSON.stringify(claim), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error creating claim:', error);
    return new Response(JSON.stringify({ message: 'Failed to create claim', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
