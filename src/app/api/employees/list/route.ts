import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyEmployerSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("WHR_EMPLOYER_SESSION")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const session = await verifyEmployerSession(sessionToken);
    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // Fetch all employees
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        email: true,
        // assume we store name? if not, can use email as fallback
        name: true,
      },
      orderBy: { email: "asc" },
    });

    return NextResponse.json({ employees });
  } catch (error: any) {
    console.error("FETCH_EMPLOYEES_ERROR", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
