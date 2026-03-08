import { SignJWT, jwtVerify } from "jose";

if (!process.env.WHR_JWT_SECRET) {
  throw new Error("CRITICAL_CONFIG_MISSING: WHR_JWT_SECRET is required");
}

const SECRET = new TextEncoder().encode(process.env.WHR_JWT_SECRET);
const ISSUER = "whr";
const AUDIENCE = "work-history-registry";

export interface RegistryTokenPayload {
  employee_hash_id: string;
  scope: "FULL" | "SINGLE" | "VERIFY_EVENTS";
  consent_id: string;
}

export async function issueToken(payload: RegistryTokenPayload, expiresIn: string = "24h") {
  return await new SignJWT({ 
    ...payload,
    scope: payload.scope || "VERIFY_EVENTS" 
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .setJti(crypto.randomUUID())
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<RegistryTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    
    return {
      employee_hash_id: payload.employee_hash_id as string,
      scope: payload.scope as any,
      consent_id: payload.consent_id as string,
    };
  } catch (error) {
    return null;
  }
}
