import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to calculate premium with NCD (duplicate from policies/route.ts for self-containment)
function calculatePremiumWithNCD(basePremium: number, ncdYears: number): number {
  let discountFactor = 0;
  if (ncdYears >= 1 && ncdYears <= 3) {
    discountFactor = 0.05 * ncdYears; // 5% discount per year for first 3 years
  } else if (ncdYears > 3) {
    discountFactor = 0.15; // Max 15% discount for more than 3 years
  }
  return basePremium * (1 - discountFactor);
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const policy = await prisma.policy.findUnique({
      where: { id },
      include: {
        vehicle: true,
        customer: true,
        agent: true,
      },
    });

    if (!policy) {
      return new Response(JSON.stringify({ message: 'Policy not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify(policy), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching policy:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch policy', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedPolicy = await prisma.policy.update({
      where: { id },
      data: {
        ...data,
        premiumAmount: data.premiumAmount ? parseFloat(data.premiumAmount) : undefined,
        deductible: data.deductible ? parseFloat(data.deductible) : undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: {
        vehicle: true,
        customer: true,
        agent: true,
      },
    });

    return new Response(JSON.stringify(updatedPolicy), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error updating policy:', error);
    return new Response(JSON.stringify({ message: 'Failed to update policy', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // This is the ID of the policy to be renewed

    const oldPolicy = await prisma.policy.findUnique({
      where: { id },
      include: {
        customer: true, // Include customer to get NCD years
      },
    });

    if (!oldPolicy) {
      return new Response(JSON.stringify({ message: 'Original policy not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    let newPremiumAmount = oldPolicy.premiumAmount;
    if (oldPolicy.customer && oldPolicy.customer.ncdYears !== undefined) {
      newPremiumAmount = calculatePremiumWithNCD(newPremiumAmount.toNumber(), oldPolicy.customer.ncdYears);
    }

    // Create a new policy based on the old one
    const newPolicy = await prisma.policy.create({
      data: {
        policyNumber: `${oldPolicy.policyNumber}-R${Date.now()}`, // Generate a new policy number
        customerId: oldPolicy.customerId,
        vehicleId: oldPolicy.vehicleId,
        agentId: oldPolicy.agentId,
        policyType: oldPolicy.policyType,
        coverageLevel: oldPolicy.coverageLevel,
        premiumAmount: newPremiumAmount, // Apply NCD here
        deductible: oldPolicy.deductible,
        startDate: new Date(), // New start date (today)
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // One year from now
        status: 'ACTIVE', // New policy is active
      },
      include: {
        vehicle: true,
        customer: true,
        agent: true,
      },
    });

    // Update the status of the old policy to EXPIRED
    await prisma.policy.update({
      where: { id: oldPolicy.id },
      data: { status: 'EXPIRED' },
    });

    return new Response(JSON.stringify(newPolicy), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error renewing policy:', error);
    return new Response(JSON.stringify({ message: 'Failed to renew policy', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
