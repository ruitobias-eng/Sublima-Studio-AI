import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Check,
  Plus,
  ChevronDown,
  Loader2,
  RefreshCw,
  Sliders,
  Palette,
  Eye,
  Layers,
} from 'lucide-react';
import { AI_STYLE_PRESETS, PALETTE_COLORS } from '../data/initialData';

interface AIPanelProps {
  onGenerateArt: (prompt: string, style: string, colors: string[]) => void;
  onApplyVariation: (varId: string) => void;
  isGenerating: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  onGenerateArt,
  onApplyVariation,
  isGenerating,
  isOpen,
  onClose,
}) => {
  const [prompt, setPrompt] = useState(
    'Arte tropical vibrante com folhagens, tucano e flores, estilo pintura digital'
  );
  const [selectedModel, setSelectedModel] = useState('Sublima AI Pro');
  const [selectedStyle, setSelectedStyle] = useState('Vibrante');
  const [selectedColors, setSelectedColors] = useState<string[]>([
    '#facc15',
    '#f97316',
    '#ef4444',
    '#3b82f6',
    '#06b6d4',
    '#22c55e',
    '#a855f7',
  ]);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Generated Variations
  const [variations, setVariations] = useState([
    {
      id: 'var-1',
      title: 'Tucano Tropical Vibrante V1',
      desc: 'Cores Saturadas CMYK + Iluminação Neon',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%"><rect width="120" height="120" fill="#0f2027"/><circle cx="60" cy="60" r="40" fill="#f9d423"/><path d="M 40 40 L 80 80" stroke="#ff4e50" stroke-width="8" stroke-linecap="round"/></svg>`,
    },
    {
      id: 'var-2',
      title: 'Aquarela Folhagem Intensa V2',
      desc: 'Traços Orgânicos + Splatters de Tinta',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%"><rect width="120" height="120" fill="#11998e"/><circle cx="60" cy="60" r="30" fill="#38ef7d"/><path d="M 20 60 Q 60 20 100 60 Z" fill="#22c1c3"/></svg>`,
    },
    {
      id: 'var-3',
      title: 'Vetor Sublimação Pro V3',
      desc: 'Linhas Limpas + Fundo Gradiente HD',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%"><rect width="120" height="120" fill="#1e1b4b"/><circle cx="60" cy="60" r="35" fill="#a855f7"/><path d="M 30 30 L 90 90" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/></svg>`,
    },
  ]);

  const handleColorToggle = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleEnhancePrompt = async () => {
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style: selectedStyle }),
      });
      const data = await res.json();
      if (data.success && data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = () => {
    onGenerateArt(prompt, selectedStyle, selectedColors);
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col h-full z-20 shrink-0 text-slate-200 select-none shadow-2xl overflow-y-auto custom-scrollbar">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            IA GENERATIVA
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 text-xs p-1 rounded hover:bg-slate-800"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Prompt Input Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-300">
              Descrever o que deseja
            </label>
            <button
              onClick={handleEnhancePrompt}
              disabled={isEnhancing}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium bg-cyan-950/50 hover:bg-cyan-900/60 px-2 py-0.5 rounded border border-cyan-800/50 transition"
            >
              {isEnhancing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Wand2 className="w-3 h-3 text-cyan-400" />
              )}
              <span>Aprimorar</span>
            </button>
          </div>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Digite a descrição da arte desejada (ex: tucano tropical)..."
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 resize-none transition outline-none"
            />
            <span className="absolute right-2 bottom-2 text-[9px] text-slate-500 font-mono">
              {prompt.length}/300
            </span>
          </div>
        </div>

        {/* AI Model Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300">
            Modelo de IA
          </label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-200 appearance-none focus:border-cyan-500 outline-none cursor-pointer pr-8"
            >
              <option value="Sublima AI Pro">Sublima AI Pro (Estamparia 300DPI)</option>
              <option value="Sublima Flash Vector">Sublima Flash Vector (Vetor Limpo)</option>
              <option value="Sublima Ultra-HD">Sublima Ultra-HD 4K (Fotorrealista)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Style Badges Grid */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300">
            Estilo da Arte
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {AI_STYLE_PRESETS.map((style) => {
              const isSelected = selectedStyle === style.label;
              return (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.label)}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-purple-500/80 text-cyan-300 shadow-sm'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <span className="font-medium text-[11px]">{style.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Palette Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-300">
              Paleta de Cores
            </label>
            <span className="text-[10px] text-slate-400">
              {selectedColors.length} selecionadas
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            {PALETTE_COLORS.map((color) => {
              const isSelected = selectedColors.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => handleColorToggle(color)}
                  style={{ backgroundColor: color }}
                  className={`w-6 h-6 rounded-full border border-slate-700/80 transition-transform flex items-center justify-center ${
                    isSelected
                      ? 'scale-110 ring-2 ring-cyan-400 shadow-md'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  {isSelected && (
                    <Check
                      className={`w-3 h-3 ${
                        color === '#ffffff' ? 'text-slate-900' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
            <button className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-purple-900/40 border border-purple-400/30 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
              <span>Sintetizando Arte Generativa...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Gerar Arte com IA</span>
            </>
          )}
        </button>

        {/* Variations Output Section */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">
              Variações Geradas
            </span>
            <button className="text-[10px] text-cyan-400 hover:underline">
              Ver tudo
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {variations.map((v) => (
              <div
                key={v.id}
                onClick={() => onApplyVariation(v.id)}
                className="group relative aspect-square bg-slate-900 rounded-lg border border-slate-800 overflow-hidden cursor-pointer hover:border-cyan-400/80 transition"
              >
                <div
                  className="w-full h-full flex items-center justify-center p-1"
                  dangerouslySetInnerHTML={{ __html: v.svg }}
                />
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 p-1 text-center">
                  <span className="text-[9px] font-medium text-cyan-300 leading-tight">
                    Aplicar
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
