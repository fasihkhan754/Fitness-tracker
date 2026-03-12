import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";

export default async function HistoryPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Workout history</h1>
      {workouts.length === 0 ? (
        <p className="text-slate-500 bg-white rounded-xl p-6 border border-slate-200">
          No workouts yet. Log your first workout from the dashboard.
        </p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Type</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Duration</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Intensity</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workouts.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-700">{new Date(w.date).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{w.type}</td>
                  <td className="px-4 py-3 text-slate-600">{w.durationMins} min</td>
                  <td className="px-4 py-3 text-slate-600">{w.intensity}</td>
                  <td className="px-4 py-3 text-slate-500 text-sm">{w.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
