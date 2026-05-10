import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";

const VALID_MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
const MAX_CALORIES_PER_ENTRY = 5000;

/**
 * GET /api/food
 * Returns food entries for the current user. Optional ?date=YYYY-MM-DD to filter by day.
 */
export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  let where: Record<string, unknown> = { userId };
  if (dateParam) {
    const dayStart = new Date(dateParam);
    if (!isNaN(dayStart.getTime())) {
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      where = { ...where, date: { gte: dayStart, lt: dayEnd } };
    }
  }

  const entries = await prisma.foodEntry.findMany({
    where,
    orderBy: { date: "desc" },
    take: 200,
  });
  return NextResponse.json(entries);
}

/**
 * POST /api/food
 * Creates a food entry. Body: name, calories, date?, mealType?
 */
export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) {
      return NextResponse.json({ error: "Session invalid. Please log in again." }, { status: 401 });
    }

    const parsed = body && typeof body === "object" && "name" in body ? body : null;
    if (!parsed) {
      return NextResponse.json({ error: "Body must include name and calories" }, { status: 400 });
    }
    const { name, calories, date, mealType } = parsed as { name?: unknown; calories?: unknown; date?: unknown; mealType?: unknown };

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Food name is required" }, { status: 400 });
    }
    const cal = parseInt(String(calories), 10);
    if (isNaN(cal) || cal < 0 || cal > MAX_CALORIES_PER_ENTRY) {
      return NextResponse.json({ error: `Calories must be between 0 and ${MAX_CALORIES_PER_ENTRY}` }, { status: 400 });
    }
    if (mealType !== undefined && mealType !== null && (typeof mealType !== "string" || !VALID_MEAL_TYPES.includes(mealType))) {
      return NextResponse.json(
        { error: `mealType must be one of: ${VALID_MEAL_TYPES.join(", ")}` },
        { status: 400 }
      );
    }
    const dateObj =
      date !== undefined && date !== null && (typeof date === "string" || typeof date === "number" || date instanceof Date)
        ? new Date(date as string | number | Date)
        : new Date();
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const entry = await prisma.foodEntry.create({
      data: {
        userId,
        name: name.trim(),
        calories: cal,
        mealType: typeof mealType === "string" ? mealType : null,
        date: dateObj,
      },
    });
    return NextResponse.json(entry);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Create food entry error:", e);
    const errorResponse =
      process.env.NODE_ENV === "development"
        ? { error: "Failed to create food entry", detail: message }
        : { error: "Failed to create food entry" };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
