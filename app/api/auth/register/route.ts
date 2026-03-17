import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";

/**
 * POST /api/auth/register
 * Create a new user and start a session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, password, name } = body;

    /* ---------- VALIDATE NAME ---------- */

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    /* ---------- VALIDATE EMAIL ---------- */

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    /* ---------- VALIDATE PASSWORD ---------- */

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    /* ---------- CHECK EXISTING USER ---------- */

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    /* ---------- HASH PASSWORD ---------- */

    const hashedPassword = await hashPassword(password);

    /* ---------- CREATE USER ---------- */

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: trimmedName,
      },
    });

    /* ---------- CREATE SESSION ---------- */

    setSessionCookie(user.id);

    return NextResponse.json({
      ok: true,
      userId: user.id,
      name: user.name,
    });

  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}