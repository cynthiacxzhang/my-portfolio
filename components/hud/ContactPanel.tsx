'use client'

// Third panel in zigzag — bottom-left, same x as Bio.
// top: 28vh + 2 * (PANEL_H * 2/3) = 28vh + 2 * 140px = 28vh + 280px
// 70px gap above Bio's bottom (Bio ends at 28vh+210, Contact starts at 28vh+280).

export function ContactPanel() {
  return (
    <div id="panel-contact" style={{
      position: 'absolute',
      left: 72,
      top: 'calc(34vh + 220px)',
      width: 300,
      height: 210,
      padding: '18px 22px 16px',
      border: '1px solid rgba(255,100,160,0.55)',
      background: 'rgba(18,8,14,0.82)',
      fontFamily: "'Space Mono', monospace",
      pointerEvents: 'auto',
      zIndex: 15,
      overflow: 'hidden',
    }}>
      <p style={{ fontSize: 11, letterSpacing: '0.18em', color: 'rgba(255,100,160,0.55)', textTransform: 'uppercase', marginBottom: 14 }}>
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
            borderBottom: '0.5px solid rgba(255,100,160,0.2)',
            color: 'rgba(255,255,255,0.65)',
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            padding: '6px 0',
            marginBottom: 6,
            outline: 'none',
            display: 'block',
          }}
        />
      ))}
      <button style={{
        marginTop: 6,
        width: '100%',
        background: 'rgba(255,100,160,0.07)',
        border: '0.5px solid rgba(255,100,160,0.3)',
        color: 'rgba(255,100,160,0.8)',
        fontFamily: "'Space Mono', monospace",
        fontSize: 10,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '5px 0',
        cursor: 'pointer',
      }}>
        connect →
      </button>
    </div>
  )
}
