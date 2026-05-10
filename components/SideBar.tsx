import Link from "next/link";
import { LayoutDashboard, Activity, History, BarChart3 } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r p-6 flex flex-col">

      <h1 className="text-2xl font-bold text-green-600 mb-10">
        Fitness Tracker
      </h1>

      <nav className="flex flex-col gap-6 text-slate-600">

        <Link href="/dashboard" className="flex items-center gap-3 hover:text-green-600">
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link href="/dashboard/log" className="flex items-center gap-3 hover:text-green-600">
          <Activity size={20} />
          Log workout
        </Link>

        <Link href="/dashboard/history" className="flex items-center gap-3 hover:text-green-600">
          <History size={20} />
          History
        </Link>

        <Link href="/dashboard/calories" className="flex items-center gap-3 hover:text-green-600">
          <BarChart3 size={20} />
          Calories
        </Link>

        <Link href="/dashboard/progress" className="flex items-center gap-3 hover:text-green-600">
          <BarChart3 size={20} />
          Progress
        </Link>

      </nav>

    </aside>
  );
}