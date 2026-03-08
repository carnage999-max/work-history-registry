import crypto from "crypto";

export function hashIdentifier(identifier: string): string {
  // In a real production system, we'd use a PEP (Policy Enforcement Point) 
  // with a master salt from a HSM. For this implementation, we use a 
  // deterministic hash for the Blind Index link.
  return crypto
    .createHash("sha256")
    .update(identifier.trim().replace(/[-\s]/g, ""))
    .digest("hex");
}

// Legacy alias for backward compatibility
export const hashSsn = hashIdentifier;

export function generateRecordHash(payload: any, prevHash: string | null): string {
  const content = JSON.stringify(payload);
  return crypto
    .createHash("sha256")
    .update(`WHR_V1|${content}|${prevHash || "ROOT"}`)
    .digest("hex");
}
