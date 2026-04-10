'use client'

export function BioPanel() {
  return (
    <div
      id="panel-bio"
      style={{
        position: 'absolute',
        left: 52,
        top: '28%',
        width: 291,
        padding: '44px 33px 40px',
        border: '0.5px solid rgba(255,100,160,0.32)',
        background: 'rgba(6,6,6,0.92)',
        fontFamily: "'Space Mono', monospace",
        pointerEvents: 'auto',
        zIndex: 15,
      }}
    >
      <p style={{ fontSize: 8, letterSpacing: '0.22em', color: 'rgba(255,100,160,0.5)', textTransform: 'uppercase', marginBottom: 20 }}>
        Node — CZ — 001
      </p>

      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: 3 }}>School</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 2 }}>University of Waterloo</span>
      </div>
      <div style={{ width: '100%', height: '0.5px', background: 'rgba(255,100,160,0.1)', margin: '14px 0' }} />

      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: 3 }}>Focus</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 2 }}>CS + Cognitive Science</span>
      </div>
      <div style={{ width: '100%', height: '0.5px', background: 'rgba(255,100,160,0.1)', margin: '14px 0' }} />

      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: 3 }}>Currently</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 2 }}>Wealthsimple · Building in public</span>
      </div>
      <div style={{ width: '100%', height: '0.5px', background: 'rgba(255,100,160,0.1)', margin: '14px 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', minWidth: 36 }}>29%</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,100,160,0.15)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '29%', background: 'rgba(255,100,160,0.55)' }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', minWidth: 36 }}>76%</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,100,160,0.15)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '76%', background: 'rgba(255,100,160,0.55)' }} />
        </div>
      </div>
    </div>
  )
}
