"use client";

import { useState, useEffect, useCallback } from "react";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  mealType: string | null;
  date: string;
}

export default function CaloriesPage() {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<FoodEntry[]>([]);

  const todayStr = new Date().toISOString().slice(0, 10);

  const loadEntries = useCallback(async () => {
    try {
      const res = await fetch(`/api/food?date=${todayStr}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch { /* ignore */ }
  }, [todayStr]);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const todayTotal = entries.reduce((s, e) => s + e.calories, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          calories: parseInt(calories, 10),
          mealType: mealType || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save");
        return;
      }
      setName("");
      setCalories("");
      setMealType("");
      await loadEntries();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Calorie tracking</h1>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-sm font-medium text-slate-500 mb-1">Today&apos;s calories</h2>
        <p className="text-3xl font-bold text-primary-600">{todayTotal} kcal</p>
      </div>

      <div className="max-w-md">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Log food</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Food name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Chicken salad"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Calories (kcal)</label>
            <input
              type="number"
              min={0}
              max={5000}
              required
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. 350"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meal (optional)</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select meal</option>
              {MEAL_TYPES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add food"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Today&apos;s food log</h2>
        {entries.length === 0 ? (
          <p className="text-slate-500 bg-white rounded-xl p-6 border border-slate-200">No food logged today.</p>
        ) : (
          <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {entries.map((entry) => (
              <li key={entry.id} className="px-4 py-3 flex justify-between items-center">
                <div>
                  <span className="font-medium text-slate-800">{entry.name}</span>
                  {entry.mealType && (
                    <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{entry.mealType}</span>
                  )}
                </div>
                <span className="font-semibold text-primary-600">{entry.calories} kcal</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
