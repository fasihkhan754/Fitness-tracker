import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export default async function ProfilePage() {

  const userId = await getSessionUserId();

  if (!userId) {
    return <p className="text-red-500">Unauthorized</p>;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      workouts: true,
      foods: true,
    },
  });

  if (!user) {
    return <p>User not found</p>;
  }

  const totalWorkouts = user.workouts.length;

  const caloriesBurned = user.workouts.reduce(
    (sum, w) => sum + w.caloriesBurned,
    0
  );

  const caloriesConsumed = user.foods.reduce(
    (sum, f) => sum + f.calories,
    0
  );

  return (
    <div className="max-w-2xl space-y-6">

      <h1 className="text-3xl font-bold">
        Profile
      </h1>

      {/* Profile Card */}

      <div className="bg-white p-6 rounded-xl border shadow-sm">

        <h2 className="text-xl font-semibold mb-4">
          Account Information
        </h2>

        <p className="mb-2">
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

      </div>


      {/* Stats Card */}

      <div className="bg-white p-6 rounded-xl border shadow-sm">

        <h2 className="text-xl font-semibold mb-4">
          Fitness Stats
        </h2>

        <p className="mb-2">
          <strong>Total Workouts:</strong> {totalWorkouts}
        </p>

        <p className="mb-2">
          <strong>Calories Burned:</strong> {caloriesBurned} kcal
        </p>

        <p>
          <strong>Calories Consumed:</strong> {caloriesConsumed} kcal
        </p>

      </div>

    </div>
  );
}