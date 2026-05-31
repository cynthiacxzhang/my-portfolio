import { GraphNode, GraphEdge } from '@/types/graph'

// Layout: two columns left/right, minimal vertical spread
// CZ at origin (r=200). Branches spread wide on x, compressed on y.

export const NODES: GraphNode[] = [
  // Layer 0
  { id:'cz',        label:'CZ — 001',  title:'Cynthia Zhang',          x:    0, y:    0, r:200, layer:0, type:'circle', inside:true,  lAnchor:'center',       parentId:null },

  // Layer 1 — two columns: left = research/about, right = work/explore
  { id:'research',  label:'R — 7.4',   title:'Research',               x: -370, y: -170, r:130, layer:1, type:'circle', inside:true,  lAnchor:'bottom-right', parentId:'cz' },
  { id:'work',      label:'W — 4/2',   title:'Work & Experience',      x:  390, y: -160, r:110, layer:1, type:'circle', inside:true,  lAnchor:'bottom-left',  parentId:'cz' },
  { id:'about',     label:'F — 2.4',   title:'About Me',               x: -370, y:  200, r:115, layer:1, type:'circle', inside:false, lAnchor:'top-right',    parentId:'cz' },
  { id:'explore',   label:'EX — 3.1',  title:'Explore',                x:  370, y:  210, r:100, layer:1, type:'circle', inside:false, lAnchor:'top-left',     parentId:'cz' },

  // Layer 2 — research children
  { id:'nhp',       label:'NH — 2024', title:'NSERC NHP Project',      x: -520, y: -290, r: 68, layer:2, type:'circle', inside:false, lAnchor:'bottom-right', parentId:'research' },
  { id:'ucb',       label:'UC — 7.4',  title:'UC Berkeley',            x: -270, y: -360, r: 60, layer:2, type:'circle', inside:false, lAnchor:'bottom-left',  parentId:'research' },
  { id:'trust',     label:'TN — 0093', title:'UW TRuST Network',       x: -540, y:  -90, r: 55, layer:2, type:'circle', inside:false, lAnchor:'bottom-right', parentId:'research' },

  // Layer 2 — work children
  { id:'rbc',       label:'RB — 2024', title:'RBC Borealis',           x:  280, y: -340, r: 65, layer:2, type:'circle', inside:false, lAnchor:'bottom-right', parentId:'work' },
  { id:'ws',        label:'WS — 0025', title:'Wealthsimple',           x:  530, y: -270, r: 58, layer:2, type:'circle', inside:false, lAnchor:'bottom-left',  parentId:'work' },

  // Layer 2 — about children
  { id:'cogsci',    label:'SR — 7832', title:'Cognitive Science',      x: -540, y:   80, r: 65, layer:2, type:'circle', inside:false, lAnchor:'bottom-right', parentId:'about' },
  { id:'gym',       label:'RG — 0012', title:'Rhythmic Gymnastics',    x: -530, y:  300, r: 62, layer:2, type:'circle', inside:false, lAnchor:'top-right',    parentId:'about' },
  { id:'mun',       label:'MU — 2019', title:'Model UN',               x: -280, y:  360, r: 52, layer:2, type:'circle', inside:false, lAnchor:'top-right',    parentId:'about' },

  // Layer 2 — explore children
  { id:'projects',  label:'PR — 2893', title:'Projects',               x:  260, y:  380, r: 52, layer:2, type:'circle', inside:false, lAnchor:'top-left',     parentId:'explore' },
  { id:'blog',      label:'BL — 001',  title:'Blog',                   x:  510, y:  310, r: 48, layer:2, type:'circle', inside:false, lAnchor:'top-left',     parentId:'explore' },
  { id:'exec',      label:'KU — 0073', title:'execOS',                 x:  520, y:  100, r: 48, layer:2, type:'circle', inside:false, lAnchor:'top-left',     parentId:'explore' },

  // Layer 3 — labels
  { id:'ieee',      label:'FG — 8374', title:'IEEE ISEC 2024',         x: -650, y: -340, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'nhp'      },
  { id:'gan_arch',  label:'ET — 3940', title:'GAN Architecture',       x: -310, y: -470, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'ucb'      },
  { id:'trust_lab', label:'TL — 003',  title:'TRuST Lab',              x: -680, y:  -70, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'trust'    },
  { id:'supabase',  label:'SH — 456',  title:'Supabase / pgvector',    x:  680, y: -290, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'ws'       },
  { id:'fastapi',   label:'FA — 784',  title:'FastAPI / execOS',       x:  660, y:  110, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'exec'     },
  { id:'ca_nat',    label:'CA — 001',  title:'Canadian National Team', x: -680, y:  310, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'gym'      },
  { id:'note',      label:'Q — 9973',  title:'Neural Netbook',         x:  280, y:  510, r:  0, layer:3, type:'label', inside:false, lAnchor:'center', parentId:'projects' },
]

export const EDGES: GraphEdge[] = [
  // CZ → Layer 1
  { source:'cz',       target:'research', isCross:false },
  { source:'cz',       target:'work',     isCross:false },
  { source:'cz',       target:'about',    isCross:false },
  { source:'cz',       target:'explore',  isCross:false },

  // research → Layer 2
  { source:'research', target:'nhp',      isCross:false },
  { source:'research', target:'ucb',      isCross:false },
  { source:'research', target:'trust',    isCross:false },

  // work → Layer 2
  { source:'work',     target:'rbc',      isCross:false },
  { source:'work',     target:'ws',       isCross:false },

  // about → Layer 2
  { source:'about',    target:'cogsci',   isCross:false },
  { source:'about',    target:'gym',      isCross:false },
  { source:'about',    target:'mun',      isCross:false },

  // explore → Layer 2
  { source:'explore',  target:'projects', isCross:false },
  { source:'explore',  target:'blog',     isCross:false },
  { source:'explore',  target:'exec',     isCross:false },

  // Layer 2 → Layer 3
  { source:'nhp',      target:'ieee',     isCross:false },
  { source:'ucb',      target:'gan_arch', isCross:false },
  { source:'trust',    target:'trust_lab',isCross:false },
  { source:'ws',       target:'supabase', isCross:false },
  { source:'exec',     target:'fastapi',  isCross:false },
  { source:'gym',      target:'ca_nat',   isCross:false },
  { source:'projects', target:'note',     isCross:false },

  // Cross-domain (amber dashed)
  { source:'nhp',      target:'cogsci',   isCross:true  },
  { source:'rbc',      target:'nhp',      isCross:true  },
  { source:'exec',     target:'projects', isCross:true  },
  { source:'trust',    target:'cogsci',   isCross:true  },
  { source:'ucb',      target:'nhp',      isCross:true  },
]
