import React, { useState, useEffect } from 'react';
import { ExerciseItem } from '../types';
import { ExerciseAnimation } from './ExerciseAnimation';

interface WorkoutExecutionModalProps {
  isOpen: boolean;
  exercises: ExerciseItem[];
  initialExerciseIndex?: number;
  onClose: () => void;
  onCompleteWorkout: () => void;
}

export const WorkoutExecutionModal: React.FC<WorkoutExecutionModalProps> = ({
  isOpen,
  exercises: exercisesProp,
  initialExerciseIndex = 0,
  onClose,
  onCompleteWorkout
}) => {
  const [exercises, setExercises] = useState<ExerciseItem[]>(exercisesProp);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(initialExerciseIndex);

  // Sync local editable copy whenever the modal (re)opens with a (possibly new) exercise list
  useEffect(() => {
    if (isOpen) {
      setExercises(exercisesProp);
      setActiveExerciseIndex(initialExerciseIndex);
    }
  }, [isOpen, exercisesProp, initialExerciseIndex]);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  // Overall workout stopwatch
  useEffect(() => {
    let interval: any;
    if (isOpen && isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isWorkoutActive]);

  // Rest countdown timer
  useEffect(() => {
    let restInterval: any;
    if (restSecondsLeft !== null && restSecondsLeft > 0) {
      restInterval = setInterval(() => {
        setRestSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [restSecondsLeft]);

  if (!isOpen) return null;

  if (exercises.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200 p-6">
        <div className="w-full max-w-md bg-[#1e2024] border border-[#282a2e] rounded-2xl p-6 text-center flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[36px] text-[#c5f400]">bedtime</span>
          <h3 className="text-[18px] font-bold text-white">Dia de descanso</h3>
          <p className="text-[13px] text-[#c2c6d2]">Não há exercícios prescritos para hoje. Aproveite para recuperar.</p>
          <button
            onClick={onClose}
            className="w-full h-11 rounded-full bg-[#c5f400] text-[#161e00] font-bold text-[13px] mt-2"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[activeExerciseIndex];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const toggleSetComplete = (exIdx: number, setIdx: number) => {
    const updated = [...exercises];
    const targetSet = updated[exIdx].sets[setIdx];
    targetSet.completed = !targetSet.completed;
    setExercises(updated);

    // If marked as completed, trigger rest countdown automatically
    if (targetSet.completed) {
      setRestSecondsLeft(updated[exIdx].restSeconds);
    }
  };

  const updateSetWeight = (exIdx: number, setIdx: number, delta: number) => {
    const updated = [...exercises];
    updated[exIdx].sets[setIdx].weightKg = Math.max(1, updated[exIdx].sets[setIdx].weightKg + delta);
    setExercises(updated);
  };

  const updateSetReps = (exIdx: number, setIdx: number, delta: number) => {
    const updated = [...exercises];
    updated[exIdx].sets[setIdx].reps = Math.max(1, updated[exIdx].sets[setIdx].reps + delta);
    setExercises(updated);
  };

  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );

  const handleFinish = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      onCompleteWorkout();
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full h-full max-w-md bg-[#0c0e12] flex flex-col justify-between overflow-hidden">
        {/* Top Bar: Timer, Sets progress, and Close */}
        <div className="p-4 pt-safe bg-[#1a1c20] border-b border-[#282a2e] flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#c5f400] animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#c5f400] tracking-wider">
                Sessão em Andamento
              </span>
              <span className="text-[17px] font-bold text-white tabular-nums">
                {formatTime(workoutSeconds)}
              </span>
            </div>
          </div>

          {/* Rest Countdown if active */}
          {restSecondsLeft !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5f400]/20 border border-[#c5f400]/40 animate-pulse">
              <span className="material-symbols-outlined text-[#c5f400] text-[16px]">timer</span>
              <span className="text-[13px] font-bold text-[#c5f400] tabular-nums">
                Descanso: {restSecondsLeft}s
              </span>
              <button
                onClick={() => setRestSecondsLeft(null)}
                className="ml-1 text-[11px] text-[#c2c6d2] hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] text-[#c2c6d2]">Séries</span>
              <div className="text-[13px] font-bold text-white">
                {completedSets} / {totalSets}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#282a2e] flex items-center justify-center text-[#c2c6d2] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Exercise Quick Switcher (Horizontal Chips) */}
        <div className="flex items-center gap-2 p-3 bg-[#111317] border-b border-[#282a2e] overflow-x-auto no-scrollbar shrink-0">
          {exercises.map((ex, idx) => {
            const isAllCompleted = ex.sets.every((s) => s.completed);
            const isCurrent = idx === activeExerciseIndex;
            return (
              <button
                key={ex.id}
                onClick={() => setActiveExerciseIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-[#c5f400] text-[#161e00] font-bold'
                    : isAllCompleted
                    ? 'bg-[#282a2e] text-[#c5f400] border border-[#c5f400]/40'
                    : 'bg-[#1e2024] text-[#c2c6d2] hover:text-white'
                }`}
              >
                <span>#{ex.index}</span>
                <span>{ex.title.split(' ')[0]}</span>
                {isAllCompleted && (
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Exercise Detail Card */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
          <div className="relative rounded-2xl overflow-hidden bg-[#1e2024] border border-[#282a2e] shadow-md">
            <div className="relative h-36 w-full">
              {currentExercise.imageUrl ? (
                <img
                  src={currentExercise.imageUrl}
                  alt={currentExercise.imageAlt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#282a2e] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[40px] text-[#c5f400]/50">fitness_center</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e2024] via-[#1e2024]/40 to-transparent" />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[#c5f400] text-[11px] font-bold uppercase tracking-wider">
                  {currentExercise.targetMuscle}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white text-[11px]">
                  {currentExercise.rirBadge}
                </span>
              </div>
              <div className="absolute bottom-2.5 left-3 right-3">
                <h3 className="text-[18px] font-bold text-white leading-tight">
                  {currentExercise.title}
                </h3>
                <p className="text-[12px] text-[#c2c6d2] mt-0.5">
                  {currentExercise.prescription} • {currentExercise.restTime}
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#1a1c20] flex items-center justify-between text-[11px] text-[#c2c6d2]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#c5f400] text-[14px]">history</span>
                {currentExercise.lastRecord}
              </span>
              <span className="text-[#c5f400] font-semibold">
                Alvo: Sobrecarga Dupla
              </span>
            </div>
          </div>

          {/* Movement Demonstration */}
          <div className="flex flex-col gap-2.5 p-3 rounded-2xl bg-[#1a1c20] border border-[#282a2e]">
            <span className="text-[10px] uppercase tracking-wider text-[#8e9379] font-bold px-0.5">
              Demonstração do Movimento
            </span>
            <div className="w-full h-56 rounded-xl bg-[#14161b] border border-[#282a2e] overflow-hidden">
              <ExerciseAnimation
                key={currentExercise.id}
                exerciseId={currentExercise.id}
                hint={`${currentExercise.title} ${currentExercise.targetMuscle}`}
                className="w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-0.5 px-0.5">
              <span className="text-[13px] text-white font-semibold">
                {currentExercise.title}
              </span>
              <span className="text-[11px] text-[#c2c6d2]">
                {currentExercise.currentPrescription}
              </span>
            </div>
          </div>

          {/* Sets Tracking Table */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#8e9379] px-2 font-bold">
              <span>Série</span>
              <span>Carga (kg)</span>
              <span>Reps</span>
              <span>Concluir</span>
            </div>

            {currentExercise.sets.map((set, sIdx) => (
              <div
                key={set.setNumber}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  set.completed
                    ? 'bg-[#1a1c20]/80 border-[#c5f400]/40 text-[#c2c6d2]'
                    : 'bg-[#1e2024] border-[#282a2e] text-white shadow-sm'
                }`}
              >
                {/* Set # */}
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold ${
                      set.completed ? 'bg-[#c5f400] text-[#161e00]' : 'bg-[#282a2e] text-white'
                    }`}
                  >
                    {set.setNumber}
                  </span>
                </div>

                {/* Weight Stepper */}
                <div className="flex items-center gap-1.5 bg-[#14161b] px-2 py-1 rounded-lg border border-[#282a2e]">
                  <button
                    onClick={() => updateSetWeight(activeExerciseIndex, sIdx, -2)}
                    className="w-6 h-6 rounded bg-[#282a2e] hover:bg-[#333539] text-white text-[14px] flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="text-[14px] font-bold text-white tabular-nums w-8 text-center">
                    {set.weightKg}
                  </span>
                  <button
                    onClick={() => updateSetWeight(activeExerciseIndex, sIdx, 2)}
                    className="w-6 h-6 rounded bg-[#282a2e] hover:bg-[#333539] text-white text-[14px] flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                  <span className="text-[10px] text-[#8e9379]">kg</span>
                </div>

                {/* Reps Stepper */}
                <div className="flex items-center gap-1.5 bg-[#14161b] px-2 py-1 rounded-lg border border-[#282a2e]">
                  <button
                    onClick={() => updateSetReps(activeExerciseIndex, sIdx, -1)}
                    className="w-6 h-6 rounded bg-[#282a2e] hover:bg-[#333539] text-white text-[14px] flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="text-[14px] font-bold text-white tabular-nums w-6 text-center">
                    {set.reps}
                  </span>
                  <button
                    onClick={() => updateSetReps(activeExerciseIndex, sIdx, 1)}
                    className="w-6 h-6 rounded bg-[#282a2e] hover:bg-[#333539] text-white text-[14px] flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                  <span className="text-[10px] text-[#8e9379]">reps</span>
                </div>

                {/* Check button */}
                <button
                  onClick={() => toggleSetComplete(activeExerciseIndex, sIdx)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    set.completed
                      ? 'bg-[#c5f400] text-[#161e00] shadow-[0_0_12px_#c5f400]'
                      : 'bg-[#282a2e] text-[#c2c6d2] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] font-bold">
                    {set.completed ? 'check' : 'check_box_outline_blank'}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Quick Rest Timer Trigger Buttons */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a1c20] border border-[#282a2e]">
            <span className="text-[11px] text-[#c2c6d2] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[#c5f400] text-[16px]">alarm</span>
              Iniciar Descanso Manual:
            </span>
            <div className="flex items-center gap-1.5">
              {[60, 90, 120, 150].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setRestSecondsLeft(sec)}
                  className="px-2 py-1 rounded-md bg-[#282a2e] hover:bg-[#333539] text-[11px] font-bold text-[#c5f400]"
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="p-4 pb-safe bg-[#1a1c20] border-t border-[#282a2e] flex items-center gap-3 shadow-xl">
          {activeExerciseIndex < exercises.length - 1 ? (
            <button
              onClick={() => setActiveExerciseIndex((prev) => prev + 1)}
              className="flex-1 h-12 rounded-full bg-[#282a2e] hover:bg-[#333539] text-white font-bold text-[14px] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Próximo Exercício</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex-1 h-12 rounded-full bg-[#c5f400] text-[#161e00] font-extrabold text-[15px] flex items-center justify-center gap-1.5 shadow-[0_0_24px_rgba(197,244,0,0.4)] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span>Finalizar Treino & Salvar Cargas</span>
            </button>
          )}
        </div>

        {/* Celebration Toast Modal */}
        {showCelebration && (
          <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#c5f400] flex items-center justify-center text-[#161e00] mb-4 shadow-[0_0_32px_#c5f400]">
              <span className="material-symbols-outlined text-[36px] font-bold">trophy</span>
            </div>
            <h3 className="text-[22px] font-extrabold text-white">Treino Concluído!</h3>
            <p className="text-[14px] text-[#c2c6d2] mt-1">
              {completedSets} séries registradas • Sobrecarga calculada com sucesso.
            </p>
            <div className="mt-4 px-4 py-2 rounded-full bg-[#1e2024] text-[#c5f400] text-[12px] font-semibold border border-[#c5f400]/40">
              Agora: 25 min Cardio Zona 2 para lipólise eficiente
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
