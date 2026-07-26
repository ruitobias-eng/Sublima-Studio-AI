import React from 'react';
import {
  MousePointer,
  Move,
  Crop,
  Paintbrush,
  Type,
  Shapes,
  PenTool,
  Wand2,
  Sparkles,
  Orbit,
  Pipette,
  Eraser,
  ZoomIn,
  Hand,
  SlidersHorizontal,
} from 'lucide-react';
import { ToolType } from '../types';

interface LeftToolbarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
}

export const LeftToolbar: React.FC<LeftToolbarProps> = ({
  activeTool,
  onSelectTool,
}) => {
  const tools: { id: ToolType; name: string; shortcut: string; icon: React.ReactNode }[] = [
    { id: 'move', name: 'Selecionar', shortcut: 'V', icon: <MousePointer className="w-4 h-4" /> },
    { id: 'select', name: 'Transformar', shortcut: 'M', icon: <Move className="w-4 h-4" /> },
    { id: 'crop', name: 'Cortar', shortcut: 'C', icon: <Crop className="w-4 h-4" /> },
    { id: 'brush', name: 'Pincel', shortcut: 'B', icon: <Paintbrush className="w-4 h-4" /> },
    { id: 'text', name: 'Texto', shortcut: 'T', icon: <Type className="w-4 h-4" /> },
    { id: 'rectangle', name: 'Formas', shortcut: 'R', icon: <Shapes className="w-4 h-4" /> },
    { id: 'pen', name: 'Vetores', shortcut: 'P', icon: <PenTool className="w-4 h-4" /> },
    { id: 'wand', name: 'Máscara', shortcut: 'W', icon: <Wand2 className="w-4 h-4" /> },
    { id: 'gradient', name: 'Efeitos', shortcut: 'G', icon: <SlidersHorizontal className="w-4 h-4" /> },
    {
      id: 'ai_designer',
      name: 'AI Designer',
      shortcut: 'AI',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
    },
    { id: 'orbit3d', name: 'Visualização 3D Orbit', shortcut: '3', icon: <Orbit className="w-4 h-4 text-purple-400" /> },
    { id: 'eyedropper', name: 'Conta-gotas', shortcut: 'I', icon: <Pipette className="w-4 h-4" /> },
    { id: 'erase', name: 'Borracha', shortcut: 'E', icon: <Eraser className="w-4 h-4" /> },
    { id: 'zoom', name: 'Zoom', shortcut: 'Z', icon: <ZoomIn className="w-4 h-4" /> },
    { id: 'hand', name: 'Mão (Navegação)', shortcut: 'H', icon: <Hand className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-12 bg-slate-950 border-r border-slate-800/80 flex flex-col items-center py-2 gap-1 z-20 shrink-0 select-none shadow-xl">
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;
        return (
          <div key={tool.id} className="relative group">
            <button
              onClick={() => onSelectTool(tool.id)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 relative ${
                isActive
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tool.icon}
              {isActive && (
                <span className="absolute -left-1 top-2.5 w-1 h-4 bg-cyan-400 rounded-r-full" />
              )}
            </button>

            {/* Tooltip */}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-slate-900 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 flex items-center gap-2">
              <span>{tool.name}</span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1 rounded">
                {tool.shortcut}
              </span>
            </div>
          </div>
        );
      })}
    </aside>
  );
};
