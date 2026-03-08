import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  // clear any session cookies regardless of user type
  cookieStore.delete("WHR_EMPLOYER_SESSION");
  cookieStore.delete("WHR_EMPLOYEE_SESSION");
  return NextResponse.json({ success: true });
}
