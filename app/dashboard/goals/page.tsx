import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";

const WEEKLY_TARGET = 5;
const MONTHLY_TARGET = 20;

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function ProgressBar({ current, target }: { current: number; target: number }) {
  const pct = Math.min(Math.round((current / target) * 100), 100);
  return (
    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
      <div
        className={`h-4 rounded-full transition-all ${pct >= 100 ? "bg-green-500" : "bg-primary-500"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default async function GoalsPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const weekStart = getWeekStart();
  const monthStart = getMonthStart();

  const [weeklyCount, monthlyCount] = await Promise.all([
    prisma.workout.count({
      where: { userId, date: { gte: weekStart } },
    }),
    prisma.workout.count({
      where: { userId, date: { gte: monthStart } },
    }),
  ]);

  const weeklyDone = weeklyCount >= WEEKLY_TARGET;
  const monthlyDone = monthlyCount >= MONTHLY_TARGET;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Goals & Challenges</h1>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Weekly challenge</h2>
          {weeklyDone && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
              Goal achieved!
            </span>
          )}
        </div>
        <p className="text-slate-600">Complete <strong>{WEEKLY_TARGET} workouts</strong> this week.</p>
        <ProgressBar current={weeklyCount} target={WEEKLY_TARGET} />
        <p className="text-sm text-slate-500">{weeklyCount} / {WEEKLY_TARGET} workouts</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Monthly challenge</h2>
          {monthlyDone && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
              Goal achieved!
            </span>
          )}
        </div>
        <p className="text-slate-600">Complete <strong>{MONTHLY_TARGET} workouts</strong> this month.</p>
        <ProgressBar current={monthlyCount} target={MONTHLY_TARGET} />
        <p className="text-sm text-slate-500">{monthlyCount} / {MONTHLY_TARGET} workouts</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">How it works</h2>
        <ul className="list-disc list-inside text-slate-600 space-y-1">
          <li>Log workouts regularly to fill your progress bars.</li>
          <li>Hit your weekly target of {WEEKLY_TARGET} workouts to earn a weekly badge.</li>
          <li>Reach {MONTHLY_TARGET} workouts in a month for the monthly challenge.</li>
          <li>Progress resets each week (Monday) and each month (1st).</li>
        </ul>
      </div>
    </div>
  );
}
