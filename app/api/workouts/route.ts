import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";

const VALID_TYPES = ["Running", "Cycling", "Gym", "Swimming", "Walking", "Other"];
const VALID_INTENSITY = ["Low", "Medium", "High"];

/**
 * GET /api/workouts
 * Returns workouts for the current user (optional: ?limit=10).
 */
export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "100", 10) || 100, 500);
  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
  });
  return NextResponse.json(workouts);
}

/**
 * POST /api/workouts
 * Creates a new workout. Body: type, durationMins, intensity, date, notes?
 */
export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { type, durationMins, intensity, date, notes } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `type must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }
    const duration = parseInt(String(durationMins), 10);
    if (isNaN(duration) || duration < 1 || duration > 600) {
      return NextResponse.json(
        { error: "durationMins must be between 1 and 600" },
        { status: 400 }
      );
    }
    if (!intensity || !VALID_INTENSITY.includes(intensity)) {
      return NextResponse.json(
        { error: `intensity must be one of: ${VALID_INTENSITY.join(", ")}` },
        { status: 400 }
      );
    }
    const dateObj = date ? new Date(date) : new Date();
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const workout = await prisma.workout.create({
      data: {
        userId,
        type,
        durationMins: duration,
        intensity,
        date: dateObj,
        notes: notes?.trim() || null,
      },
    });
    return NextResponse.json(workout);
  } catch (e) {
    console.error("Create workout error:", e);
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 });
  }
}
