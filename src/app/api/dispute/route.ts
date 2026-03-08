import { NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/lib/email/enqueue";

export async function POST(req: NextRequest) {
  try {
    const { record_id, employee_id } = await req.json();

    await recordEvent({
      type: "DISPUTE_FILED",
      actor_type: "EMPLOYEE",
      actor_id: employee_id,
      subject_type: "EVENT",
      subject_id: record_id,
      payload: { record_id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
