import { NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/lib/email/enqueue";

export async function POST(req: NextRequest) {
  try {
    const { employee_id, action, email } = await req.json();

    if (action === "ISSUE") {
      await recordEvent({
        type: "CONSENT_ISSUED",
        actor_type: "EMPLOYEE",
        actor_id: employee_id,
        subject_type: "EMPLOYEE",
        subject_id: employee_id,
        payload: { employee_id, email }
      });
    } else if (action === "REVOKE") {
      await recordEvent({
        type: "CONSENT_REVOKED",
        actor_type: "EMPLOYEE",
        actor_id: employee_id,
        subject_type: "EMPLOYEE",
        subject_id: employee_id,
        payload: { employee_id, email }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
