import { cookies } from "next/headers";
import { verifyEmployeeSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import EmployeeDashboardClient from "./EmployeeDashboardClient";

export default async function EmployeeDashboard() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("WHR_EMPLOYEE_SESSION")?.value;

  if (!sessionToken) {
    redirect("/employee/login");
  }

  const session = await verifyEmployeeSession(sessionToken);
  if (!session) {
    redirect("/employee/login");
  }

  // 1. Fetch Subject Identity
  const employee = await prisma.employee.findUnique({
    where: { id: session.employee_id },
    include: {
      consents: true
    }
  });

  if (!employee) {
    redirect("/employee/login");
  }

  // 2. Retrieve Attested History via Blind Index (hashedSsn)
  const history = await prisma.employmentEvent.findMany({
    where: { employeeHashedId: employee.hashedSsn },
    include: {
      employer: {
        select: { name: true }
      }
    },
    orderBy: { attestedAt: "desc" }
  });

  return (
    <EmployeeDashboardClient 
      email={employee.email}
      history={history.map((h: any) => ({
        id: h.id,
        employerName: h.employer.name,
        eventType: h.eventType,
        startDate: h.startDate,
        endDate: h.endDate,
        attestedAt: h.attestedAt,
        recordHash: h.recordHash
      }))}
      consents={employee.consents}
    />
  );
}
