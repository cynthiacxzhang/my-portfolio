'use client'
import { useEffect, useRef, useState } from 'react'

// Contact panel (1.5x prototype size).
// Position: top-left corner overlaps bio's bottom-right corner.
// Overlap: 1/3 of contact's height vertically, 1/4 of contact's width horizontally.
// i.e. contact.top  = bio.bottom  - contactEl.offsetHeight / 3
//      contact.left = bio.right   - contactEl.offsetWidth  / 4

export function ContactPanel() {
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)

  useEffect(() => {
    function measure() {
      const bio     = document.getElementById('panel-bio')
      const contact = panelRef.current
      if (!bio || !contact) return
      const br = bio.getBoundingClientRect()
      setPos({
        left: br.right  - contact.offsetWidth  / 2,
        top:  br.bottom - contact.offsetHeight / 3,
      })
    }
    // Small delay so bio has rendered at its CSS-percentage top
    const id = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div
      ref={panelRef}
      style={{
        position: 'absolute',
        // Invisible until measured to avoid flash at (0,0)
        visibility: pos ? 'visible' : 'hidden',
        left: pos?.left ?? 0,
        top:  pos?.top  ?? 0,
        width: 258,
        padding: '32px 30px 36px',
        border: '0.5px solid rgba(255,100,160,0.2)',
        background: 'rgba(6,6,6,0.94)',
        fontFamily: "'Space Mono', monospace",
        pointerEvents: 'auto',
        zIndex: 15,
      }}
    >
      <p style={{ fontSize: 8, letterSpacing: '0.22em', color: 'rgba(255,100,160,0.5)', textTransform: 'uppercase', marginBottom: 20 }}>
        Contact
      </p>
      {(['name', 'email', 'message'] as const).map(field => (
        <input
          key={field}
          placeholder={field}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: '0.5px solid rgba(255,100,160,0.18)',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            padding: '8px 0',
            marginBottom: 8,
            outline: 'none',
            display: 'block',
          }}
        />
      ))}
      <button style={{
        marginTop: 14,
        width: '100%',
        background: 'rgba(255,100,160,0.07)',
        border: '0.5px solid rgba(255,100,160,0.3)',
        color: 'rgba(255,100,160,0.75)',
        fontFamily: "'Space Mono', monospace",
        fontSize: 9,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '10px 0',
        cursor: 'pointer',
      }}>
        transmit →
      </button>
    </div>
  )
}
