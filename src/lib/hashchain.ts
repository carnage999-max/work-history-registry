/**
 * Truly recursive canonical stringify.
 * - Sorts keys at every depth level.
 * - Handles ISO date formatting.
 * - Removes undefined values.
 */
function canonicalStringify(obj: any): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return "[" + obj.map(canonicalStringify).join(",") + "]";
  }

  if (obj instanceof Date) {
    return JSON.stringify(obj.toISOString());
  }

  const sortedKeys = Object.keys(obj)
    .filter(key => obj[key] !== undefined)
    .sort();

  const joined = sortedKeys
    .map(key => `${JSON.stringify(key)}:${canonicalStringify(obj[key])}`)
    .join(",");

  return "{" + joined + "}";
}

async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface ChainedEvent {
  event: any;
  record_hash: string;
  prev_record_hash: string | null;
}

/**
 * Computes the hash chain for a set of events.
 * hash = sha256("WHR_EVENT_V1|" + canonical_payload + "|" + prev_hash)
 */
export async function computeHashChain(events: any[], employee_hash_id: string): Promise<ChainedEvent[]> {
  const chained: ChainedEvent[] = [];
  let prevHash: string | null = "ROOT_NULL";

  for (const event of events) {
    // Strict DTO for hashing as per spec V1
    const payloadObject = {
      event_id: event.id,
      employer_id: event.employer_id,
      employee_hash_id: employee_hash_id,
      event_type: event.event_type,
      start_date: event.start_date,
      end_date: event.end_date,
      rehire_eligible: event.rehire_eligible,
      attested_at: event.attested_at
    };

    const canonicalPayload = canonicalStringify(payloadObject);
    const hashInput = `WHR_EVENT_V1|${canonicalPayload}|${prevHash}`;
    const currentHash = await sha256(hashInput);

    chained.push({
      event,
      record_hash: currentHash,
      prev_record_hash: prevHash === "ROOT_NULL" ? null : prevHash,
    });

    prevHash = currentHash;
  }

  return chained;
}
