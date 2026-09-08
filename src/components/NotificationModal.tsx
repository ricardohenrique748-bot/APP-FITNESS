import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      type: 'coach',
      title: 'Taxa Metabólica Calibrada',
      desc: 'Seu peso médio móvel reduziu 0,6% nesta semana. Sem cortes calóricos necessários hoje.',
      time: 'Há 12 min',
      icon: 'insights',
      accent: 'text-primary-fixed'
    },
    {
      id: 'notif-2',
      type: 'meal',
      title: 'Próxima Refeição Sugerida',
      desc: 'Pré-Treino às 16:30 (38g Proteína e 48g Carboidratos recomendados).',
      time: 'Há 45 min',
      icon: 'restaurant_menu',
      accent: 'text-tertiary-fixed-dim'
    },
    {
      id: 'notif-3',
      type: 'workout',
      title: 'Meta de Sobrecarga para Hoje',
      desc: 'Remada Curvada: Alvo 68 kg x 8 reps para liberar incremento de +2 kg na próxima sessão.',
      time: 'Hoje 08:00',
      icon: 'fitness_center',
      accent: 'text-primary-fixed'
    },
    {
      id: 'notif-4',
      type: 'recovery',
      title: 'Prontidão Neuromuscular 94%',
      desc: 'Sono de 7h30m e biofeedback articular excelente. Liberado para carga total.',
      time: 'Hoje 07:00',
      icon: 'health_and_safety',
      accent: 'text-primary-fixed'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-container border border-surface-container-high rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed text-[22px]">notifications</span>
            <h3 className="text-[18px] font-bold text-on-surface">Alertas & Diagnóstico GoFit</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/50"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                <span className={`material-symbols-outlined text-[18px] ${item.accent}`}>{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-on-surface">{item.title}</span>
                  <span className="text-[10px] text-outline">{item.time}</span>
                </div>
                <p className="text-[12px] text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-[13px] transition-colors mt-1"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
