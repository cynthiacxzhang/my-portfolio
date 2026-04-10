'use client'
import { useFrame, useThree } from '@react-three/fiber'
import { useGraphStore } from '@/store/graphStore'
import { useEffect } from 'react'

const BASE_Z = 800
const LERP   = 0.075

export function CameraRig() {
  const { camera, size } = useThree()
  const targetCam     = useGraphStore(s => s.targetCam)
  const setDimensions = useGraphStore(s => s.setDimensions)

  useEffect(() => {
    setDimensions(size.width, size.height)
  }, [size.width, size.height, setDimensions])

  useFrame(() => {
    camera.position.x += (targetCam.x         - camera.position.x) * LERP
    camera.position.y += (-targetCam.y         - camera.position.y) * LERP
    camera.position.z += (BASE_Z / targetCam.zoom - camera.position.z) * LERP
    camera.lookAt(camera.position.x, camera.position.y, 0)
  })

  return null
}
