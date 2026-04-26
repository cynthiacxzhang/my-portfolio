'use client'
import { Html } from '@react-three/drei'
import { useState, useEffect } from 'react'

const ANNOTATIONS = [
  { text: '0.94 val accuracy',           x:  -30, y: -470, opacity: 0.38, size: 7.5 },
  { text: 'waterloo · 3B',               x:  140, y: -460, opacity: 0.32, size: 7   },
  { text: 'IEEE ISEC 2024',              x: -170, y: -560, opacity: 0.35, size: 7.5 },
  { text: 'GAN → conv architecture',     x:  -80, y: -630, opacity: 0.28, size: 7   },
  { text: 'supabase pgvector',           x:  620, y: -210, opacity: 0.30, size: 7   },
  { text: 'senior canadian national',    x: -660, y:  230, opacity: 0.33, size: 7.5 },
  { text: 'cognitive load theory',       x: -480, y: -100, opacity: 0.28, size: 7   },
  { text: '2500+ commits',               x:  460, y: -180, opacity: 0.28, size: 7   },
  { text: 'fastapi · execOS',            x:  580, y:  180, opacity: 0.26, size: 7   },
  { text: '12 years · rhythmic gym',     x: -560, y:  380, opacity: 0.25, size: 7   },
]

function Annotation({ a, index }: { a: typeof ANNOTATIONS[number]; index: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), (2.4 + index * 0.08) * 1000)
    return () => clearTimeout(t)
  }, [index])

  return (
    <Html
      position={[a.x, -a.y, -4]}
      zIndexRange={[5, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <span style={{
        fontFamily:    "'Space Mono', monospace",
        fontSize:      a.size,
        letterSpacing: '0.12em',
        color:         `rgba(255,100,160,${a.opacity})`,
        whiteSpace:    'nowrap',
        textTransform: 'uppercase',
        transform:     'translate(-50%, -50%)',
        display:       'block',
        userSelect:    'none',
        opacity:       visible ? 1 : 0,
        transition:    'opacity 0.6s ease',
      }}>
        {a.text}
      </span>
    </Html>
  )
}

export function AmbientText() {
  return (
    <>
      {ANNOTATIONS.map((a, i) => (
        <Annotation key={i} a={a} index={i} />
      ))}
    </>
  )
}
