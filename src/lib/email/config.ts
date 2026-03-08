import { z } from "zod";

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  MAIL_FROM: z.string().min(1),
  APP_BASE_URL: z.string().url(),
});

function getEnv() {
  // In Next.js, process.env is available. 
  // We want to fail fast if these are missing.
  const result = envSchema.safeParse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    MAIL_FROM: process.env.MAIL_FROM,
    APP_BASE_URL: process.env.APP_BASE_URL,
  });

  if (!result.success) {
    const missing = result.error.issues.map(i => i.path.join(".")).join(", ");
    throw new Error(`CRITICAL_MAIL_CONFIG_MISSING: [${missing}]`);
  }

  return result.data;
}

export const mailConfig = getEnv();
