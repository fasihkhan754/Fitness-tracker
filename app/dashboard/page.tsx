import Link from "next/link";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Activity, Clock, Flame, ArrowRight } from "lucide-react";
import WorkoutChart from "@/components/WorkoutChart";

export default async function DashboardPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const [recentWorkouts, allWorkouts, count, foodLogs] = await Promise.all([
    prisma.workout.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    }),

    prisma.workout.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    }),

    prisma.workout.count({
      where: { userId },
    }),

    prisma.foodLog.findMany({
      where: { userId },
    }),
  ]);

  /* ---------- SAFE CALCULATIONS ---------- */

  const totalMins = recentWorkouts.reduce(
    (s, w) => s + (w.durationMins ?? 0),
    0
  );

  const thisWeek = await prisma.workout.count({
    where: {
      userId,
      date: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const caloriesConsumed = foodLogs.reduce(
    (sum, f) => sum + (f.calories ?? 0),
    0
  );

  const caloriesBurnedTotal = allWorkouts.reduce(
    (sum, w) => sum + (w.caloriesBurned ?? 0),
    0
  );

  const netCalories = caloriesConsumed - caloriesBurnedTotal;

  /* ---------- SAFE CHART DATA ---------- */

  const chartData =
    allWorkouts?.map((w) => ({
      date: new Date(w.date).toLocaleDateString(),
      minutes: w.durationMins ?? 0,
    })) ?? [];

  return (
    <div className="space-y-10">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <Link
          href="/dashboard/log"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          Log workout
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-100 text-green-600">
            <Activity size={22} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total workouts
            </p>
            <p className="text-3xl font-bold text-green-600">
              {count}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <Clock size={22} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              This week
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {thisWeek}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
            <Flame size={22} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Last 5 workouts time
            </p>
            <p className="text-3xl font-bold text-orange-600">
              {totalMins} min
            </p>
          </div>
        </div>

      </div>

      {/* Calories Summary */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Calories Summary
        </h2>

        <div className="space-y-2 text-slate-700">

          <p>
            Consumed:
            <span className="ml-2 font-semibold text-green-600">
              {caloriesConsumed} kcal
            </span>
          </p>

          <p>
            Burned:
            <span className="ml-2 font-semibold text-orange-600">
              {caloriesBurnedTotal} kcal
            </span>
          </p>

          <p>
            Net:
            <span className="ml-2 font-semibold text-blue-600">
              {netCalories} kcal
            </span>
          </p>

        </div>
      </div>

      {/* Charts + Activity */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="md:col-span-2">
          <WorkoutChart data={chartData} />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

          <h2 className="text-lg font-semibold mb-4">
            Activity
          </h2>

          <ul className="space-y-3 text-sm text-slate-600">

            <li className="flex gap-2">
              🏃 <span>You logged a workout</span>
            </li>

            <li className="flex gap-2">
              🔥 <span>Calories burned updated</span>
            </li>

            <li className="flex gap-2">
              🍎 <span>Food logs tracked</span>
            </li>

          </ul>

        </div>

      </div>

      {/* Recent Workouts */}
      <div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Recent workouts
          </h2>

          <Link
            href="/dashboard/history"
            className="text-green-600 text-sm hover:underline"
          >
            View all
          </Link>
        </div>

        {recentWorkouts.length === 0 ? (
          <div className="bg-white rounded-xl p-10 border border-slate-200 text-center">

            <p className="text-4xl mb-3">🏃</p>

            <p className="text-slate-600 mb-4">
              No workouts yet
            </p>

            <Link
              href="/dashboard/log"
              className="inline-block px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Log your first workout
            </Link>

          </div>
        ) : (
          <ul className="bg-white rounded-xl border border-slate-200 divide-y overflow-hidden">

            {recentWorkouts.map((w) => (
              <li
                key={w.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
              >

                <div>
                  <p className="font-semibold text-slate-800">
                    {w.type}
                  </p>

                  <p className="text-sm text-slate-500">
                    {(w.durationMins ?? 0)} min · {w.intensity}
                  </p>
                </div>

                <span className="text-sm text-slate-400">
                  {new Date(w.date).toLocaleDateString()}
                </span>

              </li>
            ))}

          </ul>
        )}

      </div>

    </div>
  );
}