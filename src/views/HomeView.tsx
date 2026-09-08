import React from 'react';
import { BRAND_ASSETS } from '../data/mockData';
import { GeneratedPlan, TabType, WorkoutDayPlan } from '../types';

interface HomeViewProps {
  plan: GeneratedPlan;
  todayWorkout?: WorkoutDayPlan;
  onNavigateTab: (tab: TabType) => void;
  onStartWorkout: () => void;
  waterLevel: number;
  onAddWater: () => void;
}

const GOAL_STRATEGY_LABEL: Record<GeneratedPlan['profile']['goal'], string> = {
  perder_peso: 'Déficit Planejado',
  ganhar_massa: 'Superávit Planejado',
  recomposicao: 'Recomposição Corporal'
};

const todayDateLabel = new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

export const HomeView: React.FC<HomeViewProps> = ({
  plan,
  todayWorkout,
  onNavigateTab,
  onStartWorkout,
  waterLevel,
  onAddWater
}) => {
  const { diet } = plan;
  const macroBars = [
    { label: 'Proteína', value: diet.protein.target, unit: 'g', sub: diet.protein.perKg, color: '#c5f400', dot: 'bg-[#c5f400]' },
    { label: 'Carboidratos', value: diet.carbs.target, unit: 'g', sub: diet.carbs.perKg, color: '#7bd0ff', dot: 'bg-[#7bd0ff]' },
    { label: 'Gorduras', value: diet.fats.target, unit: 'g', sub: diet.fats.perKg, color: '#dee2ef', dot: 'bg-[#dee2ef]' },
    { label: 'Fibras', value: diet.fibers.target, unit: 'g', sub: diet.fibers.perKg, color: '#8e9379', dot: 'bg-[#8e9379]' }
  ];
  const firstMeal = diet.meals[0];
  const totalSets = todayWorkout?.exercises.reduce((acc, ex) => acc + ex.sets.length, 0) ?? 0;

  return (
    <div className="flex flex-col w-full px-4 gap-5 pb-8 animate-in fade-in duration-200">
      {/* Athlete Welcome & Metabolic Phase Badge */}
      <section className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#282a2e] text-[#c5f400] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5f400] animate-pulse" />
              {GOAL_STRATEGY_LABEL[plan.profile.goal]}
            </span>
          </div>
          <span className="text-[11px] text-[#8e9379] uppercase tracking-wider font-semibold capitalize">
            {todayDateLabel}
          </span>
        </div>
        <div className="flex flex-col">
          <h2 className="text-[26px] font-extrabold text-white tracking-tight leading-tight">
            Bom dia, {plan.profile.name}
          </h2>
          <p className="text-[13px] text-[#c2c6d2] mt-0.5">{plan.coachSummary}</p>
        </div>
      </section>

      {/* Energy Balance & Macronutrient Matrix Card */}
      <section className="flex flex-col p-4 rounded-2xl bg-[#1e2024] border border-[#282a2e] shadow-md gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#c2c6d2] font-semibold">
              Meta Calórica
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[32px] font-extrabold text-white tracking-tight tabular-nums">
                {diet.calorieTarget.toLocaleString('pt-BR')}
              </span>
              <span className="text-[14px] text-[#c2c6d2]">kcal/dia</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="px-2 py-0.5 rounded bg-[#333539] text-[#c5f400] text-[11px] font-bold">
              TMB {diet.tmb}
            </span>
            <span className="text-[11px] text-[#c2c6d2] mt-1 font-medium">GET {diet.get} kcal</span>
          </div>
        </div>

        {/* Macros Density Breakdown */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {macroBars.map((macro) => (
            <div key={macro.label} className="flex flex-col p-3 rounded-xl bg-[#282a2e] border border-[#333539]/40">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${macro.dot}`} />
                  <span className="text-[12px] font-bold text-white">{macro.label}</span>
                </div>
                <span className="text-[11px] font-bold" style={{ color: macro.color }}>
                  {macro.sub}
                </span>
              </div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[18px] font-bold text-white tabular-nums">
                  {macro.value}
                  {macro.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Hydration Micro-Track */}
        <div className="flex items-center justify-between pt-1 px-1 border-t border-[#282a2e]">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[#7bd0ff] text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              water_drop
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#c2c6d2]">Hidratação (35ml/kg + treino)</span>
              <span className="text-[14px] text-white font-bold tabular-nums">
                {waterLevel.toFixed(1)}L{' '}
                <span className="font-normal text-[#c2c6d2]">
                  / {((plan.profile.weightKg * 35) / 1000).toFixed(1)}L
                </span>
              </span>
            </div>
          </div>
          <button
            onClick={onAddWater}
            aria-label="Adicionar 250ml de água"
            className="w-9 h-9 rounded-full bg-[#282a2e] hover:bg-[#333539] flex items-center justify-center text-[#c5f400] transition-transform active:scale-90 border border-[#444933]/50 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
      </section>

      {/* Workout of the Day Hero Action Tile */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-white">Treino de Hoje</h3>
          <button
            onClick={() => onNavigateTab('treino')}
            className="text-[12px] font-bold text-[#c5f400] hover:underline flex items-center gap-0.5"
          >
            Ver semana
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#1e2024] border border-[#282a2e] shadow-lg">
          <div className="relative w-full h-44 bg-cover bg-center">
            <img
              src={BRAND_ASSETS.heroWorkout}
              alt={todayWorkout?.focus ?? 'Treino do dia'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e2024] via-[#1e2024]/60 to-transparent" />

            <div className="absolute top-3 left-3 flex gap-1.5">
              <span className="px-2.5 py-1 rounded-md bg-[#0c0e12]/80 backdrop-blur-md text-[#c5f400] text-[11px] uppercase font-bold tracking-wider">
                {todayWorkout?.isRestDay ? 'Descanso' : 'Treino'}
              </span>
            </div>

            <div className="absolute bottom-3 left-4 right-4 flex flex-col">
              <h4 className="text-[20px] font-extrabold text-white drop-shadow-sm leading-tight">
                {todayWorkout?.focus ?? 'Descanso'}
              </h4>
              {!todayWorkout?.isRestDay && (
                <div className="flex items-center gap-2 text-[#c2c6d2] text-[12px] mt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#c5f400]">fitness_center</span>
                    {todayWorkout?.exercises.length ?? 0} exercícios · {totalSets} séries
                  </span>
                </div>
              )}
            </div>
          </div>

          {!todayWorkout?.isRestDay && (
            <div className="flex flex-col p-3.5 gap-3 bg-[#1e2024]">
              <div className="flex items-center justify-between text-[#c2c6d2] text-[11px] px-1 font-medium">
                <span className="truncate pr-2">
                  {todayWorkout?.exercises.map((ex) => ex.title.split(' ')[0]).join(' · ')}
                </span>
              </div>
              <button
                id="start-workout-trigger"
                onClick={onStartWorkout}
                className="w-full h-12 rounded-full bg-[#c5f400] hover:bg-[#acd600] text-[#161e00] text-[14px] font-extrabold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_24px_rgba(197,244,0,0.3)]"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
                Iniciar Treino de Hoje
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Next Scheduled Meal Card */}
      {firstMeal && (
        <section className="flex flex-col p-3.5 rounded-2xl bg-[#1a1c20] border border-[#282a2e] shadow-sm gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1e2024] flex items-center justify-center text-[#c5f400]">
                <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-white">Próxima Refeição: {firstMeal.title}</h4>
                <span className="text-[11px] text-[#c2c6d2]">Sugerido para às {firstMeal.time}</span>
              </div>
            </div>
            <span className="text-[13px] text-[#c5f400] font-extrabold">{firstMeal.kcal} kcal</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1e2024] border border-[#282a2e]/50 text-[#c2c6d2] text-[12px]">
            <span>{firstMeal.ingredients.map((i) => i.boldText).join(' + ')}</span>
            <span className="text-white font-bold shrink-0 ml-2">{firstMeal.proteinGrams}g P</span>
          </div>
        </section>
      )}
    </div>
  );
};
