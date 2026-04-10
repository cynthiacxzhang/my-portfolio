'use client'
import { useRef, useCallback } from 'react'
import { useGraphData } from '@/hooks/useGraphData'
import { useGraphStore } from '@/store/graphStore'
import { draggedId } from '@/lib/physics'
import { GraphCanvas } from './GraphCanvas'
import { HUD } from './hud/HUD'

export function GraphScene() {
  useGraphData()

  const pan       = useGraphStore(s => s.pan)
  const zoomWheel = useGraphStore(s => s.zoomWheel)
  const targetCam = useGraphStore(s => s.targetCam)

  const dragging  = useRef(false)
  const lastPos   = useRef({ x: 0, y: 0 })
  const lastTouch = useRef({ x: 0, y: 0 })

  // We need the live camera zoom for pan calculations — store it in a ref
  // that CameraRig keeps updated. For now, use targetCam.zoom as approximation.
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (draggedId) return   // node drag in progress — don't start canvas pan
    dragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current || draggedId) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    pan(dx, dy, targetCam.zoom)
  }, [pan, targetCam.zoom])

  const handleMouseUp = useCallback(() => {
    dragging.current = false
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    zoomWheel(e.deltaY, e.clientX, e.clientY, targetCam)
  }, [zoomWheel, targetCam])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (draggedId) return
    lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (draggedId) return
    const dx = e.touches[0].clientX - lastTouch.current.x
    const dy = e.touches[0].clientY - lastTouch.current.y
    lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    pan(dx, dy, targetCam.zoom)
  }, [pan, targetCam.zoom])

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', cursor: dragging.current ? 'grabbing' : 'crosshair' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <GraphCanvas />
      <HUD />
    </div>
  )
}
