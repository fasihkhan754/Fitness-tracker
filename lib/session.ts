/**
 * Simple cookie-based session for authenticated user ID.
 * Session cookie name and encoding for Next.js server components / API routes.
 */
import { cookies } from "next/headers";

const SESSION_COOKIE = "fitness_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setSessionCookie(userId: string) {
  cookies().set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  return value ?? null;
}
