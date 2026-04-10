'use client'
import { Html } from '@react-three/drei'

// Floating annotations to fill the dead zone above/between CZ and the panel edge.
// World coords: negative y = up on screen, negative x = left.
// These populate the space between the HUD panels and the graph cluster.
const ANNOTATIONS = [
  // Upper gap between CZ bubble top and viewport top
  { text: '0.94 val accuracy',        x:  -30, y: -460, opacity: 0.38, size: 7.5 },
  { text: 'waterloo · 3A',            x:  120, y: -400, opacity: 0.32, size: 7   },
  { text: 'IEEE ISEC 2024',           x: -160, y: -530, opacity: 0.35, size: 7.5 },
  { text: 'GAN → conv architecture',  x:  -80, y: -620, opacity: 0.28, size: 7   },
  { text: 'supabase pgvector',        x:  230, y: -470, opacity: 0.30, size: 7   },
  // Between panels and research cluster (x: -200 to -50, y: -150 to -250)
  { text: 'co-op #4 · wealthsimple',  x: -220, y: -200, opacity: 0.33, size: 7.5 },
  { text: 'cognitive load theory',    x: -190, y: -260, opacity: 0.28, size: 7   },
  // Right side upper — between CZ and work node
  { text: '2500+ commits',            x:  190, y: -310, opacity: 0.28, size: 7   },
  { text: 'fastapi · execOS',         x:  380, y: -290, opacity: 0.26, size: 7   },
  { text: 'triathlete · swimmer',     x:   50, y: -350, opacity: 0.25, size: 7   },
]

export function AmbientText() {
  return (
    <>
      {ANNOTATIONS.map((a, i) => (
        <Html
          key={i}
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
          }}>
            {a.text}
          </span>
        </Html>
      ))}
    </>
  )
}
