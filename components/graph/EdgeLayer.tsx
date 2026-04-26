'use client'
import { useMemo, useRef } from 'react'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useGraphStore } from '@/store/graphStore'
import { QuadraticBezierCurve3, Vector3 } from 'three'
import { fadeIn } from '@/lib/introTime'

const ALPHA_BY_DEPTH = [0.65, 0.42, 0.26, 0.14]
// Each depth level fades in 0.2s after the previous
const DELAY_BY_DEPTH = [0.7, 0.9, 1.1, 1.3]

export function EdgeLayer() {
  const nodes   = useGraphStore(s => s.nodes)
  const edges   = useGraphStore(s => s.edges)
  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes])

  const lines = useMemo(() => {
    return edges.flatMap(edge => {
      const na = nodeMap.get(edge.source)
      const nb = nodeMap.get(edge.target)
      if (!na || !nb) return []

      const depth = Math.max(na.layer, nb.layer)
      const alpha = ALPHA_BY_DEPTH[depth] ?? 0.12
      const z     = -depth * 0.5
      const bend  = ((na.x * 7 + nb.y * 3) % 5 > 2) ? 0.24 : -0.20
      const mx    = (na.x + nb.x) / 2 + (nb.y - na.y) * bend
      const my    = (na.y + nb.y) / 2 - (nb.x - na.x) * bend

      const pts = new QuadraticBezierCurve3(
        new Vector3(na.x, -na.y, z),
        new Vector3(mx,   -my,   z),
        new Vector3(nb.x, -nb.y, z),
      ).getPoints(24)

      return [{
        pts,
        key:    `${edge.source}-${edge.target}`,
        color:  edge.isCross ? '#ffd278' : nb.type === 'label' ? '#ff50b4' : '#ffffff',
        alpha:  edge.isCross ? alpha : nb.type === 'label' ? alpha * 2.2 : alpha * 0.9,
        width:  depth === 0 ? 1.4 : nb.type === 'label' ? 0.7 : 0.6,
        dashed: edge.isCross,
        depth,
      }]
    })
  }, [edges, nodeMap])

  const lineRefs = useRef<any[]>([])
  const doneRef  = useRef(false)

  useFrame(() => {
    if (doneRef.current) return
    let allDone = true
    lineRefs.current.forEach((line, i) => {
      if (!line?.material) return
      const l = lines[i]
      if (!l) return
      const delay = DELAY_BY_DEPTH[l.depth] ?? 1.3
      const t = fadeIn(delay, 0.5)
      if (t < 1) allDone = false
      line.material.opacity = l.alpha * t
    })
    if (allDone) doneRef.current = true
  })

  return (
    <>
      {lines.map((l, i) => (
        <Line
          key={l.key}
          ref={(el: any) => { lineRefs.current[i] = el }}
          points={l.pts}
          color={l.color}
          lineWidth={l.width}
          transparent
          opacity={0}
          dashed={l.dashed}
          dashScale={l.dashed ? 50 : undefined}
          dashSize={l.dashed ? 3 : undefined}
          gapSize={l.dashed ? 6 : undefined}
        />
      ))}
    </>
  )
}
