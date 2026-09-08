import React from 'react';
import { TabType } from '../types';
import { BRAND_ASSETS } from '../data/mockData';

interface HeaderProps {
  currentTab: TabType;
  profileName: string;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  profileName,
  onOpenNotifications,
  onOpenProfile
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'inicio':
        return 'Início';
      case 'dieta':
        return 'Dieta';
      case 'treino':
        return 'Treino';
      case 'evolucao':
        return 'Evolução';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 pt-safe bg-[#0c0e12]/90 backdrop-blur-xl border-b border-[#282a2e]/60 shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        {/* Brand Mark & View Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#c5f400] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(197,244,0,0.35)]">
            <span
              className="material-symbols-outlined text-[20px] text-[#161e00]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5f400] leading-none">
              GOFIT
            </span>
            <h1 className="text-[18px] font-bold tracking-tight text-[#e2e2e8] leading-tight mt-0.5">
              {getTabTitle()}
            </h1>
          </div>
        </div>

        {/* Action Controls: Notifications & Profile */}
        <div className="flex items-center gap-2.5">
          <button
            id="header-notification-btn"
            onClick={onOpenNotifications}
            aria-label="Notificações e Alertas"
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#1e2024] text-[#c2c6d2] hover:text-white transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#c5f400] ring-2 ring-[#0c0e12] animate-pulse" />
          </button>

          <button
            id="header-profile-btn"
            onClick={onOpenProfile}
            aria-label="Perfil do Atleta"
            className="relative flex items-center justify-center p-0.5 rounded-full bg-[#1e2024] hover:ring-2 hover:ring-[#c5f400] transition-all active:scale-95"
          >
            <img
              alt={`Perfil de ${profileName}`}
              className="w-8 h-8 rounded-full object-cover"
              src={BRAND_ASSETS.avatar}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
