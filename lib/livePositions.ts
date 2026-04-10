// Module-level mutable map — updated every frame by CameraRig, read by NodeMesh + EdgeLayer.
// Using a plain Map avoids Zustand re-renders on every frame.
export const livePos = new Map<string, [number, number]>()
