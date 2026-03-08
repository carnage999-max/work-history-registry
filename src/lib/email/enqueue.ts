import { Resend } from "resend";
import { mailConfig } from "./config";
import { EMAIL_TEMPLATES, TemplateId } from "./templates";
import { eventStore, ActorType, SubjectType, DomainEvent } from "./store";

const resend = new Resend(mailConfig.RESEND_API_KEY);

export interface DomainEventInput {
  type: string;
  actor_type: ActorType;
  actor_id: string;
  subject_type: SubjectType;
  subject_id: string;
  payload: any;
}

/**
 * Sends an email inline and logs the domain event.
 * Failures in email sending do NOT block the main action.
 */
async function sendInlineEmail(event_id: string, templateId: TemplateId, to: string, payload: any) {
  try {
    const template = EMAIL_TEMPLATES[templateId];
    if (!template) return;

    const varsResult = template.schema.safeParse(payload);
    if (!varsResult.success) {
      const errMsg = `EMAIL_PAYLOAD_INVALID: ${varsResult.error.message}`;
      console.error(errMsg);
      eventStore.addFailureLog({
        id: crypto.randomUUID(),
        event_id,
        template_id: templateId,
        to,
        error: errMsg,
        payload,
        created_at: new Date().toISOString()
      });
      return;
    }

    const { error } = await resend.emails.send({
      from: mailConfig.MAIL_FROM,
      to: [to],
      subject: template.subject(varsResult.data),
      html: template.renderHtml(varsResult.data),
      text: template.renderText(varsResult.data),
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log(`EMAIL_DISPATCHED: ${templateId} to ${to}`);
  } catch (err: any) {
    console.error(`EMAIL_FAILED: ${templateId} to ${to}`, err);
    eventStore.addFailureLog({
      id: crypto.randomUUID(),
      event_id,
      template_id: templateId,
      to,
      error: err.message || "Unknown error",
      payload,
      created_at: new Date().toISOString()
    });
  }
}

export async function recordEvent(input: DomainEventInput) {
  const event: DomainEvent = {
    ...input,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  eventStore.addEvent(event);

  const notifications = getNotificationRecipients(event);

  // Process sequentially to respect third-party API rate limits (e.g. Resend free tier)
  for (const n of notifications) {
      await sendInlineEmail(event.id, n.templateId, n.to, event.payload);
      // Optional: small sleep if we find sequential is still too fast
      // await new Promise(r => setTimeout(r, 100)); 
  }

  return event;
}

function getNotificationRecipients(event: DomainEvent): { to: string; templateId: TemplateId }[] {
  const recipients: { to: string; templateId: TemplateId }[] = [];
  
  const adminEmailsVal = process.env.REGISTRY_ADMIN_EMAILS;
  const adminEmails = adminEmailsVal ? adminEmailsVal.split(",") : ["cod3.culture@gmail.com"]; // Official Registry Governance Fallback

  switch (event.type) {
    case "CONSENT_ISSUED":
      recipients.push({ 
        templateId: "TPL_CONSENT_ISSUED", 
        to: event.payload.email || "employee@example.com" 
      });
      break;
    case "CONSENT_REVOKED":
      recipients.push({ 
        templateId: "TPL_CONSENT_REVOKED", 
        to: event.payload.email || "employee@example.com" 
      });
      break;
    case "EMPLOYMENT_EVENT_ATTESTED":
      recipients.push({ 
        templateId: "TPL_EMPLOYMENT_EVENT_ATTESTED", 
        to: event.payload.employer_email || "employer@example.com" 
      });
      break;
    case "DISPUTE_FILED":
      // In V1, notify both parties of the audit trail update
      recipients.push({ templateId: "TPL_DISPUTE_FILED", to: "employer@example.com" });
      recipients.push({ templateId: "TPL_DISPUTE_FILED", to: "employee@example.com" });
      break;
    case "EMPLOYER_REGISTERED":
      // 1. Notify the Registry Administrators for review
      adminEmails.forEach(email => {
        // Suppress self-notification if an admin is registering their own institutional account
        if (event.payload.is_admin_registration && email.trim().toLowerCase() === event.payload.email?.toLowerCase()) {
            return;
        }
        recipients.push({ templateId: "TPL_EMPLOYER_REGISTERED", to: email.trim() });
      });
      // 2. Notify the registrant immediately with institutional welcome (Skip if they are an admin as they know where to go)
      if (event.payload.email && !event.payload.is_admin_registration) {
        recipients.push({ templateId: "TPL_EMPLOYER_WELCOME", to: event.payload.email });
      }
      break;
    case "EMPLOYER_VERIFIED":
      recipients.push({ 
        templateId: "TPL_EMPLOYER_VERIFIED", 
        to: event.payload.email || "employer@example.com" 
      });
      break;
    case "EMPLOYER_SUSPENDED":
      recipients.push({ 
        templateId: "TPL_EMPLOYER_SUSPENDED", 
        to: event.payload.email || "employer@example.com" 
      });
      break;
    case "PASSWORD_RESET":
      // send reset link to the employee
      if (event.payload.email) {
        recipients.push({ templateId: "TPL_EMPLOYEE_PASSWORD_RESET", to: event.payload.email });
      }
      break;
    case "CONTACT_INQUIRY":
      adminEmails.forEach(email => {
        recipients.push({ templateId: "TPL_CONTACT_INQUIRY", to: email.trim() });
      });
      break;
  }

  return recipients;
}
