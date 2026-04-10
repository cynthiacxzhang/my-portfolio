'use client'
import { useGraphStore } from '@/store/graphStore'
import { NodeMesh } from './NodeMesh'

export function NodeLayer() {
  const nodes = useGraphStore(s => s.nodes)

  // Draw largest first so smaller nodes are occluded by larger ones
  const circleNodes = [...nodes]
    .filter(n => n.type === 'circle')
    .sort((a, b) => b.r - a.r)

  return (
    <>
      {circleNodes.map(node => (
        <NodeMesh key={node.id} node={node} />
      ))}
    </>
  )
}
