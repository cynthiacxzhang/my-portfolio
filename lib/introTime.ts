// Module-level intro timer. CameraRig ticks this every frame.
// All graph layers read from it to stagger their reveal animations.
export const introTime = { elapsed: 0 }

/** Returns 0→1 as elapsed crosses [delay, delay+duration]. */
export function fadeIn(delay: number, duration: number): number {
  return Math.max(0, Math.min(1, (introTime.elapsed - delay) / duration))
}
