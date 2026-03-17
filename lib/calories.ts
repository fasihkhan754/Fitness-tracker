/**
 * Calorie estimation helpers.
 * Uses a simple formula: durationMins * intensity multiplier.
 * Multipliers are rough estimates (cal/min) per intensity level.
 */

const INTENSITY_MULTIPLIERS: Record<string, number> = {
  Low: 3,
  Medium: 5,
  High: 8,
};

export function estimateCaloriesBurned(durationMins: number, intensity: string): number {
  const multiplier = INTENSITY_MULTIPLIERS[intensity] ?? INTENSITY_MULTIPLIERS.Medium;
  return Math.round(durationMins * multiplier);
}
