'use client'
import { useFrame, useThree } from '@react-three/fiber'
import { useGraphStore } from '@/store/graphStore'
import { livePos } from '@/lib/livePositions'
import {
  physState, draggedId, dragTarget,
  K_SPRING, DAMPING, K_REPULSE,
} from '@/lib/physics'
import * as THREE from 'three'

const _ray    = new THREE.Raycaster()
const _plane  = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
const _target = new THREE.Vector3()

export function PhysicsEngine() {
  const nodes = useGraphStore(s => s.nodes)
  const { camera, pointer } = useThree()

  useFrame(() => {
    // Seed any new nodes; update rest position if data changed
    nodes.forEach(n => {
      const p = physState.get(n.id)
      if (!p) {
        physState.set(n.id, { x: n.x, y: n.y, vx: 0, vy: 0, restX: n.x, restY: n.y })
      } else if (p.restX !== n.x || p.restY !== n.y) {
        p.restX = n.x; p.restY = n.y
        p.x = n.x;    p.y = n.y
        p.vx = 0;     p.vy = 0
      }
    })

    // If dragging, unproject pointer → world XY
    if (draggedId) {
      _ray.setFromCamera(pointer, camera)
      if (_ray.ray.intersectPlane(_plane, _target)) {
        dragTarget.wx =  _target.x
        dragTarget.wy = -_target.y   // flip back to our graph space (y-down)
      }
    }

    // Physics step
    physState.forEach((p, id) => {
      const node = nodes.find(n => n.id === id)
      if (!node) return

      if (id === draggedId) {
        // Pin to pointer
        p.x = dragTarget.wx
        p.y = dragTarget.wy
        p.vx = 0; p.vy = 0
        livePos.set(id, [p.x, p.y])
        return
      }

      // Spring force back to rest position
      let ax = (p.restX - p.x) * K_SPRING
      let ay = (p.restY - p.y) * K_SPRING

      // Repulsion from every other node
      physState.forEach((q, qid) => {
        if (qid === id) return
        const qnode = nodes.find(n => n.id === qid)
        if (!qnode) return
        const dx = p.x - q.x
        const dy = p.y - q.y
        const dist2 = dx * dx + dy * dy
        const minDist = (node.r + qnode.r) * 0.85 + 20
        const dist = Math.sqrt(dist2)
        if (dist < minDist && dist > 0.5) {
          const overlap = (minDist - dist) / minDist
          ax += overlap * K_REPULSE * dx / dist
          ay += overlap * K_REPULSE * dy / dist
        }
      })

      p.vx = (p.vx + ax) * DAMPING
      p.vy = (p.vy + ay) * DAMPING
      p.x += p.vx
      p.y += p.vy
      livePos.set(id, [p.x, p.y])
    })
  })

  return null
}
