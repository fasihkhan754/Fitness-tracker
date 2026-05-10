export function calculateCalories(type: string, duration: number) {

  const rates: Record<string, number> = {
    running: 10,
    cycling: 8,
    gym: 6,
    walking: 4,
    swimming: 11
  };

  const rate = rates[type.toLowerCase()] || 5;

  return rate * duration;
}

const INTENSITY_MULTIPLIERS: Record<string, number> = {
  Low: 3,
  Medium: 5,
  High: 8,
};

export function estimateCaloriesBurned(durationMins: number, intensity: string): number {
  const multiplier = INTENSITY_MULTIPLIERS[intensity] ?? INTENSITY_MULTIPLIERS.Medium;
  return Math.round(durationMins * multiplier);
}
