import React from 'react';
import { Dumbbell, LayoutDashboard, LineChart, UtensilsCrossed } from 'lucide-react';
import { TabType } from '../types';
import { cn } from '../lib/utils';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

const TABS: { id: TabType; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: 'inicio', label: 'Início', Icon: LayoutDashboard },
  { id: 'dieta', label: 'Dieta', Icon: UtensilsCrossed },
  { id: 'treino', label: 'Treino', Icon: Dumbbell },
  { id: 'evolucao', label: 'Evolução', Icon: LineChart }
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  return (
    <nav
      id="main-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 w-full z-40 pb-safe bg-surface-container-lowest/92 backdrop-blur-xl border-t border-surface-container-high/70 shadow-[0_-2px_16px_rgba(0,0,0,0.4)]"
    >
      <div className="max-w-md mx-auto flex items-stretch justify-around h-16 px-1">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = currentTab === id;
          return (
            <button
              key={id}
              id={`nav-tab-${id}`}
              onClick={() => onSelectTab(id)}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center justify-center flex-1 gap-1 min-h-[44px] select-none active:scale-95 transition-transform"
            >
              <Icon
                className={cn('w-6 h-6 transition-colors', isActive ? 'text-primary-fixed' : 'text-secondary')}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  'text-[11px] tracking-wide leading-none transition-colors',
                  isActive ? 'text-primary-fixed font-bold' : 'text-secondary'
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
