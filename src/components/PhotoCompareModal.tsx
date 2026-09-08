import React, { useState } from 'react';
import { BRAND_ASSETS } from '../data/mockData';

interface PhotoCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoCompareModal: React.FC<PhotoCompareModalProps> = ({ isOpen, onClose }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [mode, setMode] = useState<'sideBySide' | 'slider'>('sideBySide');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-container border border-surface-container-high rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed text-[22px]">compare</span>
            <div>
              <h3 className="text-[17px] font-bold text-on-surface leading-tight">Comparativo Fotográfico Padronizado</h3>
              <span className="text-[11px] text-secondary">Semana 1 vs Semana 6 • Mesma iluminação e jejum</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl">
          <button
            onClick={() => setMode('sideBySide')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
              mode === 'sideBySide' ? 'bg-primary-fixed text-on-primary-fixed' : 'text-secondary hover:text-on-surface'
            }`}
          >
            Lado a Lado
          </button>
          <button
            onClick={() => setMode('slider')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
              mode === 'slider' ? 'bg-primary-fixed text-on-primary-fixed' : 'text-secondary hover:text-on-surface'
            }`}
          >
            Controle Deslizante
          </button>
        </div>

        {/* Visual Showcase */}
        {mode === 'sideBySide' ? (
          <div className="grid grid-cols-2 gap-3">
            {/* Week 1 */}
            <div className="flex flex-col gap-1.5">
              <div className="relative rounded-xl overflow-hidden h-64 bg-surface-container-lowest border border-surface-container-high">
                <img
                  src={BRAND_ASSETS.photoWeek1}
                  alt="Semana 01"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="text-[12px] font-bold text-on-surface block">Semana 01</span>
                  <span className="text-[11px] text-secondary">87,8 kg • 19% BF</span>
                </div>
              </div>
              <div className="text-[11px] text-outline text-center">Fase Inicial • Baseline</div>
            </div>

            {/* Week 6 */}
            <div className="flex flex-col gap-1.5">
              <div className="relative rounded-xl overflow-hidden h-64 bg-surface-container-lowest border border-primary-fixed/40">
                <img
                  src={BRAND_ASSETS.photoWeek6}
                  alt="Semana 06"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold uppercase tracking-wider">
                  ATUAL
                </div>
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="text-[12px] font-bold text-primary-fixed block">Semana 06</span>
                  <span className="text-[11px] text-on-surface">84,2 kg • 15.2% BF</span>
                </div>
              </div>
              <div className="text-[11px] text-primary-fixed text-center font-bold">Vascularização & Densidade</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="relative rounded-xl overflow-hidden h-72 bg-surface-container-lowest border border-surface-container-high select-none">
              {/* Underneath: Week 6 */}
              <img
                src={BRAND_ASSETS.photoWeek6}
                alt="Semana 06"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* On top: Week 1 clipped */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={BRAND_ASSETS.photoWeek1}
                  alt="Semana 01"
                  className="w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/80 text-white text-[11px] font-bold">
                  Semana 1
                </div>
              </div>

              {/* Slider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-primary-fixed shadow-[0_0_12px_#c5f400]"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold shadow-md">
                  ⇄
                </div>
              </div>

              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                Semana 6
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full accent-primary-fixed cursor-pointer"
            />
          </div>
        )}

        {/* Biometric Deltas Summary */}
        <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-3 rounded-xl border border-surface-container-high/60 text-center">
          <div>
            <span className="text-[10px] text-secondary">Delta Peso</span>
            <div className="text-[14px] font-bold text-primary-fixed">-3,6 kg</div>
          </div>
          <div>
            <span className="text-[10px] text-secondary">Delta Gordura</span>
            <div className="text-[14px] font-bold text-primary-fixed">-3.8% BF</div>
          </div>
          <div>
            <span className="text-[10px] text-secondary">Cintura</span>
            <div className="text-[14px] font-bold text-primary-fixed">-1,5 cm</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-[13px] transition-colors"
        >
          Fechar Comparativo
        </button>
      </div>
    </div>
  );
};
