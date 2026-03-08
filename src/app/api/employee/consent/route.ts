import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyEmployeeSession } from "@/lib/auth";
import { issueToken } from "@/lib/token";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = req.cookies;
    const sessionToken = cookieStore.get("WHR_EMPLOYEE_SESSION")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const session = await verifyEmployeeSession(sessionToken);
    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { scope, authorizedActor, expiresInDays } = await req.json();

    // 1. Establish the Registry Consent in the database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 7));

    const consent = await prisma.consent.create({
      data: {
        ...(session.employee_id ? { employee: { connect: { id: session.employee_id } } } : {}),
        employeeHashedId: session.hashed_ssn,
        authorizedActor: authorizedActor || "ANY",
        scope: scope || "FULL",
        expiresAt: expiresAt
      }
    });

    // 2. Issue the cryptographically signed Token
    const token = await issueToken({
      employee_hash_id: session.hashed_ssn,
      scope: (scope === "FULL" ? "FULL" : "VERIFY_EVENTS") as any,
      consent_id: consent.id
    }, `${expiresInDays || 7}d`);

    return NextResponse.json({ 
      success: true, 
      token,
      consent_id: consent.id 
    });

  } catch (error: any) {
    console.error("CONSENT_CREATION_ERROR", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
