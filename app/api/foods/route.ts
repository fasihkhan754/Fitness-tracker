import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

const VALID_MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];

export async function GET() {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const foods = await prisma.foodLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(foods);
}

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { foodName, calories, mealType } = body;

    if (!foodName) {
      return NextResponse.json(
        { error: "Food name required" },
        { status: 400 }
      );
    }

    const cal = Number(calories);

    if (!cal || cal <= 0) {
      return NextResponse.json(
        { error: "Invalid calories" },
        { status: 400 }
      );
    }

    if (!VALID_MEALS.includes(mealType)) {
      return NextResponse.json(
        { error: "Invalid meal type" },
        { status: 400 }
      );
    }

    const food = await prisma.foodLog.create({
      data: {
        userId,
        foodName,
        calories: cal,
        mealType,
      },
    });

    return NextResponse.json(food);
  } catch (error) {
    console.error("Food create error:", error);
    return NextResponse.json(
      { error: "Failed to add food" },
      { status: 500 }
    );
  }
}