import React, { useState } from 'react';
import {
  Grid,
  Image,
  Type,
  Box,
  Sparkles,
  History,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Layers,
  Cpu,
  HardDrive,
  ZoomIn,
} from 'lucide-react';
import { SAMPLE_PATTERNS, INITIAL_HISTORY } from '../data/initialData';
import { PatternItem, HistoryAction } from '../types';

interface BottomPanelProps {
  onSelectPattern: (pattern: PatternItem) => void;
  onRestoreHistory: (action: HistoryAction) => void;
  zoom: number;
  onChangeZoom: (zoom: number) => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  onSelectPattern,
  onRestoreHistory,
  zoom,
  onChangeZoom,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'patterns' | 'history'>('patterns');
  const [activeAssetType, setActiveAssetType] = useState<
    'Padrões' | 'Texturas' | 'Cliparts' | 'Mockups' | 'Fontes'
  >('Padrões');
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filterPills = ['Todos', 'Tropical', 'Floral', 'Abstrato', 'Geométrico', 'Animal', 'Textura'];

  const filteredPatterns = SAMPLE_PATTERNS.filter((p) => {
    const matchesCategory = activeFilter === 'Todos' || p.category === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <footer className="bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl flex flex-col shrink-0 text-slate-200 select-none z-30 shadow-2xl">
      {/* Panel Expand / Collapse Toggle Header */}
      <div className="h-8 bg-slate-900/90 px-3 flex items-center justify-between border-b border-slate-800 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 font-semibold text-slate-300">
            <button
              onClick={() => {
                setActiveTab('patterns');
                if (!isExpanded) setIsExpanded(true);
              }}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition ${
                activeTab === 'patterns' && isExpanded
                  ? 'bg-slate-800 text-cyan-300'
                  : 'hover:bg-slate-800/60 text-slate-400'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-cyan-400" />
              <span>Biblioteca de Elementos</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                if (!isExpanded) setIsExpanded(true);
              }}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition ${
                activeTab === 'history' && isExpanded
                  ? 'bg-slate-800 text-purple-300'
                  : 'hover:bg-slate-800/60 text-slate-400'
              }`}
            >
              <History className="w-3.5 h-3.5 text-purple-400" />
              <span>Histórico de Ações</span>
            </button>
          </div>
        </div>

        {/* Toggle Expand Icon */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-800 rounded"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Drawer Area */}
      {isExpanded && (
        <div className="h-44 flex overflow-hidden bg-slate-950/90 border-b border-slate-800">
          {activeTab === 'patterns' ? (
            <>
              {/* Asset Categories Left Sub-menu */}
              <div className="w-36 border-r border-slate-800 p-2 space-y-1 bg-slate-900/40 shrink-0 text-xs font-medium">
                {(
                  [
                    { name: 'Padrões', icon: <Grid className="w-3.5 h-3.5" /> },
                    { name: 'Texturas', icon: <Sparkles className="w-3.5 h-3.5" /> },
                    { name: 'Cliparts', icon: <Image className="w-3.5 h-3.5" /> },
                    { name: 'Mockups', icon: <Box className="w-3.5 h-3.5" /> },
                    { name: 'Fontes', icon: <Type className="w-3.5 h-3.5" /> },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveAssetType(cat.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition ${
                      activeAssetType === cat.name
                        ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Main Patterns Content */}
              <div className="flex-1 p-2.5 flex flex-col gap-2 overflow-hidden">
                {/* Search & Filter Pills */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Buscar elementos (tropical, floral)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar py-0.5">
                    {filterPills.map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition shrink-0 ${
                          activeFilter === f
                            ? 'bg-cyan-500 text-slate-950 shadow-sm'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patterns Grid */}
                <div className="flex-1 overflow-x-auto custom-scrollbar flex items-center gap-3 py-1">
                  {filteredPatterns.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onSelectPattern(p)}
                      className="w-24 h-24 rounded-xl border border-slate-800 bg-slate-900 shrink-0 overflow-hidden cursor-pointer hover:border-cyan-400 hover:scale-105 transition-all group relative flex flex-col justify-end p-1.5 shadow-lg"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        dangerouslySetInnerHTML={{ __html: p.url }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent opacity-80 group-hover:opacity-100 transition" />
                      <span className="relative z-10 text-[9px] font-bold text-slate-100 truncate drop-shadow">
                        {p.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* History Timeline Tab */
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400 mb-1">
                Linha do Tempo de Ações
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {INITIAL_HISTORY.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => onRestoreHistory(h)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-400/80 cursor-pointer transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{h.title}</div>
                      <div className="text-[10px] text-slate-400">{h.detail}</div>
                    </div>
                    <span className="font-mono text-[9px] text-purple-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {h.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Production Status Bar */}
      <div className="h-7 bg-slate-950 px-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 font-mono select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-300">
            Projeto: <strong className="text-cyan-300">Tropical AI</strong>
          </span>
          <span className="hidden sm:inline">Tamanho: 1080 x 1350 px</span>
          <span className="hidden md:inline">Resolução: 300 DPI</span>
          <span className="hidden lg:inline text-purple-400">Modo de Cor: CMYK</span>
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          <span className="hidden md:flex items-center gap-1 text-emerald-400">
            <Cpu className="w-3 h-3" /> WebGL 2.0 (Active)
          </span>
          <span className="hidden lg:flex items-center gap-1 text-slate-400">
            <HardDrive className="w-3 h-3 text-cyan-400" /> RAM: 1.2 GB
          </span>
          <div className="flex items-center gap-2">
            <span>Zoom: {zoom}%</span>
            <input
              type="range"
              min="30"
              max="200"
              value={zoom}
              onChange={(e) => onChangeZoom(parseInt(e.target.value))}
              className="w-16 h-1 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
