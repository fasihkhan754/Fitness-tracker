import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";

export default async function ProgressPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });

  const totalMins = workouts.reduce((s, w) => s + w.durationMins, 0);
  const byType = workouts.reduce<Record<string, number>>((acc, w) => {
    acc[w.type] = (acc[w.type] ?? 0) + w.durationMins;
    return acc;
  }, {});
  const last7Days = workouts.filter((w) => new Date(w.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const minsThisWeek = last7Days.reduce((s, w) => s + w.durationMins, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Progress</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
