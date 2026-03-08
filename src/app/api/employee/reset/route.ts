import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

const RESET_SECRET = process.env.WHR_JWT_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return NextResponse.json({ error: "MISSING_DATA" }, { status: 400 });
    }

    // verify token
    let payload: any;
    try {
      const verified = await jwtVerify(token, Buffer.from(RESET_SECRET));
      payload = verified.payload;
    } catch (e) {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 400 });
    }

    const employeeId = payload.employee_id as string;
    if (!employeeId) {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.employee.update({
      where: { id: employeeId },
      data: { passwordHash }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("RESET_API_ERR", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}