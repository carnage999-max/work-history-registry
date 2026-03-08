import { cookies } from "next/headers";
import { verifyEmployerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminClient from "@/app/admin/AdminClient";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("WHR_EMPLOYER_SESSION")?.value;

  // In a real production system, this would be restricted to specific ADMIN actor types.
  // For V1 baseline, we check for a session and then check if the user has an 'admin' email suffix or specific ID.
  // For now, let's allow access to the dashboard if the user is nathan@membershipauto.com or cod3.culture@gmail.com.
  
  if (!sessionToken) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h1>Institutional Control Locked</h1>
        <p>This terminal requires Registry Administrator credentials.</p>
      </div>
    );
  }

  const session = await verifyEmployerSession(sessionToken);
  const isAdmin = session?.email === "nathan@membershipauto.com" || session?.email === "cod3.culture@gmail.com";

  if (!isAdmin) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h1>Access Denied</h1>
        <p>Your institutional credentials lack 'GOVERNANCE_ADMIN' clearance.</p>
      </div>
    );
  }

  const employers = await prisma.employer.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <AdminClient employers={employers} />
  );
}
