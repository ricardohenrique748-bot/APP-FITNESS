import React from 'react';
import { BRAND_ASSETS } from '../data/mockData';
import { GeneratedPlan } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  plan: GeneratedPlan;
  onClose: () => void;
  onRegenerateRequest: () => void;
  onSignOut: () => void;
}

const GOAL_LABEL: Record<GeneratedPlan['profile']['goal'], string> = {
  perder_peso: 'Perda de Peso',
  ganhar_massa: 'Ganho de Massa',
  recomposicao: 'Recomposição Corporal'
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, plan, onClose, onRegenerateRequest, onSignOut }) => {
  if (!isOpen) return null;

  const trainingDays = plan.week.filter((d) => !d.isRestDay).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1e2024] border border-[#282a2e] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#282a2e] pb-3">
          <div className="flex items-center gap-3">
            <img
              alt={plan.profile.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#c5f400]"
              src={BRAND_ASSETS.avatar}
            />
            <div className="flex flex-col">
              <h3 className="text-[18px] font-bold text-white">{plan.profile.name}</h3>
              <span className="text-[12px] text-[#c5f400] font-semibold">{GOAL_LABEL[plan.profile.goal]}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#282a2e] flex items-center justify-center text-[#c2c6d2] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Biometrics Matrix */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#1a1c20] p-2.5 rounded-xl border border-[#282a2e]/60">
            <span className="text-[10px] uppercase text-[#c2c6d2] tracking-wider">Peso Atual</span>
            <div className="text-[18px] font-bold text-white mt-0.5">{plan.profile.weightKg} kg</div>
          </div>
          <div className="bg-[#1a1c20] p-2.5 rounded-xl border border-[#282a2e]/60">
            <span className="text-[10px] uppercase text-[#c2c6d2] tracking-wider">IMC</span>
            <div className="text-[18px] font-bold text-white mt-0.5">{plan.profile.bmi}</div>
          </div>
          <div className="bg-[#1a1c20] p-2.5 rounded-xl border border-[#282a2e]/60">
            <span className="text-[10px] uppercase text-[#c2c6d2] tracking-wider">Estatura</span>
            <div className="text-[18px] font-bold text-white mt-0.5">{plan.profile.heightCm} cm</div>
          </div>
        </div>

        {/* Metabolic Targets */}
        <div className="bg-[#1a1c20] p-3.5 rounded-xl border border-[#282a2e]/60 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#c5f400] text-[16px]">local_fire_department</span>
              Equações Metabólicas (Mifflin-St Jeor)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm pt-1">
            <div className="flex flex-col bg-[#282a2e]/50 p-2 rounded-lg">
              <span className="text-[11px] text-[#c2c6d2]">Taxa Metabólica Basal</span>
              <span className="text-[15px] font-bold text-white">{plan.diet.tmb} kcal</span>
            </div>
            <div className="flex flex-col bg-[#282a2e]/50 p-2 rounded-lg">
              <span className="text-[11px] text-[#c2c6d2]">Gasto Total (GET)</span>
              <span className="text-[15px] font-bold text-white">{plan.diet.get} kcal</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#c5f400] font-medium pt-1 border-t border-[#282a2e]">
            <span>Meta Diária</span>
            <span>{plan.diet.calorieTarget.toLocaleString('pt-BR')} kcal</span>
          </div>
        </div>

        {/* Protocol Specs */}
        <div className="bg-[#1a1c20] p-3.5 rounded-xl border border-[#282a2e]/60 flex flex-col gap-2 text-xs">
          <div className="text-white font-bold text-[13px] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#7bd0ff] text-[16px]">verified</span>
            Parâmetros do Treinador (Gerado por IA)
          </div>
          <ul className="flex flex-col gap-1.5 text-[#c2c6d2]">
            <li className="flex items-center justify-between">
              <span>Divisão Semanal:</span>
              <strong className="text-white">{trainingDays}x / semana</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>Nível de atividade:</span>
              <strong className="text-white capitalize">{plan.profile.activityLevel.replace('_', ' ')}</strong>
            </li>
          </ul>
          <p className="text-[#c2c6d2] leading-relaxed pt-1 border-t border-[#282a2e]">{plan.coachSummary}</p>
        </div>

        <button
          onClick={onRegenerateRequest}
          className="w-full h-11 rounded-full bg-[#282a2e] hover:bg-[#333539] border border-[#333539] text-white font-bold text-[13px] flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Gerar Novo Plano
        </button>

        <button
          onClick={onSignOut}
          className="w-full h-11 rounded-full bg-transparent hover:bg-[#93000a]/10 border border-[#93000a]/40 text-[#ffb4ab] font-bold text-[13px] flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sair da Conta
        </button>

        <button
          onClick={onClose}
          className="w-full h-11 rounded-full bg-[#c5f400] text-[#161e00] font-bold text-[14px] hover:bg-[#acd600] transition-colors"
        >
          Fechar Perfil
        </button>
      </div>
    </div>
  );
};
