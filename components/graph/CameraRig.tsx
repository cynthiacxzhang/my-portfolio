'use client'
import { useFrame, useThree } from '@react-three/fiber'
import { useGraphStore } from '@/store/graphStore'
import { useEffect } from 'react'
import { livePos } from '@/lib/livePositions'

const BASE_Z   = 800
const LERP     = 0.075
const MIN_ZOOM = 1.1
const MAX_ZOOM = 7.0

export function CameraRig() {
  const { camera, size } = useThree()
  const targetCam     = useGraphStore(s => s.targetCam)
  const setDimensions = useGraphStore(s => s.setDimensions)
  const nodes         = useGraphStore(s => s.nodes)
  const activeNode    = useGraphStore(s => s.activeNode)

  useEffect(() => {
    setDimensions(size.width, size.height)
  }, [size.width, size.height, setDimensions])

  useFrame(() => {
    // Lerp camera position
    camera.position.x += (targetCam.x        - camera.position.x) * LERP
    camera.position.y += (-targetCam.y       - camera.position.y) * LERP
    camera.position.z += (BASE_Z / targetCam.zoom - camera.position.z) * LERP
    camera.lookAt(camera.position.x, camera.position.y, 0)

    // Spread: 0 at min zoom, up to 0.6 at max zoom
    const t = Math.max(0, (targetCam.zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM))
    const spreadFactor = t * 0.6

    nodes.forEach(n => {
      const base: [number, number] = [n.x, n.y]
      let target: [number, number] = base

      if (activeNode && spreadFactor > 0) {
        if (n.parentId === activeNode.id) {
          // Direct children spread outward
          const dx = n.x - activeNode.x
          const dy = n.y - activeNode.y
          target = [
            activeNode.x + dx * (1 + spreadFactor),
            activeNode.y + dy * (1 + spreadFactor),
          ]
        } else if (n.layer > activeNode.layer && n.parentId !== activeNode.id && n.id !== activeNode.id) {
          // Non-children at deeper layers drift slightly toward their parent (declutter)
          const contract = spreadFactor * 0.2
          target = [n.x * (1 - contract), n.y * (1 - contract)]
        }
      }

      const cur = livePos.get(n.id) ?? base
      livePos.set(n.id, [
        cur[0] + (target[0] - cur[0]) * 0.07,
        cur[1] + (target[1] - cur[1]) * 0.07,
      ])
    })
  })

  return null
}
