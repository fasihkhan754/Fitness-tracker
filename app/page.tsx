import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-primary-50 to-white">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-primary-800 mb-2">Fitness Tracker</h1>
        <p className="text-slate-600 mb-8">Log workouts, track progress, and stay consistent.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-lg border-2 border-primary-600 text-primary-700 font-medium hover:bg-primary-50 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
