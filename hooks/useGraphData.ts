'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useGraphStore } from '@/store/graphStore'
import { NODES, EDGES } from '@/lib/graphData'
import { GraphNode, GraphEdge } from '@/types/graph'

export function useGraphData() {
  const setGraph = useGraphStore(s => s.setGraph)

  useEffect(() => {
    // Render on frame 1 with hardcoded data
    setGraph(NODES, EDGES)

    // Then swap if Supabase has rows
    async function fetchFromDB() {
      const [{ data: nodeRows }, { data: edgeRows }] = await Promise.all([
        supabase.from('graph_nodes').select('*'),
        supabase.from('graph_edges').select('*'),
      ])
      if (nodeRows?.length) {
        const nodes: GraphNode[] = nodeRows.map(r => ({
          id:       r.id,
          label:    r.label,
          title:    r.title,
          x:        r.x,
          y:        r.y,
          r:        r.r,
          layer:    r.layer,
          type:     r.node_type,
          inside:   r.label_inside,
          lAnchor:  r.label_anchor,
          parentId: r.parent_id,
        }))
        const edges: GraphEdge[] = (edgeRows ?? []).map(r => ({
          source:  r.source,
          target:  r.target,
          isCross: r.is_cross,
        }))
        setGraph(nodes, edges)
      }
    }
    fetchFromDB()
  }, [setGraph])
}
