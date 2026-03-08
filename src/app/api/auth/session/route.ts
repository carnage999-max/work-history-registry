import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyEmployerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
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

    return NextResponse.json({
      authenticated: true,
      user: employer
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
