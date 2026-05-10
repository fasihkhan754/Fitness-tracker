"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPES = ["Running", "Cycling", "Gym", "Swimming", "Walking", "Other"];
const INTENSITIES = ["Low", "Medium", "High"];

export default function LogWorkoutPage() {
  const router = useRouter();

  const [type, setType] = useState("Running");
  const [durationMins, setDurationMins] = useState("");
  const [intensity, setIntensity] = useState("Medium");
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 16)
  );
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const estimatedCalories = durationMins
    ? Math.round(Number(durationMins) * 5)
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          durationMins: parseInt(durationMins, 10),
          intensity,
          date: new Date(date).toISOString(),
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to save");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl">

      {/* FORM */}
      <div>

        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Log workout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >

          {/* TYPE */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Workout Type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* DURATION */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Duration (minutes)
            </label>

            <input
              type="number"
              min={1}
              max={600}
              required
              value={durationMins}
              onChange={(e) => setDurationMins(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          {/* CALORIES PREVIEW */}
          {durationMins && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
              🔥 Estimated calories burned:
              <span className="font-semibold ml-1">
                {estimatedCalories} kcal
              </span>
            </div>
          )}

          {/* INTENSITY */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Intensity
            </label>

            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              {INTENSITIES.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date & time
            </label>

            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              placeholder="How did it go?"
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Saving..." : "Save workout"}
          </button>

        </form>

      </div>

      {/* SIDE PANEL */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

        <h2 className="text-lg font-semibold mb-4">
          Workout Tips
        </h2>

        <ul className="space-y-3 text-sm text-slate-600">

          <li>🏃 Running improves cardiovascular health</li>
          <li>🚴 Cycling burns calories efficiently</li>
          <li>💪 Strength training builds muscle</li>
          <li>🧘 Stretching helps prevent injuries</li>
          <li>🔥 Consistency is the key to progress</li>

        </ul>

      </div>

    </div>
  );
}