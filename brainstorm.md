# Cursor Prompt — Cynthia Zhang Neural Graph Portfolio

You are building a personal portfolio site from scratch. This is not a standard portfolio.
The entire site is a single full-screen interactive graph — a neural network visualization
of a person's mind, work, and identity. Navigation happens by clicking nodes and zooming
into semantic spaces, not by scrolling pages or clicking navlinks.

I have a working HTML prototype (attached: cynthia_graph_v6.html). It proves the visual
language and interaction model. Your job is to rebuild this as a production Next.js app
using Three.js for the graph renderer. Preserve everything visual from the prototype
exactly — colors, layout, node data, camera behavior, label style, white string design.
Upgrade the rendering engine and add the data layer.

---

## TECH STACK

```
Framework:        Next.js 14, App Router, TypeScript, strict mode
Styling:          Tailwind CSS — HUD/panels only, never touch the graph
Graph renderer:   @react-three/fiber + @react-three/drei + three
State:            zustand
Spring animation: @react-spring/three (camera lerp only)
Data:             @supabase/supabase-js
Fonts:            next/font/google — Cormorant_Garamond + Space_Mono
Deployment:       Vercel (vercel.json not needed, zero-config)
```

Install command:
```bash
npx create-next-app@latest cynthia-graph --typescript --tailwind --app --no-src-dir
cd cynthia-graph
npm install three @react-three/fiber @react-three/drei @react-spring/three zustand @supabase/supabase-js
npm install -D @types/three
```

---

## PROJECT STRUCTURE

```
app/
  layout.tsx              ← fonts, <html> bg=#060606, overflow:hidden, no padding
  page.tsx                ← just renders <GraphScene />, full viewport, no other content

components/
  GraphScene.tsx          ← top-level client component ('use client')
                            renders: <HUD /> absolutely on top, <GraphCanvas /> filling screen
  GraphCanvas.tsx         ← <Canvas> from r3f, fills 100vw/100vh
                            children: <CameraRig> <FlowLines> <AttractorRings>
                                      <EdgeLayer> <NodeLayer> <NodeLabels>
  graph/
    CameraRig.tsx         ← useFrame() lerps camera toward target from Zustand store
    FlowLines.tsx         ← white string design (spine curves + web background)
    AttractorRings.tsx    ← decorative hollow rings (right side)
    EdgeLayer.tsx         ← all edges as <Line> from drei
    NodeLayer.tsx         ← maps nodes → <NodeMesh>
    NodeMesh.tsx          ← single circle node: <mesh> with click handler
    NodeLabels.tsx        ← maps nodes → <NodeLabel>
    NodeLabel.tsx         ← <Html> from drei, positions DOM label at 3D node position

  hud/
    HUD.tsx               ← pointer-events:none wrapper, renders all panels
    NameBlock.tsx         ← "Cynthia Zhang" + tagline, fixed top-left
    BioPanel.tsx          ← identity info panel, vertically centered left
    ContactPanel.tsx      ← contact form, overlaps BioPanel bottom-left corner
    BackButton.tsx        ← appears when history.length > 0
    HintText.tsx          ← bottom-right: "scroll to zoom / drag to pan / click to enter"

hooks/
  useGraphData.ts         ← fetches nodes + edges from Supabase on mount
  useWindowSize.ts        ← { W, H } updated on resize

store/
  graphStore.ts           ← Zustand store (see spec below)

lib/
  supabase.ts             ← createClient() using env vars
  graphData.ts            ← HARDCODED fallback node/edge data (used until Supabase is wired)
  renderUtils.ts          ← labelAnchorOffset(node, radius, anchor) → {dx, dy}

types/
  graph.ts                ← Node, Edge, Camera, LabelAnchor types
```

---

## TYPES

```typescript
// types/graph.ts

export type LabelAnchor =
  | 'center' | 'top-right' | 'top-left'
  | 'bottom-right' | 'bottom-left'
  | 'right' | 'left' | 'top' | 'bottom'

export type NodeType = 'circle' | 'label'

export interface GraphNode {
  id: string
  label: string        // pink tag text: "R — 7.4"
  title: string        // human name: "Research"
  x: number
  y: number
  r: number            // radius in world units. 0 for terminal/label nodes
  layer: 0 | 1 | 2 | 3
  type: NodeType
  inside: boolean      // if true, label centered inside circle
  lAnchor: LabelAnchor
  parentId: string | null
}

export interface GraphEdge {
  source: string       // node id
  target: string       // node id
  isCross: boolean     // true = amber dashed, false = white structural
}

export interface CameraState {
  x: number
  y: number
  zoom: number
}
```

---

## ZUSTAND STORE

```typescript
// store/graphStore.ts
import { create } from 'zustand'
import { GraphNode, GraphEdge, CameraState } from '@/types/graph'

const MIN_ZOOM = 1.1
const MAX_ZOOM = 7.0
const ZOOM_MAP = [1.1, 1.8, 2.8, 4.0]

interface GraphStore {
  nodes: GraphNode[]
  edges: GraphEdge[]
  activeNode: GraphNode | null
  history: GraphNode[]
  targetCam: CameraState
  W: number
  H: number

  setGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void
  setDimensions: (W: number, H: number) => void
  zoomTo: (node: GraphNode) => void
  goBack: () => void
  resetCamera: () => void
  pan: (dx: number, dy: number, currentZoom: number) => void
  zoomWheel: (delta: number, mx: number, my: number, currentCam: CameraState) => void
}

function defaultTarget(W: number, H: number): CameraState {
  // CZ node (world 0,0) anchored at 72% x, 50% y of screen
  const sx = W * 0.72, sy = H * 0.50
  return {
    x: -(sx - W / 2) / MIN_ZOOM,
    y: -(sy - H / 2) / MIN_ZOOM,
    zoom: MIN_ZOOM,
  }
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  nodes: [],
  edges: [],
  activeNode: null,
  history: [],
  targetCam: defaultTarget(
    typeof window !== 'undefined' ? window.innerWidth : 1440,
    typeof window !== 'undefined' ? window.innerHeight : 900
  ),
  W: typeof window !== 'undefined' ? window.innerWidth : 1440,
  H: typeof window !== 'undefined' ? window.innerHeight : 900,

  setGraph: (nodes, edges) => set({ nodes, edges, activeNode: nodes[0] ?? null }),

  setDimensions: (W, H) => set({ W, H, targetCam: defaultTarget(W, H) }),

  zoomTo: (node) => {
    const { activeNode, history, W, H } = get()
    const z = Math.max(MIN_ZOOM, ZOOM_MAP[node.layer] ?? 1.8)
    const sx = W * 0.72, sy = H * 0.50
    set({
      activeNode: node,
      history: activeNode ? [...history, activeNode] : history,
      targetCam: {
        x: node.x - (sx - W / 2) / z,
        y: node.y - (sy - H / 2) / z,
        zoom: z,
      },
    })
  },

  goBack: () => {
    const { history, W, H } = get()
    if (!history.length) return
    const prev = history[history.length - 1]
    const z = Math.max(MIN_ZOOM, ZOOM_MAP[prev.layer] ?? MIN_ZOOM)
    const sx = W * 0.72, sy = H * 0.50
    set({
      activeNode: prev,
      history: history.slice(0, -1),
      targetCam: {
        x: prev.x - (sx - W / 2) / z,
        y: prev.y - (sy - H / 2) / z,
        zoom: z,
      },
    })
  },

  resetCamera: () => {
    const { W, H } = get()
    set({ targetCam: defaultTarget(W, H), activeNode: null, history: [] })
  },

  pan: (dx, dy, currentZoom) => {
    set(s => ({
      targetCam: {
        ...s.targetCam,
        x: s.targetCam.x - dx / currentZoom,
        y: s.targetCam.y - dy / currentZoom,
      }
    }))
  },

  zoomWheel: (delta, mx, my, currentCam) => {
    const factor = delta > 0 ? 0.88 : 1.13
    const newZ = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentCam.zoom * factor))
    const { W, H } = get()
    const wx = currentCam.x + (mx - W / 2) / currentCam.zoom
    const wy = currentCam.y + (my - H / 2) / currentCam.zoom
    set({
      targetCam: {
        zoom: newZ,
        x: wx - (mx - W / 2) / newZ,
        y: wy - (my - H / 2) / newZ,
      }
    })
  },
}))
```

---

## HARDCODED GRAPH DATA

```typescript
// lib/graphData.ts
// This is the source of truth until Supabase is wired.
// Node positions are in world units. CZ is at origin (0,0).
// Graph is right-heavy: CZ sits at W*0.72 on screen.
// Nodes cluster LEFT and DOWN from CZ.

import { GraphNode, GraphEdge } from '@/types/graph'

export const NODES: GraphNode[] = [
  // Layer 0
  { id:'cz',        label:'scroll to explore ↓', title:'Cynthia Zhang',        x:    0, y:    0, r:200, layer:0, type:'circle', inside:true,  lAnchor:'center',       parentId:null },
  // Layer 1 — left/below heavy
  { id:'research',  label:'R — 7.4',              title:'Research',             x: -330, y: -100, r:130, layer:1, type:'circle', inside:true,  lAnchor:'top-right',    parentId:'cz' },
  { id:'about',     label:'F — 2.4',              title:'About Me',             x: -360, y:  200, r:115, layer:1, type:'circle', inside:false, lAnchor:'top-right',    parentId:'cz' },
  { id:'athlete',   label:'B — 3/8',              title:'Athletics & Life',     x: -120, y:  380, r:100, layer:1, type:'circle', inside:false, lAnchor:'top-right',    parentId:'cz' },
  { id:'work',      label:'G — 4/2',              title:'Work & Co-ops',        x:  340, y: -160, r:110, layer:1, type:'circle', inside:true,  lAnchor:'bottom-left',  parentId:'cz' },
  { id:'systems',   label:'A — 7/3',              title:'Systems & Projects',   x:  310, y:  240, r: 95, layer:1, type:'circle', inside:false, lAnchor:'top-left',     parentId:'cz' },
  // Layer 2
  { id:'ml',        label:'VE — 0084',            title:'Machine Learning',     x: -520, y: -230, r: 72, layer:2, type:'circle', inside:false, lAnchor:'top-right',    parentId:'research' },
  { id:'hail',      label:'FN — 9062',            title:'N. Hail Project',      x: -300, y: -330, r: 58, layer:2, type:'circle', inside:false, lAnchor:'top-right',    parentId:'research' },
  { id:'model',     label:'DS — 2893',            title:'GAN Paper',            x: -480, y: -370, r: 48, layer:2, type:'circle', inside:false, lAnchor:'bottom-right', parentId:'research' },
  { id:'cogsci',    label:'SR — 7832',            title:'Cognitive Science',    x: -560, y:   80, r: 65, layer:2, type:'circle', inside:false, lAnchor:'bottom-right', parentId:'about' },
  { id:'adhd',      label:'P — 8931',             title:'ADHD & Cognition',     x: -520, y:  340, r: 54, layer:2, type:'circle', inside:false, lAnchor:'top-right',    parentId:'about' },
  { id:'swim',      label:'DW — 7561',            title:'Competitive Swimming', x: -260, y:  530, r: 52, layer:2, type:'circle', inside:false, lAnchor:'top-right',    parentId:'athlete' },
  { id:'graph',     label:'RO — 2893',            title:'Graph Thinking',       x:  120, y:  510, r: 52, layer:2, type:'circle', inside:false, lAnchor:'top-left',     parentId:'systems' },
  { id:'rag',       label:'RO — 9472',            title:'RAG / pgvector',       x:  540, y: -120, r: 48, layer:2, type:'circle', inside:false, lAnchor:'bottom-left',  parentId:'work' },
  { id:'exec',      label:'KU — 0073',            title:'execOS',               x:  530, y:  300, r: 48, layer:2, type:'circle', inside:false, lAnchor:'top-left',     parentId:'systems' },
  // Layer 3 — terminal labels (no circle, r=0)
  { id:'ieee',      label:'FG — 8374',            title:'IEEE ISEC 2024',       x: -620, y: -500, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'model' },
  { id:'gan_arch',  label:'ET — 3940',            title:'GAN Architecture',     x: -700, y: -280, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'ml' },
  { id:'note',      label:'Q — 9973',             title:'Neural Netbook',       x:  260, y:  640, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'graph' },
  { id:'mun',       label:'VA — 2904',            title:'Model UN',             x: -700, y:  160, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'cogsci' },
  { id:'depth',     label:'G — 3943',             title:'Depth Processing',     x: -680, y:  420, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'adhd' },
  { id:'triathlon', label:'RT — 7832',            title:'Triathlon Training',   x: -400, y:  660, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'swim' },
  { id:'supabase',  label:'SH — 456',             title:'Supabase / pgvector',  x:  700, y:   40, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'rag' },
  { id:'fastapi',   label:'B — 784',              title:'FastAPI / execOS',     x:  700, y:  420, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'exec' },
]

export const EDGES: GraphEdge[] = [
  // structural (white)
  { source:'cz',       target:'research',  isCross:false },
  { source:'cz',       target:'work',      isCross:false },
  { source:'cz',       target:'systems',   isCross:false },
  { source:'cz',       target:'about',     isCross:false },
  { source:'cz',       target:'athlete',   isCross:false },
  { source:'research', target:'ml',        isCross:false },
  { source:'research', target:'hail',      isCross:false },
  { source:'research', target:'model',     isCross:false },
  { source:'model',    target:'ieee',      isCross:false },
  { source:'ml',       target:'gan_arch',  isCross:false },
  { source:'about',    target:'cogsci',    isCross:false },
  { source:'about',    target:'adhd',      isCross:false },
  { source:'cogsci',   target:'mun',       isCross:false },
  { source:'adhd',     target:'depth',     isCross:false },
  { source:'athlete',  target:'swim',      isCross:false },
  { source:'swim',     target:'triathlon', isCross:false },
  { source:'systems',  target:'graph',     isCross:false },
  { source:'systems',  target:'exec',      isCross:false },
  { source:'graph',    target:'note',      isCross:false },
  { source:'exec',     target:'fastapi',   isCross:false },
  { source:'work',     target:'rag',       isCross:false },
  { source:'rag',      target:'supabase',  isCross:false },
  // cross-domain (amber dashed) — these encode ADHD-style relational thinking:
  // the meaningful connections ARE the cross-domain ones
  { source:'ml',       target:'cogsci',    isCross:true },
  { source:'adhd',     target:'graph',     isCross:true },
  { source:'model',    target:'ml',        isCross:true },
  { source:'hail',     target:'swim',      isCross:true },
  { source:'cogsci',   target:'adhd',      isCross:true },
  { source:'research', target:'cogsci',    isCross:true },
  { source:'exec',     target:'graph',     isCross:true },
  { source:'rag',      target:'ieee',      isCross:true },
]
```

---

## THREE.JS COMPONENTS

### GraphCanvas.tsx
```tsx
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
```

### CameraRig.tsx
```tsx
// The camera system. This is the heart of navigation.
// useFrame lerps the Three.js camera toward targetCam from the Zustand store.
// The camera is ORTHOGRAPHIC in feel (no perspective distortion on 2D graph)
// but implemented as perspective with high FOV distance so it reads flat.
//
// World units: 1 unit ≈ 1px at default zoom.
// CZ node is at (0,0,0). Camera starts at z=800, zooms in by moving closer.
// "Zoom" is implemented as camera.position.z — closer = more zoomed in.
// MIN_ZOOM=1.1 maps to z≈727. MAX_ZOOM=7.0 maps to z≈114.
// Formula: z = BASE_Z / zoom, where BASE_Z = 800.

'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGraphStore } from '@/store/graphStore'
import * as THREE from 'three'

const BASE_Z = 800
const LERP   = 0.075

export function CameraRig() {
  const { camera } = useThree()
  const targetCam  = useGraphStore(s => s.targetCam)
  const setStore   = useGraphStore(s => s.setDimensions)
  const { size }   = useThree()

  // Sync screen dimensions to store
  useFrame(() => {
    // Target position in 3D: x and y from targetCam, z from zoom
    const tx = targetCam.x
    const ty = -targetCam.y  // Three.js y is inverted vs canvas
    const tz = BASE_Z / targetCam.zoom

    camera.position.x += (tx - camera.position.x) * LERP
    camera.position.y += (ty - camera.position.y) * LERP
    camera.position.z += (tz - camera.position.z) * LERP
    camera.lookAt(camera.position.x, camera.position.y, 0)
  })

  return null
}
```

### FlowLines.tsx
```tsx
// White string design — two layers:
// 1. Background web: many random bezier curves anchored right of center
// 2. Spine: deliberate curves tracing top-right → CZ bubble → bottom-left panels
// This is generated once with useMemo — never regenerated.

'use client'
import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { QuadraticBezierCurve3, Vector3 } from 'three'

function makeCurvePoints(x1:number,y1:number,mx:number,my:number,x2:number,y2:number,n=24) {
  return new QuadraticBezierCurve3(
    new Vector3(x1,-y1,0),
    new Vector3(mx,-my,0),
    new Vector3(x2,-y2,0)
  ).getPoints(n)
}

export function FlowLines() {
  const lines = useMemo(() => {
    const out: Array<{pts: THREE.Vector3[], alpha: number, width: number}> = []

    // Background web — right-side cluster
    for(let i=0;i<180;i++){
      const cx=300, cy=100
      const a1=Math.random()*Math.PI*2, d1=80+Math.random()*500
      const a2=a1+(Math.random()-.5)*1.6, d2=60+Math.random()*500
      out.push({
        pts: makeCurvePoints(
          cx+Math.cos(a1)*d1, cy+Math.sin(a1)*d1,
          cx+(Math.random()-.5)*380, cy+(Math.random()-.5)*380,
          cx+Math.cos(a2)*d2, cy+Math.sin(a2)*d2
        ),
        alpha: 0.035+Math.random()*0.095,
        width: 0.4,
      })
    }

    // Spine — intentional arcs: top-right → through CZ → bottom-left
    const spine = [
      [600,-400, 280,100, -200,500, 0.45,1.1],
      [620,-300, 300, 80, -180,600, 0.35,0.9],
      [580,-500, 200,200, -280,480, 0.30,1.0],
      [640,-200, 350,150, -100,520, 0.25,0.8],
      [560,-600, 160,300, -320,420, 0.22,0.7],
      [500,-350, 250, 50, -150,580, 0.32,1.0],
      [660,-100, 320,250,  -80,560, 0.20,0.7],
      [200, 400,-100,550, -380,680, 0.28,0.8],
      [100, 450,-150,560, -420,650, 0.22,0.6],
      [300, 380, -80,520, -350,700, 0.20,0.5],
    ] as const
    spine.forEach(([x1,y1,mx,my,x2,y2,a,w]) => {
      out.push({ pts: makeCurvePoints(x1,y1,mx,my,x2,y2,32), alpha:a, width:w })
    })

    return out
  }, [])

  return (
    <>
      {lines.map((l,i) => (
        <Line
          key={i}
          points={l.pts}
          color={`rgba(255,255,255,${l.alpha})`}
          lineWidth={l.width}
          transparent
          opacity={l.alpha}
        />
      ))}
    </>
  )
}
```

### NodeMesh.tsx
```tsx
// Single node. Circle nodes are rendered as flat discs (PlaneGeometry + circle shader)
// or as ring geometry (RingGeometry for the stroke look).
// Fill: opaque dark. Stroke: color by layer. Largest drawn first = occludes smaller.
// Label anchoring is handled in NodeLabel.tsx via <Html> from drei.

'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGraphStore } from '@/store/graphStore'
import { GraphNode } from '@/types/graph'
import * as THREE from 'three'

const LAYER_COLORS = [
  new THREE.Color('#ffffff'),      // layer 0 — white
  new THREE.Color('#ff6ea0'),      // layer 1 — bright pink
  new THREE.Color('#ff82a8'),      // layer 2 — medium pink
  new THREE.Color('#ff96b4'),      // layer 3 — lighter pink
]

interface Props { node: GraphNode }

export function NodeMesh({ node }: Props) {
  const meshRef  = useRef<THREE.Mesh>(null)
  const ringRef  = useRef<THREE.Mesh>(null)
  const activeNode = useGraphStore(s => s.activeNode)
  const zoomTo   = useGraphStore(s => s.zoomTo)
  const isActive = activeNode?.id === node.id
  const t = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    t.current += delta * 1.0
    if(meshRef.current) {
      const pulse = 1 + Math.sin(t.current + node.x * 0.014) * 0.018
      meshRef.current.scale.setScalar(pulse)
    }
  })

  const color  = LAYER_COLORS[node.layer] ?? LAYER_COLORS[2]
  const stroke = isActive ? '#ffffff' : node.layer === 0 ? '#ffffff' : color.getStyle()

  return (
    <group position={[node.x, -node.y, -node.layer]}>
      {/* Opaque fill disc — occludes everything behind it */}
      <mesh ref={meshRef} onClick={() => zoomTo(node)}>
        <circleGeometry args={[node.r, 64]} />
        <meshBasicMaterial color="#060606" transparent={false} />
      </mesh>
      {/* Stroke ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[node.r - 1, node.r + (node.layer===0?1.5:0.75), 64]} />
        <meshBasicMaterial
          color={stroke}
          transparent
          opacity={isActive ? 0.92 : node.layer===0 ? 0.58 : 0.75 - node.layer*0.1}
        />
      </mesh>
      {/* Glow halo for layer 0 and 1 */}
      {node.layer <= 1 && (
        <mesh>
          <circleGeometry args={[node.r * 2.0, 64]} />
          <meshBasicMaterial
            color="#ff6495"
            transparent
            opacity={node.layer===0 ? 0.06 : 0.03}
          />
        </mesh>
      )}
    </group>
  )
}
```

### NodeLabel.tsx
```tsx
// Uses <Html> from drei — automatically projects 3D position to screen DOM.
// No manual worldToScreen() math needed.
// Label is offset from node center based on lAnchor so it crosses the circle edge.
// occlude prop hides label when it's behind another mesh (free depth culling).

'use client'
import { Html } from '@react-three/drei'
import { GraphNode } from '@/types/graph'
import { useGraphStore } from '@/store/graphStore'

interface Props { node: GraphNode }

// Returns [dx, dy] offset in world units so label edge crosses circle rim
function anchorOffset(node: GraphNode): [number, number] {
  const D = node.r * 0.68  // diagonal distance at 45°
  switch(node.lAnchor) {
    case 'top-right':    return [ D, -D]
    case 'top-left':     return [-D, -D]
    case 'bottom-right': return [ D,  D]
    case 'bottom-left':  return [-D,  D]
    case 'right':        return [node.r, 0]
    case 'left':         return [-node.r, 0]
    case 'top':          return [0, -node.r]
    case 'bottom':       return [0,  node.r]
    default:             return [0, 0]
  }
}

// CSS transform so label EXTENDS outward from the anchor point (not centered on it)
function anchorTransform(anchor: GraphNode['lAnchor']): string {
  switch(anchor) {
    case 'top-right':    return 'translate(0%, -100%)'
    case 'top-left':     return 'translate(-100%, -100%)'
    case 'bottom-right': return 'translate(0%, 0%)'
    case 'bottom-left':  return 'translate(-100%, 0%)'
    case 'right':        return 'translate(0%, -50%)'
    case 'left':         return 'translate(-100%, -50%)'
    case 'top':          return 'translate(-50%, -100%)'
    case 'bottom':       return 'translate(-50%, 0%)'
    default:             return 'translate(-50%, -50%)'
  }
}

export function NodeLabel({ node }: Props) {
  const zoomTo     = useGraphStore(s => s.zoomTo)
  const activeNode = useGraphStore(s => s.activeNode)
  const isActive   = activeNode?.id === node.id
  const [dx, dy]   = anchorOffset(node)

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize:   node.inside ? '10px' : node.type === 'label' ? '8.5px' : '9px',
    letterSpacing: node.inside ? '0.15em' : '0.07em',
    background: node.inside
      ? 'rgba(0,0,0,0.55)'
      : node.type === 'label'
        ? 'rgba(10,4,8,0.75)'
        : 'rgba(10,4,8,0.82)',
    border: `0.5px solid ${
      isActive ? 'rgba(255,255,255,0.7)' :
      node.inside ? 'rgba(255,255,255,0.42)' :
      node.type === 'label' ? 'rgba(255,100,160,0.38)' :
      'rgba(255,100,160,0.55)'
    }`,
    color: node.inside ? 'rgba(255,255,255,0.92)'
         : node.type === 'label' ? 'rgba(255,120,160,0.8)'
         : 'rgba(255,130,175,1)',
    padding: '3px 9px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transform: anchorTransform(node.lAnchor),
    pointerEvents: 'auto',
  }

  return (
    <Html
      position={[node.x + dx, -(node.y + dy), -node.layer]}
      zIndexRange={[20, 20]}
      style={{ pointerEvents: 'none' }}
    >
      <div style={labelStyle} onClick={() => zoomTo(node)}>
        {node.label}
      </div>
    </Html>
  )
}
```

### EdgeLayer.tsx
```tsx
// Renders all edges as curved lines.
// Structural edges: white, alpha by depth.
// Cross-domain edges: amber (#ffd278), dashed appearance via short segments.
// Terminal edges (to label nodes): dashed, faint.
// Curves are quadratic bezier — control point offset perpendicular to edge midpoint.

'use client'
import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { useGraphStore } from '@/store/graphStore'
import { GraphNode } from '@/types/graph'
import { QuadraticBezierCurve3, Vector3 } from 'three'

const ALPHA_BY_DEPTH = [0.65, 0.42, 0.26, 0.14]

export function EdgeLayer() {
  const nodes = useGraphStore(s => s.nodes)
  const edges = useGraphStore(s => s.edges)
  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes])

  const lines = useMemo(() => {
    return edges.map(edge => {
      const na = nodeMap.get(edge.source)
      const nb = nodeMap.get(edge.target)
      if(!na || !nb) return null

      const depth  = Math.max(na.layer, nb.layer)
      const alpha  = ALPHA_BY_DEPTH[depth] ?? 0.12
      const bend   = ((na.x * 7 + nb.y * 3) % 5 > 2) ? 0.24 : -0.20
      const mx     = (na.x + nb.x) / 2 + (nb.y - na.y) * bend
      const my     = (na.y + nb.y) / 2 - (nb.x - na.x) * bend
      const z      = -depth * 0.5

      const pts = new QuadraticBezierCurve3(
        new Vector3(na.x, -na.y, z),
        new Vector3(mx,   -my,   z),
        new Vector3(nb.x, -nb.y, z),
      ).getPoints(24)

      return {
        pts,
        color:     edge.isCross ? '#ffd278' : '#ffffff',
        alpha:     edge.isCross ? alpha : alpha * 0.9,
        width:     depth === 0 ? 1.4 : nb.type === 'label' ? 0.4 : 0.6,
        dashed:    edge.isCross || nb.type === 'label',
      }
    }).filter(Boolean)
  }, [edges, nodeMap])

  return (
    <>
      {lines.map((l,i) => l && (
        <Line
          key={i}
          points={l.pts}
          color={l.color}
          lineWidth={l.width}
          transparent
          opacity={l.alpha}
          dashed={l.dashed}
          dashScale={l.dashed ? 50 : undefined}
          dashSize={l.dashed ? 3 : undefined}
          gapSize={l.dashed ? 6 : undefined}
        />
      ))}
    </>
  )
}
```

---

## HUD COMPONENTS

### HUD.tsx
```tsx
'use client'
import { NameBlock }     from './NameBlock'
import { BioPanel }      from './BioPanel'
import { ContactPanel }  from './ContactPanel'
import { BackButton }    from './BackButton'
import { HintText }      from './HintText'

export function HUD() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none',
      zIndex: 10,
      fontFamily: "'Space Mono', monospace",
    }}>
      <NameBlock />
      <BioPanel />
      <ContactPanel />
      <BackButton />
      <HintText />
      <div
        style={{
          position:'absolute', top:52, right:52,
          fontSize:7, letterSpacing:'0.22em',
          color:'rgba(255,255,255,0.08)',
          textTransform:'uppercase', textAlign:'right',
          lineHeight:2,
        }}
      >
        Neural Network — CZ.Graph
      </div>
    </div>
  )
}
```

### NameBlock.tsx
```tsx
// Cormorant Garamond italic for the name.
// Single-line Space Mono tagline with generous margin.
// Fixed top-left, ~52px margin.
// pointerEvents: none — it's decorative.

import { Cormorant_Garamond, Space_Mono } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'], weight: ['600'], style: ['italic']
})
const spaceMono = Space_Mono({
  subsets: ['latin'], weight: ['400']
})

export function NameBlock() {
  return (
    <div style={{ position:'absolute', top:52, left:52, pointerEvents:'none' }}>
      <h1
        className={cormorant.className}
        style={{
          fontSize: 58,
          fontStyle: 'italic',
          fontWeight: 600,
          color: '#fff',
          lineHeight: 1,
          letterSpacing: '0.01em',
          margin: 0,
        }}
      >
        Cynthia Zhang
      </h1>
      <p
        className={spaceMono.className}
        style={{
          fontSize: 8,
          color: 'rgba(255,100,160,0.6)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: 22,
          whiteSpace: 'nowrap',
        }}
      >
        ML Engineer &nbsp;·&nbsp; Uni of Waterloo &nbsp;·&nbsp; Wealthsimple
      </p>
    </div>
  )
}
```

### BioPanel.tsx
```tsx
// Left side, vertically centered at ~42% of screen height.
// Wider and larger than prototype: 220px, bigger text.
// Links replace binary numbers and meaningless stat bars.

'use client'
import { useEffect, useRef, useState } from 'react'
import { useWindowSize } from '@/hooks/useWindowSize'

export function BioPanel() {
  const { H } = useWindowSize()
  const top = H ? Math.round(H * 0.36) : 300

  return (
    <div
      id="panel-bio"
      style={{
        position: 'absolute',
        left: 52, top,
        width: 220,
        padding: '24px 26px',
        border: '0.5px solid rgba(255,100,160,0.32)',
        background: 'rgba(6,6,6,0.93)',
        pointerEvents: 'auto',
        zIndex: 15,
      }}
    >
      <p style={{ fontSize:7.5, letterSpacing:'0.22em', color:'rgba(255,100,160,0.5)', textTransform:'uppercase', marginBottom:16 }}>—</p>

      <div style={{ marginBottom:10 }}>
        <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.8)', display:'block', marginBottom:3 }}>School</span>
        <span style={{ fontSize:9, color:'rgba(255,255,255,0.4)', lineHeight:1.8 }}>University of Waterloo</span>
      </div>
      <div style={{ width:'100%', height:'0.5px', background:'rgba(255,100,160,0.1)', margin:'10px 0' }} />

      <div style={{ marginBottom:10 }}>
        <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.8)', display:'block', marginBottom:3 }}>Focus</span>
        <span style={{ fontSize:9, color:'rgba(255,255,255,0.4)', lineHeight:1.8 }}>CS + Cognitive Science</span>
      </div>
      <div style={{ width:'100%', height:'0.5px', background:'rgba(255,100,160,0.1)', margin:'10px 0' }} />

      <div style={{ marginBottom:10 }}>
        <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.8)', display:'block', marginBottom:3 }}>Currently</span>
        <span style={{ fontSize:9, color:'rgba(255,255,255,0.4)', lineHeight:1.8 }}>Wealthsimple · Building in public</span>
      </div>
      <div style={{ width:'100%', height:'0.5px', background:'rgba(255,100,160,0.1)', margin:'10px 0' }} />

      <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
        {[
          { label:'github',   href:'https://github.com/cynthiazhang' },
          { label:'linkedin', href:'https://linkedin.com/in/cynthiazhang' },
          { label:'email',    href:'mailto:cynthia@example.com' },
        ].map(l => (
          <a key={l.label} href={l.href}
            style={{ fontSize:8.5, color:'rgba(255,100,160,0.65)', letterSpacing:'0.1em',
                     textDecoration:'none', textTransform:'lowercase' }}
            onMouseEnter={e => (e.target as HTMLElement).style.color='#fff'}
            onMouseLeave={e => (e.target as HTMLElement).style.color='rgba(255,100,160,0.65)'}
          >
            ↗ {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}
```

### ContactPanel.tsx
```tsx
// Overlaps BioPanel: left edge at bio.left + 20px, top at bio.bottom - 32px.
// Measured via ref after mount so overlap is exact regardless of bio height.

'use client'
import { useEffect, useRef, useState } from 'react'

export function ContactPanel() {
  const [pos, setPos] = useState({ left: 72, top: 580 })

  useEffect(() => {
    function measure() {
      const bio = document.getElementById('panel-bio')
      if(!bio) return
      const r = bio.getBoundingClientRect()
      setPos({ left: r.left + 20, top: r.bottom - 32 })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <div style={{
      position:'absolute', left:pos.left, top:pos.top,
      width:200,
      padding:'18px 22px',
      border:'0.5px solid rgba(255,100,160,0.2)',
      background:'rgba(6,6,6,0.95)',
      pointerEvents:'auto',
      zIndex:15,
    }}>
      <p style={{ fontSize:7.5, letterSpacing:'0.22em', color:'rgba(255,100,160,0.5)', textTransform:'uppercase', marginBottom:14 }}>Contact</p>
      {(['name','email','message'] as const).map(field => (
        <input key={field} placeholder={field}
          style={{
            width:'100%', background:'transparent', border:'none',
            borderBottom:'0.5px solid rgba(255,100,160,0.18)',
            color:'rgba(255,255,255,0.6)',
            fontFamily:"'Space Mono',monospace", fontSize:8,
            padding:'5px 0', marginBottom:5, outline:'none', display:'block',
          }}
        />
      ))}
      <button style={{
        marginTop:10, width:'100%',
        background:'rgba(255,100,160,0.07)',
        border:'0.5px solid rgba(255,100,160,0.3)',
        color:'rgba(255,100,160,0.8)',
        fontFamily:"'Space Mono',monospace", fontSize:7.5,
        letterSpacing:'0.12em', textTransform:'uppercase',
        padding:'7px 0', cursor:'pointer',
      }}>
        transmit →
      </button>
    </div>
  )
}
```

---

## SUPABASE SCHEMA

```sql
-- Run in Supabase SQL editor

create table graph_nodes (
  id           text primary key,
  label        text not null,
  title        text not null,
  x            float not null,
  y            float not null,
  r            float not null default 0,
  layer        int  not null default 0,
  node_type    text not null default 'circle',
  label_inside boolean not null default false,
  label_anchor text not null default 'center',
  parent_id    text references graph_nodes(id),
  created_at   timestamptz default now()
);

create table graph_edges (
  id        uuid primary key default gen_random_uuid(),
  source    text not null references graph_nodes(id),
  target    text not null references graph_nodes(id),
  is_cross  boolean not null default false,
  created_at timestamptz default now()
);

-- Enable RLS + public read
alter table graph_nodes enable row level security;
alter table graph_edges  enable row level security;
create policy "public read nodes" on graph_nodes for select using (true);
create policy "public read edges" on graph_edges for select using (true);
```

### useGraphData.ts
```typescript
'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useGraphStore } from '@/store/graphStore'
import { NODES, EDGES } from '@/lib/graphData'
import { GraphNode, GraphEdge } from '@/types/graph'

export function useGraphData() {
  const setGraph = useGraphStore(s => s.setGraph)

  useEffect(() => {
    // Load hardcoded data immediately so graph renders on first frame
    setGraph(NODES, EDGES)

    // Then try to fetch from Supabase and override if data exists
    async function fetchFromDB() {
      const [{ data: nodeRows }, { data: edgeRows }] = await Promise.all([
        supabase.from('graph_nodes').select('*'),
        supabase.from('graph_edges').select('*'),
      ])
      if(nodeRows?.length) {
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
```

---

## ENV VARS

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## WHAT NOT TO BUILD

- No navbar, no page transitions, no hero section, no scroll animations
- No SSR of graph — everything is client-side (`'use client'` on all graph components)
- No OrbitControls from drei — it fights the zoom-floor logic. Use CameraRig only.
- No CSS animations on graph elements — all motion is useFrame / requestAnimationFrame
- No GraphQL — plain Supabase JS client only
- No extra pages — this is a single-page app. `app/page.tsx` is the only route.
- Do not use `<Canvas>` camera prop for navigation — camera is driven entirely by CameraRig reading from Zustand store
- Do not add loading spinners — graph loads from hardcoded data instantly, Supabase data swaps in silently

---

## VISUAL SPEC (do not change these)

```
Background:         radial gradient — rgba(14,6,10,1) center → rgba(0,0,0,1) edges
Name font:          Cormorant Garamond 600 italic 58px
UI font:            Space Mono 400
Primary accent:     rgba(255,100,160,x) — pink
Cross-edge color:   rgba(255,210,120,x) — warm amber
Structural edges:   rgba(255,255,255,x) — white, depth-faded
Node fill:          rgba(6,6,6,0.97) — opaque black (occludes nodes behind)
CZ stroke:          rgba(255,255,255,0.58)
Layer 1 stroke:     rgba(255,110,160,0.75)
Layer 2 stroke:     rgba(255,130,150,0.63)
Layer 3 stroke:     rgba(255,150,140,0.51)
Label bg:           rgba(10,4,8,0.82)
Label border:       rgba(255,100,160,0.55)
Label color:        rgba(255,130,175,1)
Panel bg:           rgba(6,6,6,0.93)
Panel border:       rgba(255,100,160,0.32)
All margins:        52px
```
