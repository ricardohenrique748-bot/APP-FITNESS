import React, { useState } from 'react';
import { ActivityLevel, GeneratedPlan, Goal, Sex, UserProfileInput } from '../types';
import { generatePlan } from '../services/planGenerator';

interface OnboardingViewProps {
  initialValues?: UserProfileInput;
  onGenerated: (plan: GeneratedPlan) => void;
}

const DEFAULT_FORM: UserProfileInput = {
  name: '',
  sex: 'masculino',
  age: 28,
  weightKg: 80,
  heightCm: 175,
  activityLevel: 'moderado',
  goal: 'perder_peso',
  restrictions: ''
};

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentario', label: 'Sedentário (pouco ou nenhum exercício)' },
  { value: 'leve', label: 'Leve (1-3 dias/semana)' },
  { value: 'moderado', label: 'Moderado (3-5 dias/semana)' },
  { value: 'ativo', label: 'Ativo (6-7 dias/semana)' },
  { value: 'muito_ativo', label: 'Muito ativo (treino diário intenso)' }
];

const GOAL_OPTIONS: { value: Goal; label: string; icon: string }[] = [
  { value: 'perder_peso', label: 'Perder peso', icon: 'trending_down' },
  { value: 'ganhar_massa', label: 'Ganhar massa', icon: 'trending_up' },
  { value: 'recomposicao', label: 'Recomposição', icon: 'sync' }
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({ initialValues, onGenerated }) => {
  const [form, setForm] = useState<UserProfileInput>(initialValues ?? DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof UserProfileInput>(key: K, value: UserProfileInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isValid =
    form.name.trim().length > 0 &&
    form.age >= 14 &&
    form.age <= 90 &&
    form.weightKg >= 30 &&
    form.weightKg <= 300 &&
    form.heightCm >= 100 &&
    form.heightCm <= 250;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generatePlan(form);
      onGenerated(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado ao gerar o plano.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface-container-lowest text-on-surface flex flex-col items-center justify-start selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div className="w-full max-w-md min-h-screen flex flex-col relative bg-surface-container-lowest border-x border-surface-container-high/40 shadow-2xl px-5 pt-10 pb-10">
        <div className="flex flex-col gap-1.5 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary-fixed">GOFIT</span>
          <h1 className="text-[26px] font-extrabold text-on-surface tracking-tight leading-tight">
            Vamos montar seu plano
          </h1>
          <p className="text-[13px] text-secondary leading-relaxed">
            Conte seus dados atuais e seu objetivo. A IA vai gerar seu calendário de treinos da semana e sua dieta
            personalizada.
          </p>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16">
            <div className="w-14 h-14 rounded-full border-4 border-surface-container-high border-t-primary-fixed animate-spin" />
            <p className="text-[14px] text-on-surface font-semibold text-center">Montando seu plano...</p>
            <p className="text-[12px] text-outline text-center max-w-xs">
              Calculando metabolismo, macros, treino semanal e cardápio. Isso pode levar alguns segundos.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Nome */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-secondary uppercase tracking-wider">Nome</label>
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Como podemos te chamar?"
                className="h-12 rounded-xl bg-surface-container border border-surface-container-high px-4 text-[14px] text-on-surface placeholder:text-placeholder focus:outline-none focus:border-primary-fixed transition-colors"
              />
            </div>

            {/* Sexo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-secondary uppercase tracking-wider">Sexo biológico</label>
              <div className="grid grid-cols-2 gap-2">
                {(['masculino', 'feminino'] as Sex[]).map((sex) => (
                  <button
                    key={sex}
                    type="button"
                    onClick={() => update('sex', sex)}
                    className={`h-11 rounded-xl text-[13px] font-bold capitalize transition-all border ${
                      form.sex === sex
                        ? 'bg-primary-fixed text-on-primary-fixed border-primary-fixed'
                        : 'bg-surface-container text-secondary border-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    {sex}
                  </button>
                ))}
              </div>
            </div>

            {/* Idade, Peso, Altura */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-secondary uppercase tracking-wider">Idade</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => update('age', Number(e.target.value))}
                  className="h-12 rounded-xl bg-surface-container border border-surface-container-high px-2.5 text-[14px] text-on-surface text-center focus:outline-none focus:border-primary-fixed"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-secondary uppercase tracking-wider">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.weightKg}
                  onChange={(e) => update('weightKg', Number(e.target.value))}
                  className="h-12 rounded-xl bg-surface-container border border-surface-container-high px-2.5 text-[14px] text-on-surface text-center focus:outline-none focus:border-primary-fixed"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-secondary uppercase tracking-wider">Altura (cm)</label>
                <input
                  type="number"
                  value={form.heightCm}
                  onChange={(e) => update('heightCm', Number(e.target.value))}
                  className="h-12 rounded-xl bg-surface-container border border-surface-container-high px-2.5 text-[14px] text-on-surface text-center focus:outline-none focus:border-primary-fixed"
                />
              </div>
            </div>

            {/* Nível de atividade */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-secondary uppercase tracking-wider">
                Nível de atividade atual
              </label>
              <select
                value={form.activityLevel}
                onChange={(e) => update('activityLevel', e.target.value as ActivityLevel)}
                className="h-12 rounded-xl bg-surface-container border border-surface-container-high px-3 text-[13px] text-on-surface focus:outline-none focus:border-primary-fixed"
              >
                {ACTIVITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Objetivo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-secondary uppercase tracking-wider">Objetivo</label>
              <div className="grid grid-cols-3 gap-2">
                {GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update('goal', opt.value)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-[11px] font-bold text-center transition-all border ${
                      form.goal === opt.value
                        ? 'bg-primary-fixed text-on-primary-fixed border-primary-fixed'
                        : 'bg-surface-container text-secondary border-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Restrições */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-secondary uppercase tracking-wider">
                Restrições alimentares (opcional)
              </label>
              <textarea
                value={form.restrictions}
                onChange={(e) => update('restrictions', e.target.value)}
                placeholder="Ex: intolerância à lactose, vegetariano, sem frutos do mar..."
                rows={2}
                className="rounded-xl bg-surface-container border border-surface-container-high px-4 py-3 text-[13px] text-on-surface placeholder:text-placeholder focus:outline-none focus:border-primary-fixed resize-none"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-error-container/20 border border-error-container/50 text-on-error-container text-[12px] leading-relaxed">
                <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full h-14 rounded-full bg-primary-fixed text-on-primary-fixed font-extrabold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_24px_rgba(197,244,0,0.35)] disabled:opacity-40 disabled:active:scale-100"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              Gerar meu plano com IA
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
