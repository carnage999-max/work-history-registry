import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Professional Record Vault | Work History Registry",
  description: "Secure, subject-controlled access to your attested work history records.",
};

export default async function EmployeePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const employerSession = cookieStore.get("WHR_EMPLOYER_SESSION");

  // Enforce architectural boundary: Institutions cannot access the Professional Subject Vault
  if (employerSession?.value) {
    redirect("/employers");
  }

  return (
    <div className="employee-portal-root">
      {children}
    </div>
  );
}
