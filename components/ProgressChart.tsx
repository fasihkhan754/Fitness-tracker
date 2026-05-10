"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface WeekData {
  weekLabel: string;
  minutes: number;
  count: number;
}

export function ProgressChart({ data }: { data: WeekData[] }) {
  if (data.length === 0) {
    return <p className="text-slate-500">Not enough data yet. Log workouts over multiple weeks to see your improvement.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="weekLabel" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} label={{ value: "Minutes", angle: -90, position: "insideLeft", style: { fontSize: 12 } }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} label={{ value: "Workouts", angle: 90, position: "insideRight", style: { fontSize: 12 } }} />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="minutes" name="Minutes" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="count" name="Workouts" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
