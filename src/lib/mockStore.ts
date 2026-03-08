export interface EmploymentEvent {
  id: string;
  employer_id: string;
  employer: string;
  position: string;
  start_date: string;
  end_date: string;
  event_type: "HIRE" | "SEPARATION" | "TITLE_CHANGE";
  rehire_eligible: boolean;
  attested_at: string;
}

export interface MockStore {
  employees: Record<string, EmploymentEvent[]>;
  consents: Record<string, boolean>; // employee_hash_id -> has_consented
}

export const MOCK_RECORDS: MockStore = {
  employees: {
    "emp_8829": [
      {
        id: "1",
        employer_id: "ORG-001",
        employer: "Global Systems Inc.",
        position: "Senior Systems Architect",
        start_date: "2022-01-01",
        end_date: "2026-02-28",
        event_type: "HIRE",
        rehire_eligible: true,
        attested_at: "2026-02-28T00:00:00Z",
      },
      {
        id: "2",
        employer_id: "ORG-002",
        employer: "Nexus Cloud Dynamics",
        position: "Lead Infrastructure Engineer",
        start_date: "2019-03-01",
        end_date: "2021-12-31",
        event_type: "SEPARATION",
        rehire_eligible: true,
        attested_at: "2021-12-31T23:59:59Z",
      }
    ],
    "emp_1102": [
      {
        id: "3",
        employer_id: "ORG-003",
        employer: "Standard Data Corp",
        position: "Junior Developer",
        start_date: "2017-06-01",
        end_date: "2019-02-01",
        event_type: "SEPARATION",
        rehire_eligible: false,
        attested_at: "2019-02-01T12:00:00Z",
      }
    ]
  },
  consents: {
    "emp_8829": true,
    "emp_1102": false,
  }
};
