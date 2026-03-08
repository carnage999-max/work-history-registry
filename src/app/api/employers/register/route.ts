import { NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/lib/email/enqueue";
import prisma from "@/lib/prisma";
import { createEmployerSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { employer_name, email, password } = await req.json();

    if (!employer_name || !email || !password) {
      return NextResponse.json({ error: "MISSING_DATA" }, { status: 400 });
    }

    const existingEmployer = await prisma.employer.findUnique({
      where: { email }
    });

    if (existingEmployer) {
      return NextResponse.json({ error: "EMAIL_EXISTS" }, { status: 400 });
    }

    // High-entropy hashing for institutional safety
    const passwordHash = await bcrypt.hash(password, 12);

    // Check for Registry Governance whitelist
    const adminEmails = (process.env.REGISTRY_ADMIN_EMAILS || "cod3.culture@gmail.com").split(",");
    const isAdmin = adminEmails.map(e => e.trim().toLowerCase()).includes(email.toLowerCase());

    const employer = await prisma.employer.create({
      data: {
        name: employer_name,
        email: email,
        passwordHash: passwordHash,
        status: isAdmin ? "VERIFIED" : "PENDING"
      }
    });

    // Create and sign a session token
    const token = await createEmployerSession({
      employer_id: employer.id,
      email: employer.email
    });

    // Log registration event via Domain Event system
    await recordEvent({
      type: "EMPLOYER_REGISTERED",
      actor_type: "SYSTEM",
      actor_id: employer.id,
      subject_type: "EMPLOYER",
      subject_id: employer.id,
      payload: { 
        employer_name: employer.name, 
        email: employer.email,
        status: employer.status,
        is_admin_registration: isAdmin // Signal to email system to suppress self-alerts
      }
    });

    // Return the token to the client (to be stored in a secure cookie normally)
    const response = NextResponse.json({ success: true });
    response.cookies.set("WHR_EMPLOYER_SESSION", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("REGISTRATION_ERROR", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
