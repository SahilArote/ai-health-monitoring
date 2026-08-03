/**
 * Utility helper to add small random Gaussian-like noise around a baseline value.
 * @param value Base value
 * @param range Maximum +/- variation range
 */
export function addNoise(value: number, range: number): number {
  const delta = (Math.random() - 0.5) * 2 * range;
  return value + delta;
}

/**
 * Returns a realistic heart rate for the given timestamp.
 * Baseline: 70bpm.
 * - 23:00–06:00 (sleep window): 55–65 bpm
 * - 07:00–08:59 & 18:00–19:59 (activity window): 90–110 bpm
 * - Otherwise: 65–80 bpm
 */
export function heartRate(date: Date): number {
  const hour = date.getHours();

  if (hour >= 23 || hour < 6) {
    // Sleep window
    const val = addNoise(60, 5);
    return Math.round(Math.max(52, Math.min(68, val)));
  } else if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 20)) {
    // Activity / exercise window
    const val = addNoise(100, 10);
    return Math.round(Math.max(85, Math.min(115, val)));
  } else {
    // Normal waking hours
    const val = addNoise(72, 7);
    return Math.round(Math.max(62, Math.min(84, val)));
  }
}

/**
 * Returns a realistic SpO2 percentage (95% - 99%).
 */
export function spo2(date: Date): number {
  const val = addNoise(97.2, 1.8);
  const clamped = Math.max(95.0, Math.min(99.5, val));
  return Math.round(clamped * 10) / 10;
}

/**
 * Calculates updated cumulative steps for the current day.
 * - Waking hours (7am to 10pm): adds 80–350 steps per hourly sample
 * - Overnight (11pm to 6am): zero increment
 */
export function steps(date: Date, cumulativeSoFarToday: number): number {
  const hour = date.getHours();

  if (hour >= 7 && hour <= 22) {
    const increment = Math.floor(80 + Math.random() * 270);
    return cumulativeSoFarToday + increment;
  }
  return cumulativeSoFarToday;
}

/**
 * Emits sleep duration once per day at 6:00 AM (representing prior night's sleep).
 * Returns duration in hours (6.0 - 8.0), or null if not 6 AM.
 */
export function sleepDuration(date: Date): number | null {
  const hour = date.getHours();
  if (hour === 6) {
    const val = addNoise(7.2, 0.8);
    const clamped = Math.max(6.0, Math.min(8.5, val));
    return Math.round(clamped * 10) / 10;
  }
  return null;
}

/**
 * Returns body temperature in °C (36.5 - 37.2°C).
 */
export function temperature(date: Date): number {
  const val = addNoise(36.8, 0.35);
  const clamped = Math.max(36.3, Math.min(37.3, val));
  return Math.round(clamped * 10) / 10;
}
