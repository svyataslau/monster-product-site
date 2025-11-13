export function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Normalizes progress within a [start, end] segment into [0..1].
 * Returns 0 when end === start to avoid division by zero.
 */
export function segmentProgress(progress: number, start: number, end: number): number {
  if (end === start) return 0;
  return clamp01((progress - start) / (end - start));
}


