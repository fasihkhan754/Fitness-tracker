"use client";

import { useState } from "react";

export default function SettingsPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Profile updated successfully");
    } else {
      setMessage(data.error || "Update failed");
    }
  }

  return (
    <div className="max-w-xl">

      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl border shadow-sm"
      >

        <div>
          <label className="block text-sm font-medium mb-1">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            New Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Update Profile
        </button>

        {message && (
          <p className="text-sm text-slate-600">{message}</p>
        )}

      </form>

    </div>
  );
}