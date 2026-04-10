export function HintText() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 44,
      right: 52,
      fontFamily: "'Space Mono', monospace",
      fontSize: 7,
      color: 'rgba(255,255,255,0.13)',
      letterSpacing: '0.08em',
      textAlign: 'right',
      lineHeight: 2.1,
      pointerEvents: 'none',
    }}>
      scroll to zoom<br />
      drag to pan<br />
      click to enter
    </div>
  )
}
