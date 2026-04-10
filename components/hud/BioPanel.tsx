'use client'

export function BioPanel() {
  return (
    <div
      id="panel-bio"
      style={{
        position: 'absolute',
        left: 104,
        top: '28vh',
        width: 300,
        height: 210,
        padding: '18px 22px 16px',
        border: '0.5px solid rgba(255,100,160,0.32)',
        background: 'rgba(6,6,6,0.93)',
        fontFamily: "'Space Mono', monospace",
        pointerEvents: 'auto',
        zIndex: 15,
        overflow: 'hidden',
      }}
    >
      <p style={{ fontSize: 11, letterSpacing: '0.18em', color: 'rgba(255,100,160,0.55)', textTransform: 'uppercase', marginBottom: 14 }}>
        Node — CZ — 001
      </p>

      <div style={{ marginBottom: 9 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 1 }}>School</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>University of Waterloo</span>
      </div>
      <div style={{ width: '100%', height: '0.5px', background: 'rgba(255,100,160,0.1)', margin: '8px 0' }} />

      <div style={{ marginBottom: 9 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 1 }}>Focus</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>CS + Cognitive Science</span>
      </div>
      <div style={{ width: '100%', height: '0.5px', background: 'rgba(255,100,160,0.1)', margin: '8px 0' }} />

      <div>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 1 }}>Currently</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>Wealthsimple · Building in public</span>
      </div>
    </div>
  )
}
