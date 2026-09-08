import React from 'react';
import { Dumbbell, LayoutDashboard, LineChart, UtensilsCrossed } from 'lucide-react';
import { TabType } from '../types';
import { Dock, DockIcon, DockItem } from './ui/dock';
import { cn } from '../lib/utils';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

// DockItem clones every direct child with `width`/`isHovered` motion props (meant for DockIcon).
// This wrapper just swallows them instead of letting them leak onto the DOM <span>.
function TabCaption({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={className}>{children}</span>;
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
      className="fixed bottom-0 left-0 right-0 w-full z-40 pb-safe bg-[#0c0e12]/92 backdrop-blur-xl border-t border-[#282a2e]/70 shadow-[0_-2px_16px_rgba(0,0,0,0.4)]"
    >
      <div className="max-w-md mx-auto flex justify-center">
        <Dock
          className="!bg-transparent !px-0 gap-2"
          panelHeight={64}
          magnification={56}
          distance={110}
        >
          {TABS.map(({ id, label, Icon }) => {
            const isActive = currentTab === id;
            return (
              <DockItem
                key={id}
                id={`nav-tab-${id}`}
                onClick={() => onSelectTab(id)}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'aspect-square rounded-2xl flex-col gap-1',
                  isActive ? 'bg-[#c5f400]/15' : 'bg-transparent hover:bg-[#1e2024]'
                )}
              >
                <DockIcon>
                  <Icon
                    className={cn('h-full w-full', isActive ? 'text-[#c5f400]' : 'text-[#c2c6d2]')}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </DockIcon>
                <TabCaption
                  className={cn(
                    'text-[10px] tracking-wide leading-none pb-1.5',
                    isActive ? 'text-[#c5f400] font-bold' : 'text-[#c2c6d2]'
                  )}
                >
                  {label}
                </TabCaption>
              </DockItem>
            );
          })}
        </Dock>
      </div>
    </nav>
  );
};
