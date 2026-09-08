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
        <div className="w-full max-w-md bg-surface-container border border-surface-container-high rounded-2xl p-6 text-center flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[36px] text-primary-fixed">bedtime</span>
          <h3 className="text-[18px] font-bold text-on-surface">Dia de descanso</h3>
          <p className="text-[13px] text-secondary">Não há exercícios prescritos para hoje. Aproveite para recuperar.</p>
          <button
            onClick={onClose}
            className="w-full h-11 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-[13px] mt-2"
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
      <div className="w-full h-full max-w-md bg-surface-container-lowest flex flex-col justify-between overflow-hidden">
        {/* Top Bar: Timer, Sets progress, and Close */}
        <div className="pt-safe bg-surface-container-low border-b border-surface-container-high shadow-lg shrink-0">
          <div className="p-4 grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-fixed animate-pulse shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold text-primary-fixed tracking-wider truncate">
                  Sessão em Andamento
                </span>
                <span className="text-[17px] font-bold text-on-surface tabular-nums leading-tight">
                  {formatTime(workoutSeconds)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-secondary uppercase tracking-wide">Séries</span>
                <div className="text-[13px] font-bold text-on-surface tabular-nums leading-tight">
                  {completedSets} / {totalSets}
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar treino"
                className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-secondary hover:text-on-surface transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="h-1 w-full bg-surface-container-high">
            <div
              className="h-full bg-primary-fixed transition-all duration-300"
              style={{ width: totalSets > 0 ? `${(completedSets / totalSets) * 100}%` : '0%' }}
            />
          </div>

          {/* Rest Countdown, shown as its own row so it never shifts the layout above */}
          {restSecondsLeft !== null && (
            <div className="px-4 py-2 flex items-center justify-center gap-1.5 bg-primary-fixed/10 border-t border-primary-fixed/30 animate-in slide-in-from-top-2 duration-200">
              <span className="material-symbols-outlined text-primary-fixed text-[16px]">timer</span>
              <span className="text-[13px] font-bold text-primary-fixed tabular-nums">
                Descanso: {restSecondsLeft}s
              </span>
              <button
                onClick={() => setRestSecondsLeft(null)}
                aria-label="Cancelar descanso"
                className="ml-1.5 text-[11px] text-secondary hover:text-on-surface"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Exercise Quick Switcher (Horizontal Chips) */}
        <div className="flex items-center gap-2 p-3 bg-surface border-b border-surface-container-high overflow-x-auto no-scrollbar shrink-0">
          {exercises.map((ex, idx) => {
            const isAllCompleted = ex.sets.every((s) => s.completed);
            const isCurrent = idx === activeExerciseIndex;
            return (
              <button
                key={ex.id}
                onClick={() => setActiveExerciseIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                    : isAllCompleted
                    ? 'bg-surface-container-high text-primary-fixed border border-primary-fixed/40'
                    : 'bg-surface-container text-secondary hover:text-on-surface'
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
          <div className="relative rounded-2xl overflow-hidden bg-surface-container border border-surface-container-high shadow-md">
            <div className="relative h-36 w-full">
              {currentExercise.imageUrl ? (
                <img
                  src={currentExercise.imageUrl}
                  alt={currentExercise.imageAlt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-[40px] text-primary-fixed/50">fitness_center</span>
                </div>
              )}
              {/* Fixed dark scrim for photo caption legibility — stays dark in both themes */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-primary-fixed text-[11px] font-bold uppercase tracking-wider">
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
                <p className="text-[12px] text-secondary mt-0.5">
                  {currentExercise.prescription} • {currentExercise.restTime}
                </p>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low flex items-center justify-between text-[11px] text-secondary">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary-fixed text-[14px]">history</span>
                {currentExercise.lastRecord}
              </span>
              <span className="text-primary-fixed font-semibold">
                Alvo: Sobrecarga Dupla
              </span>
            </div>
          </div>

          {/* Movement Demonstration */}
          <div className="flex flex-col gap-2.5 p-3 rounded-2xl bg-surface-container-low border border-surface-container-high">
            <span className="text-[10px] uppercase tracking-wider text-outline font-bold px-0.5">
              Demonstração do Movimento
            </span>
            <div className="w-full h-56 rounded-xl bg-surface-dim border border-surface-container-high overflow-hidden">
              <ExerciseAnimation
                key={currentExercise.id}
                exerciseId={currentExercise.id}
                hint={`${currentExercise.title} ${currentExercise.targetMuscle}`}
                className="w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-0.5 px-0.5">
              <span className="text-[13px] text-on-surface font-semibold">
                {currentExercise.title}
              </span>
              <span className="text-[11px] text-secondary">
                {currentExercise.currentPrescription}
              </span>
            </div>
          </div>

          {/* Sets Tracking Table */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-outline px-2 font-bold">
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
                    ? 'bg-surface-container-low/80 border-primary-fixed/40 text-secondary'
                    : 'bg-surface-container border-surface-container-high text-on-surface shadow-sm'
                }`}
              >
                {/* Set # */}
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold ${
                      set.completed ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {set.setNumber}
                  </span>
                </div>

                {/* Weight Stepper */}
                <div className="flex items-center gap-1.5 bg-surface-dim px-2 py-1 rounded-lg border border-surface-container-high">
                  <button
                    onClick={() => updateSetWeight(activeExerciseIndex, sIdx, -2)}
                    className="w-6 h-6 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[14px] flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="text-[14px] font-bold text-on-surface tabular-nums w-8 text-center">
                    {set.weightKg}
                  </span>
                  <button
                    onClick={() => updateSetWeight(activeExerciseIndex, sIdx, 2)}
                    className="w-6 h-6 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[14px] flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                  <span className="text-[10px] text-outline">kg</span>
                </div>

                {/* Reps Stepper */}
                <div className="flex items-center gap-1.5 bg-surface-dim px-2 py-1 rounded-lg border border-surface-container-high">
                  <button
                    onClick={() => updateSetReps(activeExerciseIndex, sIdx, -1)}
                    className="w-6 h-6 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[14px] flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="text-[14px] font-bold text-on-surface tabular-nums w-6 text-center">
                    {set.reps}
                  </span>
                  <button
                    onClick={() => updateSetReps(activeExerciseIndex, sIdx, 1)}
                    className="w-6 h-6 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[14px] flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                  <span className="text-[10px] text-outline">reps</span>
                </div>

                {/* Check button */}
                <button
                  onClick={() => toggleSetComplete(activeExerciseIndex, sIdx)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    set.completed
                      ? 'bg-primary-fixed text-on-primary-fixed shadow-[0_0_12px_#c5f400]'
                      : 'bg-surface-container-high text-secondary hover:text-on-surface'
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
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
            <span className="text-[11px] text-secondary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-primary-fixed text-[16px]">alarm</span>
              Iniciar Descanso Manual:
            </span>
            <div className="flex items-center gap-1.5">
              {[60, 90, 120, 150].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setRestSecondsLeft(sec)}
                  className="px-2 py-1 rounded-md bg-surface-container-high hover:bg-surface-container-highest text-[11px] font-bold text-primary-fixed"
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="p-4 pb-safe bg-surface-container-low border-t border-surface-container-high flex items-center gap-3 shadow-xl">
          {activeExerciseIndex < exercises.length - 1 ? (
            <button
              onClick={() => setActiveExerciseIndex((prev) => prev + 1)}
              className="flex-1 h-12 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-[14px] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Próximo Exercício</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex-1 h-12 rounded-full bg-primary-fixed text-on-primary-fixed font-extrabold text-[15px] flex items-center justify-center gap-1.5 shadow-[0_0_24px_rgba(197,244,0,0.4)] transition-all active:scale-95"
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
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed mb-4 shadow-[0_0_32px_#c5f400]">
              <span className="material-symbols-outlined text-[36px] font-bold">trophy</span>
            </div>
            <h3 className="text-[22px] font-extrabold text-on-surface">Treino Concluído!</h3>
            <p className="text-[14px] text-secondary mt-1">
              {completedSets} séries registradas • Sobrecarga calculada com sucesso.
            </p>
            <div className="mt-4 px-4 py-2 rounded-full bg-surface-container text-primary-fixed text-[12px] font-semibold border border-primary-fixed/40">
              Agora: 25 min Cardio Zona 2 para lipólise eficiente
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
