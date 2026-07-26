import React from 'react';
import {
  FileText,
  FolderOpen,
  Save,
  Download,
  Printer,
  Undo2,
  Redo2,
  Copy,
  Scissors,
  Eye,
  Grid,
  Layers,
  Sparkles,
  HelpCircle,
  Settings,
  Check,
} from 'lucide-react';

interface TopMenusDropdownProps {
  activeMenu: string | null;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const TopMenusDropdown: React.FC<TopMenusDropdownProps> = ({
  activeMenu,
  onClose,
  onAction,
}) => {
  if (!activeMenu) return null;

  const renderMenuContent = () => {
    switch (activeMenu) {
      case 'Arquivo':
        return (
          <>
            <button
              onClick={() => {
                onAction('new');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center justify-between rounded"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Novo Projeto de Sublimação
              </span>
              <span className="text-[10px] text-slate-400">Ctrl+N</span>
            </button>
            <button
              onClick={() => {
                onAction('open');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center justify-between rounded"
            >
              <span className="flex items-center gap-2">
                <FolderOpen className="w-3.5 h-3.5" /> Abrir Projeto...
              </span>
              <span className="text-[10px] text-slate-400">Ctrl+O</span>
            </button>
            <div className="my-1 border-t border-slate-800" />
            <button
              onClick={() => {
                onAction('save');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center justify-between rounded"
            >
              <span className="flex items-center gap-2">
                <Save className="w-3.5 h-3.5" /> Salvar Projeto
              </span>
              <span className="text-[10px] text-slate-400">Ctrl+S</span>
            </button>
            <button
              onClick={() => {
                onAction('export');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center justify-between rounded"
            >
              <span className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5" /> Exportar (PNG/SVG/PDF 300DPI)
              </span>
              <span className="text-[10px] text-slate-400">Ctrl+E</span>
            </button>
            <div className="my-1 border-t border-slate-800" />
            <button
              onClick={() => {
                onAction('print');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-indigo-300 hover:bg-indigo-600 hover:text-white flex items-center justify-between rounded font-semibold"
            >
              <span className="flex items-center gap-2">
                <Printer className="w-3.5 h-3.5 text-purple-400" /> Imprimir / Sublimar
              </span>
              <span className="text-[10px] text-indigo-200">Ctrl+P</span>
            </button>
          </>
        );

      case 'Editar':
        return (
          <>
            <button
              onClick={() => {
                onAction('undo');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center justify-between rounded"
            >
              <span className="flex items-center gap-2">
                <Undo2 className="w-3.5 h-3.5" /> Desfazer
              </span>
              <span className="text-[10px] text-slate-400">Ctrl+Z</span>
            </button>
            <button
              onClick={() => {
                onAction('redo');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center justify-between rounded"
            >
              <span className="flex items-center gap-2">
                <Redo2 className="w-3.5 h-3.5" /> Refazer
              </span>
              <span className="text-[10px] text-slate-400">Ctrl+Y</span>
            </button>
            <div className="my-1 border-t border-slate-800" />
            <button
              onClick={() => {
                onAction('copy');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center justify-between rounded"
            >
              <span className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5" /> Copiar Camada
              </span>
              <span className="text-[10px] text-slate-400">Ctrl+C</span>
            </button>
            <button
              onClick={() => {
                onAction('cut');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center justify-between rounded"
            >
              <span className="flex items-center gap-2">
                <Scissors className="w-3.5 h-3.5" /> Recortar
              </span>
              <span className="text-[10px] text-slate-400">Ctrl+X</span>
            </button>
          </>
        );

      case 'Visualizar':
        return (
          <>
            <button
              onClick={() => {
                onAction('toggle-bleed');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center justify-between rounded"
            >
              <span className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" /> Guia de Sangria & Margens
              </span>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            <button
              onClick={() => {
                onAction('toggle-grid');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center justify-between rounded"
            >
              <span className="flex items-center gap-2">
                <Grid className="w-3.5 h-3.5" /> Grade de Alinhamento
              </span>
            </button>
            <button
              onClick={() => {
                onAction('toggle-cmyk');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center justify-between rounded"
            >
              <span className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5" /> Prova de Cores CMYK Realista
              </span>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </>
        );

      case 'AI Tools':
        return (
          <>
            <button
              onClick={() => {
                onAction('ai-generate');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-cyan-300 hover:bg-indigo-600 hover:text-white flex items-center gap-2 rounded font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Gerador de Arte Generativa
            </button>
            <button
              onClick={() => {
                onAction('ai-bg-remove');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center gap-2 rounded"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Remover Fundo com IA
            </button>
            <button
              onClick={() => {
                onAction('ai-vectorize');
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center gap-2 rounded"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Vetorizador Automático IA
            </button>
          </>
        );

      default:
        return (
          <div className="p-3 text-xs text-slate-400">
            {activeMenu} opções carregadas. Clique nas ferramentas do menu principal para utilizar.
          </div>
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="absolute top-11 left-28 z-50 min-w-60 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-lg p-1.5 text-slate-200 animate-in fade-in zoom-in-95 duration-100"
        style={{
          boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 15px rgba(99,102,241,0.2)',
        }}
      >
        {renderMenuContent()}
      </div>
    </>
  );
};
