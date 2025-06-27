import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        policy: true,
        adjuster: true,
      },
    });

    if (!claim) {
      return new Response(JSON.stringify({ message: 'Claim not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify(claim), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching claim:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch claim', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: {
        ...data,
        incidentDate: data.incidentDate ? new Date(data.incidentDate) : undefined,
        reportDate: data.reportDate ? new Date(data.reportDate) : undefined,
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

    // Update NCD if claim status changes to APPROVED or SETTLED
    if (updatedClaim.status === 'APPROVED' || updatedClaim.status === 'SETTLED') {
      const policy = await prisma.policy.findUnique({
        where: { id: updatedClaim.policyId },
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

    return new Response(JSON.stringify(updatedClaim), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error updating claim:', error);
    return new Response(JSON.stringify({ message: 'Failed to update claim', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
