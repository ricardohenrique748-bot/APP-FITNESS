import { GoogleGenAI, Type } from '@google/genai';
import { DietPlan, GeneratedPlan, MealItem, UserProfileInput, WorkoutDayPlan } from '../types';
import { calculateBMI, calculateTargets } from './nutrition';

const WEEK_DAYS = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

const GOAL_LABEL: Record<UserProfileInput['goal'], string> = {
  perder_peso: 'perda de gordura (déficit calórico, preservando massa magra)',
  ganhar_massa: 'ganho de massa muscular (superávit calórico, treino de hipertrofia)',
  recomposicao: 'recomposição corporal (perder gordura e ganhar músculo ao mesmo tempo)'
};

const ACTIVITY_LABEL: Record<UserProfileInput['activityLevel'], string> = {
  sedentario: 'sedentário (pouco ou nenhum exercício)',
  leve: 'levemente ativo (exercício leve 1-3 dias/semana)',
  moderado: 'moderadamente ativo (exercício moderado 3-5 dias/semana)',
  ativo: 'ativo (exercício intenso 6-7 dias/semana)',
  muito_ativo: 'muito ativo (exercício intenso diário + trabalho físico)'
};

const exerciseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    targetMuscle: { type: Type.STRING },
    type: { type: Type.STRING },
    prescription: { type: Type.STRING, description: 'Ex: "3 séries × 8 a 10 reps"' },
    restTime: { type: Type.STRING, description: 'Ex: "Descanso: 90s"' },
    restSeconds: { type: Type.INTEGER },
    rirBadge: { type: Type.STRING, description: 'Ex: "RIR 1–2"' },
    currentPrescription: { type: Type.STRING }
  },
  required: ['title', 'targetMuscle', 'type', 'prescription', 'restTime', 'restSeconds', 'rirBadge', 'currentPrescription']
};

const mealSchema = {
  type: Type.OBJECT,
  properties: {
    time: { type: Type.STRING, description: 'Ex: "07:30"' },
    title: { type: Type.STRING },
    subtitle: { type: Type.STRING },
    kcal: { type: Type.INTEGER },
    proteinGrams: { type: Type.INTEGER },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          boldText: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ['boldText', 'description']
      }
    }
  },
  required: ['time', 'title', 'subtitle', 'kcal', 'proteinGrams', 'ingredients']
};

const planSchema = {
  type: Type.OBJECT,
  properties: {
    coachSummary: {
      type: Type.STRING,
      description: 'Resumo curto (2-3 frases) explicando a estratégia do plano para o usuário.'
    },
    meals: {
      type: Type.ARRAY,
      description: 'Refeições de um dia típico (4 a 6 refeições).',
      items: mealSchema
    },
    week: {
      type: Type.ARRAY,
      description: 'Exatamente 7 entradas, uma por dia da semana, na ordem Segunda a Domingo.',
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          focus: { type: Type.STRING, description: 'Ex: "Upper A", "Lower B", "Descanso Ativo"' },
          isRestDay: { type: Type.BOOLEAN },
          exercises: { type: Type.ARRAY, items: exerciseSchema },
          cardioDescription: { type: Type.STRING },
          cardioMinutes: { type: Type.INTEGER }
        },
        required: ['day', 'focus', 'isRestDay', 'exercises']
      }
    },
    shoppingList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['category', 'items']
      }
    }
  },
  required: ['coachSummary', 'meals', 'week', 'shoppingList']
};

interface RawExercise {
  title: string;
  targetMuscle: string;
  type: string;
  prescription: string;
  restTime: string;
  restSeconds: number;
  rirBadge: string;
  currentPrescription: string;
}

interface RawMeal {
  time: string;
  title: string;
  subtitle: string;
  kcal: number;
  proteinGrams: number;
  ingredients: { boldText: string; description: string }[];
}

interface RawPlanResponse {
  coachSummary: string;
  meals: RawMeal[];
  week: {
    day: string;
    focus: string;
    isRestDay: boolean;
    exercises: RawExercise[];
    cardioDescription?: string;
    cardioMinutes?: number;
  }[];
  shoppingList: { category: string; items: string[] }[];
}

function toExerciseItem(raw: RawExercise, index: number, dayKey: string): import('../types').ExerciseItem {
  return {
    id: `${dayKey}-ex-${index + 1}`,
    index: index + 1,
    title: raw.title,
    targetMuscle: raw.targetMuscle,
    type: raw.type,
    prescription: raw.prescription,
    restTime: raw.restTime,
    restSeconds: raw.restSeconds,
    lastRecord: 'Ainda sem histórico — primeira sessão',
    currentPrescription: raw.currentPrescription,
    rirBadge: raw.rirBadge,
    sets: Array.from({ length: extractSetCount(raw.prescription) }, (_, i) => ({
      setNumber: i + 1,
      weightKg: 0,
      reps: extractRepTarget(raw.prescription),
      rir: 2,
      completed: false
    }))
  };
}

function extractSetCount(prescription: string): number {
  const match = prescription.match(/(\d+)\s*séries?/i);
  const count = match ? parseInt(match[1], 10) : 3;
  return Number.isFinite(count) && count > 0 ? count : 3;
}

function extractRepTarget(prescription: string): number {
  const match = prescription.match(/(\d+)\s*(?:a|à|-)\s*(\d+)?\s*reps?/i);
  const rep = match ? parseInt(match[2] ?? match[1], 10) : 10;
  return Number.isFinite(rep) && rep > 0 ? rep : 10;
}

function toMealItem(raw: RawMeal, index: number): MealItem {
  return {
    id: `meal-${index + 1}`,
    time: raw.time,
    title: raw.title,
    subtitle: raw.subtitle,
    kcal: raw.kcal,
    proteinGrams: raw.proteinGrams,
    ingredients: raw.ingredients
  };
}

function buildPrompt(profile: UserProfileInput, diet: Omit<DietPlan, 'meals'>): string {
  return `Você é um personal trainer e nutricionista esportivo brasileiro. Monte um plano semanal de treino de musculação e um cardápio diário para o seguinte atleta:

- Nome: ${profile.name}
- Sexo: ${profile.sex}
- Idade: ${profile.age} anos
- Peso: ${profile.weightKg} kg
- Altura: ${profile.heightCm} cm
- Nível de atividade: ${ACTIVITY_LABEL[profile.activityLevel]}
- Objetivo: ${GOAL_LABEL[profile.goal]}
${profile.restrictions ? `- Restrições alimentares / observações: ${profile.restrictions}` : ''}

Metas nutricionais já calculadas que o cardápio deve respeitar (não recalcule, apenas monte as refeições dentro desses valores, com tolerância de ±5%):
- Calorias: ${diet.calorieTarget} kcal/dia
- Proteína: ${diet.protein.target} g/dia
- Carboidratos: ${diet.carbs.target} g/dia
- Gorduras: ${diet.fats.target} g/dia

Regras:
1. O treino deve ter 7 entradas (Segunda a Domingo), com 3 a 5 dias de treino de musculação (divisão adequada ao objetivo) e o restante como descanso ou descanso ativo. Marque "isRestDay" corretamente.
2. Cada dia de treino deve ter de 4 a 6 exercícios, com séries/reps/descanso coerentes com o objetivo (ex: força/hipertrofia para ganho de massa, volume moderado com déficit para perda de peso).
3. O cardápio deve usar alimentos comuns no Brasil (arroz, feijão, frango, ovos, batata doce, aveia, frutas etc.), com 4 a 6 refeições cobrindo o dia todo.
4. Gere também uma lista de compras semanal agrupada por categoria (açougue/ovos, hortifruti, mercearia/grãos, laticínios/suplementos) coerente com o cardápio.
5. Escreva "coachSummary" em português, tom motivador e direto, 2 a 3 frases.

Responda estritamente no formato JSON definido pelo schema.`;
}

export async function generatePlan(profile: UserProfileInput): Promise<GeneratedPlan> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY não configurada. Crie um arquivo .env.local na raiz do projeto com GEMINI_API_KEY=sua_chave e reinicie o servidor.'
    );
  }

  const targets = calculateTargets(profile);
  const prompt = buildPrompt(profile, targets);

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: planSchema
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error('A IA não retornou nenhum conteúdo. Tente novamente.');
  }

  let raw: RawPlanResponse;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('Não foi possível interpretar a resposta da IA. Tente novamente.');
  }

  const week: WorkoutDayPlan[] = WEEK_DAYS.map((dayLabel, i) => {
    const match = raw.week[i] ?? raw.week.find((d) => d.day.toLowerCase().includes(dayLabel.slice(0, 3).toLowerCase()));
    if (!match) {
      return { day: dayLabel, focus: 'Descanso', isRestDay: true, exercises: [] };
    }
    return {
      day: dayLabel,
      focus: match.focus,
      isRestDay: match.isRestDay,
      exercises: match.exercises.map((ex, idx) => toExerciseItem(ex, idx, dayLabel)),
      cardio:
        match.cardioDescription && match.cardioMinutes
          ? { description: match.cardioDescription, minutes: match.cardioMinutes }
          : undefined
    };
  });

  const diet: DietPlan = {
    ...targets,
    meals: raw.meals.map(toMealItem)
  };

  return {
    generatedAt: new Date().toISOString(),
    profile: { ...profile, bmi: calculateBMI(profile.weightKg, profile.heightCm) },
    diet,
    week,
    shoppingList: raw.shoppingList,
    coachSummary: raw.coachSummary
  };
}
