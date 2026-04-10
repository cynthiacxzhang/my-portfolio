// Module-level physics state — frame-safe, no React re-renders.
// PhysicsEngine.tsx drives this every frame via useFrame.

export interface PhysNode {
  x: number; y: number       // current world position
  vx: number; vy: number     // velocity
  restX: number; restY: number // rest / home position
}

export const physState = new Map<string, PhysNode>()

// The node currently being dragged (set by NodeMesh pointer events)
export let draggedId: string | null = null
export let dragTarget: { wx: number; wy: number } = { wx: 0, wy: 0 }

export function setDraggedId(id: string | null) { draggedId = id }
export function setDragTarget(wx: number, wy: number) {
  dragTarget.wx = wx
  dragTarget.wy = wy
}

// Physics constants
export const K_SPRING  = 0.055   // pull toward rest position
export const DAMPING   = 0.87    // velocity decay — lower = more bounce
export const K_REPULSE = 0.65    // push strength when nodes overlap
