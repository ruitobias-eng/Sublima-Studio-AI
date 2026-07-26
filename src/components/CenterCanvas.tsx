import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Trash2,
  MoreHorizontal,
  Eye,
  Grid,
  Sparkles,
  Move,
  Layers,
  Check,
  Crosshair,
  Printer,
} from 'lucide-react';
import { TOUCAN_ARTWORK_SVG } from '../data/initialData';
import { CanvasLayer, ProjectMeta } from '../types';

interface CenterCanvasProps {
  meta: ProjectMeta;
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayerTransform: (
    id: string,
    transform: { x?: number; y?: number; rotation?: number }
  ) => void;
  showBleed: boolean;
  onToggleBleed: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  zoom: number;
  onChangeZoom: (newZoom: number) => void;
}

export const CenterCanvas: React.FC<CenterCanvasProps> = ({
  meta,
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayerTransform,
  showBleed,
  onToggleBleed,
  showGrid,
  onToggleGrid,
  zoom,
  onChangeZoom,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (canvasContainerRef.current) {
      const rect = canvasContainerRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) / (zoom / 100));
      const y = Math.round((e.clientY - rect.top) / (zoom / 100));
      setCursorPos({ x: Math.max(0, x), y: Math.max(0, y) });
    }

    if (isDragging && selectedLayerId) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setDragStart({ x: e.clientX, y: e.clientY });

      const current = layers.find((l) => l.id === selectedLayerId);
      if (current) {
        onUpdateLayerTransform(selectedLayerId, {
          x: current.x + dx,
          y: current.y + dy,
        });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedLayerId) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  return (
    <main className="flex-1 bg-slate-900/90 flex flex-col h-full overflow-hidden relative select-none">
      {/* Top Workspace Tab & Status Header */}
      <div className="h-8 bg-slate-950/90 border-b border-slate-800/80 px-3 flex items-center justify-between text-xs text-slate-300 z-10 shrink-0">
        <div className="flex items-center gap-2">
          {/* Active Tab */}
          <div className="bg-slate-900 border-t-2 border-indigo-500 border-x border-slate-800/80 px-3 py-1 rounded-t flex items-center gap-2 font-medium text-slate-100">
            <span>{meta.name}</span>
            <span className="text-[10px] text-cyan-400 bg-slate-800 px-1.5 rounded">
              {zoom}%
            </span>
            <button className="hover:text-cyan-300 text-[10px]">✕</button>
          </div>
          <button className="p-1 hover:bg-slate-800 text-slate-400 rounded">
            +
          </button>
        </div>

        {/* Artboard Status Badges */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            {meta.width} × {meta.height} px ({meta.dpi} DPI)
          </span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono text-cyan-300">
            Modo: {meta.colorMode} Pro
          </span>
          <span className="hidden sm:inline text-emerald-400">
            Sangria: +{meta.bleed}mm (Ativa)
          </span>
        </div>
      </div>

      {/* Rulers & Canvas Viewport Container */}
      <div
        ref={canvasContainerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 relative overflow-auto custom-scrollbar bg-slate-950 flex items-center justify-center p-8 cursor-crosshair"
        style={{
          backgroundImage: showGrid
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)'
            : 'none',
          backgroundSize: '20px 20px',
        }}
      >
        {/* Horizontal Top Ruler */}
        <div className="absolute top-0 left-0 right-0 h-5 bg-slate-950/90 border-b border-slate-800 text-[9px] font-mono text-slate-500 flex items-center px-6 overflow-hidden z-20 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="flex-1 border-l border-slate-800 pl-1">
              {i * 100}
            </div>
          ))}
          {/* Cursor X Marker */}
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-cyan-400 z-30"
            style={{ left: `${cursorPos.x}px` }}
          />
        </div>

        {/* Vertical Left Ruler */}
        <div className="absolute top-5 left-0 bottom-0 w-5 bg-slate-950/90 border-r border-slate-800 text-[9px] font-mono text-slate-500 flex flex-col items-center py-2 overflow-hidden z-20 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="flex-1 border-t border-slate-800 pt-0.5">
              {i * 100}
            </div>
          ))}
          {/* Cursor Y Marker */}
          <div
            className="absolute left-0 right-0 h-[1px] bg-cyan-400 z-30"
            style={{ top: `${cursorPos.y}px` }}
          />
        </div>

        {/* Main Infinite Canvas Artboard Frame */}
        <div
          className="relative transition-transform duration-100 ease-out shadow-2xl rounded-sm overflow-visible bg-slate-900 border border-slate-800"
          style={{
            width: `${(meta.width * zoom) / 100}px`,
            height: `${(meta.height * zoom) / 100}px`,
            boxShadow:
              '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(99,102,241,0.15)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onSelectLayer(null);
          }}
        >
          {/* Transparent Checkerboard Background */}
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          />

          {/* Render Active Layers or Fallback SVG */}
          {layers && layers.length > 0 ? (
            layers.map((layer, index) => {
              if (!layer.visible) return null;

              const isSelected = layer.id === selectedLayerId;
              const layerStyle: React.CSSProperties = {
                left: `${layer.x}px`,
                top: `${layer.y}px`,
                width: `${layer.width || 1080}px`,
                height: `${layer.height || 1350}px`,
                transform: `rotate(${layer.rotation || 0}deg)`,
                opacity: (layer.opacity ?? 100) / 100,
                mixBlendMode: (layer.blendMode || 'normal') as any,
              };

              if (layer.type === 'image' && layer.content) {
                return (
                  <img
                    key={layer.id || index}
                    src={layer.content}
                    alt={layer.name}
                    referrerPolicy="no-referrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLayer(layer.id);
                    }}
                    className={`absolute object-contain cursor-pointer transition-all hover:ring-2 hover:ring-cyan-400/50 ${
                      isSelected ? 'ring-2 ring-cyan-400/80 shadow-cyan-500/20 shadow-lg' : ''
                    }`}
                    style={layerStyle}
                  />
                );
              }

              if ((layer.type === 'vector' || layer.type === 'pattern') && layer.content) {
                return (
                  <div
                    key={layer.id || index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLayer(layer.id);
                    }}
                    className={`absolute cursor-pointer transition-all hover:ring-2 hover:ring-cyan-400/50 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain ${
                      isSelected ? 'ring-2 ring-cyan-400/80 shadow-cyan-500/20 shadow-lg' : ''
                    }`}
                    style={layerStyle}
                    dangerouslySetInnerHTML={{ __html: layer.content }}
                  />
                );
              }

              return (
                <div
                  key={layer.id || index}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLayer(layer.id);
                  }}
                  className={`absolute cursor-pointer transition-all hover:ring-2 hover:ring-cyan-400/50 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain ${
                    isSelected ? 'ring-2 ring-cyan-400/80 shadow-cyan-500/20 shadow-lg' : ''
                  }`}
                  style={layerStyle}
                  dangerouslySetInnerHTML={{ __html: layer.content || TOUCAN_ARTWORK_SVG }}
                />
              );
            })
          ) : (
            <div
              className="absolute inset-0 z-1 pointer-events-none"
              dangerouslySetInnerHTML={{ __html: TOUCAN_ARTWORK_SVG }}
            />
          )}

          {/* Bleed & Safe Printable Guides Overlay */}
          {showBleed && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              {/* Bleed Zone Margin (Dashed Cyan) */}
              <div className="absolute inset-[-12px] border-2 border-dashed border-cyan-400/80 rounded-xs flex items-start justify-start p-1">
                <span className="bg-cyan-950/90 text-cyan-300 text-[9px] font-bold px-1 rounded border border-cyan-700/50">
                  Sangria Sublimática (+3mm)
                </span>
              </div>

              {/* Cut / Crop Line (Solid Red) */}
              <div className="absolute inset-0 border-2 border-red-500/80">
                <span className="absolute top-1 left-1 bg-red-950/90 text-red-300 text-[9px] font-bold px-1 rounded border border-red-700/50">
                  Linha de Corte (Corte Final)
                </span>
              </div>

              {/* Safe Printable Zone (Dashed Green) */}
              <div className="absolute inset-[20px] border-2 border-dashed border-emerald-400/80">
                <span className="absolute top-1 left-1 bg-emerald-950/90 text-emerald-300 text-[9px] font-bold px-1 rounded border border-emerald-700/50">
                  Área Segura de Impressão
                </span>
              </div>
            </div>
          )}

          {/* Interactive Bounding Box & Transformation Handles for Selected Layer */}
          {selectedLayer && (
            <div
              onMouseDown={handleMouseDown}
              className="absolute z-20 border-2 border-cyan-400 bg-cyan-400/10 cursor-move rounded-xs transition-shadow shadow-lg shadow-cyan-500/20"
              style={{
                left: `${selectedLayer.x}px`,
                top: `${selectedLayer.y}px`,
                width: `${selectedLayer.width}px`,
                height: `${selectedLayer.height}px`,
                transform: `rotate(${selectedLayer.rotation}deg)`,
              }}
            >
              {/* Corner Handles */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-nwse-resize shadow" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-nesw-resize shadow" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-nesw-resize shadow" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-nwse-resize shadow" />

              {/* Rotation Handle */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-3.5 h-3.5 bg-purple-500 border-2 border-white rounded-full cursor-grab shadow-lg flex items-center justify-center">
                  <RotateCw className="w-2 h-2 text-white" />
                </div>
                <div className="w-[1px] h-4 bg-purple-400" />
              </div>

              {/* Selection Tag */}
              <div className="absolute -bottom-6 left-0 bg-cyan-950 border border-cyan-500/80 text-cyan-200 text-[9px] font-semibold px-2 py-0.5 rounded shadow">
                {selectedLayer.name} ({Math.round(selectedLayer.width)}x
                {Math.round(selectedLayer.height)}px)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Canvas Action Toolbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-slate-950/90 border border-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-3 text-slate-300 text-xs">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-full border border-slate-800">
          <button
            onClick={() => onChangeZoom(Math.max(30, zoom - 10))}
            className="hover:text-cyan-300 p-0.5 rounded"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] w-10 text-center text-cyan-300 font-semibold">
            {zoom}%
          </span>
          <button
            onClick={() => onChangeZoom(Math.min(200, zoom + 10))}
            className="hover:text-cyan-300 p-0.5 rounded"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-slate-800" />

        {/* Toggles */}
        <button
          onClick={onToggleBleed}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] transition ${
            showBleed
              ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300 font-medium'
              : 'border-slate-800 hover:bg-slate-900 text-slate-400'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>Sangria + Margens</span>
        </button>

        <button
          onClick={onToggleGrid}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] transition ${
            showGrid
              ? 'bg-purple-950/80 border-purple-500/80 text-purple-300 font-medium'
              : 'border-slate-800 hover:bg-slate-900 text-slate-400'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Grade</span>
        </button>

        <button
          onClick={() => onChangeZoom(70)}
          className="p-1.5 hover:bg-slate-900 rounded-full text-slate-400 hover:text-slate-200"
          title="Ajustar à Tela"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <button
          className="p-1.5 hover:bg-slate-900 rounded-full text-slate-400 hover:text-slate-200"
          title="Opções do Canvas"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </main>
  );
};
