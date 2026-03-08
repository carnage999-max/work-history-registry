import fs from "fs";
import path from "path";

export type ActorType = "EMPLOYEE" | "EMPLOYER" | "ADMIN" | "SYSTEM";
export type SubjectType = "EMPLOYEE" | "EMPLOYER" | "EVENT" | "SYSTEM";

export interface DomainEvent {
  id: string;
  type: string;
  actor_type: ActorType;
  actor_id: string;
  subject_type: SubjectType;
  subject_id: string;
  payload: any;
  created_at: string;
}

export interface EmailFailureLog {
  id: string;
  event_id: string;
  template_id: string;
  to: string;
  error: string;
  payload: any;
  created_at: string;
}

const STORE_FILE = path.join(process.cwd(), "tmp", "event_log.json");
const FAILURE_FILE = path.join(process.cwd(), "tmp", "email_failures.json");

export const eventStore = {
  addEvent: (event: DomainEvent) => {
    try {
      const dir = path.dirname(STORE_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      let events = [];
      if (fs.existsSync(STORE_FILE)) {
        events = JSON.parse(fs.readFileSync(STORE_FILE, "utf-8"));
      }
      events.push(event);
      fs.writeFileSync(STORE_FILE, JSON.stringify(events, null, 2));
    } catch (err) {
      console.error("EVENT_STORE_FAILED", err);
    }
  },

  addFailureLog: (log: EmailFailureLog) => {
    try {
      const dir = path.dirname(FAILURE_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      let failures = [];
      if (fs.existsSync(FAILURE_FILE)) {
        failures = JSON.parse(fs.readFileSync(FAILURE_FILE, "utf-8"));
      }
      failures.push(log);
      fs.writeFileSync(FAILURE_FILE, JSON.stringify(failures, null, 2));
    } catch (err) {
      console.error("FAILURE_LOG_FAILED", err);
    }
  }
};
