import { Cormorant_Garamond, Space_Mono } from 'next/font/google'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['600'], style: ['italic'] })
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400'] })

export function NameBlock() {
  return (
    <div style={{ position: 'absolute', top: 52, left: 52, pointerEvents: 'none' }}>
      <h1
        className={cormorant.className}
        style={{
          fontSize: 58,
          fontStyle: 'italic',
          fontWeight: 600,
          color: '#fff',
          lineHeight: 1,
          letterSpacing: '0.01em',
          margin: 0,
        }}
      >
        Cynthia Zhang
      </h1>
      <p
        className={spaceMono.className}
        style={{
          fontSize: 8,
          color: 'rgba(255,100,160,0.6)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: 22,
          whiteSpace: 'nowrap',
        }}
      >
        ML Engineer &nbsp;·&nbsp; Uni of Waterloo &nbsp;·&nbsp; Wealthsimple
      </p>
    </div>
  )
}
