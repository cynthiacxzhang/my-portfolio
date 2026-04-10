'use client'
import { Canvas } from '@react-three/fiber'
import { CameraRig } from './graph/CameraRig'
import { FlowLines } from './graph/FlowLines'
import { AttractorRings } from './graph/AttractorRings'
import { EdgeLayer } from './graph/EdgeLayer'
import { NodeLayer } from './graph/NodeLayer'
import { NodeLabels } from './graph/NodeLabels'

export function GraphCanvas() {
  return (
    <Canvas
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
      camera={{ position: [0, 0, 800], fov: 60, near: 0.1, far: 10000 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor('#060606')
      }}
    >
      <CameraRig />
      <FlowLines />
      <AttractorRings />
      <EdgeLayer />
      <NodeLayer />
      <NodeLabels />
    </Canvas>
  )
}
