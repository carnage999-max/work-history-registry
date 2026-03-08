import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyEmployerSession, verifyEmployeeSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();

    // 1. check employee session first
    const empToken = cookieStore.get("WHR_EMPLOYEE_SESSION")?.value;
    if (empToken) {
      const session = await verifyEmployeeSession(empToken);
      if (session) {
        const employee = await prisma.employee.findUnique({
          where: { id: session.employee_id },
          select: { id: true, email: true }
        });
        if (employee) {
          // no explicit name field for employees – derive from email
          const name = employee.email.split("@")[0];
          return NextResponse.json({
            authenticated: true,
            user: { id: employee.id, name, email: employee.email, type: "employee" }
          });
        }
      }
      // if token present but invalid, fall through to unauthenticated
      return NextResponse.json({ authenticated: false });
    }

    // 2. fall back to employer session
    const token = cookieStore.get("WHR_EMPLOYER_SESSION")?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const session = await verifyEmployerSession(token);
    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    const employer = await prisma.employer.findUnique({
      where: { id: session.employer_id },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      }
    });

    if (!employer) {
      return NextResponse.json({ authenticated: false });
    }

    // treat special emails as admin user type
    const adminEmails = [
      "nathan@membershipauto.com",
      "cod3.culture@gmail.com"
    ];
    const type = adminEmails.includes(employer.email) ? "admin" : "employer";

    return NextResponse.json({
      authenticated: true,
      user: { ...employer, type }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
