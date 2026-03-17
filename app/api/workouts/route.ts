import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";
import { calculateCalories } from "@/lib/calories";

const VALID_TYPES = ["Running", "Cycling", "Gym", "Swimming", "Walking", "Other"];
const VALID_INTENSITY = ["Low", "Medium", "High"];

/**
 * GET /api/workouts
 * Returns workouts for the logged-in user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const limitParam = searchParams.get("limit");
    const limit = Math.min(Number(limitParam) || 100, 500);

    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });

    return NextResponse.json(workouts);
  } catch (error) {
    console.error("Fetch workouts error:", error);

    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workouts
 * Create a new workout
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { type, durationMins, intensity, date, notes } = body;

    /* ---------- VALIDATE TYPE ---------- */

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Type must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    /* ---------- VALIDATE DURATION ---------- */

    const duration = Number(durationMins);

    if (!duration || duration < 1 || duration > 600) {
      return NextResponse.json(
        { error: "Duration must be between 1 and 600 minutes" },
        { status: 400 }
      );
    }

    /* ---------- VALIDATE INTENSITY ---------- */

    if (!intensity || !VALID_INTENSITY.includes(intensity)) {
      return NextResponse.json(
        { error: `Intensity must be one of: ${VALID_INTENSITY.join(", ")}` },
        { status: 400 }
      );
    }

    /* ---------- VALIDATE DATE ---------- */

    const dateObj = date ? new Date(date) : new Date();

    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    /* ---------- CALCULATE CALORIES ---------- */

    const caloriesBurned = calculateCalories(type, duration);

    /* ---------- CREATE WORKOUT ---------- */

    const workout = await prisma.workout.create({
      data: {
        userId,
        type,
        durationMins: duration,
        intensity,
        caloriesBurned,
        date: dateObj,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error("Create workout error:", error);

    return NextResponse.json(
      { error: "Failed to create workout" },
      { status: 500 }
    );
  }
}