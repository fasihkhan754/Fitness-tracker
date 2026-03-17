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