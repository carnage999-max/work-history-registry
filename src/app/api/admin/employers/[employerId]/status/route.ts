import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyEmployerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { recordEvent } from "@/lib/email/enqueue";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ employerId: string }> }
) {
  try {
    const { employerId } = await params;
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("WHR_EMPLOYER_SESSION")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const session = await verifyEmployerSession(sessionToken);
    const isAdmin = session?.email === "nathan@membershipauto.com" || session?.email === "cod3.culture@gmail.com";

    if (!isAdmin) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const { status } = await request.json();
    if (!status || !["VERIFIED", "SUSPENDED", "PENDING"].includes(status)) {
       return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
    }

    const employer = await prisma.employer.update({
      where: { id: employerId },
      data: { status }
    });

    // Record formal event for traceability
    await recordEvent({
      type: status === "VERIFIED" ? "EMPLOYER_VERIFIED" : "EMPLOYER_SUSPENDED",
      actor_type: "ADMIN",
      actor_id: session!.employer_id, // Admin's own ID
      subject_type: "EMPLOYER",
      subject_id: employer.id,
      payload: { 
        email: employer.email, 
        employer_name: employer.name,
        new_status: status 
      }
    });

    return NextResponse.json({ success: true, status: employer.status });
  } catch (error) {
    console.error("ADMIN_STATUS_UPDATE_ERROR", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
