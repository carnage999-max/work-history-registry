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

    // use upsert to avoid unique constraint violations when the same actor requests a second token
    const consent = await prisma.consent.upsert({
      where: {
        employeeHashedId_authorizedActor: {
          employeeHashedId: session.hashed_ssn,
          authorizedActor: authorizedActor || "ANY",
        }
      },
      update: {
        scope: scope || "FULL",
        expiresAt: expiresAt,
      },
      create: {
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

export async function DELETE(req: NextRequest) {
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

    const { consentId } = await req.json();

    if (!consentId) {
      return NextResponse.json({ error: "MISSING_CONSENT_ID" }, { status: 400 });
    }

    // Verify the consent belongs to this employee
    const consent = await prisma.consent.findUnique({
      where: { id: consentId },
      include: { employee: true }
    });

    if (!consent || consent.employeeId !== session.employee_id) {
      return NextResponse.json({ error: "CONSENT_NOT_FOUND" }, { status: 404 });
    }

    // Delete the consent
    await prisma.consent.delete({
      where: { id: consentId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("CONSENT_DELETION_ERROR", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
