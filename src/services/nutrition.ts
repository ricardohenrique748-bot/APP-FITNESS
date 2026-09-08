import { ActivityLevel, DietPlan, Goal, UserProfileInput } from '../types';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  ativo: 1.725,
  muito_ativo: 1.9
};

const GOAL_CALORIE_ADJUSTMENT: Record<Goal, number> = {
  perder_peso: -0.2,
  ganhar_massa: 0.12,
  recomposicao: -0.1
};

const GOAL_PROTEIN_PER_KG: Record<Goal, number> = {
  perder_peso: 2.2,
  ganhar_massa: 1.9,
  recomposicao: 2.0
};

const GOAL_FAT_PER_KG: Record<Goal, number> = {
  perder_peso: 0.7,
  ganhar_massa: 0.9,
  recomposicao: 0.8
};

// Mifflin-St Jeor
export function calculateTMB(profile: Pick<UserProfileInput, 'sex' | 'weightKg' | 'heightCm' | 'age'>): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  return Math.round(profile.sex === 'masculino' ? base + 5 : base - 161);
}

export function calculateGET(tmb: number, activityLevel: ActivityLevel): number {
  return Math.round(tmb * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function calculateTargets(
  profile: UserProfileInput
): Pick<DietPlan, 'calorieTarget' | 'tmb' | 'get' | 'protein' | 'carbs' | 'fats' | 'fibers'> {
  const tmb = calculateTMB(profile);
  const get = calculateGET(tmb, profile.activityLevel);
  const calorieTarget = Math.round(get * (1 + GOAL_CALORIE_ADJUSTMENT[profile.goal]));

  const proteinPerKg = GOAL_PROTEIN_PER_KG[profile.goal];
  const fatPerKg = GOAL_FAT_PER_KG[profile.goal];

  const proteinG = Math.round(profile.weightKg * proteinPerKg);
  const fatG = Math.round(profile.weightKg * fatPerKg);
  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbsKcal = Math.max(calorieTarget - proteinKcal - fatKcal, 0);
  const carbsG = Math.round(carbsKcal / 4);
  const fibersG = Math.round((calorieTarget / 1000) * 14);

  return {
    calorieTarget,
    tmb,
    get,
    protein: {
      consumed: 0,
      target: proteinG,
      unit: 'g',
      perKg: `${proteinPerKg}g/kg`,
      sublabel: `alvo ${proteinG}g`,
      color: '#c5f400'
    },
    carbs: {
      consumed: 0,
      target: carbsG,
      unit: 'g',
      perKg: 'Peri-treino',
      sublabel: `alvo ${carbsG}g`,
      color: '#7bd0ff'
    },
    fats: {
      consumed: 0,
      target: fatG,
      unit: 'g',
      perKg: 'Hormonal',
      sublabel: `alvo ${fatG}g`,
      color: '#dee2ef'
    },
    fibers: {
      consumed: 0,
      target: fibersG,
      unit: 'g',
      perKg: 'Saciedade',
      sublabel: `alvo ${fibersG}g`,
      color: '#8e9379'
    }
  };
}
