'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGraphStore } from '@/store/graphStore'
import { GraphNode } from '@/types/graph'
import { livePos } from '@/lib/livePositions'
import * as THREE from 'three'

const LAYER_COLORS = [
  new THREE.Color('#ffffff'),
  new THREE.Color('#ff6ea0'),
  new THREE.Color('#ff82a8'),
  new THREE.Color('#ff96b4'),
]

interface Props { node: GraphNode }

export function NodeMesh({ node }: Props) {
  const groupRef  = useRef<THREE.Group>(null)
  const meshRef   = useRef<THREE.Mesh>(null)
  const activeNode = useGraphStore(s => s.activeNode)
  const zoomTo    = useGraphStore(s => s.zoomTo)
  const isActive  = activeNode?.id === node.id
  const t         = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    t.current += delta * 1.0
    const pulse = 1 + Math.sin(t.current + node.x * 0.014) * 0.018
    if (meshRef.current) meshRef.current.scale.setScalar(pulse)

    // Track live position from livePos map
    const [lx, ly] = livePos.get(node.id) ?? [node.x, node.y]
    if (groupRef.current) {
      groupRef.current.position.x += (lx - groupRef.current.position.x) * 0.12
      groupRef.current.position.y += (-ly - groupRef.current.position.y) * 0.12
    }
  })

  const color  = LAYER_COLORS[node.layer] ?? LAYER_COLORS[2]
  const stroke = isActive ? '#ffffff' : node.layer === 0 ? '#ffffff' : color.getStyle()
  const strokeOpacity = isActive ? 0.92 : node.layer === 0 ? 0.58 : 0.75 - node.layer * 0.1
  const strokeWidth = node.layer === 0 ? 1.5 : isActive ? 1.1 : 0.75

  return (
    <group ref={groupRef} position={[node.x, -node.y, -node.layer]}>
      {/* Glow halo */}
      {node.layer <= 1 && (
        <mesh>
          <circleGeometry args={[node.r * 2.0, 64]} />
          <meshBasicMaterial color="#ff6495" transparent opacity={node.layer === 0 ? 0.06 : 0.03} />
        </mesh>
      )}
      {/* Opaque fill — occludes nodes behind it */}
      <mesh ref={meshRef} onClick={() => zoomTo(node)}>
        <circleGeometry args={[node.r, 64]} />
        <meshBasicMaterial color="#060606" transparent={false} />
      </mesh>
      {/* Stroke ring */}
      <mesh>
        <ringGeometry args={[node.r - strokeWidth, node.r + strokeWidth * 0.5, 64]} />
        <meshBasicMaterial color={stroke} transparent opacity={strokeOpacity} />
      </mesh>
    </group>
  )
}
