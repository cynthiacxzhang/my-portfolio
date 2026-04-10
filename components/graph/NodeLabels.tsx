'use client'
import { useGraphStore } from '@/store/graphStore'
import { NodeLabel } from './NodeLabel'

export function NodeLabels() {
  const nodes = useGraphStore(s => s.nodes)

  return (
    <>
      {nodes.map(node => (
        <NodeLabel key={node.id} node={node} />
      ))}
    </>
  )
}
