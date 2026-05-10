import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";
import { estimateCaloriesBurned } from "@/lib/calories";
import { ProgressChart } from "@/components/ProgressChart";

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatWeekLabel(monday: Date): string {
  return monday.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default async function ProgressPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });

  const totalMins = workouts.reduce((s, w) => s + w.durationMins, 0);
  const totalBurn = workouts.reduce((s, w) => s + estimateCaloriesBurned(w.durationMins, w.intensity), 0);
  const byType = workouts.reduce<Record<string, number>>((acc, w) => {
    acc[w.type] = (acc[w.type] ?? 0) + w.durationMins;
    return acc;
  }, {});
  const last7Days = workouts.filter((w) => new Date(w.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const minsThisWeek = last7Days.reduce((s, w) => s + w.durationMins, 0);

  // Weekly aggregation for chart (last 12 weeks)
  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 12 * 7);
  const recentWorkouts = workouts.filter((w) => new Date(w.date) >= twelveWeeksAgo);
  const weekMap = new Map<string, { minutes: number; count: number }>();
  for (const w of recentWorkouts) {
    const monday = getMonday(new Date(w.date));
    const key = monday.toISOString().slice(0, 10);
    const existing = weekMap.get(key) ?? { minutes: 0, count: 0 };
    existing.minutes += w.durationMins;
    existing.count += 1;
    weekMap.set(key, existing);
  }
  const weeklyData = Array.from(weekMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => ({
      weekLabel: formatWeekLabel(new Date(key)),
      minutes: val.minutes,
      count: val.count,
    }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Progress</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500 mb-1">Total time (all time)</h2>
          <p className="text-2xl font-bold text-primary-600">{totalMins} minutes</p>
          <p className="text-slate-500 text-sm mt-1">{Math.round(totalMins / 60 * 10) / 10} hours</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500 mb-1">This week</h2>
          <p className="text-2xl font-bold text-primary-600">{minsThisWeek} minutes</p>
          <p className="text-slate-500 text-sm mt-1">{last7Days.length} workouts</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500 mb-1">Total calories burned (est.)</h2>
          <p className="text-2xl font-bold text-orange-600">{totalBurn} kcal</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Improvement over time</h2>
        <ProgressChart data={weeklyData} />
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Time by activity type</h2>
        {Object.keys(byType).length === 0 ? (
          <p className="text-slate-500">No data yet. Log workouts to see breakdown.</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(byType)
              .sort(([, a], [, b]) => b - a)
              .map(([type, mins]) => (
                <li key={type} className="flex justify-between items-center">
                  <span className="font-medium text-slate-800">{type}</span>
                  <span className="text-primary-600">{mins} min</span>
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Summary</h2>
        <p className="text-slate-600">
          Total workouts: <strong>{workouts.length}</strong>. Keep logging to see trends over time.
        </p>
      </div>
    </div>
  );
}
