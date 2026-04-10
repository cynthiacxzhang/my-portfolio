'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { useGraphStore } from '@/store/graphStore'
import { GraphNode, GraphEdge } from '@/types/graph'
import { livePos } from '@/lib/livePositions'
import { QuadraticBezierCurve3, Vector3 } from 'three'

const ALPHA_BY_DEPTH = [0.65, 0.42, 0.26, 0.14]

interface EdgeMeta {
  na: GraphNode
  nb: GraphNode
  edge: GraphEdge
  depth: number
  alpha: number
  width: number
  dashed: boolean
  color: string
}

// Each edge updates its own geometry every frame from livePos
function LiveEdge({ meta }: { meta: EdgeMeta }) {
  const { na, nb, edge, depth, alpha, width, dashed, color } = meta

  // Use a ref to hold the Line component so we can mutate its geometry
  const lineRef = useRef<{ geometry: { setFromPoints: (pts: Vector3[]) => void } } | null>(null)

  const initPts = useMemo(() => buildPts(na.x, na.y, nb.x, nb.y, na, nb, depth), [na, nb, depth])

  useFrame(() => {
    const [ax, ay] = livePos.get(na.id) ?? [na.x, na.y]
    const [bx, by] = livePos.get(nb.id) ?? [nb.x, nb.y]
    const pts = buildPts(ax, ay, bx, by, na, nb, depth)
    lineRef.current?.geometry?.setFromPoints(pts)
  })

  return (
    <Line
      // @ts-expect-error drei Line ref typing
      ref={lineRef}
      points={initPts}
      color={color}
      lineWidth={width}
      transparent
      opacity={alpha}
      dashed={dashed}
      dashScale={dashed ? 50 : undefined}
      dashSize={dashed ? 3 : undefined}
      gapSize={dashed ? 6 : undefined}
    />
  )
}

function buildPts(ax: number, ay: number, bx: number, by: number, na: GraphNode, nb: GraphNode, depth: number): Vector3[] {
  const z    = -depth * 0.5
  const bend = ((na.x * 7 + nb.y * 3) % 5 > 2) ? 0.24 : -0.20
  const mx   = (ax + bx) / 2 + (by - ay) * bend
  const my   = (ay + by) / 2 - (bx - ax) * bend
  return new QuadraticBezierCurve3(
    new Vector3(ax, -ay, z),
    new Vector3(mx, -my, z),
    new Vector3(bx, -by, z),
  ).getPoints(24)
}

export function EdgeLayer() {
  const nodes   = useGraphStore(s => s.nodes)
  const edges   = useGraphStore(s => s.edges)
  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes])

  const edgeMetas = useMemo<EdgeMeta[]>(() => {
    return edges.flatMap(edge => {
      const na = nodeMap.get(edge.source)
      const nb = nodeMap.get(edge.target)
      if (!na || !nb) return []
      const depth = Math.max(na.layer, nb.layer)
      const alpha = ALPHA_BY_DEPTH[depth] ?? 0.12
      return [{
        na, nb, edge, depth,
        color:  edge.isCross ? '#ffd278' : '#ffffff',
        alpha:  edge.isCross ? alpha : alpha * 0.9,
        width:  depth === 0 ? 1.4 : nb.type === 'label' ? 0.4 : 0.6,
        dashed: edge.isCross || nb.type === 'label',
      }]
    })
  }, [edges, nodeMap])

  return (
    <>
      {edgeMetas.map((meta, i) => (
        <LiveEdge key={`${meta.edge.source}-${meta.edge.target}-${i}`} meta={meta} />
      ))}
    </>
  )
}
