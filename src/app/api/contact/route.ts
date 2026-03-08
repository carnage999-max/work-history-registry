import { NextResponse } from "next/server";
import { recordEvent, DomainEventInput } from "@/lib/email/enqueue";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, organization, classification, message } = body;

    if (!email || !organization || !classification || !message) {
      return NextResponse.json(
        { error: "MISSING_FIELDS" },
        { status: 400 }
      );
    }

    const eventInput: DomainEventInput = {
      type: "CONTACT_INQUIRY",
      actor_type: "SYSTEM",
      actor_id: "public-surface",
      subject_type: "SYSTEM",
      subject_id: organization,
      payload: {
        email,
        organization,
        classification,
        message,
      },
    };

    // recordEvent handles the Resend dispatch (inline)
    await recordEvent(eventInput);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONTACT_API_ERROR", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
