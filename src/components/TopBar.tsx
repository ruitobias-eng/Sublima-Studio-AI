import React, { useState } from 'react';
import {
  Sparkles,
  Printer,
  Save,
  Download,
  CloudCheck,
  Undo2,
  Redo2,
  Layers,
  ChevronDown,
  Minimize2,
  Square,
  X,
  PrinterCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { TopMenusDropdown } from './TopMenusDropdown';

interface TopBarProps {
  onOpenPrintModal: () => void;
  onOpenExportModal: () => void;
  onSaveProject: () => void;
  onUndo: () => void;
  onRedo: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenPrintModal,
  onOpenExportModal,
  onSaveProject,
  onUndo,
  onRedo,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = [
    'Arquivo',
    'Editar',
    'Visualizar',
    'Inserir',
    'Camada',
    'AI Tools',
    'Janela',
    'Ajuda',
  ];

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuAction = (action: string) => {
    if (action === 'print') onOpenPrintModal();
    if (action === 'export') onOpenExportModal();
    if (action === 'save') onSaveProject();
    if (action === 'undo') onUndo();
    if (action === 'redo') onRedo();
  };

  return (
    <header className="h-12 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md px-3 flex items-center justify-between text-slate-200 select-none z-30 shrink-0 shadow-md">
      {/* Left Brand Identity & Windows Menu */}
      <div className="flex items-center gap-4">
        {/* Brand Icon & Name */}
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
          <div className="relative w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              Sublima Studio AI
            </span>
            <span className="text-[9px] text-cyan-400/80 font-medium tracking-wider -mt-0.5">
              Ambiente de Criação & Sublimação
            </span>
          </div>
        </div>

        {/* Navigation Dropdown Menus */}
        <nav className="hidden lg:flex items-center gap-0.5 text-xs text-slate-300">
          {menus.map((menu) => (
            <button
              key={menu}
              onClick={() => handleMenuClick(menu)}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 font-medium ${
                activeMenu === menu
                  ? 'bg-slate-800 text-cyan-300'
                  : 'hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {menu === 'AI Tools' && (
                <Sparkles className="w-3 h-3 text-cyan-400" />
              )}
              {menu}
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>
          ))}
        </nav>
      </div>

      {/* Center Cloud Sync Status */}
      <div className="hidden md:flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 px-3 py-1 rounded-full text-[11px] text-slate-400">
        <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Nuvem Sincronizada</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
      </div>

      {/* Right Quick Action Toolbar & Windows Controls */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={onUndo}
            title="Desfazer (Ctrl+Z)"
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-100 transition"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            title="Refazer (Ctrl+Y)"
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-100 transition"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Save & Export */}
        <button
          onClick={onSaveProject}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 rounded-lg transition shadow-sm"
        >
          <Save className="w-3.5 h-3.5 text-slate-400" />
          <span>Salvar</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 rounded-lg transition shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Exportar</span>
        </button>

        {/* Light / Dark Mode Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 rounded-lg transition shadow-sm"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span className="hidden md:inline font-medium">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline font-medium">Escuro</span>
              </>
            )}
          </button>
        )}

        {/* Primary Action Button: IMPRIMIR / SUBLIMAR */}
        <button
          onClick={onOpenPrintModal}
          className="relative group overflow-hidden px-4 py-1.5 rounded-lg font-semibold text-xs text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-purple-900/30 border border-purple-400/30 transition-all duration-200 flex items-center gap-2 active:scale-95"
        >
          <PrinterCheck className="w-4 h-4 text-white animate-bounce" />
          <span>Imprimir / Sublimar</span>
        </button>

        {/* OS Window Actions Simulation */}
        <div className="hidden xl:flex items-center ml-2 border-l border-slate-800 pl-2 gap-1 text-slate-500">
          <button className="p-1.5 hover:bg-slate-800 hover:text-slate-300 rounded">
            <Minimize2 className="w-3 h-3" />
          </button>
          <button className="p-1.5 hover:bg-slate-800 hover:text-slate-300 rounded">
            <Square className="w-3 h-3" />
          </button>
          <button className="p-1.5 hover:bg-red-600 hover:text-white rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dropdown Menu Overlay */}
      <TopMenusDropdown
        activeMenu={activeMenu}
        onClose={() => setActiveMenu(null)}
        onAction={handleMenuAction}
      />
    </header>
  );
};
