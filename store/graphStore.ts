import { create } from 'zustand'
import { GraphNode, GraphEdge, CameraState } from '@/types/graph'

const MIN_ZOOM = 1.1
const MAX_ZOOM = 7.0
const ZOOM_MAP = [1.1, 1.8, 2.8, 4.0]

interface GraphStore {
  nodes: GraphNode[]
  edges: GraphEdge[]
  activeNode: GraphNode | null
  history: GraphNode[]
  targetCam: CameraState
  W: number
  H: number

  setGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void
  setDimensions: (W: number, H: number) => void
  zoomTo: (node: GraphNode) => void
  goBack: () => void
  resetCamera: () => void
  pan: (dx: number, dy: number, currentZoom: number) => void
  zoomWheel: (delta: number, mx: number, my: number, currentCam: CameraState) => void
}

function defaultTarget(W: number, H: number): CameraState {
  const sx = W * 0.76, sy = H * 0.44
  return {
    x: -(sx - W / 2) / MIN_ZOOM,
    y: -(sy - H / 2) / MIN_ZOOM,
    zoom: MIN_ZOOM,
  }
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  nodes: [],
  edges: [],
  activeNode: null,
  history: [],
  targetCam: defaultTarget(
    typeof window !== 'undefined' ? window.innerWidth : 1440,
    typeof window !== 'undefined' ? window.innerHeight : 900
  ),
  W: typeof window !== 'undefined' ? window.innerWidth : 1440,
  H: typeof window !== 'undefined' ? window.innerHeight : 900,

  setGraph: (nodes, edges) => set({ nodes, edges, activeNode: nodes[0] ?? null }),

  setDimensions: (W, H) => set({ W, H, targetCam: defaultTarget(W, H) }),

  zoomTo: (node) => {
    const { activeNode, history, W, H } = get()
    const z = Math.max(MIN_ZOOM, ZOOM_MAP[node.layer] ?? 1.8)
    const sx = W * 0.76, sy = H * 0.44
    set({
      activeNode: node,
      history: activeNode ? [...history, activeNode] : history,
      targetCam: {
        x: node.x - (sx - W / 2) / z,
        y: node.y - (sy - H / 2) / z,
        zoom: z,
      },
    })
  },

  goBack: () => {
    const { history, W, H } = get()
    if (!history.length) return
    const prev = history[history.length - 1]
    const z = Math.max(MIN_ZOOM, ZOOM_MAP[prev.layer] ?? MIN_ZOOM)
    const sx = W * 0.76, sy = H * 0.44
    set({
      activeNode: prev,
      history: history.slice(0, -1),
      targetCam: {
        x: prev.x - (sx - W / 2) / z,
        y: prev.y - (sy - H / 2) / z,
        zoom: z,
      },
    })
  },

  resetCamera: () => {
    const { W, H } = get()
    set({ targetCam: defaultTarget(W, H), activeNode: null, history: [] })
  },

  pan: (dx, dy, currentZoom) => {
    set(s => ({
      targetCam: {
        ...s.targetCam,
        x: s.targetCam.x - dx / currentZoom,
        y: s.targetCam.y - dy / currentZoom,
      }
    }))
  },

  zoomWheel: (delta, mx, my, currentCam) => {
    const factor = delta > 0 ? 0.88 : 1.13
    const newZ = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentCam.zoom * factor))
    const { W, H } = get()
    const wx = currentCam.x + (mx - W / 2) / currentCam.zoom
    const wy = currentCam.y + (my - H / 2) / currentCam.zoom
    set({
      targetCam: {
        zoom: newZ,
        x: wx - (mx - W / 2) / newZ,
        y: wy - (my - H / 2) / newZ,
      }
    })
  },
}))
