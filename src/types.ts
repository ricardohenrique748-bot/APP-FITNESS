export type TabType = 'inicio' | 'dieta' | 'treino' | 'evolucao';

export type Sex = 'masculino' | 'feminino';

export type ActivityLevel = 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'muito_ativo';

export type Goal = 'perder_peso' | 'ganhar_massa' | 'recomposicao';

export interface UserProfileInput {
  name: string;
  sex: Sex;
  age: number;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  restrictions?: string;
}

export interface MacroTarget {
  consumed: number;
  target: number;
  unit: string;
  perKg?: string;
  sublabel?: string;
  color: string;
}

export interface MealItem {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  kcal: number;
  proteinGrams: number;
  imageUrl?: string;
  imageAlt?: string;
  ingredients: {
    boldText: string;
    description: string;
  }[];
  tip?: {
    type: 'marmita' | 'dica';
    text: string;
  };
  substitution?: {
    title: string;
    macros: string;
    description: string;
  };
}

export interface ExerciseSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  rir: number;
  completed: boolean;
}

export interface ExerciseItem {
  id: string;
  index: number;
  title: string;
  targetMuscle: string;
  type: string;
  prescription: string;
  restTime: string;
  restSeconds: number;
  lastRecord: string;
  currentPrescription: string;
  rirBadge: string;
  imageUrl?: string;
  imageAlt?: string;
  canToggleEquipment?: boolean;
  equipment?: 'Barra' | 'Halteres';
  sets: ExerciseSet[];
}

export interface WeightDataPoint {
  day: string;
  date: string;
  weight: number;
  trendWeight: number;
  isToday?: boolean;
}

export interface MeasurementPoint {
  name: string;
  currentCm: number;
  deltaCm: number;
  type: string;
  sublabel: string;
}

export interface StrengthRecord {
  exercise: string;
  details: string;
  delta: string;
  isPositive: boolean;
}

export interface BiofeedbackMetric {
  title: string;
  score: string;
  bars: number;
  maxBars: number;
  statusText: string;
  highlight?: boolean;
}

export interface WorkoutDayPlan {
  day: string;
  focus: string;
  isRestDay: boolean;
  exercises: ExerciseItem[];
  cardio?: {
    description: string;
    minutes: number;
  };
}

export interface DietPlan {
  calorieTarget: number;
  tmb: number;
  get: number;
  protein: MacroTarget;
  carbs: MacroTarget;
  fats: MacroTarget;
  fibers: MacroTarget;
  meals: MealItem[];
}

export interface ShoppingListCategory {
  category: string;
  items: string[];
}

export interface GeneratedPlan {
  generatedAt: string;
  profile: UserProfileInput & { bmi: number };
  diet: DietPlan;
  week: WorkoutDayPlan[];
  shoppingList: ShoppingListCategory[];
  coachSummary: string;
}
