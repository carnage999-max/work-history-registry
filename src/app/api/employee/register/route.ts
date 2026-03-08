import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { hashIdentifier } from "@/lib/registry-crypto";
import { createEmployeeSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, ssn } = await req.json();

    if (!name || !email || !password || !ssn) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    // 1. Generate the Blind Index (Hashed Identifier)
    const hashedSsn = hashIdentifier(ssn);

    // 2. Check if identity already exists
    const existing = await prisma.employee.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json({ error: "EMAIL_ALREADY_EXISTS" }, { status: 400 });
    }

    // 3. Secure Password Hashing
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Create the Registry Subject identity
    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        passwordHash,
        hashedSsn,
      }
    });

    // 5. Establish Session
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
    console.error("EMPLOYEE_REGISTRATION_ERROR", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
