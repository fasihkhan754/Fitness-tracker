import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {

  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { name, email, password } = body;

  const data: any = {};

  if (name) data.name = name;
  if (email) data.email = email;

  if (password && password.length >= 6) {
    data.password = await hashPassword(password);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return NextResponse.json({
    ok: true,
    user,
  });
}