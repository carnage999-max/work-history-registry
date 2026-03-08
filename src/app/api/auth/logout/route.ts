import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("WHR_EMPLOYER_SESSION");
  return NextResponse.json({ success: true });
}
