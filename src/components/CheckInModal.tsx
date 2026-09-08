import React, { useState } from 'react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCheckin: (weight: number, waist: number) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose, onSaveCheckin }) => {
  const [weight, setWeight] = useState(84.2);
  const [waist, setWaist] = useState(88);
  const [hunger, setHunger] = useState(3);
  const [energy, setEnergy] = useState(4);
  const [sleep, setSleep] = useState(4);
  const [photoSelected, setPhotoSelected] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSaveCheckin(weight, waist);
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-container border border-surface-container-high rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed text-[22px]">photo_camera</span>
            <div>
              <h3 className="text-[17px] font-bold text-on-surface leading-tight">Novo Check-in Semanal</h3>
              <p className="text-[11px] text-secondary">Registro de peso em jejum, circunferências e fotos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed shadow-[0_0_24px_#c5f400]">
              <span className="material-symbols-outlined text-[32px] font-bold">check</span>
            </div>
            <h4 className="text-[18px] font-bold text-on-surface">Check-in Processado!</h4>
            <p className="text-[13px] text-secondary max-w-xs">
              Algoritmo calibrado. Déficit de -20% validado para os próximos 7 dias.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Weight & Waist inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 bg-surface-container-low p-3 rounded-xl border border-surface-container-high">
                <label className="text-[11px] text-secondary font-semibold">Peso Hoje (kg)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-transparent text-[20px] font-bold text-on-surface focus:outline-none tabular-nums"
                  />
                  <span className="text-[12px] text-outline">kg</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 bg-surface-container-low p-3 rounded-xl border border-surface-container-high">
                <label className="text-[11px] text-secondary font-semibold">Cintura Umbilical</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.5"
                    value={waist}
                    onChange={(e) => setWaist(Number(e.target.value))}
                    className="w-full bg-transparent text-[20px] font-bold text-on-surface focus:outline-none tabular-nums"
                  />
                  <span className="text-[12px] text-outline">cm</span>
                </div>
              </div>
            </div>

            {/* Subjective Biofeedback ratings */}
            <div className="flex flex-col gap-2 bg-surface-container-low p-3 rounded-xl border border-surface-container-high">
              <span className="text-[12px] font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary-fixed text-[16px]">monitor_heart</span>
                Biofeedback Subjetivo
              </span>

              {/* Hunger */}
              <div className="flex items-center justify-between text-[12px] pt-1">
                <span className="text-secondary">Fome na semana:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setHunger(lvl)}
                      className={`w-6 h-6 rounded text-[11px] font-bold transition-all ${
                        hunger >= lvl ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-secondary'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy */}
              <div className="flex items-center justify-between text-[12px] pt-1">
                <span className="text-secondary">Disposição nos treinos:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setEnergy(lvl)}
                      className={`w-6 h-6 rounded text-[11px] font-bold transition-all ${
                        energy >= lvl ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-secondary'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep */}
              <div className="flex items-center justify-between text-[12px] pt-1">
                <span className="text-secondary">Qualidade do sono:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setSleep(lvl)}
                      className={`w-6 h-6 rounded text-[11px] font-bold transition-all ${
                        sleep >= lvl ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-secondary'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Photo Capture Section */}
            <div
              onClick={() => setPhotoSelected(!photoSelected)}
              className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                photoSelected
                  ? 'border-primary-fixed bg-primary-fixed/10 text-primary-fixed'
                  : 'border-outline-variant bg-surface-container-low hover:border-primary-fixed text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[28px]">
                {photoSelected ? 'task_alt' : 'add_a_photo'}
              </span>
              <div className="text-center">
                <div className="text-[13px] font-bold">
                  {photoSelected ? '3 Fotos Anexadas (Frente, Costas, Lado)' : 'Adicionar Fotos da Semana'}
                </div>
                <div className="text-[11px] opacity-80">
                  {photoSelected ? 'Pronto para enviar' : 'Toque para selecionar ou capturar fotos em jejum'}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-[14px] hover:bg-primary-fixed-dim transition-transform active:scale-98 shadow-md"
            >
              Confirmar Check-in da Semana
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
