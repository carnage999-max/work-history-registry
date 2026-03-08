import { cookies } from "next/headers";
import { verifyEmployerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import EmployersClient from "@/app/employers/EmployersClient";
import { redirect } from "next/navigation";

export default async function EmployersPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("WHR_EMPLOYER_SESSION")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const session = await verifyEmployerSession(sessionToken);
  if (!session) {
    redirect("/login");
  }

  // Refactored to avoid the specific include._count validation if the client is partially out-of-sync
  // This approach is more robust in development environments with file locks.
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

  // Separate count query to circumvent the 'include._count' field validation issue
  let attestationCount = 0;
  try {
    attestationCount = await prisma.employmentEvent.count({
      where: { employerId: employer.id }
    });
  } catch (err) {
    console.warn("DASHBOARD_STATS_DEGRADED: Could not fetch attestation count. Re-syncing the schema may be required.", err);
  }

  // Determine if this institutional session is authorized for Registry Governance
  const adminEmails = (process.env.REGISTRY_ADMIN_EMAILS || "cod3.culture@gmail.com").split(",");
  const isAdmin = adminEmails.map(e => e.trim().toLowerCase()).includes(session.email.toLowerCase());

  return (
    <EmployersClient 
      status={employer.status} 
      employerName={employer.name} 
      attestationCount={attestationCount} 
      isAdmin={isAdmin}
    />
  );
}
