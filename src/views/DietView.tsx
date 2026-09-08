import React, { useState } from 'react';
import { DietPlan } from '../types';

interface DietViewProps {
  diet: DietPlan;
  onOpenShoppingList: () => void;
}

export const DietView: React.FC<DietViewProps> = ({ diet, onOpenShoppingList }) => {
  const [showFreeMealInfo, setShowFreeMealInfo] = useState(false);

  const proteinKcal = diet.protein.target * 4;
  const carbsKcal = diet.carbs.target * 4;
  const fatsKcal = diet.fats.target * 9;
  const macroKcalTotal = proteinKcal + carbsKcal + fatsKcal || 1;
  const proteinPct = (proteinKcal / macroKcalTotal) * 100;
  const carbsPct = (carbsKcal / macroKcalTotal) * 100;
  const fatsPct = (fatsKcal / macroKcalTotal) * 100;

  return (
    <div className="flex flex-col w-full px-4 gap-5 pb-8 animate-in fade-in duration-200">
      {/* Overview Card: Macro Telemetry */}
      <section className="flex flex-col bg-surface-container border border-surface-container-high rounded-2xl p-4 gap-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-primary-fixed font-bold">
              Metabolismo &amp; Aporte Diário
            </span>
            <span className="text-[24px] font-extrabold text-on-surface tracking-tight leading-snug">
              {diet.calorieTarget.toLocaleString('pt-BR')} <span className="text-[13px] text-secondary font-normal">kcal/dia</span>
            </span>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-high px-3 py-1 rounded-full border border-surface-container-highest">
            <span className="material-symbols-outlined text-[16px] text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
              sync
            </span>
            <span className="text-[11px] text-on-surface font-bold">Plano IA</span>
          </div>
        </div>

        {/* Segmented Energy Bar */}
        <div className="w-full flex h-2 rounded-full overflow-hidden bg-surface-container-highest gap-0.5">
          <div className="h-full bg-primary-fixed" style={{ width: `${proteinPct}%` }} title={`Proteína (${proteinPct.toFixed(0)}%)`} />
          <div className="h-full bg-tertiary-fixed-dim" style={{ width: `${carbsPct}%` }} title={`Carboidrato (${carbsPct.toFixed(0)}%)`} />
          <div className="h-full bg-secondary-fixed" style={{ width: `${fatsPct}%` }} title={`Gordura (${fatsPct.toFixed(0)}%)`} />
        </div>

        {/* Macronutrient Breakdown */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="flex flex-col items-center bg-surface-container-high/70 rounded-xl py-2 px-1 border border-surface-container-highest/30">
            <span className="text-[10px] text-secondary uppercase font-bold">Proteína</span>
            <span className="text-[18px] font-extrabold text-primary-fixed leading-tight">
              {diet.protein.target}<span className="text-[12px]">g</span>
            </span>
            <span className="text-[10px] text-outline font-medium">{diet.protein.perKg}</span>
          </div>

          <div className="flex flex-col items-center bg-surface-container-high/70 rounded-xl py-2 px-1 border border-surface-container-highest/30">
            <span className="text-[10px] text-secondary uppercase font-bold">Carbo</span>
            <span className="text-[18px] font-extrabold text-on-surface leading-tight">
              {diet.carbs.target}<span className="text-[12px]">g</span>
            </span>
            <span className="text-[10px] text-outline font-medium">{diet.carbs.perKg}</span>
          </div>

          <div className="flex flex-col items-center bg-surface-container-high/70 rounded-xl py-2 px-1 border border-surface-container-highest/30">
            <span className="text-[10px] text-secondary uppercase font-bold">Gordura</span>
            <span className="text-[18px] font-extrabold text-on-surface leading-tight">
              {diet.fats.target}<span className="text-[12px]">g</span>
            </span>
            <span className="text-[10px] text-outline font-medium">{diet.fats.perKg}</span>
          </div>

          <div className="flex flex-col items-center bg-surface-container-high/70 rounded-xl py-2 px-1 border border-surface-container-highest/30">
            <span className="text-[10px] text-secondary uppercase font-bold">Fibras</span>
            <span className="text-[18px] font-extrabold text-on-surface leading-tight">
              {diet.fibers.target}<span className="text-[12px]">g</span>
            </span>
            <span className="text-[10px] text-primary-fixed font-bold">Meta</span>
          </div>
        </div>
      </section>

      {/* Meal Timeline */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[16px] font-bold text-on-surface">Cardápio do Dia</h3>
        {diet.meals.map((meal) => (
          <article
            key={meal.id}
            className="flex flex-col bg-surface-container border border-surface-container-high rounded-2xl overflow-hidden shadow-md"
          >
            {/* Header banner */}
            {meal.imageUrl ? (
              <div className="relative h-40 w-full bg-surface-container-high">
                <img src={meal.imageUrl} alt={meal.imageAlt} className="w-full h-full object-cover" />
                {/* Fixed dark scrim for photo caption legibility — stays dark in both themes */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md text-primary-fixed text-[11px] font-bold">
                    {meal.time}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md text-white text-[11px] font-medium">
                    {meal.kcal} kcal
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-4 right-4 flex justify-between items-end gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-secondary font-bold line-clamp-1">
                      {meal.subtitle}
                    </span>
                    <h2 className="text-[18px] font-extrabold text-white leading-tight">{meal.title}</h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/20 text-primary-fixed text-[12px] font-extrabold border border-primary-fixed/30 shrink-0">
                    {meal.proteinGrams}g P
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 p-4 pb-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-primary-fixed text-[11px] font-bold">
                      {meal.time}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-secondary text-[11px] font-medium">
                      {meal.kcal} kcal
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/20 text-primary-fixed text-[12px] font-extrabold border border-primary-fixed/30 shrink-0">
                    {meal.proteinGrams}g P
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-outline font-bold">
                    {meal.subtitle}
                  </span>
                  <h2 className="text-[18px] font-extrabold text-on-surface leading-tight mt-0.5">{meal.title}</h2>
                </div>
              </div>
            )}

            {/* Ingredients */}
            <div className="p-4 flex flex-col gap-3">
              <ul className="flex flex-col gap-2 text-[13px] text-on-surface">
                {meal.ingredients.map((ing, iIdx) => (
                  <li key={iIdx} className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        iIdx === 0 ? 'bg-primary-fixed' : 'bg-secondary'
                      }`}
                    />
                    <span>
                      <strong className="font-semibold text-on-surface">{ing.boldText}</strong>{' '}
                      <span className="text-secondary">{ing.description}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {meal.tip && (
                <div className="flex items-center gap-2 bg-surface-container-high/70 px-3 py-2 rounded-xl border border-surface-container-highest/60">
                  <span className="material-symbols-outlined text-[18px] text-primary-fixed shrink-0">kitchen</span>
                  <span className="text-[12px] text-on-surface leading-snug">{meal.tip.text}</span>
                </div>
              )}

              {meal.substitution && (
                <div className="mt-1 bg-surface-container-high/40 rounded-xl p-3 border border-surface-container-highest/40 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-secondary">
                    <span className="text-[11px] uppercase tracking-wider flex items-center gap-1 text-primary-fixed font-bold">
                      <span className="material-symbols-outlined text-[14px]">swap_horizontal_circle</span>{' '}
                      {meal.substitution.title}
                    </span>
                    <span className="text-[11px] text-outline font-medium">{meal.substitution.macros}</span>
                  </div>
                  <p className="text-[12px] text-on-surface leading-relaxed">{meal.substitution.description}</p>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Action Cards */}
      <section className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-high border border-surface-container-highest">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-primary-fixed border border-surface-container-highest">
              <span className="material-symbols-outlined text-[22px]">event_available</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-on-surface">Refeição Livre</span>
              <span className="text-[12px] text-secondary">Uma vez por semana, com moderação</span>
            </div>
          </div>
          <button
            onClick={() => setShowFreeMealInfo(true)}
            aria-label="Detalhes da refeição livre"
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-highest flex items-center justify-center text-on-surface hover:text-primary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>

        <button
          onClick={onOpenShoppingList}
          className="w-full h-14 rounded-full bg-primary-fixed text-on-primary-fixed font-extrabold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_24px_rgba(197,244,0,0.35)]"
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            shopping_cart
          </span>
          <span>Lista de Compras (Feira &amp; Mercado)</span>
        </button>
      </section>

      {/* Free Meal Info Modal */}
      {showFreeMealInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-surface-container border border-surface-container-high rounded-2xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed text-[22px]">restaurant</span>
                <h3 className="text-[17px] font-bold text-on-surface">Estratégia de Refeição Livre</h3>
              </div>
              <button
                onClick={() => setShowFreeMealInfo(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary hover:text-on-surface"
              >
                ✕
              </button>
            </div>
            <p className="text-[13px] text-secondary leading-relaxed">
              Uma refeição livre semanal, com moderação, ajuda na aderência a longo prazo sem comprometer o resultado.
            </p>
            <button
              onClick={() => setShowFreeMealInfo(false)}
              className="w-full py-2.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-[13px] hover:bg-primary-fixed-dim"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
