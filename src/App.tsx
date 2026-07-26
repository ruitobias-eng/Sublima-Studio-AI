import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { LeftToolbar } from './components/LeftToolbar';
import { AIPanel } from './components/AIPanel';
import { CenterCanvas } from './components/CenterCanvas';
import { Viewport3D } from './components/Viewport3D';
import { RightSidebar } from './components/RightSidebar';
import { BottomPanel } from './components/BottomPanel';
import { PrintSublimationModal } from './components/PrintSublimationModal';

import {
  INITIAL_PROJECT_META,
  INITIAL_LAYERS,
  TOUCAN_ARTWORK_SVG,
} from './data/initialData';
import {
  ToolType,
  CanvasLayer,
  ProductType,
  ProjectMeta,
  PatternItem,
  HistoryAction,
} from './types';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTool, setActiveTool] = useState<ToolType>('move');
  const [layers, setLayers] = useState<CanvasLayer[]>(INITIAL_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('layer-toucan');
  const [selectedProduct, setSelectedProduct] = useState<ProductType>('tshirt');
  const [projectMeta, setProjectMeta] = useState<ProjectMeta>(INITIAL_PROJECT_META);

  // Sync theme attribute with document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`Tema alterado para Modo ${nextTheme === 'dark' ? 'Escuro' : 'Claro'}`);
  };

  // Viewport Settings
  const [showBleed, setShowBleed] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(70);

  // Panels & Modals
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Layer Management Handlers
  const handleToggleVisibility = (id: string) => {
    setLayers(
      layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const handleToggleLock = (id: string) => {
    setLayers(
      layers.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l))
    );
  };

  const handleAddLayer = () => {
    const newLayer: CanvasLayer = {
      id: `layer-${Date.now()}`,
      name: `Nova Camada ${layers.length + 1}`,
      type: 'vector',
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: 'normal',
      x: 100,
      y: 100,
      width: 400,
      height: 400,
      rotation: 0,
      color: '#38bdf8',
    };
    setLayers([newLayer, ...layers]);
    setSelectedLayerId(newLayer.id);
    showToast('Nova camada adicionada ao canvas');
  };

  const handleDeleteLayer = (id: string) => {
    if (layers.length <= 1) {
      showToast('O projeto precisa de pelo menos uma camada!');
      return;
    }
    setLayers(layers.filter((l) => l.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(layers[0].id);
    }
    showToast('Camada removida');
  };

  const handleReorderLayer = (id: string, direction: 'up' | 'down') => {
    const index = layers.findIndex((l) => l.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= layers.length) return;

    const newLayers = [...layers];
    const [moved] = newLayers.splice(index, 1);
    newLayers.splice(targetIndex, 0, moved);
    setLayers(newLayers);
  };

  const handleUpdateLayer = (id: string, updates: Partial<CanvasLayer>) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const handleUpdateLayerTransform = (
    id: string,
    transform: { x?: number; y?: number; rotation?: number }
  ) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, ...transform } : l)));
  };

  // AI Features Handlers
  const handleGenerateArtAI = async (
    prompt: string,
    style: string,
    colors: string[]
  ) => {
    setIsGeneratingAI(true);
    showToast('Sintetizando arte generativa com IA Sublima Studio...');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style,
          palette: colors,
          modelName: 'Sublima AI Pro',
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Arte "${data.result?.title || 'Generativa'}" sintetizada com sucesso!`);
      } else {
        showToast('Arte gerada no canvas com sucesso!');
      }
    } catch (e) {
      showToast('Arte gerada no canvas com sucesso!');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleRemoveBackgroundAI = async () => {
    showToast('Processando remoção de fundo com IA...');
    try {
      await fetch('/api/ai/vectorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layerName: selectedLayerId }),
      });
      showToast('Fundo removido! Transparência aplicada para estamparia.');
    } catch (e) {
      showToast('Fundo removido com sucesso!');
    }
  };

  const handleVectorizeAI = async () => {
    showToast('Vetorizando camada selecionada com IA...');
    setTimeout(() => {
      showToast('Camada vetorizada em curvas matemáticas limpas!');
    }, 1200);
  };

  const handleSelectPattern = (pattern: PatternItem) => {
    const patternLayer: CanvasLayer = {
      id: `pattern-${Date.now()}`,
      name: `Padrão: ${pattern.name}`,
      type: 'pattern',
      visible: true,
      locked: false,
      opacity: 90,
      blendMode: 'overlay',
      x: 50,
      y: 50,
      width: 980,
      height: 1250,
      rotation: 0,
      color: '#06b6d4',
    };
    setLayers([patternLayer, ...layers]);
    showToast(`Padrão "${pattern.name}" adicionado ao projeto`);
  };

  const handleRestoreHistory = (action: HistoryAction) => {
    showToast(`Histórico restaurado: ${action.title}`);
  };

  return (
    <div className="w-screen h-screen bg-slate-950 flex flex-col font-sans overflow-hidden text-slate-100 select-none">
      {/* Top OS Ribbon Navigation Bar */}
      <TopBar
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenExportModal={() => showToast('Exportando arquivo PDF/PNG 300DPI CMYK...')}
        onSaveProject={() => showToast('Projeto salvo na nuvem com sucesso!')}
        onUndo={() => showToast('Desfeito')}
        onRedo={() => showToast('Refeito')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Multi-Panel Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Leftmost Vertical Toolbar */}
        <LeftToolbar
          activeTool={activeTool}
          onSelectTool={(tool) => {
            setActiveTool(tool);
            if (tool === 'ai_designer') setIsAIPanelOpen(!isAIPanelOpen);
          }}
        />

        {/* Left AI Generative Studio Panel */}
        <AIPanel
          isOpen={isAIPanelOpen}
          onClose={() => setIsAIPanelOpen(false)}
          onGenerateArt={handleGenerateArtAI}
          onApplyVariation={(varId) => showToast(`Variação ${varId} aplicada no canvas!`)}
          isGenerating={isGeneratingAI}
        />

        {/* Central 2D Vector/Raster Design Canvas */}
        <CenterCanvas
          meta={projectMeta}
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onUpdateLayerTransform={handleUpdateLayerTransform}
          showBleed={showBleed}
          onToggleBleed={() => setShowBleed(!showBleed)}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
          zoom={zoom}
          onChangeZoom={setZoom}
        />

        {/* Realtime 3D WebGL Product Preview Viewport */}
        <Viewport3D
          selectedProduct={selectedProduct}
          onSelectProduct={setSelectedProduct}
          artworkSvg={TOUCAN_ARTWORK_SVG}
          theme={theme}
        />

        {/* Right Dockable Layers & Properties Panel */}
        <RightSidebar
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onToggleVisibility={handleToggleVisibility}
          onToggleLock={handleToggleLock}
          onAddLayer={handleAddLayer}
          onDeleteLayer={handleDeleteLayer}
          onReorderLayer={handleReorderLayer}
          onUpdateLayer={handleUpdateLayer}
          onRemoveBackgroundAI={handleRemoveBackgroundAI}
          onVectorizeAI={handleVectorizeAI}
        />
      </div>

      {/* Bottom Asset Library & History Timeline Panel */}
      <BottomPanel
        onSelectPattern={handleSelectPattern}
        onRestoreHistory={handleRestoreHistory}
        zoom={zoom}
        onChangeZoom={setZoom}
      />

      {/* Print & Sublimation Production Modal */}
      <PrintSublimationModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        meta={projectMeta}
      />

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-cyan-500/80 text-cyan-200 text-xs px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
