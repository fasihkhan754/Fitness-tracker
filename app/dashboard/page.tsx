import Link from "next/link";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const [workouts, count] = await Promise.all([
    prisma.workout.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    }),
    prisma.workout.count({ where: { userId } }),
  ]);

  const totalMins = workouts.reduce((s, w) => s + w.durationMins, 0);
  const thisWeek = await prisma.workout.count({
    where: {
      userId,
      date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Total workouts</p>
          <p className="text-2xl font-bold text-primary-600">{count}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">This week</p>
          <p className="text-2xl font-bold text-primary-600">{thisWeek}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Last 5 total (mins)</p>
          <p className="text-2xl font-bold text-primary-600">{totalMins}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-slate-800">Recent workouts</h2>
          <Link href="/dashboard/log" className="text-primary-600 hover:underline text-sm">Log workout</Link>
        </div>
        {workouts.length === 0 ? (
          <p className="text-slate-500 bg-white rounded-xl p-6 border border-slate-200">
            No workouts yet. <Link href="/dashboard/log" className="text-primary-600 hover:underline">Log your first workout</Link>.
          </p>
        ) : (
          <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {workouts.map((w) => (
              <li key={w.id} className="px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-slate-800">{w.type}</span>
                <span className="text-slate-600">{w.durationMins} min · {w.intensity}</span>
                <span className="text-sm text-slate-400">{new Date(w.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-4">
        <Link href="/dashboard/log" className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700">Log workout</Link>
        <Link href="/dashboard/progress" className="px-4 py-2 rounded-lg border border-primary-600 text-primary-700 font-medium hover:bg-primary-50">View progress</Link>
      </div>
    </div>
  );
}
