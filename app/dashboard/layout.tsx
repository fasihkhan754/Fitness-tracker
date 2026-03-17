import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold text-primary-700">Fitness Tracker</Link>
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
          <Link href="/dashboard/log" className="text-slate-600 hover:text-slate-900">Log workout</Link>
          <Link href="/dashboard/history" className="text-slate-600 hover:text-slate-900">History</Link>
          <Link href="/dashboard/progress" className="text-slate-600 hover:text-slate-900">Progress</Link>
          <Link href="/dashboard/calories" className="text-slate-600 hover:text-slate-900">Calories</Link>
          <Link href="/dashboard/goals" className="text-slate-600 hover:text-slate-900">Goals</Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{user?.name || user?.email}</span>
          <LogoutButton />
        </div>
      </nav>
      <main className="p-6 max-w-4xl mx-auto">{children}</main>
    </div>
  );
}
