import React, { useState } from 'react';
import { ExerciseItem, WorkoutDayPlan } from '../types';
import { getExerciseMedia } from '../data/exerciseMedia';

interface WorkoutViewProps {
  week: WorkoutDayPlan[];
  todayIndex: number;
  onStartExecution: (exercises: ExerciseItem[], exerciseIndex?: number) => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({ week, todayIndex, onStartExecution }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex);
  const [showRoutineInfo, setShowRoutineInfo] = useState(false);

  const selectedDay = week[selectedDayIndex];
  const exercises = selectedDay?.exercises ?? [];
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const trainingDaysCount = week.filter((d) => !d.isRestDay).length;

  return (
    <div className="flex flex-col w-full px-4 gap-5 pb-12 animate-in fade-in duration-200">
      {/* Overview Header & Routine Split Badge */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#282a2e] text-[#c5f400] text-[11px] font-extrabold tracking-wider uppercase">
              Divisão {trainingDaysCount}x / semana
            </span>
          </div>
          <button
            onClick={() => setShowRoutineInfo(true)}
            aria-label="Ver semana completa"
            className="w-8 h-8 rounded-full bg-[#1e2024] flex items-center justify-center text-[#c2c6d2] hover:text-white transition-colors border border-[#282a2e]"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          </button>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[#c2c6d2] uppercase tracking-wider font-semibold">
            {selectedDay?.day}
            {selectedDayIndex === todayIndex ? ' · Hoje' : ''}
          </span>
          <h2 className="text-[24px] font-extrabold text-white tracking-tight leading-tight">
            {selectedDay?.focus}
          </h2>
        </div>
      </div>

      {/* Day Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        {week.map((day, idx) => (
          <button
            key={day.day}
            onClick={() => setSelectedDayIndex(idx)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all shrink-0 border ${
              idx === selectedDayIndex
                ? 'bg-[#c5f400] text-[#161e00] border-[#c5f400]'
                : 'bg-[#1e2024] text-[#c2c6d2] border-[#282a2e] hover:text-white'
            }`}
          >
            <span>{day.day.slice(0, 3)}</span>
            {idx === todayIndex && <span className="w-1 h-1 rounded-full bg-current" />}
          </button>
        ))}
      </div>

      {selectedDay?.isRestDay ? (
        <div className="flex flex-col items-center gap-3 py-14 px-6 rounded-2xl bg-[#1a1c20] border border-[#282a2e] text-center">
          <span className="material-symbols-outlined text-[40px] text-[#c5f400]">bedtime</span>
          <h3 className="text-[16px] font-bold text-white">Dia de descanso</h3>
          <p className="text-[12px] text-[#c2c6d2] max-w-xs">
            Sem treino de musculação prescrito. Priorize sono e recuperação.
          </p>
        </div>
      ) : (
        <>
          {/* Hero Telemetry Dashboard */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1a1c20] border border-[#282a2e] shadow-xl p-4 flex flex-col gap-3.5">
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#c5f400]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#282a2e] flex items-center justify-center text-[#c5f400] border border-[#333539]">
                  <span className="material-symbols-outlined text-[20px]">science</span>
                </div>
                <div>
                  <p className="text-[12px] text-white font-bold">Plano gerado por IA</p>
                  <p className="text-[11px] text-[#c2c6d2]">Ajustado ao seu objetivo e nível de atividade</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 z-10 text-center">
              <div className="flex flex-col p-2.5 rounded-xl bg-[#1e2024] border border-[#282a2e]">
                <span className="text-[10px] text-[#c2c6d2] uppercase font-bold">Volume Total</span>
                <div className="flex items-baseline justify-center gap-1 mt-0.5">
                  <span className="text-[18px] text-white font-extrabold">{totalSets}</span>
                  <span className="text-[11px] text-[#8e9379]">séries</span>
                </div>
              </div>

              <div className="flex flex-col p-2.5 rounded-xl bg-[#1e2024] border border-[#282a2e]">
                <span className="text-[10px] text-[#c2c6d2] uppercase font-bold">Exercícios</span>
                <div className="flex items-baseline justify-center gap-1 mt-0.5">
                  <span className="text-[18px] text-white font-extrabold">{exercises.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-white">Sequência de Exercícios</h3>
            <span className="text-[12px] text-[#c5f400] font-bold">{exercises.length} Atividades</span>
          </div>

          {/* Exercise List (Prescription Cards) */}
          <div className="flex flex-col gap-3.5">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="group relative rounded-2xl bg-[#1a1c20] border border-[#282a2e] shadow-md p-3.5 flex flex-col gap-2.5 transition-all hover:border-[#333539]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#282a2e] shrink-0 border border-[#282a2e]">
                      <img
                        src={getExerciseMedia(`${exercise.title} ${exercise.targetMuscle}`)[0]}
                        alt={exercise.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 text-[10px] font-bold text-[#c5f400] bg-black/90 px-1 rounded">
                        #{exercise.index}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-[#282a2e] text-[#c5f400] text-[10px] font-bold uppercase tracking-wider">
                          {exercise.targetMuscle}
                        </span>
                        <span className="text-[#8e9379] text-[11px]">• {exercise.type}</span>
                      </div>
                      <h4 className="text-[15px] font-bold text-white leading-snug mt-0.5">
                        {exercise.title}
                      </h4>
                      <span className="text-[12px] text-[#c2c6d2]">
                        {exercise.prescription} • {exercise.restTime}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartExecution(exercises, exercise.index - 1)}
                    aria-label="Ver detalhes e executar"
                    className="w-10 h-10 rounded-full bg-[#282a2e] flex items-center justify-center text-[#c5f400] hover:bg-[#c5f400] hover:text-[#161e00] transition-all shadow-sm shrink-0 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  </button>
                </div>

                <div className="rounded-xl bg-[#1e2024] p-2.5 flex items-center justify-between border border-[#282a2e]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[17px] text-[#c5f400]">history</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#c2c6d2]">Meta de Hoje</span>
                      <span className="text-[12px] text-white font-semibold">
                        {exercise.currentPrescription}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#282a2e] text-[#c5f400]">
                    {exercise.rirBadge}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Cardio Prescription Card */}
          {selectedDay?.cardio && (
            <div className="relative overflow-hidden rounded-2xl bg-[#1a1c20] border border-[#282a2e] shadow-lg p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#c4e7ff]/15 text-[#7bd0ff] flex items-center justify-center border border-[#7bd0ff]/30">
                    <span className="material-symbols-outlined text-[20px]">directions_run</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#c2c6d2] uppercase font-bold tracking-wider">
                      Cardio Prescrito
                    </span>
                    <h4 className="text-[15px] font-bold text-white">Cardio Complementar</h4>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#1e2024] text-[#7bd0ff] text-[11px] font-bold border border-[#7bd0ff]/30">
                  {selectedDay.cardio.minutes} min
                </span>
              </div>

              <p className="text-[12px] text-[#c2c6d2] leading-relaxed">{selectedDay.cardio.description}</p>
            </div>
          )}

          {/* Primary CTA */}
          <div className="sticky bottom-20 z-30 pt-1">
            <button
              id="btn-start-workout"
              onClick={() => onStartExecution(exercises, 0)}
              className="w-full h-[54px] rounded-full bg-[#c5f400] text-[#161e00] text-[15px] font-extrabold flex items-center justify-center gap-2 shadow-[0_0_32px_rgba(197,244,0,0.4)] active:scale-95 transition-all hover:bg-[#acd600]"
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                timer
              </span>
              Iniciar Execução com Cronômetro
            </button>
          </div>
        </>
      )}

      {/* Weekly Overview Modal */}
      {showRoutineInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1e2024] border border-[#282a2e] rounded-2xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#282a2e] pb-3">
              <h3 className="text-[17px] font-bold text-white">Semana Completa</h3>
              <button
                onClick={() => setShowRoutineInfo(false)}
                className="w-8 h-8 rounded-full bg-[#282a2e] flex items-center justify-center text-[#c2c6d2]"
              >
                ✕
              </button>
            </div>
            <ul className="flex flex-col gap-2 text-[12px] text-[#c2c6d2]">
              {week.map((day) => (
                <li key={day.day} className="p-2 bg-[#1a1c20] rounded-lg border border-[#282a2e]">
                  <strong className={day.isRestDay ? 'text-white' : 'text-[#c5f400]'}>{day.day}:</strong> {day.focus}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowRoutineInfo(false)}
              className="w-full py-2.5 rounded-full bg-[#c5f400] text-[#161e00] font-bold text-[13px]"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
