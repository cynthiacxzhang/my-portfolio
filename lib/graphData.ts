import { GraphNode, GraphEdge } from '@/types/graph'

export const NODES: GraphNode[] = [
  // Layer 0
  { id:'cz',        label:'CZ — 001',        title:'Cynthia Zhang',          x:    0, y:    0, r:200, layer:0, type:'circle', inside:true,  lAnchor:'center',       parentId:null },
  // Layer 1 — pushed ~15% further from CZ so edges from center are longer
  { id:'research',  label:'R — 7.4',          title:'Research',               x: -380, y: -115, r:130, layer:1, type:'circle', inside:true,  lAnchor:'top-right',    parentId:'cz' },
  { id:'about',     label:'F — 2.4',          title:'About Me',               x: -414, y:  230, r:115, layer:1, type:'circle', inside:false, lAnchor:'top-right',    parentId:'cz' },
  { id:'athlete',   label:'B — 3/8',          title:'Athletics & Life',       x: -138, y:  320, r:100, layer:1, type:'circle', inside:false, lAnchor:'top-right',    parentId:'cz' },
  { id:'work',      label:'G — 4/2',          title:'Work & Co-ops',          x:  391, y: -184, r:110, layer:1, type:'circle', inside:true,  lAnchor:'bottom-left',  parentId:'cz' },
  { id:'systems',   label:'A — 7/3',          title:'Systems & Projects',     x:  357, y:  276, r: 95, layer:1, type:'circle', inside:false, lAnchor:'top-left',     parentId:'cz' },
  // Layer 2 — back near original; y values compressed to reduce diagonal spread
  { id:'ml',        label:'VE — 0084',        title:'Machine Learning',       x: -520, y: -230, r: 72, layer:2, type:'circle', inside:false, lAnchor:'top-right',    parentId:'research' },
  { id:'hail',      label:'FN — 9062',        title:'N. Hail Project',        x: -300, y: -330, r: 58, layer:2, type:'circle', inside:false, lAnchor:'top-right',    parentId:'research' },
  { id:'model',     label:'DS — 2893',        title:'GAN Paper',              x: -480, y: -370, r: 48, layer:2, type:'circle', inside:false, lAnchor:'bottom-right', parentId:'research' },
  { id:'cogsci',    label:'SR — 7832',        title:'Cognitive Science',      x: -560, y:   80, r: 65, layer:2, type:'circle', inside:false, lAnchor:'bottom-right', parentId:'about' },
  { id:'adhd',      label:'P — 8931',         title:'ADHD & Cognition',       x: -520, y:  340, r: 54, layer:2, type:'circle', inside:false, lAnchor:'top-right',    parentId:'about' },
  { id:'swim',      label:'DW — 7561',        title:'Competitive Swimming',   x: -260, y:  370, r: 52, layer:2, type:'circle', inside:false, lAnchor:'top-right',    parentId:'athlete' },
  { id:'graph',     label:'RO — 2893',        title:'Graph Thinking',         x:  120, y:  360, r: 52, layer:2, type:'circle', inside:false, lAnchor:'top-left',     parentId:'systems' },
  { id:'rag',       label:'RO — 9472',        title:'RAG / pgvector',         x:  540, y: -120, r: 48, layer:2, type:'circle', inside:false, lAnchor:'bottom-left',  parentId:'work' },
  { id:'exec',      label:'KU — 0073',        title:'execOS',                 x:  530, y:  300, r: 48, layer:2, type:'circle', inside:false, lAnchor:'top-left',     parentId:'systems' },
  // Layer 3 — back near original, y compressed; right-side nodes slightly off screen on narrow displays
  { id:'ieee',      label:'FG — 8374',        title:'IEEE ISEC 2024',         x: -620, y: -430, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'model' },
  { id:'gan_arch',  label:'ET — 3940',        title:'GAN Architecture',       x: -700, y: -280, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'ml' },
  { id:'note',      label:'Q — 9973',         title:'Neural Netbook',         x:  260, y:  400, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'graph' },
  { id:'mun',       label:'VA — 2904',        title:'Model UN',               x: -700, y:  160, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'cogsci' },
  { id:'depth',     label:'G — 3943',         title:'Depth Processing',       x: -680, y:  380, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'adhd' },
  { id:'triathlon', label:'RT — 7832',        title:'Triathlon Training',     x: -400, y:  400, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'swim' },
  { id:'supabase',  label:'SH — 456',         title:'Supabase / pgvector',    x:  700, y:   40, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'rag' },
  { id:'fastapi',   label:'B — 784',          title:'FastAPI / execOS',       x:  700, y:  380, r:  0, layer:3, type:'label', inside:false, lAnchor:'center',       parentId:'exec' },
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
  // cross-domain (amber dashed)
  { source:'ml',       target:'cogsci',    isCross:true },
  { source:'adhd',     target:'graph',     isCross:true },
  { source:'model',    target:'ml',        isCross:true },
  { source:'hail',     target:'swim',      isCross:true },
  { source:'cogsci',   target:'adhd',      isCross:true },
  { source:'research', target:'cogsci',    isCross:true },
  { source:'exec',     target:'graph',     isCross:true },
  { source:'rag',      target:'ieee',      isCross:true },
]
