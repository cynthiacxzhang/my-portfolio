'use client'
import { Html } from '@react-three/drei'
import { GraphNode } from '@/types/graph'
import { useGraphStore } from '@/store/graphStore'

interface Props { node: GraphNode }

function anchorOffset(node: GraphNode): [number, number] {
  const D = node.r * 0.68
  switch (node.lAnchor) {
    case 'top-right':    return [ D, -D]
    case 'top-left':     return [-D, -D]
    case 'bottom-right': return [ D,  D]
    case 'bottom-left':  return [-D,  D]
    case 'right':        return [node.r, 0]
    case 'left':         return [-node.r, 0]
    case 'top':          return [0, -node.r]
    case 'bottom':       return [0,  node.r]
    default:             return [0, 0]
  }
}

function anchorTransform(anchor: GraphNode['lAnchor']): string {
  switch (anchor) {
    case 'top-right':    return 'translate(0%, -100%)'
    case 'top-left':     return 'translate(-100%, -100%)'
    case 'bottom-right': return 'translate(0%, 0%)'
    case 'bottom-left':  return 'translate(-100%, 0%)'
    case 'right':        return 'translate(0%, -50%)'
    case 'left':         return 'translate(-100%, -50%)'
    case 'top':          return 'translate(-50%, -100%)'
    case 'bottom':       return 'translate(-50%, 0%)'
    default:             return 'translate(-50%, -50%)'
  }
}

export function NodeLabel({ node }: Props) {
  const zoomTo     = useGraphStore(s => s.zoomTo)
  const activeNode = useGraphStore(s => s.activeNode)
  const isActive   = activeNode?.id === node.id
  const [dx, dy]   = anchorOffset(node)

  const labelStyle: React.CSSProperties = {
    fontFamily:    "'Space Mono', monospace",
    fontSize:      node.inside ? '10px' : node.type === 'label' ? '8.5px' : '9px',
    letterSpacing: node.inside ? '0.15em' : '0.07em',
    background: node.inside
      ? 'rgba(0,0,0,0.55)'
      : node.type === 'label'
        ? 'rgba(10,4,8,0.75)'
        : 'rgba(10,4,8,0.82)',
    border: `0.5px solid ${
      isActive
        ? 'rgba(255,255,255,0.7)'
        : node.inside
          ? 'rgba(255,255,255,0.42)'
          : node.type === 'label'
            ? 'rgba(255,100,160,0.38)'
            : 'rgba(255,100,160,0.55)'
    }`,
    color: node.inside
      ? 'rgba(255,255,255,0.92)'
      : node.type === 'label'
        ? 'rgba(255,120,160,0.8)'
        : 'rgba(255,130,175,1)',
    padding:       '3px 9px',
    whiteSpace:    'nowrap',
    cursor:        'pointer',
    transform:     anchorTransform(node.lAnchor),
    pointerEvents: 'auto',
  }

  return (
    <Html
      position={[node.x + dx, -(node.y + dy), -node.layer]}
      zIndexRange={[100, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div style={labelStyle} onClick={() => zoomTo(node)}>
        {node.label}
      </div>
    </Html>
  )
}
