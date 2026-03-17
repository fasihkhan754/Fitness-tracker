import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.workout.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ ok: true });
}