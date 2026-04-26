import { GraphNode, GraphEdge } from '@/types/graph'

export const NODES: GraphNode[] = [
  // Layer 0
  { id:'cz',         label:'CZ — 001',   title:'Cynthia Zhang',          x:    0, y:    0, r:200, layer:0, type:'circle', inside:true,  lAnchor:'center',       parentId:null },

  // Layer 1 — four main branches
  { id:'research',   label:'R — 7.4',    title:'Research',               x:   80, y: -400, r:130, layer:1, type:'circle', inside:true,  lAnchor:'bottom-right', parentId:'cz' },
  { id:'work',       label:'W — 4/2',    title:'Work & Experience',      x:  400, y: -280, r:110, layer:1, type:'circle', inside:true,  lAnchor:'bottom-left',  parentId:'cz' },
  { id:'about',      label:'F — 2.4',    title:'About Me',               x: -400, y:  220, r:115, layer:1, type:'circle', inside:false, lAnchor:'top-right',    parentId:'cz' },
  { id:'explore',    label:'EX — 3.1',   title:'Explore',                x:  280, y:  380, r:100, layer:1, type:'circle', inside:false, lAnchor:'top-left',     parentId:'cz' },

  // Layer 2 — research children
  { id:'nhp',        label:'NH — 2024',  title:'NSERC NHP Project',      x: -110, y: -530, r: 68, layer:2, type:'circle', inside:false, lAnchor:'bottom-right', parentId:'research' },
  { id:'ucb',        label:'UC — 7.4',   title:'UC Berkeley',            x:  240, y: -540, r: 60, layer:2, type:'circle', inside:false, lAnchor:'bottom-left',  parentId:'research' },
  { id:'trust',      label:'TN — 0093',  title:'UW TRuST Network',       x: -270, y: -490, r: 55, layer:2, type:'circle', inside:false, lAnchor:'bottom-right', parentId:'research' },

  // Layer 2 — work children
  { id:'rbc',        label:'RB — 2024',  title:'RBC Borealis',           x:  290, y: -460, r: 65, layer:2, type:'circle', inside:false, lAnchor:'bottom-right', parentId:'work' },
  { id:'ws',         label:'WS — 0025',  title:'Wealthsimple',           x:  550, y: -370, r: 58, layer:2, type:'circle', inside:false, lAnchor:'bottom-left',  parentId:'work' },

  // Layer 2 — about children
  { id:'cogsci',     label:'SR — 7832',  title:'Cognitive Science',      x: -560, y:   70, r: 65, layer:2, type:'circle', inside:false, lAnchor:'bottom-right', parentId:'about' },
  { id:'gym',        label:'RG — 0012',  title:'Rhythmic Gymnastics',    x: -570, y:  280, r: 62, layer:2, type:'circle', inside:false, lAnchor:'top-right',    parentId:'about' },
  { id:'mun',        label:'MU — 2019',  title:'Model UN',               x: -510, y:  420, r: 52, layer:2, type:'circle', inside:false, lAnchor:'top-right',    parentId:'about' },

  // Layer 2 — explore children
  { id:'projects',   label:'PR — 2893',  title:'Projects',               x:  140, y:  530, r: 52, layer:2, type:'circle', inside:false, lAnchor:'top-left',     parentId:'explore' },
  { id:'blog',       label:'BL — 001',   title:'Blog',                   x:  430, y:  500, r: 48, layer:2, type:'circle', inside:false, lAnchor:'top-left',     parentId:'explore' },
  { id:'exec',       label:'KU — 0073',  title:'execOS',                 x:  520, y:  240, r: 48, layer:2, type:'circle', inside:false, lAnchor:'top-left',     parentId:'explore' },

  // Layer 3 — labels
  { id:'ieee',       label:'FG — 8374',  title:'IEEE ISEC 2024',         x: -380, y: -610, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'nhp'      },
  { id:'gan_arch',   label:'ET — 3940',  title:'GAN Architecture',       x: -130, y: -640, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'nhp'      },
  { id:'trust_lab',  label:'TL — 003',   title:'TRuST Lab',              x: -430, y: -580, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'trust'    },
  { id:'ucb_label',  label:'BD — 7.4',   title:'Berkeley BAIR',          x:  360, y: -630, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'ucb'      },
  { id:'supabase',   label:'SH — 456',   title:'Supabase / pgvector',    x:  710, y: -280, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'ws'       },
  { id:'fastapi',    label:'FA — 784',   title:'FastAPI / execOS',       x:  670, y:  260, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'exec'     },
  { id:'ca_nat',     label:'CA — 001',   title:'Canadian National Team', x: -730, y:  310, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'gym'      },
  { id:'note',       label:'Q — 9973',   title:'Neural Netbook',         x:  200, y:  630, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'projects' },
]

export const EDGES: GraphEdge[] = [
  // CZ → Layer 1
  { source:'cz',       target:'research',  isCross:false },
  { source:'cz',       target:'work',      isCross:false },
  { source:'cz',       target:'about',     isCross:false },
  { source:'cz',       target:'explore',   isCross:false },

  // research → Layer 2
  { source:'research', target:'nhp',       isCross:false },
  { source:'research', target:'ucb',       isCross:false },
  { source:'research', target:'trust',     isCross:false },

  // work → Layer 2
  { source:'work',     target:'rbc',       isCross:false },
  { source:'work',     target:'ws',        isCross:false },

  // about → Layer 2
  { source:'about',    target:'cogsci',    isCross:false },
  { source:'about',    target:'gym',       isCross:false },
  { source:'about',    target:'mun',       isCross:false },

  // explore → Layer 2
  { source:'explore',  target:'projects',  isCross:false },
  { source:'explore',  target:'blog',      isCross:false },
  { source:'explore',  target:'exec',      isCross:false },

  // Layer 2 → Layer 3
  { source:'nhp',      target:'ieee',      isCross:false },
  { source:'nhp',      target:'gan_arch',  isCross:false },
  { source:'trust',    target:'trust_lab', isCross:false },
  { source:'ucb',      target:'ucb_label', isCross:false },
  { source:'ws',       target:'supabase',  isCross:false },
  { source:'exec',     target:'fastapi',   isCross:false },
  { source:'gym',      target:'ca_nat',    isCross:false },
  { source:'projects', target:'note',      isCross:false },

  // Cross-domain connections (amber dashed)
  { source:'nhp',      target:'cogsci',    isCross:true },
  { source:'rbc',      target:'nhp',       isCross:true },
  { source:'exec',     target:'projects',  isCross:true },
  { source:'trust',    target:'cogsci',    isCross:true },
  { source:'ucb',      target:'nhp',       isCross:true },
]
