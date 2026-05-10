import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";

/**
 * POST /api/auth/login
 * Verify credentials and create session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    /* ---------- VALIDATE INPUT ---------- */

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    /* ---------- FIND USER ---------- */

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    /* ---------- VERIFY PASSWORD ---------- */

    const passwordValid = await verifyPassword(password, user.password);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    /* ---------- CREATE SESSION ---------- */

    setSessionCookie(user.id);

    return NextResponse.json({
      ok: true,
      userId: user.id,
    });

  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}