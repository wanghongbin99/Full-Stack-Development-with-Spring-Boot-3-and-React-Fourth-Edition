import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to calculate premium with NCD
function calculatePremiumWithNCD(basePremium: number, ncdYears: number): number {
  let discountFactor = 0;
  if (ncdYears >= 1 && ncdYears <= 3) {
    discountFactor = 0.05 * ncdYears; // 5% discount per year for first 3 years
  } else if (ncdYears > 3) {
    discountFactor = 0.15; // Max 15% discount for more than 3 years
  }
  return basePremium * (1 - discountFactor);
}

export async function GET() {
  try {
    const policies = await prisma.policy.findMany({
      include: {
        vehicle: true,
        customer: true, // Include customer info
        agent: true,    // Include agent info
      },
    });
    return new Response(JSON.stringify(policies), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) { // Explicitly type error as any
    console.error('Error fetching policies:', error);
    const errorMessage = error.message || 'An unknown error occurred';
    return new Response(JSON.stringify({ message: 'Failed to fetch policies', error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { proposalId, customerId, premiumAmount, ...policyData } = await request.json();

    // Fetch customer to get NCD years
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      select: { ncdYears: true },
    });

    let finalPremiumAmount = parseFloat(premiumAmount);
    if (customer && customer.ncdYears !== undefined) {
      finalPremiumAmount = calculatePremiumWithNCD(finalPremiumAmount, customer.ncdYears);
    }

    // Create the policy
    const policy = await prisma.policy.create({
      data: {
        ...policyData,
        customerId,
        premiumAmount: finalPremiumAmount,
        deductible: parseFloat(policyData.deductible),
        startDate: new Date(policyData.startDate),
        endDate: new Date(policyData.endDate),
      },
      include: {
        vehicle: true,
        customer: true,
        agent: true,
      },
    });

    // If a proposalId is provided, update the proposal status to APPROVED
    if (proposalId) {
      await prisma.proposal.update({
        where: { id: proposalId },
        data: { status: 'APPROVED' },
      });
    }

    return new Response(JSON.stringify(policy), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) { // Explicitly type error as any
    console.error('Error creating policy:', error);
    const errorMessage = error.message || 'An unknown error occurred';
    return new Response(JSON.stringify({ message: 'Failed to create policy', error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
