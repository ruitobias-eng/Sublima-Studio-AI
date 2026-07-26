import { CanvasLayer, ProductConfig, PatternItem, HistoryAction, ProjectMeta } from '../types';

export const INITIAL_PROJECT_META: ProjectMeta = {
  name: 'Projeto Tropical AI',
  width: 1080,
  height: 1350,
  unit: 'px',
  dpi: 300,
  colorMode: 'CMYK',
  bleed: 3, // 3mm
  safeMargin: 5, // 5mm
  iccProfile: 'Epson Sublimation SC-F500 CMYK v2',
};

// Generative / High-res SVG artwork content for Toucan Tropical art
export const TOUCAN_ARTWORK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f2027"/>
      <stop offset="50%" stop-color="#203a43"/>
      <stop offset="100%" stop-color="#2c5364"/>
    </linearGradient>

    <!-- Sun / Gold Circle -->
    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff9a9e" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#fecfef" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#ffdde1" stop-opacity="0.1"/>
    </radialGradient>

    <!-- Toucan Beak Gradient -->
    <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#ff4e50"/>
      <stop offset="30%" stop-color="#f9d423"/>
      <stop offset="70%" stop-color="#22c1c3"/>
      <stop offset="100%" stop-color="#0072ff"/>
    </linearGradient>

    <!-- Leaf Green Gradient -->
    <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#11998e"/>
      <stop offset="100%" stop-color="#38ef7d"/>
    </linearGradient>

    <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0575e6"/>
      <stop offset="100%" stop-color="#00f260"/>
    </linearGradient>

    <!-- Hibiscus Flower Gradient -->
    <linearGradient id="flowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff0844"/>
      <stop offset="100%" stop-color="#ffb199"/>
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1080" height="1350" fill="url(#bgGrad)"/>

  <!-- Artistic Sun Aura -->
  <circle cx="540" cy="500" r="380" fill="url(#sunGrad)" filter="url(#glow)"/>

  <!-- Background Monstera Leaves (Lush Tropical Back) -->
  <g opacity="0.85">
    <path d="M 100 200 C 300 100, 450 300, 350 600 C 250 800, 50 700, 100 200 Z" fill="url(#leafGrad2)" />
    <path d="M 980 300 C 780 150, 650 350, 750 650 C 850 850, 1050 750, 980 300 Z" fill="url(#leafGrad1)" />
  </g>

  <!-- Tropical Flowers -->
  <g id="hibiscus-flowers">
    <path d="M 250 850 Q 180 750 220 680 Q 320 720 300 820 Z" fill="url(#flowerGrad)"/>
    <path d="M 280 880 Q 350 950 380 850 Q 360 760 280 820 Z" fill="url(#flowerGrad)"/>
    <circle cx="280" cy="820" r="28" fill="#ffd700"/>

    <path d="M 820 900 Q 750 800 790 730 Q 890 770 870 870 Z" fill="url(#flowerGrad)"/>
    <circle cx="820" cy="810" r="24" fill="#ffd700"/>
  </g>

  <!-- Toucan Body & Beak -->
  <g id="toucan-character" transform="translate(340, 260) scale(1.15)">
    <!-- Branch -->
    <path d="M -150 480 Q 150 440 450 500 L 450 540 Q 150 480 -150 520 Z" fill="#4a2e18"/>

    <!-- Tail Feathers -->
    <path d="M 120 420 L 160 580 L 190 570 L 150 410 Z" fill="#111827"/>
    <path d="M 140 420 L 190 610 L 220 590 L 170 410 Z" fill="#00f260"/>

    <!-- Black Body -->
    <path d="M 120 180 C 180 160, 240 220, 230 350 C 220 440, 160 480, 110 440 C 70 410, 80 260, 120 180 Z" fill="#0f172a"/>

    <!-- White/Yellow Chest -->
    <path d="M 100 200 C 140 210, 170 260, 160 320 C 150 370, 110 370, 90 330 C 70 290, 75 220, 100 200 Z" fill="#fffbeb"/>
    <path d="M 100 200 C 130 210, 150 250, 140 300 C 130 340, 100 340, 90 310 Z" fill="#fef08a" opacity="0.8"/>

    <!-- Giant Beak -->
    <path d="M 80 200 C 40 100, -120 120, -160 210 C -120 260, -20 250, 80 220 Z" fill="url(#beakGrad)"/>

    <!-- Beak Detail Stripes -->
    <path d="M -20 160 Q 10 190 0 230" stroke="#000" stroke-width="6" fill="none" opacity="0.4"/>

    <!-- Blue Eye Surround -->
    <circle cx="95" cy="225" r="26" fill="#38bdf8"/>
    <circle cx="95" cy="225" r="16" fill="#0284c7"/>
    <circle cx="95" cy="225" r="9" fill="#0f172a"/>
    <circle cx="91" cy="221" r="3" fill="#ffffff"/>
  </g>

  <!-- Foreground Monstera Leaves & Water Droplets -->
  <g id="foreground-foliage">
    <!-- Big Left Monstera -->
    <path d="M -50 1100 C 150 800, 400 950, 300 1380 C 100 1400, -100 1300, -50 1100 Z" fill="url(#leafGrad1)"/>
    <line x1="120" y1="1000" x2="250" y2="1250" stroke="#10b981" stroke-width="8"/>

    <!-- Big Right Monstera -->
    <path d="M 1150 1050 C 950 780, 700 920, 800 1380 C 1000 1400, 1200 1250, 1150 1050 Z" fill="url(#leafGrad2)"/>
    <line x1="960" y1="980" x2="840" y2="1240" stroke="#34d399" stroke-width="8"/>
  </g>

  <!-- Splatter Effects & Sparkles -->
  <g id="artistic-splatters" fill="#22d3ee" opacity="0.75">
    <circle cx="500" cy="180" r="8"/>
    <circle cx="520" cy="210" r="4"/>
    <circle cx="220" cy="400" r="6"/>
    <circle cx="850" cy="450" r="10"/>
    <circle cx="880" cy="490" r="5"/>
    <circle cx="620" cy="890" r="7"/>
  </g>

  <!-- Typography Overlay -->
  <text x="540" y="1240" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="64" font-weight="bold" fill="#ffffff" letter-spacing="4" filter="url(#glow)">
    TROPICAL VIBES
  </text>
  <text x="540" y="1290" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="600" fill="#a5f3fc" letter-spacing="8">
    SUBLIMA STUDIO CREATIVE AI
  </text>
</svg>
`;

export const INITIAL_LAYERS: CanvasLayer[] = [
  {
    id: 'layer-foliage-fg',
    name: 'Folhagens Tropicais (Frente)',
    type: 'vector',
    visible: true,
    locked: false,
    opacity: 100,
    blendMode: 'normal',
    x: 0,
    y: 0,
    width: 1080,
    height: 1350,
    rotation: 0,
    color: '#34d399',
  },
  {
    id: 'layer-toucan',
    name: 'Tucano Realista AI',
    type: 'vector',
    visible: true,
    locked: false,
    opacity: 100,
    blendMode: 'normal',
    x: 0,
    y: 0,
    width: 1080,
    height: 1350,
    rotation: 0,
    color: '#38bdf8',
  },
  {
    id: 'layer-flowers',
    name: 'Flores de Hibisco',
    type: 'vector',
    visible: true,
    locked: false,
    opacity: 100,
    blendMode: 'normal',
    x: 0,
    y: 0,
    width: 1080,
    height: 1350,
    rotation: 0,
    color: '#ff0844',
  },
  {
    id: 'layer-brushstrokes',
    name: 'Pinceladas & Brilho AI',
    type: 'vector',
    visible: true,
    locked: false,
    opacity: 85,
    blendMode: 'overlay',
    x: 0,
    y: 0,
    width: 1080,
    height: 1350,
    rotation: 0,
    color: '#22d3ee',
  },
  {
    id: 'layer-text',
    name: 'Texto: Tropical Vibes',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 100,
    blendMode: 'normal',
    x: 540,
    y: 1240,
    width: 800,
    height: 100,
    rotation: 0,
    content: 'TROPICAL VIBES',
    fontFamily: 'Playfair Display',
    fontSize: 64,
    fill: '#ffffff',
  },
  {
    id: 'layer-background',
    name: 'Fundo Sublimático',
    type: 'image',
    visible: true,
    locked: true,
    opacity: 100,
    blendMode: 'normal',
    x: 0,
    y: 0,
    width: 1080,
    height: 1350,
    rotation: 0,
    color: '#203a43',
  },
];

export const SUBLIMATION_PRODUCTS: ProductConfig[] = [
  {
    id: 'tshirt',
    name: 'Camiseta Poliéster',
    category: 'Vestuário',
    dimensions: '30 x 40 cm',
    printArea: 'A3 Full Print',
    sublimationTemp: '200°C',
    sublimationTime: '45 segundos',
    icon: 'Shirt',
    thumbnail: '👕',
  },
  {
    id: 'mug',
    name: 'Caneca Cerâmica 11oz',
    category: 'Canecas',
    dimensions: '21 x 9.5 cm',
    printArea: 'Área Útil 20 x 8.5 cm',
    sublimationTemp: '190°C',
    sublimationTime: '180 segundos',
    icon: 'Coffee',
    thumbnail: '☕',
  },
  {
    id: 'tumbler',
    name: 'Copo Tumbler 20oz',
    category: 'Squeezes',
    dimensions: '23 x 20.5 cm',
    printArea: 'Wrap 360° Total',
    sublimationTemp: '185°C',
    sublimationTime: '60 segundos',
    icon: 'GlassWater',
    thumbnail: '🥤',
  },
  {
    id: 'pillow',
    name: 'Almofada Decorativa',
    category: 'Decoração',
    dimensions: '40 x 40 cm',
    printArea: '40 x 40 cm (Sangria +1cm)',
    sublimationTemp: '200°C',
    sublimationTime: '50 segundos',
    icon: 'Square',
    thumbnail: '🛋️',
  },
  {
    id: 'phonecase',
    name: 'Capa de Celular 3D',
    category: 'Acessórios',
    dimensions: '15 x 7.5 cm',
    printArea: 'Bordas Curvas 3D',
    sublimationTemp: '190°C',
    sublimationTime: '300 segundos (Forninho)',
    icon: 'Smartphone',
    thumbnail: '📱',
  },
  {
    id: 'bottle',
    name: 'Squeeze Inox 600ml',
    category: 'Squeezes',
    dimensions: '22 x 7 cm',
    printArea: '22 x 14 cm',
    sublimationTemp: '185°C',
    sublimationTime: '120 segundos',
    icon: 'Container',
    thumbnail: '🧴',
  },
  {
    id: 'puzzle',
    name: 'Quebra-Cabeça A4',
    category: 'Brindes',
    dimensions: '21 x 29.7 cm',
    printArea: 'A4 Total',
    sublimationTemp: '195°C',
    sublimationTime: '60 segundos',
    icon: 'Grid',
    thumbnail: '🧩',
  },
  {
    id: 'mousepad',
    name: 'Mouse Pad Neoprene',
    category: 'Escritório',
    dimensions: '22 x 18 cm',
    printArea: '22 x 18 cm',
    sublimationTemp: '200°C',
    sublimationTime: '40 segundos',
    icon: 'Mouse',
    thumbnail: '🖱️',
  },
  {
    id: 'keychain',
    name: 'Chaveiro MDF Dupla Face',
    category: 'Brindes',
    dimensions: '5 x 5 cm',
    printArea: '5 x 5 cm',
    sublimationTemp: '190°C',
    sublimationTime: '50 segundos',
    icon: 'Key',
    thumbnail: '🔑',
  },
];

export const SAMPLE_PATTERNS: PatternItem[] = [
  {
    id: 'pat-1',
    name: 'Folhagem Tropical Neon',
    category: 'Tropical',
    url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#0f172a"/><circle cx="50" cy="50" r="35" fill="none" stroke="#06b6d4" stroke-width="4"/><path d="M 10 50 Q 50 10 90 50 Q 50 90 10 50 Z" fill="#10b981" opacity="0.6"/></svg>`,
    tags: ['folha', 'neon', 'verde', 'cyan'],
  },
  {
    id: 'pat-2',
    name: 'Floral Aquarela Vibrante',
    category: 'Floral',
    url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#181825"/><circle cx="30" cy="30" r="20" fill="#ec4899" opacity="0.8"/><circle cx="70" cy="70" r="25" fill="#8b5cf6" opacity="0.8"/><circle cx="50" cy="50" r="10" fill="#f59e0b"/></svg>`,
    tags: ['flores', 'aquarela', 'rosa', 'roxo'],
  },
  {
    id: 'pat-3',
    name: 'Geométrico Sublimático 3D',
    category: 'Geométrico',
    url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#1e1b4b"/><path d="M 0 0 L 50 50 L 100 0 Z" fill="#6366f1" opacity="0.5"/><path d="M 0 100 L 50 50 L 100 100 Z" fill="#a855f7" opacity="0.5"/></svg>`,
    tags: ['3d', 'triangulos', 'azul'],
  },
  {
    id: 'pat-4',
    name: 'Pele de Leopardo Abstrata',
    category: 'Animal',
    url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#fef3c7"/><circle cx="30" cy="30" r="12" fill="#78350f"/><circle cx="30" cy="30" r="7" fill="#f59e0b"/><circle cx="75" cy="65" r="15" fill="#78350f"/><circle cx="75" cy="65" r="9" fill="#f59e0b"/></svg>`,
    tags: ['leopardo', 'safari', 'amarelo'],
  },
  {
    id: 'pat-5',
    name: 'Textura Marmorizada Gold',
    category: 'Textura',
    url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#09090b"/><path d="M 10 10 Q 90 30 20 80 T 90 90" stroke="#eab308" stroke-width="3" fill="none"/></svg>`,
    tags: ['marmore', 'ouro', 'luxo'],
  },
  {
    id: 'pat-6',
    name: 'Ondas Psicodélicas UV',
    category: 'Abstrato',
    url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#020617"/><path d="M 0 30 C 30 10, 70 50, 100 30 L 100 60 C 70 80, 30 40, 0 60 Z" fill="#38bdf8"/></svg>`,
    tags: ['ondas', 'uv', 'psicodelico'],
  },
];

export const INITIAL_HISTORY: HistoryAction[] = [
  { id: 'h-1', timestamp: '10:42:01', title: 'Novo Projeto Criado', detail: 'Canvas 1080x1350px CMYK 300 DPI', type: 'create' },
  { id: 'h-2', timestamp: '10:42:15', title: 'Importar Modelo de Fundo', detail: 'Fundo Sublimático Gradiente', type: 'import' },
  { id: 'h-3', timestamp: '10:43:02', title: 'Gerar Arte com IA', detail: 'Prompt: Tucano tropical vibrante com flores', type: 'ai' },
  { id: 'h-4', timestamp: '10:43:45', title: 'Adicionar Camada', detail: 'Camada de Texto "Tropical Vibes"', type: 'create' },
  { id: 'h-5', timestamp: '10:44:10', title: 'Transformar Objeto', detail: 'Rotacionar Tucano +12°, Escalar 115%', type: 'transform' },
  { id: 'h-6', timestamp: '10:45:00', title: 'Aplicar Efeito de Sangria', detail: 'Ativar Sangria Automática +3mm', type: 'effect' },
];

export const AI_STYLE_PRESETS = [
  { id: 'vibrant', label: 'Vibrante', icon: 'Sparkles', active: true },
  { id: 'watercolor', label: 'Aquarela', icon: 'Droplet', active: false },
  { id: 'vector', label: 'Vetorial', icon: 'PenTool', active: false },
  { id: 'abstract', label: 'Abstrato', icon: 'Boxes', active: false },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: 'Zap', active: false },
  { id: 'vintage', label: 'Vintage Sublimation', icon: 'Flame', active: false },
];

export const PALETTE_COLORS = [
  '#000000',
  '#facc15',
  '#f97316',
  '#ef4444',
  '#3b82f6',
  '#06b6d4',
  '#22c55e',
  '#a855f7',
  '#ec4899',
  '#ffffff',
];
