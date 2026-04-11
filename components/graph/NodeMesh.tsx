'use client'
import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGraphStore } from '@/store/graphStore'
import { GraphNode } from '@/types/graph'
import { livePos } from '@/lib/livePositions'
import { physState, setDraggedId } from '@/lib/physics'
import { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

const LAYER_STROKE = ['#ffffff', '#ff6ea0', '#ff82a8', '#ff96b4'] as const

interface RingSpec { r: number; w: number; op: number; color: string }

function buildRings(node: GraphNode, isActive: boolean): RingSpec[] {
  const base   = LAYER_STROKE[node.layer] ?? '#ff96b4'
  const mainW  = ([2.2, 1.6, 1.1, 0.9] as const)[node.layer]
  const mainOp = isActive ? 0.98 : ([0.70, 0.68, 0.60, 0.52] as const)[node.layer]
  const c      = isActive ? '#ffffff' : base

  return [
    { r: node.r * 1.13,  w: mainW * 0.22, op: mainOp * 0.16, color: c },
    { r: node.r * 1.055, w: mainW * 0.40, op: mainOp * 0.38, color: c },
    { r: node.r,         w: mainW,        op: mainOp,         color: c },
  ]
}

interface Props { node: GraphNode }

export function NodeMesh({ node }: Props) {
  const groupRef   = useRef<THREE.Group>(null)
  const fillRef    = useRef<THREE.Mesh>(null)
  const activeNode = useGraphStore(s => s.activeNode)
  const zoomTo     = useGraphStore(s => s.zoomTo)
  const isActive   = activeNode?.id === node.id
  const tRef       = useRef(Math.random() * Math.PI * 2)
  const wasDragged = useRef(false)

  useFrame((_, delta) => {
    tRef.current += delta * 1.0
    const pulse = 1 + Math.sin(tRef.current + node.x * 0.014) * 0.018
    if (fillRef.current) fillRef.current.scale.setScalar(pulse)
    const [lx, ly] = livePos.get(node.id) ?? [node.x, node.y]
    if (groupRef.current) {
      groupRef.current.position.x += (lx  - groupRef.current.position.x) * 0.12
      groupRef.current.position.y += (-ly - groupRef.current.position.y) * 0.12
    }
  })

  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    wasDragged.current = false
    const p = physState.get(node.id)
    if (p) { p.vx = 0; p.vy = 0 }
    setDraggedId(node.id)

    const onUp = () => {
      setDraggedId(null)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointerup', onUp)
  }, [node.id])

  const onPointerMove = useCallback(() => {
    wasDragged.current = true
  }, [])

  const onClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (!wasDragged.current) zoomTo(node)
    wasDragged.current = false
  }, [node, zoomTo])

  const rings = buildRings(node, isActive)

  // Glow: outer = pink atmosphere, mid = warm pink, inner = white (depth gradient)
  const glowRMult   = ([2.4, 2.0, 1.6, 1.2] as const)[node.layer]
  const glowOpBase  = ([0.10, 0.06, 0.035, 0.018] as const)[node.layer]
  const intensity   = isActive ? 1.9 : 1.0
  const glowOpOuter = glowOpBase * intensity         // pink, outermost
  const glowOpMid   = glowOpBase * intensity * 0.7   // lighter pink, mid
  const glowOpInner = glowOpBase * intensity * 1.4   // near-white, inner (brightest)

  return (
    <group ref={groupRef} position={[node.x, -node.y, -node.layer]}>

      {/* Pink outer atmosphere */}
      <mesh>
        <circleGeometry args={[node.r * glowRMult, 64]} />
        <meshBasicMaterial color="#ff6495" transparent opacity={glowOpOuter} />
      </mesh>
      {/* Warm pink mid layer */}
      <mesh>
        <circleGeometry args={[node.r * 1.7, 64]} />
        <meshBasicMaterial color="#ffaac8" transparent opacity={glowOpMid} />
      </mesh>
      {/* Near-white inner — shows depth, closest to surface */}
      <mesh>
        <circleGeometry args={[node.r * 1.22, 64]} />
        <meshBasicMaterial color="#fff0f5" transparent opacity={glowOpInner} />
      </mesh>

      {/* Active halo — precise bright white ring just outside fill */}
      {isActive && (
        <mesh>
          <ringGeometry args={[node.r * 1.01, node.r * 1.035, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
        </mesh>
      )}

      {/* Opaque fill */}
      <mesh ref={fillRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onClick={onClick}>
        <circleGeometry args={[node.r, 64]} />
        <meshBasicMaterial color="#060606" transparent={false} />
      </mesh>

      {/* Concentric depth rings */}
      {rings.map((ring, i) => (
        <mesh key={i}>
          <ringGeometry args={[ring.r - ring.w / 2, ring.r + ring.w / 2, 64]} />
          <meshBasicMaterial color={ring.color} transparent opacity={ring.op} />
        </mesh>
      ))}

      {/* Dark core — re-establishes black space inside the rings */}
      <mesh>
        <circleGeometry args={[node.r * 0.82, 64]} />
        <meshBasicMaterial color="#060606" transparent={false} />
      </mesh>
    </group>
  )
}
