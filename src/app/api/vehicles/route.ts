// app/api/vehicles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const vehicles = await prisma.vehicle.findMany();
  return Response.json(vehicles);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Received vehicle data:", data);

    if (!data || typeof data !== "object") {
      console.error("Invalid payload:", data); // 添加日志信息
      throw new TypeError(
        'The "payload" argument must be of type object. Received null'
      );
    }

    const vehicle = await prisma.vehicle.create({ data });
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.error();
  }
}
