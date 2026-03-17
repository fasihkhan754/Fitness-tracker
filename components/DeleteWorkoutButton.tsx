"use client";

import { useRouter } from "next/navigation";

export default function DeleteWorkoutButton({ id }: { id: string }) {

  const router = useRouter();

  async function handleDelete() {

    const confirmDelete = confirm("Delete this workout?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/workouts/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete workout");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-sm font-medium"
    >
      Delete
    </button>
  );
}