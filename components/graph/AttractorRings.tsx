'use client'
import { useMemo, useRef } from 'react'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { EllipseCurve, Vector3 } from 'three'
import { fadeIn } from '@/lib/introTime'

const RINGS = [
  { x: 320, y: -80, rx: 260, ry: 220, alpha: 0.04 },
  { x: 300, y: -60, rx: 380, ry: 320, alpha: 0.025 },
  { x: 340, y: -100, rx: 500, ry: 420, alpha: 0.015 },
]

export function AttractorRings() {
  const rings = useMemo(() =>
    RINGS.map(r => {
      const curve = new EllipseCurve(r.x, -r.y, r.rx, r.ry, 0, Math.PI * 2, false, 0)
      const pts = curve.getPoints(80).map(p => new Vector3(p.x, p.y, -10))
      return { pts, alpha: r.alpha }
    })
  , [])

  const ringRefs = useRef<any[]>([])
  const doneRef  = useRef(false)

  useFrame(() => {
    if (doneRef.current) return
    const t = fadeIn(0.3, 0.8)
    if (t >= 1) doneRef.current = true
    ringRefs.current.forEach((line, i) => {
      if (line?.material) line.material.opacity = rings[i].alpha * t
    })
  })

  return (
    <>
      {rings.map((r, i) => (
        <Line
          key={i}
          ref={(el: any) => { ringRefs.current[i] = el }}
          points={r.pts}
          color="#ffffff"
          lineWidth={0.4}
          transparent
          opacity={0}
        />
      ))}
    </>
  )
}
