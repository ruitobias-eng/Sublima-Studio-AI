import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Layers,
  Sliders,
  Sparkles,
  Move,
  Maximize2,
  Copy,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Check,
  Palette,
  Droplet,
  Wand2,
} from 'lucide-react';
import { CanvasLayer, BlendMode } from '../types';

interface RightSidebarProps {
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onAddLayer: () => void;
  onDeleteLayer: (id: string) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  onRemoveBackgroundAI: () => void;
  onVectorizeAI: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleVisibility,
  onToggleLock,
  onAddLayer,
  onDeleteLayer,
  onReorderLayer,
  onUpdateLayer,
  onRemoveBackgroundAI,
  onVectorizeAI,
}) => {
  const [activeTab, setActiveTab] = useState<'layers' | 'properties' | 'adjustments'>('layers');

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || layers[0];

  const blendModes: BlendMode[] = [
    'normal',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-burn',
    'hard-light',
    'soft-light',
  ];

  return (
    <aside className="w-80 bg-slate-950/95 border-l border-slate-800/80 backdrop-blur-xl flex flex-col h-full z-20 shrink-0 text-slate-200 select-none shadow-2xl">
      {/* Sidebar Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-900/60 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'layers'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/80'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Camadas</span>
        </button>

        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'properties'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/80'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Propriedades</span>
        </button>

        <button
          onClick={() => setActiveTab('adjustments')}
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'adjustments'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/80'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ajustes</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        {activeTab === 'layers' && (
          <div className="space-y-3">
            {/* Layers Header Actions */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                Gerenciador de Camadas ({layers.length})
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={onAddLayer}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 rounded-md transition flex items-center gap-1 text-[11px] font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova</span>
                </button>
              </div>
            </div>

            {/* Layers Stack */}
            <div className="space-y-1.5">
              {layers.map((layer, index) => {
                const isSelected = selectedLayerId === layer.id;
                return (
                  <div
                    key={layer.id}
                    onClick={() => onSelectLayer(layer.id)}
                    className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 group cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-cyan-400/80 shadow-md shadow-indigo-950/50 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    {/* Layer Visibility & Name */}
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVisibility(layer.id);
                        }}
                        className="text-slate-400 hover:text-cyan-300 p-0.5"
                      >
                        {layer.visible ? (
                          <Eye className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-600" />
                        )}
                      </button>

                      {/* Color Accent Indicator */}
                      <div
                        className="w-2.5 h-7 rounded-full shrink-0"
                        style={{ backgroundColor: layer.color || '#3b82f6' }}
                      />

                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-xs truncate">
                          {layer.name}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {layer.type} • {layer.blendMode} ({layer.opacity}%)
                        </span>
                      </div>
                    </div>

                    {/* Layer Right Controls */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLock(layer.id);
                        }}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400"
                      >
                        {layer.locked ? (
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderLayer(layer.id, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderLayer(layer.id, 'down');
                        }}
                        disabled={index === layers.length - 1}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLayer(layer.id);
                        }}
                        className="p-1 hover:bg-red-900/50 hover:text-red-300 rounded text-slate-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROPERTIES TAB */}
        {activeTab === 'properties' && selectedLayer && (
          <div className="space-y-4 text-xs">
            {/* Layer Info Header */}
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-100">{selectedLayer.name}</div>
                <div className="text-[10px] text-cyan-400 uppercase font-mono">
                  ID: {selectedLayer.id}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[10px] text-cyan-300 font-semibold uppercase">
                {selectedLayer.type}
              </span>
            </div>

            {/* Transform Fields */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-300 text-[11px]">
                Transformar (Coordenadas & Dimensões)
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-slate-500 font-mono text-[10px]">X:</span>
                  <input
                    type="number"
                    value={Math.round(selectedLayer.x)}
                    onChange={(e) =>
                      onUpdateLayer(selectedLayer.id, {
                        x: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-16 bg-transparent text-right font-mono text-slate-200 outline-none"
                  />
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-slate-500 font-mono text-[10px]">Y:</span>
                  <input
                    type="number"
                    value={Math.round(selectedLayer.y)}
                    onChange={(e) =>
                      onUpdateLayer(selectedLayer.id, {
                        y: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-16 bg-transparent text-right font-mono text-slate-200 outline-none"
                  />
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-slate-500 font-mono text-[10px]">Largura (L):</span>
                  <input
                    type="number"
                    value={Math.round(selectedLayer.width)}
                    onChange={(e) =>
                      onUpdateLayer(selectedLayer.id, {
                        width: parseFloat(e.target.value) || 10,
                      })
                    }
                    className="w-16 bg-transparent text-right font-mono text-slate-200 outline-none"
                  />
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-slate-500 font-mono text-[10px]">Altura (H):</span>
                  <input
                    type="number"
                    value={Math.round(selectedLayer.height)}
                    onChange={(e) =>
                      onUpdateLayer(selectedLayer.id, {
                        height: parseFloat(e.target.value) || 10,
                      })
                    }
                    className="w-16 bg-transparent text-right font-mono text-slate-200 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300 text-[11px]">
                  Opacidade
                </label>
                <span className="font-mono text-cyan-300">{selectedLayer.opacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedLayer.opacity}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    opacity: parseInt(e.target.value),
                  })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Blend Mode Dropdown */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 text-[11px]">
                Modo de Mesclagem
              </label>
              <div className="relative">
                <select
                  value={selectedLayer.blendMode}
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, {
                      blendMode: e.target.value as BlendMode,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 capitalize outline-none cursor-pointer pr-8"
                >
                  {blendModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* AI Quick Actions */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="font-semibold text-slate-300 text-[11px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ações com IA para Sublimação</span>
              </label>

              <button
                onClick={onRemoveBackgroundAI}
                className="w-full py-2 px-3 bg-gradient-to-r from-blue-900/60 to-cyan-900/60 border border-cyan-500/50 hover:border-cyan-400 rounded-xl text-cyan-200 font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-md"
              >
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Remover Fundo (IA)</span>
              </button>

              <button
                onClick={onVectorizeAI}
                className="w-full py-2 px-3 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/50 hover:border-purple-400 rounded-xl text-purple-200 font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Vetorizar Arte (IA)</span>
              </button>
            </div>
          </div>
        )}

        {/* ADJUSTMENTS TAB */}
        {activeTab === 'adjustments' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-slate-200">Calibração de Cor CMYK Sublimática</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Perfil ativo: <span className="text-cyan-300">Epson Sublimation SC-F500</span>. Converte automaticamente cores RGB para pigmentação de prensa térmica.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Brilho Sublimático</span>
                <span className="text-cyan-300">+5%</span>
              </div>
              <input type="range" defaultValue="55" className="w-full accent-cyan-400" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Saturação de Pigmento</span>
                <span className="text-cyan-300">+12%</span>
              </div>
              <input type="range" defaultValue="62" className="w-full accent-cyan-400" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Nitidez de Impressão</span>
                <span className="text-cyan-300">+10%</span>
              </div>
              <input type="range" defaultValue="60" className="w-full accent-cyan-400" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
