import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/token";
import prisma from "@/lib/prisma";
import { computeHashChain } from "@/lib/hashchain";


const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 10;

function getRateLimit(key: string): { count: number; retryAfter: number } {
  const now = Date.now();
  const limit = rateLimitMap.get(key) || { count: 0, lastReset: now };

  if (now - limit.lastReset > RATE_LIMIT_WINDOW) {
    limit.count = 1;
    limit.lastReset = now;
    rateLimitMap.set(key, limit);
    return { count: 1, retryAfter: 0 };
  }

  limit.count++;
  rateLimitMap.set(key, limit);
  
  const retryAfter = Math.ceil((limit.lastReset + RATE_LIMIT_WINDOW - now) / 1000);
  return { count: limit.count, retryAfter };
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    
    // Parse first IP from x-forwarded-for
    const xForwardedFor = req.headers.get("x-forwarded-for");
    const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "unknown";
    
    const rateLimitKey = `${ip}:${(token || "").slice(0, 8)}`;
    const { count, retryAfter } = getRateLimit(rateLimitKey);

    if (count > MAX_REQUESTS) {
      return new NextResponse(
        JSON.stringify({ error: "RATE_LIMITED" }),
        { 
          status: 429, 
          headers: { 
            "Content-Type": "application/json",
            "Retry-After": retryAfter.toString() 
          } 
        }
      );
    }

    if (!token) {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 400 });
    }

    // 1. Authenticate the Token Signature
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 400 });
    }

    const { employee_hash_id, consent_id, scope } = decoded;

    // 2. Execute the Identity Consent Gate (Live DB)
    const activeConsent = await prisma.consent.findUnique({
      where: { id: consent_id }
    });
    
    if (!activeConsent || activeConsent.expiresAt < new Date()) {
      return NextResponse.json(
        { 
          verification_result: "NOT_VERIFIED",
          consent_status: "EXPIRED_OR_MISSING",
          error: "CONSENT_REQUIRED" 
        },
        { status: 403 }
      );
    }

    // 3. Retrieve Records based on Scope
    const events = await prisma.employmentEvent.findMany({
        where: { employeeHashedId: employee_hash_id },
        orderBy: { attestedAt: "asc" },
        ...(scope !== "FULL" ? { take: 1 } : {})
    });

    // 4. Execute Real-Time Audit (Hash Chain Verification)
    const normalizedEvents = events.map((e: any) => ({
        id: e.id,
        employer_id: e.employerId,
        employee_hash_id: e.employeeHashedId,
        event_type: e.eventType,
        start_date: e.startDate,
        end_date: e.endDate,
        rehire_eligible: e.rehireEligible,
        attested_at: e.attestedAt
    }));

    const chainedEvents = await computeHashChain(normalizedEvents, employee_hash_id);

    // 5. Final Whitelist of Display DTOs
    const responseEvents = chainedEvents.map(ce => ({
      event_id: ce.event.id,
      employer_id: ce.event.employer_id,
      employee_hash_id: employee_hash_id,
      event_type: ce.event.event_type,
      start_date: ce.event.start_date,
      end_date: ce.event.end_date,
      rehire_eligible: ce.event.rehire_eligible,
      attested_at: ce.event.attested_at,
      record_hash: ce.record_hash,
      prev_record_hash: ce.prev_record_hash
    }));

    return NextResponse.json({
      verification_result: "VERIFIED",
      consent_status: "ACTIVE",
      scope: scope,
      events: responseEvents,
      disputes: []
    });

  } catch (error) {
    console.error("[API Verify Error]:", error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
