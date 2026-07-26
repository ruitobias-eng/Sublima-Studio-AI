import React, { useState } from 'react';
import {
  Printer,
  X,
  Check,
  FlipHorizontal,
  Crosshair,
  FileCheck,
  Download,
  Settings2,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react';
import { TOUCAN_ARTWORK_SVG } from '../data/initialData';
import { ProjectMeta } from '../types';

interface PrintSublimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: ProjectMeta;
}

export const PrintSublimationModal: React.FC<PrintSublimationModalProps> = ({
  isOpen,
  onClose,
  meta,
}) => {
  const [mirrorMode, setMirrorMode] = useState(true); // Default true for sublimation
  const [bleedMarks, setBleedMarks] = useState(true);
  const [cropMarks, setCropMarks] = useState(true);
  const [paperSize, setPaperSize] = useState<'A4' | 'A3' | 'Roll 24"' | 'Roll 44"'>('A3');
  const [iccProfile, setIccProfile] = useState('Epson Sublimation SC-F500 CMYK v2');
  const [copies, setCopies] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      window.print();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200"
        style={{
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(168,85,247,0.2)',
        }}
      >
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 text-white shadow-lg shadow-purple-600/30">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                Painel de Impressão & Sublimação Profissional
              </h2>
              <p className="text-xs text-slate-400">
                Calibração CMYK • Espelhamento Automático • Impressão em Papel Sublimático
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[80vh]">
          {/* Left Side: Realistic Paper Layout Print Preview */}
          <div className="space-y-3 flex flex-col">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                Pré-visualização da Folha de Impressão
              </span>
              <span className="text-[10px] text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                Papel: {paperSize} (300 DPI CMYK)
              </span>
            </div>

            {/* Paper Preview Sheet Frame */}
            <div className="flex-1 min-h-[300px] bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-center relative overflow-hidden shadow-inner">
              {/* Paper Sheet Representation */}
              <div
                className={`relative bg-white shadow-2xl transition-transform duration-300 flex items-center justify-center border-2 border-slate-300 ${
                  mirrorMode ? 'scale-x-[-1]' : 'scale-x-1'
                }`}
                style={{
                  width: paperSize === 'A4' ? '210px' : '280px',
                  height: paperSize === 'A4' ? '297px' : '380px',
                }}
              >
                {/* Bleed Guide */}
                {bleedMarks && (
                  <div className="absolute inset-[-6px] border border-dashed border-cyan-500 pointer-events-none" />
                )}

                {/* Crop Marks */}
                {cropMarks && (
                  <>
                    <div className="absolute -top-3 -left-3 w-4 h-4 border-l-2 border-t-2 border-black pointer-events-none" />
                    <div className="absolute -top-3 -right-3 w-4 h-4 border-r-2 border-t-2 border-black pointer-events-none" />
                    <div className="absolute -bottom-3 -left-3 w-4 h-4 border-l-2 border-b-2 border-black pointer-events-none" />
                    <div className="absolute -bottom-3 -right-3 w-4 h-4 border-r-2 border-b-2 border-black pointer-events-none" />
                  </>
                )}

                {/* SVG Artwork rendered inside paper */}
                <div
                  className="w-full h-full p-2"
                  dangerouslySetInnerHTML={{ __html: TOUCAN_ARTWORK_SVG }}
                />

                {/* Sublimation Transfer Watermark */}
                {mirrorMode && (
                  <div className="absolute top-2 right-2 bg-purple-600/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow scale-x-[-1]">
                    ESPELHADO (TRANSFER)
                  </div>
                )}
              </div>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-xs text-amber-300">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Atenção para Sublimação:</strong> A imagem DEVE ser impressa espelhada no papel sublimático para transferência correta na prensa térmica.
              </span>
            </div>
          </div>

          {/* Right Side: Print Settings & Configuration */}
          <div className="space-y-4 text-xs">
            {/* Mirror Mode Toggle (Crucial!) */}
            <div className="p-3 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FlipHorizontal className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="font-bold text-slate-100">Espelhar Imagem (Mirror Mode)</div>
                  <div className="text-[10px] text-purple-300">
                    Obrigatório para papéis de transferência de sublimação
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMirrorMode(!mirrorMode)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  mirrorMode ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    mirrorMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Bleed & Crop Marks Toggles */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBleedMarks(!bleedMarks)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                  bleedMarks
                    ? 'bg-slate-900 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span className="font-medium">Adicionar Sangria (+3mm)</span>
                {bleedMarks && <Check className="w-4 h-4 text-cyan-400" />}
              </button>

              <button
                onClick={() => setCropMarks(!cropMarks)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                  cropMarks
                    ? 'bg-slate-900 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span className="font-medium">Marcas de Corte</span>
                {cropMarks && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            </div>

            {/* Paper Size & Copies */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 text-[11px]">
                  Tamanho do Papel
                </label>
                <select
                  value={paperSize}
                  onChange={(e: any) => setPaperSize(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none"
                >
                  <option value="A4">A4 (210 x 297 mm)</option>
                  <option value="A3">A3 (297 x 420 mm)</option>
                  <option value='Roll 24"'>Bobina 24" (610 mm)</option>
                  <option value='Roll 44"'>Bobina 44" (1118 mm)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 text-[11px]">
                  Número de Cópias
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={copies}
                  onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            {/* ICC Profile Dropdown */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 text-[11px]">
                Perfil de Cor ICC para Sublimação
              </label>
              <select
                value={iccProfile}
                onChange={(e) => setIccProfile(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none"
              >
                <option value="Epson Sublimation SC-F500 CMYK v2">
                  Epson Sublimation SC-F500 CMYK v2
                </option>
                <option value="Sawgrass Virtuoso VisiSub HD">
                  Sawgrass Virtuoso VisiSub HD
                </option>
                <option value="SubliJet HD Transfer CMYK">
                  SubliJet HD Transfer CMYK
                </option>
                <option value="Perfil Genérico Sublimação 300DPI">
                  Perfil Genérico Sublimação 300DPI
                </option>
              </select>
            </div>

            {/* Quick Export Formats */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="font-semibold text-slate-300 text-[11px]">
                Opções de Exportação Prontas para Impressão
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onClose}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-300 font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar PDF (300 DPI)</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-purple-300 font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar PNG CMYK</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-semibold text-xs border border-slate-800 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl font-bold text-xs shadow-xl shadow-purple-900/30 flex items-center gap-2 transition active:scale-95"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>{isPrinting ? 'Preparando Fila...' : 'Imprimir Agora na Prensa'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
