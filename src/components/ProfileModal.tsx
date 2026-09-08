import React from 'react';
import { BRAND_ASSETS } from '../data/mockData';
import { GeneratedPlan } from '../types';
import { ThemeMode } from '../services/theme';

interface ProfileModalProps {
  isOpen: boolean;
  plan: GeneratedPlan;
  avatarUrl?: string | null;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onClose: () => void;
  onRegenerateRequest: () => void;
  onSignOut: () => void;
}

const GOAL_LABEL: Record<GeneratedPlan['profile']['goal'], string> = {
  perder_peso: 'Perda de Peso',
  ganhar_massa: 'Ganho de Massa',
  recomposicao: 'Recomposição Corporal'
};

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  plan,
  avatarUrl,
  theme,
  onThemeChange,
  onClose,
  onRegenerateRequest,
  onSignOut
}) => {
  if (!isOpen) return null;

  const trainingDays = plan.week.filter((d) => !d.isRestDay).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-container border border-surface-container-high rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
          <div className="flex items-center gap-3">
            <img
              alt={plan.profile.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-fixed"
              src={avatarUrl || BRAND_ASSETS.avatar}
            />
            <div className="flex flex-col">
              <h3 className="text-[18px] font-bold text-on-surface">{plan.profile.name}</h3>
              <span className="text-[12px] text-primary-fixed font-semibold">{GOAL_LABEL[plan.profile.goal]}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Biometrics Matrix */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high/60">
            <span className="text-[10px] uppercase text-secondary tracking-wider">Peso Atual</span>
            <div className="text-[18px] font-bold text-on-surface mt-0.5">{plan.profile.weightKg} kg</div>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high/60">
            <span className="text-[10px] uppercase text-secondary tracking-wider">IMC</span>
            <div className="text-[18px] font-bold text-on-surface mt-0.5">{plan.profile.bmi}</div>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high/60">
            <span className="text-[10px] uppercase text-secondary tracking-wider">Estatura</span>
            <div className="text-[18px] font-bold text-on-surface mt-0.5">{plan.profile.heightCm} cm</div>
          </div>
        </div>

        {/* Metabolic Targets */}
        <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container-high/60 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary-fixed text-[16px]">local_fire_department</span>
              Equações Metabólicas (Mifflin-St Jeor)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm pt-1">
            <div className="flex flex-col bg-surface-container-high/50 p-2 rounded-lg">
              <span className="text-[11px] text-secondary">Taxa Metabólica Basal</span>
              <span className="text-[15px] font-bold text-on-surface">{plan.diet.tmb} kcal</span>
            </div>
            <div className="flex flex-col bg-surface-container-high/50 p-2 rounded-lg">
              <span className="text-[11px] text-secondary">Gasto Total (GET)</span>
              <span className="text-[15px] font-bold text-on-surface">{plan.diet.get} kcal</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-primary-fixed font-medium pt-1 border-t border-surface-container-high">
            <span>Meta Diária</span>
            <span>{plan.diet.calorieTarget.toLocaleString('pt-BR')} kcal</span>
          </div>
        </div>

        {/* Protocol Specs */}
        <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container-high/60 flex flex-col gap-2 text-xs">
          <div className="text-on-surface font-bold text-[13px] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-tertiary-fixed-dim text-[16px]">verified</span>
            Parâmetros do Treinador (Gerado por IA)
          </div>
          <ul className="flex flex-col gap-1.5 text-secondary">
            <li className="flex items-center justify-between">
              <span>Divisão Semanal:</span>
              <strong className="text-on-surface">{trainingDays}x / semana</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>Nível de atividade:</span>
              <strong className="text-on-surface capitalize">{plan.profile.activityLevel.replace('_', ' ')}</strong>
            </li>
          </ul>
          <p className="text-secondary leading-relaxed pt-1 border-t border-surface-container-high">{plan.coachSummary}</p>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between bg-surface-container-low p-1 rounded-full border border-surface-container-high/60">
          <button
            onClick={() => onThemeChange('dark')}
            className={`flex-1 h-9 rounded-full text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors ${
              theme === 'dark' ? 'bg-primary-fixed text-on-primary-fixed' : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">dark_mode</span>
            Escuro
          </button>
          <button
            onClick={() => onThemeChange('light')}
            className={`flex-1 h-9 rounded-full text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors ${
              theme === 'light' ? 'bg-primary-fixed text-on-primary-fixed' : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">light_mode</span>
            Claro
          </button>
        </div>

        <button
          onClick={onRegenerateRequest}
          className="w-full h-11 rounded-full bg-surface-container-high hover:bg-surface-container-highest border border-surface-container-highest text-on-surface font-bold text-[13px] flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Gerar Novo Plano
        </button>

        <button
          onClick={onSignOut}
          className="w-full h-11 rounded-full bg-transparent hover:bg-error-container/10 border border-error-container/40 text-error font-bold text-[13px] flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sair da Conta
        </button>

        <button
          onClick={onClose}
          className="w-full h-11 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-[14px] hover:bg-primary-fixed-dim transition-colors"
        >
          Fechar Perfil
        </button>
      </div>
    </div>
  );
};
