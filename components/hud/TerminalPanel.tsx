'use client'

// Placeholder terminal panel — will become interactive unix-style filesystem browser.
// Middle panel in the zigzag layout.

export function TerminalPanel() {
  return (
    <div style={{
      position: 'absolute',
      left: 329,
      top: 'calc(40vh + 140px)',
      width: 300,
      height: 210,
      padding: '18px 22px 16px',
      border: '0.5px solid rgba(255,100,160,0.22)',
      background: 'rgba(4,4,4,0.96)',
      fontFamily: "'Space Mono', monospace",
      pointerEvents: 'auto',
      zIndex: 15,
      overflow: 'hidden',
    }}>
      <p style={{ fontSize: 11, letterSpacing: '0.18em', color: 'rgba(255,100,160,0.55)', textTransform: 'uppercase', marginBottom: 14 }}>
        System / Terminal
      </p>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', lineHeight: 1.9 }}>
        <div>$ ls ./graph</div>
        <div style={{ color: 'rgba(255,100,160,0.45)' }}>research&nbsp;&nbsp;work&nbsp;&nbsp;systems</div>
        <div style={{ color: 'rgba(255,100,160,0.45)' }}>about&nbsp;&nbsp;&nbsp;&nbsp;athlete</div>
        <div style={{ marginTop: 6 }}>$ cd research</div>
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>$</span>
          <span style={{
            display: 'inline-block',
            width: 7, height: 13,
            background: 'rgba(255,100,160,0.7)',
            animation: 'blink 1.1s step-end infinite',
          }} />
        </div>
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  )
}
