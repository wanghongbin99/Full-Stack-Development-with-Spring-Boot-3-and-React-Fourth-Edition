// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
   // Initialize customer data
  const customer1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      firstName: 'John ',
      lastName: 'Doe',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      firstName: 'Jane ',
      lastName: 'Smith',
    },
  });
  // 初始化车辆数据
  const vehicle1 = await prisma.vehicle.create({
    data: {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      vin: '1HGCM82633A123456',
      ownerId: customer1.id,
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      vin: '2HGCM82633A123456',
      ownerId: customer2.id,
    },
  });

  // 初始化保单数据
  const policy1 = await prisma.policy.create({
    data: {
      policyNumber: 'POL123456',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      vehicleId: vehicle1.id,
      customerId: customer1.id, // Replace with a valid customer ID
      policyType: 'COMPREHENSIVE', // Example value
      coverageLevel: 'BASIC', // Example value (replace with the actual enum value from your schema)
      premiumAmount: 1200.00, // Example value
      deductible: 500.00, // Example value
    },
  });

  const policy2 = await prisma.policy.create({
    data: {
      policyNumber: 'POL654321',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-06-01'),
      vehicleId: vehicle2.id,
      customerId: customer2.id, // Replace with a valid customer ID
      policyType: 'THIRD_PARTY', // Example value
      coverageLevel: 'STANDARD', // Example value
      premiumAmount: 800.00, // Example value
      deductible: 300.00, // Example value
    },
  });

  console.log({ vehicle1, vehicle2, policy1, policy2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });