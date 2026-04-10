export type LabelAnchor =
  | 'center' | 'top-right' | 'top-left'
  | 'bottom-right' | 'bottom-left'
  | 'right' | 'left' | 'top' | 'bottom'

export type NodeType = 'circle' | 'label'

export interface GraphNode {
  id: string
  label: string
  title: string
  x: number
  y: number
  r: number
  layer: 0 | 1 | 2 | 3
  type: NodeType
  inside: boolean
  lAnchor: LabelAnchor
  parentId: string | null
}

export interface GraphEdge {
  source: string
  target: string
  isCross: boolean
}

export interface CameraState {
  x: number
  y: number
  zoom: number
}
