import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createEmployerSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "MISSING_DATA" }, { status: 400 });
    }

    const employer = await prisma.employer.findUnique({
      where: { email }
    });

    if (!employer) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    // High-integrity credential verification
    const isPasswordValid = await bcrypt.compare(password, employer.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    // Critical Authorization Check: Deny suspended employers
    if (employer.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "Access unavailable. Please contact the Registry." }, 
        { status: 403 }
      );
    }

    // Session logic: sign the session token
    const token = await createEmployerSession({
      employer_id: employer.id,
      email: employer.email
    });

    const response = NextResponse.json({ success: true, status: employer.status });
    
    // Cookie-based session storage
    response.cookies.set("WHR_EMPLOYER_SESSION", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("LOGIN_ERROR", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
