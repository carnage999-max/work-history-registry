import { NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/lib/email/enqueue";
import prisma from "@/lib/prisma";
import { verifyEmployerSession } from "@/lib/auth";
import { hashSsn, generateRecordHash } from "@/lib/registry-crypto";

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("WHR_EMPLOYER_SESSION")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const session = await verifyEmployerSession(sessionToken);
    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const employer = await prisma.employer.findUnique({
      where: { id: session.employer_id }
    });

    if (!employer) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // Critical Authorization Check: Block Suspended Employers
    if (employer.status === "SUSPENDED") {
      return NextResponse.json({ error: "ACCESS_DENIED" }, { status: 403 });
    }

    // Capture attestation details from dynamic form
    const { employee_id, employee_name, event_type } = await req.json();

    if (!employee_id || !employee_name || !event_type) {
      return NextResponse.json({ error: "MISSING_DATA" }, { status: 400 });
    }

    // 1. Generate the Secure Hashed Identifier (Blind Index)
    const employeeHashedId = hashSsn(employee_id);

    // 2. Generate the institutional Display ID (Alias/Masked version)
    const employeeDisplayId = employee_id.length > 4 
      ? `ID-***${employee_id.slice(-4)}` 
      : `ID-${employee_id}`;

    // 3. Create cryptographic record hash for institutional permanence
    // We fetch the latest event for this subject to build the chain
    const lastEvent = await prisma.employmentEvent.findFirst({
        where: { employeeHashedId },
        orderBy: { attestedAt: 'desc' }
    });

    const recordHash = generateRecordHash({
        employerId: employer.id,
        employeeName: employee_name,
        employeeHashedId,
        eventType: event_type,
        timestamp: Date.now()
    }, lastEvent?.recordHash || null);

    // Persist the official record in the Registry database
    const event = await prisma.employmentEvent.create({
      data: {
        employerId: employer.id,
        employeeName: employee_name,
        employeeHashedId,
        employeeDisplayId,
        eventType: event_type,
        startDate: new Date(),
        recordHash: recordHash,
      }
    });

    // Log the event as "ATTESTED" within the Domain Event system and dispatch alerts
    await recordEvent({
      type: "EMPLOYMENT_EVENT_ATTESTED",
      actor_type: "EMPLOYER",
      actor_id: employer.id,
      subject_type: "EVENT",
      subject_id: event.id,
      payload: { 
        event_id: event.id, 
        employer_name: employer.name, 
        employer_email: employer.email, 
        employee_id: employeeDisplayId, // Use the alias for institutional notifications
        atttestor_id: employer.id 
      }
    });

    return NextResponse.json({ success: true, event_id: event.id });
  } catch (error: any) {
    console.error("ATTESTATION_ERROR", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
