import React, { useState } from 'react';
import {
  WEIGHT_HISTORY,
  MEASUREMENTS,
  STRENGTH_RECORDS,
  BIOFEEDBACK_ITEMS,
  BRAND_ASSETS
} from '../data/mockData';

interface EvolutionViewProps {
  onOpenCheckIn: () => void;
  onOpenPhotoCompare: () => void;
  currentWeight: number;
  currentWaist: number;
}

export const EvolutionView: React.FC<EvolutionViewProps> = ({
  onOpenCheckIn,
  onOpenPhotoCompare,
  currentWeight,
  currentWaist
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(6);
  const [period, setPeriod] = useState<'14d' | '30d' | '90d'>('14d');

  const selectedPoint = selectedDayIndex !== null ? WEIGHT_HISTORY[selectedDayIndex] : null;

  return (
    <div className="flex flex-col w-full px-4 gap-5 pb-12 animate-in fade-in duration-200">
      {/* Header Context Badge & Period Selector */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full border border-surface-container-high">
          <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
          <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
            Semana 6 de 12 • Fase Fat Loss
          </span>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full border border-surface-container-high">
          <span className="material-symbols-outlined text-secondary text-[16px]">calendar_today</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="bg-transparent text-[11px] font-bold text-secondary focus:outline-none cursor-pointer"
          >
            <option value="14d" className="bg-surface-container text-on-surface">Últimos 14 dias</option>
            <option value="30d" className="bg-surface-container text-on-surface">Últimos 30 dias</option>
            <option value="90d" className="bg-surface-container text-on-surface">Ciclo Completo</option>
          </select>
        </div>
      </div>

      {/* COACH AI Protocol Diagnosis Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container border border-surface-container-high p-4 shadow-md">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-fixed/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 text-primary-fixed shadow-sm border border-surface-container-highest">
            <span className="material-symbols-outlined text-[22px]">smart_toy</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-primary-fixed font-bold">
                Veredito do Algoritmo GoFit
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-fixed/20 text-primary-fixed font-extrabold border border-primary-fixed/30">
                MANTER PLANO
              </span>
            </div>
            <p className="text-[13px] text-on-surface leading-relaxed mt-1">
              Aderência em <strong className="text-on-surface font-bold">92%</strong> e taxa de redução ponderal em{' '}
              <strong className="text-primary-fixed font-bold">-0,7%/sem</strong>. Déficit energético perfeitamente calibrado. Nenhuma redução de calorias necessária para a Semana 7.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Metric: 7-Day Rolling Weight Average & Scientific Curve */}
      <div className="flex flex-col bg-surface-container border border-surface-container-high rounded-2xl p-4 shadow-sm gap-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-secondary font-semibold">
              Média Móvel de Peso (7 Dias)
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[32px] font-extrabold text-on-surface tabular-nums tracking-tight">
                {currentWeight.toFixed(1).replace('.', ',')}
              </span>
              <span className="text-[14px] text-secondary">kg</span>
              <div className="flex items-center gap-0.5 ml-1 px-2 py-0.5 rounded-full bg-primary-fixed/15 text-primary-fixed border border-primary-fixed/25">
                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                <span className="text-[11px] font-bold">-0,6 kg (-0,7%)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-outline">Semana anterior</span>
            <p className="text-[15px] font-bold text-outline line-through opacity-80 tabular-nums">
              84,8 kg
            </p>
          </div>
        </div>

        {/* Selected Day Telemetry tooltip if active */}
        {selectedPoint && (
          <div className="bg-surface-dim px-3 py-1.5 rounded-lg border border-surface-container-high flex items-center justify-between text-[11px]">
            <span className="text-secondary">
              {selectedPoint.day} ({selectedPoint.date}): Peso pontual <strong className="text-on-surface">{selectedPoint.weight} kg</strong>
            </span>
            <span className="text-primary-fixed font-bold">
              Média móvel: {selectedPoint.trendWeight} kg
            </span>
          </div>
        )}

        {/* Trend Chart Container (SVG) */}
        <div className="relative w-full h-40 bg-surface-container-lowest rounded-xl p-2 flex flex-col justify-end border border-surface-container-high/60">
          <div className="absolute inset-x-3 bottom-6 top-6 bg-primary-fixed/[0.02] rounded pointer-events-none" />

          {/* SVG Canvas */}
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 120">
            <defs>
              <linearGradient id="weightGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#c5f400" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#c5f400" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Guides */}
            <line stroke="#282a2e" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="320" y1="20" y2="20" />
            <line stroke="#282a2e" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="320" y1="65" y2="65" />
            <line stroke="#282a2e" strokeWidth="1" x1="0" x2="320" y1="105" y2="105" />

            {/* Daily Fluctuation Noise (Dotted gray line + dots) */}
            <polyline
              fill="none"
              points="15,28 60,35 110,22 160,55 210,48 265,75 305,68"
              stroke="#424751"
              strokeDasharray="2 2"
              strokeWidth="1.5"
            />
            {[
              { cx: 15, cy: 28, idx: 0 },
              { cx: 60, cy: 35, idx: 1 },
              { cx: 110, cy: 22, idx: 2 },
              { cx: 160, cy: 55, idx: 3 },
              { cx: 210, cy: 48, idx: 4 },
              { cx: 265, cy: 75, idx: 5 },
              { cx: 305, cy: 68, idx: 6 }
            ].map((pt) => (
              <circle
                key={pt.idx}
                cx={pt.cx}
                cy={pt.cy}
                r={selectedDayIndex === pt.idx ? 4.5 : 3}
                fill={selectedDayIndex === pt.idx ? '#c5f400' : '#8e9379'}
                className="cursor-pointer transition-all hover:scale-125"
                onClick={() => setSelectedDayIndex(pt.idx)}
              />
            ))}

            {/* 7-Day Rolling Moving Average Trend (Lime solid glow line) */}
            <polygon
              fill="url(#weightGrad)"
              points="15,30 60,36 110,44 160,52 210,61 265,70 305,78 305,115 15,115"
            />
            <polyline
              fill="none"
              points="15,30 60,36 110,44 160,52 210,61 265,70 305,78"
              stroke="#c5f400"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />

            {/* Active Focus Dot on Today */}
            <circle
              className="drop-shadow-[0_0_8px_#c5f400]"
              cx="305"
              cy="78"
              fill="#c5f400"
              r="5"
            />
            <circle cx="305" cy="78" fill="#0c0e12" r="2" />
          </svg>

          {/* Day labels */}
          <div className="flex justify-between px-2 pt-1">
            {WEIGHT_HISTORY.map((item, idx) => (
              <button
                key={item.day}
                onClick={() => setSelectedDayIndex(idx)}
                className={`text-[11px] transition-colors ${
                  item.isToday
                    ? 'text-primary-fixed font-bold'
                    : selectedDayIndex === idx
                    ? 'text-on-surface font-bold underline'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                {item.day}
              </button>
            ))}
          </div>
        </div>

        {/* Science Educational Disclaimer Micro-box */}
        <div className="flex items-center gap-2.5 bg-surface-container-low px-3 py-2 rounded-xl border border-surface-container-high">
          <span className="material-symbols-outlined text-primary-fixed text-[18px] shrink-0">info</span>
          <p className="text-[12px] text-secondary leading-snug">
            <strong className="text-on-surface">Fisiologia:</strong> Picos diários refletem acúmulo temporário de sódio e água intracelular. Sua média semanal comprova queima contínua de gordura.
          </p>
        </div>
      </div>

      {/* Weekly Adherence Radar / Twin Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {/* Macro/Calorie Target */}
        <div className="bg-surface-container border border-surface-container-high rounded-2xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-secondary font-bold">
              Dieta TACO
            </span>
            <span className="material-symbols-outlined text-primary-fixed text-[18px]">restaurant</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-extrabold text-on-surface tabular-nums">92%</span>
              <span className="text-[11px] font-bold text-primary-fixed">Alvo atingido</span>
            </div>
            <p className="text-[11px] text-secondary mt-0.5">6 de 7 dias em ±50 kcal</p>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary-fixed h-full rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

        {/* Training Protocol */}
        <div className="bg-surface-container border border-surface-container-high rounded-2xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-secondary font-bold">
              Volume Cargas
            </span>
            <span className="material-symbols-outlined text-primary-fixed text-[18px]">fitness_center</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-extrabold text-on-surface tabular-nums">4 / 4</span>
              <span className="text-[11px] text-secondary">Treinos</span>
            </div>
            <p className="text-[11px] text-secondary mt-0.5">100% estímulos concluídos</p>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary-fixed h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Anthropometric Bio-Tape Measurements (14-day cadence) */}
      <div className="bg-surface-container border border-surface-container-high rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed text-[20px]">straighten</span>
            <h2 className="text-[16px] font-bold text-on-surface">Circunferências Biométricas</h2>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-secondary font-medium">
            A cada 14 dias
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-0.5">
          {MEASUREMENTS.map((m) => {
            const displayCm = m.name === 'Cintura' ? currentWaist : m.currentCm;
            return (
              <div
                key={m.name}
                className="bg-surface-dim rounded-xl p-2.5 flex flex-col border border-surface-container-high/60 text-center"
              >
                <span className="text-[11px] text-secondary font-semibold">{m.name}</span>
                <div className="flex items-baseline justify-center gap-0.5 my-0.5">
                  <span className="text-[20px] font-extrabold text-on-surface tabular-nums">
                    {displayCm}
                  </span>
                  <span className="text-[11px] text-outline">cm</span>
                </div>
                <span className="text-[11px] text-primary-fixed font-bold">
                  {m.deltaCm < 0 ? `${m.deltaCm} cm` : `${m.deltaCm} cm`}
                </span>
                <span className="text-[10px] text-outline mt-0.5">{m.sublabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lean Mass Preservation Telemetry: Compound Lifts Strength */}
      <div className="bg-surface-container border border-surface-container-high rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-on-surface leading-snug">Retenção de Força Neural</h2>
            <p className="text-[12px] text-secondary">Garante perda exclusiva de tecido adiposo</p>
          </div>
          <span className="material-symbols-outlined text-primary-fixed text-[22px]">offline_bolt</span>
        </div>

        <div className="flex flex-col gap-2 mt-0.5">
          {STRENGTH_RECORDS.map((rec) => (
            <div
              key={rec.exercise}
              className="flex items-center justify-between bg-surface-dim p-2.5 rounded-xl border border-surface-container-high/60"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[16px]">sports_gymnastics</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-on-surface leading-tight">{rec.exercise}</span>
                  <span className="text-[11px] text-secondary">{rec.details}</span>
                </div>
              </div>
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  rec.isPositive
                    ? 'bg-primary-fixed/15 text-primary-fixed border border-primary-fixed/30'
                    : 'bg-surface-container-high text-secondary'
                }`}
              >
                {rec.isPositive && (
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                )}
                <span>{rec.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subjective Biofeedback Check-in */}
      <div className="bg-surface-container border border-surface-container-high rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-on-surface">Biofeedback &amp; Bem-Estar</h2>
          <span className="text-[11px] text-primary-fixed font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">check_circle</span> Registrado
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {BIOFEEDBACK_ITEMS.map((item) => (
            <div
              key={item.title}
              className="bg-surface-dim p-2.5 rounded-xl flex flex-col gap-1.5 border border-surface-container-high/60"
            >
              <div className="flex items-center justify-between text-secondary">
                <span className="text-[11px] font-semibold">{item.title}</span>
                <span className="text-[11px] font-bold text-on-surface">{item.score}</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: item.maxBars }).map((_, bIdx) => (
                  <div
                    key={bIdx}
                    className={`h-1.5 flex-1 rounded ${
                      bIdx < item.bars ? 'bg-primary-fixed' : 'bg-surface-container-high'
                    }`}
                  />
                ))}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  item.highlight ? 'text-primary-fixed font-bold' : 'text-outline'
                }`}
              >
                {item.statusText}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Standardized Photo Comparison Teaser */}
      <div className="bg-surface-container border border-surface-container-high rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-on-surface leading-tight">
              Registro Fotográfico Padronizado
            </h2>
            <p className="text-[11px] text-secondary">Mesma iluminação, horário em jejum e distância</p>
          </div>
          <button
            onClick={onOpenPhotoCompare}
            className="text-[11px] font-bold text-primary-fixed hover:underline bg-surface-container-high px-2.5 py-1 rounded-full border border-surface-container-highest"
          >
            Semana 1 vs 6 ↗
          </button>
        </div>

        <div
          onClick={onOpenPhotoCompare}
          className="grid grid-cols-2 gap-2.5 cursor-pointer group"
        >
          {/* Week 1 photo */}
          <div className="relative rounded-xl overflow-hidden h-44 bg-surface-container-lowest border border-surface-container-high group-hover:border-surface-container-highest transition-all">
            <img
              src={BRAND_ASSETS.photoWeek1}
              alt="Semana 01"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 flex flex-col">
              <span className="text-[12px] font-bold text-on-surface">Semana 01</span>
              <span className="text-[10px] text-secondary">87,8 kg • 19% BF</span>
            </div>
          </div>

          {/* Week 6 photo */}
          <div className="relative rounded-xl overflow-hidden h-44 bg-surface-container-lowest border border-primary-fixed/40 group-hover:border-primary-fixed transition-all">
            <img
              src={BRAND_ASSETS.photoWeek6}
              alt="Semana 06"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold tracking-wider">
              ATUAL
            </div>
            <div className="absolute bottom-2 left-2 flex flex-col">
              <span className="text-[12px] font-bold text-primary-fixed">Semana 06</span>
              <span className="text-[10px] text-on-surface">84,2 kg • 15.2% BF</span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-center text-outline">
          Toque para abrir comparador com controle deslizante
        </p>
      </div>

      {/* Primary CTA: Weekly Protocol Check-in */}
      <div className="w-full pt-1">
        <button
          id="btn-checkin"
          onClick={onOpenCheckIn}
          className="w-full h-[54px] rounded-full bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed text-[15px] font-extrabold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(197,244,0,0.35)] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[24px]">photo_camera</span>
          <span>Novo Check-in com Fotos</span>
        </button>
        <p className="text-[11px] text-center text-outline mt-2">
          Próximo ciclo de reavaliação recomendado em 7 dias
        </p>
      </div>
    </div>
  );
};
