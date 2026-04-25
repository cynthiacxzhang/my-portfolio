'use client'
import { NameBlock }      from './NameBlock'
import { BioPanel }       from './BioPanel'
import { TerminalPanel }  from './TerminalPanel'
import { ContactPanel }   from './ContactPanel'
import { BackButton }     from './BackButton'
import { HintText }       from './HintText'

export function HUD() {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none',
      zIndex: 10,
      fontFamily: "'Space Mono', monospace",
    }}>
      {/* Right-edge vignette — mirrors the left margin, fades scene to black */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '12%',
        height: '100%',
        background: 'linear-gradient(to right, transparent 0%, rgba(6,6,6,0.3) 60%, rgba(6,6,6,0.75) 90%, #060606 100%)',
        pointerEvents: 'none',
        zIndex: 5,
      }} />

      <NameBlock />
      <BioPanel />
      <TerminalPanel />
      <ContactPanel />
      <BackButton />
      <HintText />
      <div style={{
        position: 'absolute',
        top: 268, right: 104,
        fontSize: 9,
        letterSpacing: '0.22em',
        color: 'rgba(255,255,255,0.1)',
        textTransform: 'uppercase',
        textAlign: 'right',
        lineHeight: 2,
        pointerEvents: 'none',
      }}>
        Neural Network — CZ.Graph
      </div>
    </div>
  )
}
