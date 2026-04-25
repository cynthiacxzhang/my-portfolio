'use client'

export function BioPanel() {
  return (
    <div
      id="panel-bio"
      style={{
        position: 'absolute',
        left: 72,
        top: '31vh',
        width: 300,
        height: 210,
        padding: '18px 22px 16px',
        border: '1px solid rgba(255,100,160,0.65)',
        background: 'rgba(18,8,14,0.82)',
        fontFamily: "'Space Mono', monospace",
        pointerEvents: 'auto',
        zIndex: 15,
        overflow: 'hidden',
      }}
    >
      <p style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(255,100,160,0.55)', textTransform: 'uppercase', marginBottom: 11 }}>
        Node — CZ — 001
      </p>

      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 1 }}>School</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>uwaterloo</span>
      </div>
      <div style={{ width: '100%', height: '0.5px', background: 'rgba(255,100,160,0.1)', margin: '7px 0' }} />

      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 1 }}>Focus</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>CS + Cognitive Science</span>
      </div>
      <div style={{ width: '100%', height: '0.5px', background: 'rgba(255,100,160,0.1)', margin: '7px 0' }} />

      <div>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 1 }}>Currently</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Wealthsimple · Building in public</span>
      </div>
    </div>
  )
}
