import { cookies } from "next/headers";
import { verifyEmployerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import EmployerAttestationsClient from "@/app/employers/attestations/EmployerAttestationsClient";

export default async function EmployerAttestationsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("WHR_EMPLOYER_SESSION")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const session = await verifyEmployerSession(sessionToken);
  if (!session) {
    redirect("/login");
  }

  const employer = await prisma.employer.findUnique({
    where: { id: session.employer_id }
  });

  if (!employer) {
    redirect("/login");
  }

  // Enforcement Rule: Access to employer dashboard blocked if SUSPENDED
  if (employer.status === "SUSPENDED") {
    return (
      <div style={{ padding: "100px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h1>Access Unavailable</h1>
        <p>Your institutional access has been suspended. Please contact the Registry of Record.</p>
      </div>
    );
  }

  // Fetch attestations for this employer
  type RawAttestation = {
    id: string;
    employeeName: string;
    employeeDisplayId: string;
    eventType: string;
    startDate: Date;
    endDate: Date | null;
    rehireEligible: boolean;
    attestedAt: Date;
    recordHash: string;
  };

  const attestations: RawAttestation[] = await prisma.employmentEvent.findMany({
    where: { employerId: employer.id },
    orderBy: { attestedAt: 'desc' },
    select: {
      id: true,
      employeeName: true,
      employeeDisplayId: true,
      eventType: true,
      startDate: true,
      endDate: true,
      rehireEligible: true,
      attestedAt: true,
      recordHash: true,
    }
  });

  // Convert Date objects to ISO strings for client component
  const attestationsForClient = attestations.map((a: RawAttestation) => ({
    ...a,
    startDate: a.startDate.toISOString(),
    endDate: a.endDate ? a.endDate.toISOString() : null,
    attestedAt: a.attestedAt.toISOString(),
  }));

  return (
    <EmployerAttestationsClient
      employerName={employer.name}
      attestations={attestationsForClient}
    />
  );
}