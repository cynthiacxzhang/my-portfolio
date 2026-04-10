'use client'
import { NameBlock }    from './NameBlock'
import { BioPanel }     from './BioPanel'
import { ContactPanel } from './ContactPanel'
import { BackButton }   from './BackButton'
import { HintText }     from './HintText'

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
      <NameBlock />
      <BioPanel />
      <ContactPanel />
      <BackButton />
      <HintText />
      <div style={{
        position: 'absolute',
        top: 52, right: 52,
        fontSize: 7,
        letterSpacing: '0.22em',
        color: 'rgba(255,255,255,0.08)',
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
