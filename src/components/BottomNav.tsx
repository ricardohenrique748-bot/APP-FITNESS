import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'inicio' as TabType, label: 'Início', icon: 'dashboard' },
    { id: 'dieta' as TabType, label: 'Dieta', icon: 'restaurant' },
    { id: 'treino' as TabType, label: 'Treino', icon: 'fitness_center' },
    { id: 'evolucao' as TabType, label: 'Evolução', icon: 'monitoring' }
  ];

  return (
    <nav
      id="main-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 w-full z-40 pb-safe bg-[#0c0e12]/92 backdrop-blur-xl border-t border-[#282a2e]/70 shadow-[0_-2px_16px_rgba(0,0,0,0.4)]"
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-1 transition-all duration-200 select-none ${
                isActive
                  ? 'text-[#c5f400] font-bold scale-105'
                  : 'text-[#c2c6d2] hover:text-[#e2e2e8]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#c5f400] shadow-[0_0_8px_#c5f400]" />
                )}
              </div>
              <span className="text-[11px] tracking-wide leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
