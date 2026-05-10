"use client";

import { useState, useEffect } from "react";

const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function CaloriesPage() {
  const [foods, setFoods] = useState<any[]>([]);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadFoods() {
    const res = await fetch("/api/foods");
    const data = await res.json();
    setFoods(data);
  }

  useEffect(() => {
    loadFoods();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foodName,
          calories: Number(calories),
          mealType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed");
        return;
      }

      setFoodName("");
      setCalories("");

      loadFoods();

    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);

  return (
    <div className="space-y-8 max-w-xl">

      <h1 className="text-2xl font-bold text-slate-800">
        Calories Tracker
      </h1>

      {/* Add Food Form */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4"
      >
        <div>
          <label className="text-sm font-medium">Food name</label>
          <input
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Calories</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Meal type</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          >
            {MEALS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Add food"}
        </button>
      </form>

      {/* Calories Summary */}

      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="font-semibold mb-2">Today's calories</h2>
        <p className="text-3xl font-bold text-green-600">
          {totalCalories}
        </p>
      </div>

      {/* Food List */}

      <div className="bg-white rounded-xl border border-slate-200 divide-y">

        {foods.length === 0 ? (
          <p className="p-6 text-slate-500">No foods logged yet</p>
        ) : (
          foods.map((f) => (
            <div
              key={f.id}
              className="p-4 flex justify-between"
            >
              <div>
                <p className="font-medium">{f.foodName}</p>
                <p className="text-sm text-slate-500">
                  {f.mealType}
                </p>
              </div>

              <p className="font-semibold">
                {f.calories} kcal
              </p>
            </div>
          ))
        )}

      </div>
    </div>
  );
}