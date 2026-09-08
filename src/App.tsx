import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { ExerciseItem, GeneratedPlan, TabType } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { DietView } from './views/DietView';
import { WorkoutView } from './views/WorkoutView';
import { EvolutionView } from './views/EvolutionView';
import { NotificationModal } from './components/NotificationModal';
import { ProfileModal } from './components/ProfileModal';
import { ShoppingListModal } from './components/ShoppingListModal';
import { WorkoutExecutionModal } from './components/WorkoutExecutionModal';
import { PhotoCompareModal } from './components/PhotoCompareModal';
import { CheckInModal } from './components/CheckInModal';
import { OnboardingView } from './onboarding/OnboardingView';
import { LoginView } from './auth/LoginView';
import { isSupabaseConfigured, supabase } from './services/supabaseClient';
import { loadPlan, savePlan } from './services/planStorage';

function getTodayIndex(): number {
  // JS getDay(): 0=Sunday..6=Saturday. Our week array is Monday..Sunday.
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function SetupNotice() {
  return (
    <div className="min-h-screen w-full bg-[#0c0e12] text-[#e2e2e8] flex items-center justify-center p-6">
      <div className="max-w-sm flex flex-col items-center gap-3 text-center">
        <span className="material-symbols-outlined text-[36px] text-[#c5f400]">settings</span>
        <h1 className="text-[18px] font-bold text-white">Configuração pendente</h1>
        <p className="text-[13px] text-[#c2c6d2] leading-relaxed">
          Defina <code className="text-[#c5f400]">VITE_SUPABASE_URL</code> e{' '}
          <code className="text-[#c5f400]">VITE_SUPABASE_ANON_KEY</code> no arquivo <code>.env.local</code> e reinicie
          o servidor para habilitar o login.
        </p>
      </div>
    </div>
  );
}

function FullScreenLoader() {
  return (
    <div className="min-h-screen w-full bg-[#0c0e12] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-[#282a2e] border-t-[#c5f400] animate-spin" />
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState(true);
  const [planError, setPlanError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>('inicio');

  // Modal visibility states
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isWorkoutExecutionOpen, setIsWorkoutExecutionOpen] = useState(false);
  const [activeWorkoutExercises, setActiveWorkoutExercises] = useState<ExerciseItem[]>([]);
  const [workoutStartIndex, setWorkoutStartIndex] = useState(0);
  const [isPhotoCompareOpen, setIsPhotoCompareOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  // Dynamic user data states
  const [waterLevel, setWaterLevel] = useState(2.8);
  const [currentWeight, setCurrentWeight] = useState(84.2);
  const [currentWaist, setCurrentWaist] = useState(88);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [planRetryToken, setPlanRetryToken] = useState(0);

  // Track the logged-in user's session.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Load the logged-in user's plan whenever the session changes.
  useEffect(() => {
    if (!session) {
      setPlan(null);
      setIsPlanLoading(false);
      return;
    }
    setIsPlanLoading(true);
    setPlanError(null);
    loadPlan(session.user.id)
      .then((loadedPlan) => {
        setPlan(loadedPlan);
        if (loadedPlan) setCurrentWeight(loadedPlan.profile.weightKg);
      })
      .catch((err) => setPlanError(err instanceof Error ? err.message : 'Erro ao carregar seu plano.'))
      .finally(() => setIsPlanLoading(false));
  }, [session?.user.id, planRetryToken]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleAddWater = () => {
    setWaterLevel((prev) => Math.min(6.0, Number((prev + 0.25).toFixed(2))));
    triggerToast('+250ml de água registrado (Hidratação atualizada)');
  };

  const handleSaveCheckIn = (weight: number, waist: number) => {
    setCurrentWeight(weight);
    setCurrentWaist(waist);
    triggerToast(`Check-in salvo: ${weight} kg | Cintura: ${waist} cm`);
  };

  const handleCompleteWorkout = () => {
    triggerToast('Treino concluído! Cargas e sobrecarga salvas.');
  };

  const handleRegenerateRequest = () => {
    setIsProfileOpen(false);
    setIsRegenerating(true);
  };

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    await supabase.auth.signOut();
  };

  const handlePlanGenerated = async (newPlan: GeneratedPlan) => {
    setPlan(newPlan);
    setIsRegenerating(false);
    setCurrentTab('inicio');
    setCurrentWeight(newPlan.profile.weightKg);
    if (session) {
      try {
        await savePlan(session.user.id, newPlan);
      } catch (err) {
        triggerToast(err instanceof Error ? err.message : 'Erro ao salvar plano na nuvem.');
      }
    }
  };

  if (!isSupabaseConfigured) {
    return <SetupNotice />;
  }

  if (isAuthLoading) {
    return <FullScreenLoader />;
  }

  if (!session) {
    return <LoginView />;
  }

  if (isPlanLoading) {
    return <FullScreenLoader />;
  }

  if (planError) {
    return (
      <div className="min-h-screen w-full bg-[#0c0e12] flex items-center justify-center p-6">
        <div className="max-w-sm flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-[36px] text-[#ffb4ab]">error</span>
          <p className="text-[13px] text-[#c2c6d2] leading-relaxed">{planError}</p>
          <button
            onClick={() => setPlanRetryToken((prev) => prev + 1)}
            className="px-5 h-10 rounded-full bg-[#c5f400] text-[#161e00] font-bold text-[13px]"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!plan || isRegenerating) {
    return <OnboardingView initialValues={plan?.profile} onGenerated={handlePlanGenerated} />;
  }

  const todayIndex = getTodayIndex();
  const todayWorkout = plan.week[todayIndex];

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#e2e2e8] flex flex-col items-center justify-start selection:bg-[#c5f400] selection:text-[#161e00]">
      {/* Mobile-centric constrained frame */}
      <div className="w-full max-w-md min-h-screen flex flex-col relative bg-[#0c0e12] border-x border-[#282a2e]/40 shadow-2xl">
        {/* Fixed Header */}
        <Header
          currentTab={currentTab}
          profileName={plan.profile.name}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 flex flex-col relative w-full pt-20 pb-20">
          {currentTab === 'inicio' && (
            <HomeView
              plan={plan}
              todayWorkout={todayWorkout}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onStartWorkout={() => {
                setActiveWorkoutExercises(todayWorkout?.exercises ?? []);
                setWorkoutStartIndex(0);
                setIsWorkoutExecutionOpen(true);
              }}
              waterLevel={waterLevel}
              onAddWater={handleAddWater}
            />
          )}

          {currentTab === 'dieta' && (
            <DietView diet={plan.diet} onOpenShoppingList={() => setIsShoppingListOpen(true)} />
          )}

          {currentTab === 'treino' && (
            <WorkoutView
              week={plan.week}
              todayIndex={todayIndex}
              onStartExecution={(exercises, exerciseIndex = 0) => {
                setActiveWorkoutExercises(exercises);
                setWorkoutStartIndex(exerciseIndex);
                setIsWorkoutExecutionOpen(true);
              }}
            />
          )}

          {currentTab === 'evolucao' && (
            <EvolutionView
              onOpenCheckIn={() => setIsCheckInOpen(true)}
              onOpenPhotoCompare={() => setIsPhotoCompareOpen(true)}
              currentWeight={currentWeight}
              currentWaist={currentWaist}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation */}
        <BottomNav currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-xs w-full px-4 animate-in slide-in-from-top-3 duration-200">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#1e2024] border border-[#c5f400]/40 text-[#c5f400] text-[12px] font-bold shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span className="truncate">{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Interactive Modals */}
        <NotificationModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          plan={plan}
          onClose={() => setIsProfileOpen(false)}
          onRegenerateRequest={handleRegenerateRequest}
          onSignOut={handleSignOut}
        />

        <ShoppingListModal
          isOpen={isShoppingListOpen}
          shoppingList={plan.shoppingList}
          onClose={() => setIsShoppingListOpen(false)}
        />

        <WorkoutExecutionModal
          isOpen={isWorkoutExecutionOpen}
          exercises={activeWorkoutExercises}
          initialExerciseIndex={workoutStartIndex}
          onClose={() => setIsWorkoutExecutionOpen(false)}
          onCompleteWorkout={handleCompleteWorkout}
        />

        <PhotoCompareModal
          isOpen={isPhotoCompareOpen}
          onClose={() => setIsPhotoCompareOpen(false)}
        />

        <CheckInModal
          isOpen={isCheckInOpen}
          onClose={() => setIsCheckInOpen(false)}
          onSaveCheckin={handleSaveCheckIn}
        />
      </div>
    </div>
  );
}
