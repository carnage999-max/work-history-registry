import { z } from "zod";

const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";
const LOGO_URL = `${APP_BASE_URL}/logo.png`;

export const TemplateIds = [
  "TPL_EMPLOYER_REGISTERED",
  "TPL_EMPLOYER_VERIFIED",
  "TPL_EMPLOYER_SUSPENDED",
  "TPL_EMPLOYMENT_EVENT_ATTESTED",
  "TPL_DISPUTE_FILED",
  "TPL_CONSENT_ISSUED",
  "TPL_CONSENT_REVOKED",
  "TPL_CONTACT_INQUIRY",
  "TPL_EMPLOYEE_PASSWORD_RESET",
  "TPL_EMPLOYER_WELCOME",
] as const;

export type TemplateId = typeof TemplateIds[number];

export interface EmailTemplate<T> {
  subject: (vars: T) => string;
  renderHtml: (vars: T) => string;
  renderText: (vars: T) => string;
  schema: z.ZodSchema<T>;
}

// Institutional Design System for Emails
const COLORS = {
  slate: "#1F2937",
  graphite: "#374151",
  blue: "#3B82F6",
  gray50: "#f8fafc",
  gray200: "#e2e8f0",
  muted: "#64748b",
};

const wrapEmailHtml = (body: string, previewText: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, sans-serif; line-height: 1.6; color: ${COLORS.graphite}; margin: 0; padding: 0; background-color: ${COLORS.gray50}; }
    .wrapper { width: 100%; table-layout: fixed; background-color: ${COLORS.gray50}; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid ${COLORS.gray200}; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background-color: ${COLORS.slate}; padding: 32px; text-align: left; }
    .logo { width: 48px; height: 48px; margin-bottom: 16px; }
    .content { padding: 40px; }
    .footer { background-color: #ffffff; padding: 32px; border-top: 1px solid ${COLORS.gray200}; text-align: left; }
    .footer-text { font-size: 12px; color: ${COLORS.muted}; margin: 0; line-height: 1.5; }
    .button { display: inline-block; background-color: ${COLORS.slate}; color: #ffffff !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 24px; }
    h1 { color: ${COLORS.slate}; font-size: 24px; font-weight: 700; margin: 0 0 24px 0; }
    p { margin: 0 0 16px 0; }
    ul { padding-left: 20px; margin: 0 0 16px 0; }
    li { margin-bottom: 8px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; background-color: ${COLORS.gray50}; border: 1px solid ${COLORS.gray200}; font-size: 11px; font-weight: 700; color: ${COLORS.muted}; text-transform: uppercase; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <img src="${LOGO_URL}" alt="Work History Registry Logo" class="logo">
      </div>
      <div class="content">
        ${body}
      </div>
      <div class="footer">
        <p class="footer-text">
          <strong>Work History Registry | Institutional Data Processing</strong><br>
          This is an automated institutional notification. No response is required.<br>
          The Registry operates under strict data integrity and neutrality mandates.<br>
          Verification IDs and hash proofs are available via the secure portal.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const EMAIL_FOOTER_TEXT = `
--
Work History Registry | Institutional Data Processing
This is an automated institutional notification. No response is required.
The Registry operates under strict data integrity and neutrality mandates.
`;

export const EMAIL_TEMPLATES: Record<TemplateId, EmailTemplate<any>> = {
  TPL_EMPLOYER_WELCOME: {
    subject: () => "Registry Access: Institutional Account Created",
    schema: z.object({ employer_name: z.string() }),
    renderHtml: (v) => wrapEmailHtml(`
      <div class="badge">Success</div>
      <h1>Institutional Account Established</h1>
      <p>The institutional account for <strong>${v.employer_name}</strong> has been successfully established within the Work History Registry.</p>
      <p>As an authorized representative, you may now utilize the Registry Portal to:</p>
      <ul>
        <li>Attest to professional employment events</li>
        <li>Synchronize payroll record hashes</li>
        <li>Execute candidate history verifications</li>
      </ul>
      <p>Your access is currently in 'PENDING' status while we finalize institutional audit procedures. Core reporting functionality remains enabled.</p>
      <a href="\${process.env.APP_BASE_URL}/employers" class="button">Access Institutional Portal</a>
    `, "Institutional Account Created"),
    renderText: (v) => `
      The institutional account for ${v.employer_name} has been successfully established within the Work History Registry.
      
      As an authorized representative, you may now utilize the Registry Portal to:
      - Attest to professional employment events
      - Synchronize payroll record hashes
      - Execute candidate history verifications
      
      Your access is currently in 'PENDING' status while we finalize institutional audit procedures. Core reporting functionality remains enabled.
      
      ${EMAIL_FOOTER_TEXT}
    `,
  },
  TPL_EMPLOYER_REGISTERED: {
    subject: () => "Institutional Account Registration: Review Required",
    schema: z.object({ employer_name: z.string() }),
    renderHtml: (v) => wrapEmailHtml(`
      <div class="badge">Action Required</div>
      <h1>New Institutional Registration</h1>
      <p>A new registration for <strong>${v.employer_name}</strong> has been received by the Registry.</p>
      <p>This application is currently awaiting institutional verification and administrative review.</p>
      <a href="\${process.env.APP_BASE_URL}/admin" class="button">Review Application</a>
    `, "Review Required"),
    renderText: (v) => `The registration for ${v.employer_name} has been received by the Registry and is currently awaiting institutional verification.\n${EMAIL_FOOTER_TEXT}`,
  },
  TPL_EMPLOYER_VERIFIED: {
    subject: () => "Institutional Account Status: Verified",
    schema: z.object({ employer_name: z.string() }),
    renderHtml: (v) => wrapEmailHtml(`
      <div class="badge">Status Update</div>
      <h1>Account Verified</h1>
      <p>The account for <strong>${v.employer_name}</strong> has been successfully verified for Registry access. All institutional restrictions have been elevated.</p>
      <a href="\${process.env.APP_BASE_URL}/employers" class="button">Go to Dashboard</a>
    `, "Account Verified"),
    renderText: (v) => `The account for ${v.employer_name} has been successfully verified for Registry access.\n${EMAIL_FOOTER_TEXT}`,
  },
  TPL_EMPLOYER_SUSPENDED: {
    subject: () => "Institutional Account Status: Suspended",
    schema: z.object({ employer_name: z.string() }),
    renderHtml: (v) => wrapEmailHtml(`
      <div class="badge">Urgent</div>
      <h1>Access Suspended</h1>
      <p>The Registry access for <strong>${v.employer_name}</strong> has been suspended per institutional safety protocols.</p>
      <p>If you believe this is in error, please contact Registry Governance immediately.</p>
    `, "Access Suspended"),
    renderText: (v) => `The Registry access for ${v.employer_name} has been suspended per institutional protocols.\n${EMAIL_FOOTER_TEXT}`,
  },
  TPL_EMPLOYMENT_EVENT_ATTESTED: {
    subject: () => "Record Attested: Professional Registry of Record",
    schema: z.object({ 
      employer_name: z.string(), 
      event_id: z.string(),
      employee_id: z.string() 
    }),
    renderHtml: (v) => wrapEmailHtml(`
      <div class="badge">Attestation Confirmed</div>
      <h1>Professional Record Secured</h1>
      <p>A professional record has been successfully attested into the Registry.</p>
      <ul>
        <li><strong>Event ID:</strong> ${v.event_id}</li>
        <li><strong>Attesting Body:</strong> ${v.employer_name}</li>
        <li><strong>Subject Reference:</strong> ${v.employee_id}</li>
      </ul>
      <p>The cryptographic provenance and hash chain for this event have been verified and sealed.</p>
    `, "Record Attested"),
    renderText: (v) => `A professional record (ID: ${v.event_id}) has been attested by ${v.employer_name} into the Registry. Provenance and hash chain and verified.\n${EMAIL_FOOTER_TEXT}`,
  },
  TPL_DISPUTE_FILED: {
    subject: () => "Registry Notification: Record Dispute Initialized",
    schema: z.object({ record_id: z.string() }),
    renderHtml: (v) => wrapEmailHtml(`
      <div class="badge">Dispute Notice</div>
      <h1>Record Dispute Initialized</h1>
      <p>A formal dispute has been initialized regarding professional record <strong>${v.record_id}</strong>.</p>
      <p>The record metadata has been updated to reflect the 'In Dispute' status in the public Registry index.</p>
    `, "Dispute Initialized"),
    renderText: (v) => `A formal dispute has been initialized regarding professional record ${v.record_id}. The record metadata has been updated to reflect the 'In Dispute' status.\n${EMAIL_FOOTER_TEXT}`,
  },
  TPL_CONSENT_ISSUED: {
    subject: () => "Authorization Issued: Data Access Token",
    schema: z.object({ employee_id: z.string() }),
    renderHtml: (v) => wrapEmailHtml(`
      <div class="badge">Authorization</div>
      <h1>Data Access Authorized</h1>
      <p>Authorization for data access to records associated with unique ID <strong>${v.employee_id}</strong> has been successfully issued by the subject.</p>
    `, "Authorization Issued"),
    renderText: (v) => `Authorization for data access to records associated with unique ID ${v.employee_id} has been successfully issued by the subject.\n${EMAIL_FOOTER_TEXT}`,
  },
  TPL_CONSENT_REVOKED: {
    subject: () => "Authorization Revoked: Data Access Terminated",
    schema: z.object({ employee_id: z.string() }),
    renderHtml: (v) => wrapEmailHtml(`
      <div class="badge">Authorization Terminated</div>
      <h1>Access Revoked</h1>
      <p>Authorization for data access to records associated with unique ID <strong>${v.employee_id}</strong> has been formally revoked.</p>
    `, "Authorization Revoked"),
    renderText: (v) => `Authorization for data access to records associated with unique ID ${v.employee_id} has been formally revoked.\n${EMAIL_FOOTER_TEXT}`,
  },
  TPL_EMPLOYEE_PASSWORD_RESET: {
    subject: () => "Password Reset Instructions",
    schema: z.object({ email: z.string().email(), token: z.string() }),
    renderHtml: (v: any) => wrapEmailHtml(`
      <div class="badge">Security</div>
      <h1>Password Reset Requested</h1>
      <p>Someone requested a password reset for the following email address:</p>
      <p><strong>${v.email}</strong></p>
      <p>If this was you, click the link below to choose a new password. The link expires in one hour.</p>
      <p><a href="${process.env.APP_BASE_URL}/employee/reset/${v.token}" class="button">Reset Password</a></p>
      <p>If you did not request this, you can safely ignore this message.</p>
    `, "Password Reset"),
    renderText: (v: any) => `Password reset requested for ${v.email}.

Visit ${process.env.APP_BASE_URL}/employee/reset/${v.token} to set a new password (expires in one hour).

If you did not request this, ignore this email.
    `,
  },
  TPL_CONTACT_INQUIRY: {
    subject: (v: any) => `New Contact Request: ${v.classification} from ${v.organization}`,
    schema: z.object({
      email: z.string().email(),
      organization: z.string(),
      classification: z.string(),
      message: z.string(),
    }),
    renderHtml: (v: any) => wrapEmailHtml(`
      <div class="badge">Contact Request</div>
      <h1>New Message from Registry Portal</h1>
      <p>You've received a contact message:</p>
      <table style="width:100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 12px; border: 1px solid ${COLORS.gray200}; font-weight: 700;">Organization</td>
          <td style="padding: 12px; border: 1px solid ${COLORS.gray200};">${v.organization}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid ${COLORS.gray200}; font-weight: 700;">Contact Email</td>
          <td style="padding: 12px; border: 1px solid ${COLORS.gray200};">${v.email}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid ${COLORS.gray200}; font-weight: 700;">Topic</td>
          <td style="padding: 12px; border: 1px solid ${COLORS.gray200};">${v.classification}</td>
        </tr>
      </table>
      <p><strong>Message:</strong></p>
      <div style="background-color: ${COLORS.gray50}; border-left: 4px solid ${COLORS.gray200}; padding: 20px; color: ${COLORS.slate};">
        ${v.message}
      </div>
    `, "Contact Request"),
    renderText: (v: any) => `
      You've received a contact message:
      Organization: ${v.organization}
      Contact Email: ${v.email}
      Topic: ${v.classification}
      
      Message:
      ${v.message}
      
      ${EMAIL_FOOTER_TEXT}
    `,
  },
};
