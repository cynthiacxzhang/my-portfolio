'use client'
import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { QuadraticBezierCurve3, Vector3 } from 'three'

function makeCurvePoints(
  x1: number, y1: number,
  mx: number, my: number,
  x2: number, y2: number,
  n = 24
): Vector3[] {
  return new QuadraticBezierCurve3(
    new Vector3(x1, -y1, 0),
    new Vector3(mx, -my, 0),
    new Vector3(x2, -y2, 0)
  ).getPoints(n)
}

export function FlowLines() {
  const lines = useMemo(() => {
    const out: Array<{ pts: Vector3[]; alpha: number; width: number }> = []

    // Background web — right-side neural cluster
    for (let i = 0; i < 180; i++) {
      const cx = 300, cy = 100
      const a1 = Math.random() * Math.PI * 2
      const d1 = 80 + Math.random() * 500
      const a2 = a1 + (Math.random() - .5) * 1.6
      const d2 = 60 + Math.random() * 500
      out.push({
        pts: makeCurvePoints(
          cx + Math.cos(a1) * d1, cy + Math.sin(a1) * d1,
          cx + (Math.random() - .5) * 380, cy + (Math.random() - .5) * 380,
          cx + Math.cos(a2) * d2, cy + Math.sin(a2) * d2
        ),
        alpha: 0.025 + Math.random() * 0.055,
        width: 0.3,
      })
    }

    // Spine — deliberate arcs: top-right → through CZ → bottom-left panels
    const spine = [
      [600, -400, 280, 100, -200, 500, 0.45, 1.1],
      [620, -300, 300,  80, -180, 600, 0.35, 0.9],
      [580, -500, 200, 200, -280, 480, 0.30, 1.0],
      [640, -200, 350, 150, -100, 520, 0.25, 0.8],
      [560, -600, 160, 300, -320, 420, 0.22, 0.7],
      [500, -350, 250,  50, -150, 580, 0.32, 1.0],
      [660, -100, 320, 250,  -80, 560, 0.20, 0.7],
      [200,  400,-100, 550, -380, 680, 0.28, 0.8],
      [100,  450,-150, 560, -420, 650, 0.22, 0.6],
      [300,  380, -80, 520, -350, 700, 0.20, 0.5],
    ] as const

    spine.forEach(([x1, y1, mx, my, x2, y2, a, w]) => {
      out.push({ pts: makeCurvePoints(x1, y1, mx, my, x2, y2, 32), alpha: a, width: w })
    })

    return out
  }, [])

  return (
    <>
      {lines.map((l, i) => (
        <Line
          key={i}
          points={l.pts}
          color="#ffffff"
          lineWidth={l.width}
          transparent
          opacity={l.alpha}
        />
      ))}
    </>
  )
}
