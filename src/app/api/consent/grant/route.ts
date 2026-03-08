import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/token";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "MISSING_TOKEN" }, { status: 400 });
    }

    // Verify the token
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 400 });
    }

    // Check if consent already exists
    const existingConsent = await prisma.consent.findUnique({
      where: {
        employeeHashedId_authorizedActor: {
          employeeHashedId: payload.employee_hash_id,
          authorizedActor: "VERIFIER",
        }
      }
    });

    if (existingConsent) {
      return NextResponse.json({ success: true });
    }

    // Create consent
    await prisma.consent.create({
      data: {
        employeeHashedId: payload.employee_hash_id,
        authorizedActor: "VERIFIER",
        scope: "FULL",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("CONSENT_GRANT_ERROR", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}