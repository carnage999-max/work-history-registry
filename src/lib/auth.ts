import { SignJWT, jwtVerify } from "jose";

if (!process.env.WHR_JWT_SECRET) {
  throw new Error("CRITICAL_CONFIG_MISSING: WHR_JWT_SECRET is required");
}

const SECRET = new TextEncoder().encode(process.env.WHR_JWT_SECRET);
const ISSUER = "whr";
export interface EmployerSession {
  employer_id: string;
  email: string;
}

export interface EmployeeSession {
  employee_id: string;
  email: string;
  hashed_ssn: string;
}

const EMPLOYER_AUDIENCE = "work-history-registry-employers";
const EMPLOYEE_AUDIENCE = "work-history-registry-employees";

export async function createEmployerSession(payload: EmployerSession, expiresIn: string = "24h") {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(EMPLOYER_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .setJti(crypto.randomUUID())
    .sign(SECRET);
}

export async function verifyEmployerSession(token: string): Promise<EmployerSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: ISSUER,
      audience: EMPLOYER_AUDIENCE,
    });
    
    return {
      employer_id: payload.employer_id as string,
      email: payload.email as string,
    };
  } catch (error) {
    return null;
  }
}

export async function createEmployeeSession(payload: EmployeeSession, expiresIn: string = "24h") {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(EMPLOYEE_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .setJti(crypto.randomUUID())
    .sign(SECRET);
}

export async function verifyEmployeeSession(token: string): Promise<EmployeeSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: ISSUER,
      audience: EMPLOYEE_AUDIENCE,
    });
    
    return {
      employee_id: payload.employee_id as string,
      email: payload.email as string,
      hashed_ssn: payload.hashed_ssn as string,
    };
  } catch (error) {
    return null;
  }
}
