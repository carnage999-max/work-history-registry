import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SignJWT } from "jose";
import { recordEvent } from "@/lib/email/enqueue";

const RESET_SECRET = process.env.WHR_JWT_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "MISSING_EMAIL" }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({ where: { email } });
    if (employee) {
      // generate token valid 1h
      const token = await new SignJWT({ employee_id: employee.id })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(Buffer.from(RESET_SECRET));

      // send reset email
      await recordEvent({
        type: "PASSWORD_RESET",
        actor_type: "SYSTEM",
        actor_id: "public-surface",
        subject_type: "EMPLOYEE",
        subject_id: employee.id,
        payload: { email, token }
      });
    }

    // respond success regardless to avoid enumeration
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("FORGOT_API_ERR", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}