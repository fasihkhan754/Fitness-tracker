import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

/**
 * POST /api/auth/logout
 * Clears session cookie.
 */
export async function POST() {
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
