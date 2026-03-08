import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createEmployeeSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    // 1. Authenticate Identity
    const employee = await prisma.employee.findUnique({
      where: { email }
    });

    if (!employee || !(await bcrypt.compare(password, employee.passwordHash))) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    // 2. Refresh Professional Session
    const token = await createEmployeeSession({
      employee_id: employee.id,
      email: employee.email,
      hashed_ssn: employee.hashedSsn
    });

    const response = NextResponse.json({ 
      success: true, 
      employee_id: employee.id 
    });

    response.cookies.set("WHR_EMPLOYEE_SESSION", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error("EMPLOYEE_LOGIN_ERROR", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
