'use client'
import { useGraphStore } from '@/store/graphStore'

export function BackButton() {
  const history = useGraphStore(s => s.history)
  const goBack  = useGraphStore(s => s.goBack)

  if (!history.length) return null

  return (
    <button
      onClick={goBack}
      style={{
        position: 'absolute',
        top: 52,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'Space Mono', monospace",
        fontSize: 7.5,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.28)',
        background: 'transparent',
        border: '0.5px solid rgba(255,255,255,0.12)',
        padding: '5px 16px',
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
    >
      ← back
    </button>
  )
}
