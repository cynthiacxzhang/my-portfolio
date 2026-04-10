'use client'
import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { EllipseCurve, Vector3 } from 'three'

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

  return (
    <>
      {rings.map((r, i) => (
        <Line
          key={i}
          points={r.pts}
          color="#ffffff"
          lineWidth={0.4}
          transparent
          opacity={r.alpha}
        />
      ))}
    </>
  )
}
