import { MealItem, ExerciseItem, WeightDataPoint, MeasurementPoint, StrengthRecord, BiofeedbackMetric } from '../types';

export const BRAND_ASSETS = {
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyxlQIAwr8x2o0j3rrfVbTwdbQ_7v-7WUxxwZiq0Aj2rIRj9k5QQtP-WXYx86SI-VOstDKZlOUEvEHGJBOg3bziKDBC8bv7Q1l39U5r5VLfFAZ0d8pGUkcNttH0EhzSpapoqcOn8BkVot38SIAX_Inkom12zCnmP2VVt3r7rNeSopf972PZf-DfUazQf4ic0t3ORZ4B76qZSdvuskxXRd3Q3iCwLEbT0HMI-lKIekQKVzHzd8ym7HJ',
  heroWorkout: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcUUC24JLz6EW6glHgZdgY5YWwX6XwMj1i10sswExNspeAJVwkxF-GoO8HZTm6FONh9haQ_-FjhTt7MLYFltHBu3zu43F1UqEB-IO4VsBrUs4B-cTnE49hewDRPnvt2v4kF6ah8eCPHXkt-x0Aqkq3ge9YZHhcmlfb8HMHb0QburVbDCMT91Yfc7-fMvhG4HxGU6Kx1J4EmLSqmyyFASG15Di10BrU9GPoLNggi-p649fHkQ4IfRjR',
  photoWeek1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE5KdIZHfF9OfElg4cvVLJ0Fsk0y3_vX4pQr9VbM5dOKHoLeVzY4RzknNevc68mSuXhWzKATcGp54XW2TZiJgNx8JEl3gwXH9viuKTp9yetazVsnwDy-gtBWV6LnmAMJmlsHauhks2j9H4lr0gRLrF4o4Hj442q1R7tzPu4homLr36fj53C1KRpQIC7YjjcC2qP-6_jwZCK8Eb8nbMrvDL1vv0fNuZ6L6Xo7A4WLTNRTX6GanwDIKR',
  photoWeek6: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKJiP8J24ztf4rGSg9t3DbA6V5K86LFDbUPKOoH-kPyzlR9MwlgyE85N63ECRtpAPgeM5ak_lQMbJ4XYM8aoVxr7rKU08RUm4PpuBziRyEh2kly9LQAKdgNSjlT-oTo5DnpdOvyP9rbHwwQNw1d_R81x_SpDUd8sVparhtby5LPCvxYMZGqxXbT70_AdSOcKP2DBRTMs0zKIooepfI0gSnoY2vfSgN7bfeW0cjGWL-WU2mI2mZKzyQ'
};

export const ATHLETE_PROFILE = {
  name: 'Lucas',
  phase: 'Semana 6 de 12 · Fase Fat Loss',
  strategy: 'Déficit Planejado (-20%)',
  dateString: 'Hoje, 24 Out',
  weight: 84.2,
  startWeight: 87.8,
  bodyFatPercent: 15.2,
  startBodyFat: 19.0,
  heightCm: 182,
  tmb: 1950,
  get: 2450,
  calorieTarget: 1950,
  calorieConsumed: 1280,
  hydrationCurrent: 2.8,
  hydrationTarget: 3.4,
  neatCurrent: 8420,
  neatTarget: 10000,
  activeBurnKcal: 490,
  restingHrBpm: 58
};

export const NUTRITION_TARGETS = {
  protein: { consumed: 154, target: 170, unit: 'g', perKg: '2.0g/kg', sublabel: 'alvo 170g', color: '#c5f400' },
  carbs: { consumed: 160, target: 210, unit: 'g', perKg: 'Peri-treino', sublabel: 'alvo 210g', color: '#7bd0ff' },
  fats: { consumed: 42, target: 55, unit: 'g', perKg: 'Hormonal', sublabel: 'alvo 55g', color: '#dee2ef' },
  fibers: { consumed: 28, target: 32, unit: 'g', perKg: 'Saciedade', sublabel: 'alvo 32g', color: '#8e9379' }
};

export const MEALS_DATA: MealItem[] = [
  {
    id: 'meal-1',
    time: '07:30',
    title: 'Café da Manhã',
    subtitle: 'Refeição 01',
    kcal: 480,
    proteinGrams: 38,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF8M0QKlN5Dyy8hJs-3lQkRjnlfaTmZmeFlKVIsDdw-k1_Z-iibwdQ28jhheI2loYo3JpwlKNHEn23_37uieGLrq80yViL5N7OQclcBPiW1tBEaIsBGENQ5rIjkxN_HyeX2ryrZoZrdkMZEjUSlNY7b6aujq8sf3DGzxPC49GKqdLmU5-0i_zkKKRPrWj4yFiMnjBtLc5LKKc4diVc47susA74qADe4naMvSho4Q2KDNmBl8FoTu2E',
    imageAlt: 'High-protein Brazilian breakfast with scrambled eggs, toasted whole grain bread, sliced banana and black coffee',
    ingredients: [
      { boldText: '3 ovos mexidos', description: 'inteiros (150g)' },
      { boldText: '2 fatias', description: 'de pão integral 100% tostado (50g)' },
      { boldText: '1 banana prata', description: 'média (70g)' },
      { boldText: 'Café filtrado', description: 'sem açúcar (livre)' }
    ],
    substitution: {
      title: 'Equivalência Isocalórica',
      macros: '475 kcal | 36g P',
      description: 'Tapioca recheada: 40g goma hidratada + 100g frango desfiado + 30g queijo coalho light grelhado.'
    }
  },
  {
    id: 'meal-2',
    time: '12:30',
    title: 'Almoço Principal',
    subtitle: 'Refeição 02 · Pré-Treino',
    kcal: 620,
    proteinGrams: 50,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk7DDxFGYi2esmzkgkN5ufHjwgCTQ5PbnWgjy5Y2OJdOahyhS-p0pspJlrTytYVHSvR1MVU-dbNh-pNcbm_0fJeXJK6wtOFazzLGbz8YkjH5tepSoJZtqm66wBfhc8jgYgEVjU7vbt_nGFhjVCmz9M1PfNHi-XptsqHAduwkKwd96hk2ll_ee2BrnfHEpDJvMEO9u6D-1NMQYDoyOXOC6U8KbxlijASam_HzLhnx2axTVCK-FkKGVZ',
    imageAlt: 'Traditional Brazilian balanced meal: grilled sliced chicken breast, fluffy white rice, carioca beans, fresh crisp garden salad with olive oil',
    ingredients: [
      { boldText: '150g peito de frango', description: 'grelhado sem pele' },
      { boldText: '150g arroz branco', description: 'cozido (ou parboilizado)' },
      { boldText: '100g feijão carioca', description: 'em caldo (concha média)' },
      { boldText: 'Salada folhosa verde', description: 'à vontade + 1 fio de azeite (5ml)' }
    ],
    tip: {
      type: 'marmita',
      text: 'Dica de Marmita: Frango grelhado e feijão porcionados congelam perfeitamente para 3 dias úteis.'
    },
    substitution: {
      title: 'Alternativa Isocalórica',
      macros: '615 kcal | 49g P',
      description: 'Patinho bovino & Tubérculo: 150g patinho moído refogado + 200g batata doce cozida com casca.'
    }
  },
  {
    id: 'meal-3',
    time: '16:30',
    title: 'Lanche Proteico',
    subtitle: 'Refeição 03 · Pós-Treino',
    kcal: 390,
    proteinGrams: 42,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOAbmxS-h06jeMKGOW_tRCPRxFc_BHeas5g5-SVavIK48-MimwmyI9t3jOx6RmOgKwbkJJVQlPoOvY0RBkSSKCzmfC_tTUxD1iCOlrhXGdI_8myvHf2voRtoQdOzPy25OqYdI8hiqzipeq3iIp-ivM70STL1cINSCSZ21hTh0wrKlTO4y-bGJe1xB4kwYatup_QOX9yHa_ngeNPkxeITZ5afvRbR62GX7y8pA6Va6FIzQjxHHvVf6N',
    imageAlt: 'High protein yogurt bowl with fresh whole strawberries, rolled oats and chocolate whey protein mix',
    ingredients: [
      { boldText: '170g iogurte natural', description: 'integral ou desnatado' },
      { boldText: '30g Whey protein', description: 'concentrado (80%)' },
      { boldText: '30g aveia', description: 'em flocos finos' },
      { boldText: '100g morangos frescos', description: 'picados (densidade calórica baixa)' }
    ]
  },
  {
    id: 'meal-4',
    time: '20:30',
    title: 'Jantar Noturno',
    subtitle: 'Refeição 04 · Ceia/Jantar',
    kcal: 460,
    proteinGrams: 40,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDwR39SqCbpzZKyhZz9VknoneJT8vBovWMcRFRFawEqJ9YpqRuaI8i0WsAcUGHJHxCBbxTVu19vSx8ckVTB1xUYl4cTrrl2qDKB0Su9Eh1l-5-YOkKuWmhC48wINQG_kUDjiH5R2DvTo6TJzjvLfzZjx8EtVl4VT7I1sLnnQHQZ-SHEYLKfdKVcTsdnVcW8j40za55StiT5pWo_w8IRiC4al_dtF7baW57hUdERHWkEtJwYOCgT9_3',
    imageAlt: 'Seared white tilapia fillet with steamed cassava chunks and colorful steamed vegetables',
    ingredients: [
      { boldText: '160g filé de tilápia grelhada', description: '(ou sobrecoxa desossada sem pele)' },
      { boldText: '180g mandioca cozida', description: 'com pitada de sal marinho' },
      { boldText: 'Vegetais no vapor', description: 'Brócolis, cenoura e abobrinha (livres)' }
    ]
  }
];

export const EXERCISES_DATA: ExerciseItem[] = [
  {
    id: 'ex-1',
    index: 1,
    title: 'Supino Reto com Barra',
    targetMuscle: 'Peito / Tríceps',
    type: 'Composto Principal',
    prescription: '3 séries × 6 a 8 reps',
    restTime: 'Descanso: 2 min 30s',
    restSeconds: 150,
    lastRecord: '76 kg × 7 reps (RIR 2)',
    currentPrescription: 'Manter carga e buscar 8 reps com pausa na primeira rep',
    rirBadge: 'RIR 1–2',
    canToggleEquipment: true,
    equipment: 'Barra',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEUVSToSwUFwGjA5Uct5rRtvmjziVhh74wB5NGKCmDMajgG9TE96nCmdayWjKvxb_ySQ3ZrDJudDM4031ZKRmS8O06drJ3z36-VgzaEqMOPZ_5wEKKEOpmgbPSb06mtg7JTY7_6-nSoCE_x4Jfd6bT4KyqF15u12dMwkfTC8PwXI26NCBCGNYWBuV9byXAIpBj1HhLzZwDHf5_TgfFcOoclLGDPIBXdezOkGa1c132NXVI0j1ZpXMV',
    imageAlt: 'Athletic muscular lifter performing flat barbell bench press with heavy iron plates',
    sets: [
      { setNumber: 1, weightKg: 76, reps: 8, rir: 2, completed: true },
      { setNumber: 2, weightKg: 76, reps: 7, rir: 1, completed: false },
      { setNumber: 3, weightKg: 76, reps: 6, rir: 1, completed: false }
    ]
  },
  {
    id: 'ex-2',
    index: 2,
    title: 'Remada Curvada (Pegada Pronada)',
    targetMuscle: 'Dorsal / Rombóides',
    type: 'Composto',
    prescription: '3 séries × 6 a 8 reps',
    restTime: 'Descanso: 2 min',
    restSeconds: 120,
    lastRecord: '68 kg × 8 reps',
    currentPrescription: 'Meta Hoje: 68 kg × 8 reps → Subir +2kg',
    rirBadge: 'RIR 1',
    canToggleEquipment: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUVxaAzPYGMQc7cojjIgZDjNJ0L4IMZ9lUQvJsIEWXRQYqJ6G1joyHqX74iwDGTG4dCV6YrYod50Y4XbFSsiXWuFTIF-CaWrLhXZwsa6LRTJ0HTh-nwoxX1Mn51jUyUIAmmAGlq6V4v3Cy_KPR7PrkzaIxMFOUzWRIAcLKQU1smXVLiY-bTtGq6S57C5GSGCIo4F9A3wRSQOuziYW4o5O347-2DfoJP1VnntMDJhs3F1UhiaBiMr66',
    imageAlt: 'Athlete performing bent over barbell row pronated grip in an aesthetic dark gym',
    sets: [
      { setNumber: 1, weightKg: 68, reps: 8, rir: 1, completed: false },
      { setNumber: 2, weightKg: 68, reps: 8, rir: 1, completed: false },
      { setNumber: 3, weightKg: 68, reps: 7, rir: 1, completed: false }
    ]
  },
  {
    id: 'ex-3',
    index: 3,
    title: 'Desenvolvimento Militar com Halteres',
    targetMuscle: 'Deltoide Anterior',
    type: 'Hipertrofia',
    prescription: '3 séries × 8 a 10 reps',
    restTime: 'Descanso: 90s',
    restSeconds: 90,
    lastRecord: '22 kg por halter',
    currentPrescription: '22 kg por halter • 3x 8-10',
    rirBadge: 'RIR 2',
    canToggleEquipment: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNrtM-rfrEJm2dJYa4hk2QpsqL2P4bH7Qtu8-qzZ7TCTfwAsFEyt7Pd5hB-7JLkQa7RlYW2nFK1RoAwaVGWiqy6OtPikCZE3QO7GE0FI46qt40fBASPzJm1gR7uFIi-15Djx6fdDWdnOWm0tlwUCj4Yu2blpSwwpqsGEgCAbM8o6KvV272J2k2bFiSrZZuLzhrLNI6SGGlYfLn0r7YP-ayjGSDDN8UPZnT_1zUSQjlEF9OnMbf8gWk',
    imageAlt: 'Fitness model seated dumbbell shoulder military press in high-end fitness studio',
    sets: [
      { setNumber: 1, weightKg: 22, reps: 10, rir: 2, completed: false },
      { setNumber: 2, weightKg: 22, reps: 9, rir: 2, completed: false },
      { setNumber: 3, weightKg: 22, reps: 8, rir: 1, completed: false }
    ]
  },
  {
    id: 'ex-4',
    index: 4,
    title: 'Puxada Alta Frente (Polia)',
    targetMuscle: 'Latíssimo do Dorso',
    type: 'Polia',
    prescription: '3 séries × 8 a 12 reps',
    restTime: 'Descanso: 90s',
    restSeconds: 90,
    lastRecord: '65 kg no stack',
    currentPrescription: '65 kg no stack • Foco na extensão escapular controlada',
    rirBadge: 'RIR 1–2',
    canToggleEquipment: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTGdUNWGGX3nLthXzYtw5XIAYRHW0fnmHCWnUtXeDSwi-2r0FgQnjTmH28kIZcNqY1hMa6qaGCZ-Tjo0Tcizgh9sYLTTaCO_vnzUnlP7l1gAoU821ezBPhjlVECPBfCThL-sLdrAAOco71BeJO0Vzz05OejEwcHRGtgGk_kHFdkIONzgOOVCg01rkcqCQAsaERu0dqWG-T7RViAALn6BPvcfRu-T7zmtHksGV0aMv4Ry_QI7R7DxaM',
    imageAlt: 'Athletic male pulling down lat pulldown cable attachment with wide grip',
    sets: [
      { setNumber: 1, weightKg: 65, reps: 12, rir: 2, completed: false },
      { setNumber: 2, weightKg: 65, reps: 10, rir: 1, completed: false },
      { setNumber: 3, weightKg: 65, reps: 10, rir: 1, completed: false }
    ]
  },
  {
    id: 'ex-5',
    index: 5,
    title: 'Elevação Lateral + Tríceps Corda',
    targetMuscle: 'Bi-Set Isolador',
    type: 'Finalizador',
    prescription: '2 séries cada × 12 a 15 reps',
    restTime: 'Descanso: 60s',
    restSeconds: 60,
    lastRecord: '12 kg lat. / 35 kg corda',
    currentPrescription: 'Estresse Metabólico: Falha concêntrica no finalizador',
    rirBadge: 'RIR 1 (Falha próxima)',
    canToggleEquipment: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsR3Zw-TF8yzw-WQMouYXL_tZfUydm56tWv51zlBSpLmdsH7cFSTF7a3k7rzRpc8W-eijCG48loJq4iV3b3MpJhqD3HvFGPqSvv_GDESZPTQiG_7YJe00IsfVoGfnk6Jz7B98kzjfsPkzrmAIhkFu-ExwbwMTvPGsg2Xoa4funWASgsl65dVI0dwkVzfgpeB2olQbT_bs9WmAR7hYaMhaDvi876fSApWWA_JkDEa51ctQQHW5Y7Aqt',
    imageAlt: 'Close up of athletic lifter arms performing dumbbell lateral raises and cable tricep rope pushdowns',
    sets: [
      { setNumber: 1, weightKg: 12, reps: 15, rir: 1, completed: false },
      { setNumber: 2, weightKg: 12, reps: 14, rir: 0, completed: false }
    ]
  }
];

export const WEIGHT_HISTORY: WeightDataPoint[] = [
  { day: 'Seg', date: '18 Out', weight: 85.0, trendWeight: 84.8 },
  { day: 'Ter', date: '19 Out', weight: 84.7, trendWeight: 84.7 },
  { day: 'Qua', date: '20 Out', weight: 85.1, trendWeight: 84.6 },
  { day: 'Qui', date: '21 Out', weight: 84.3, trendWeight: 84.5 },
  { day: 'Sex', date: '22 Out', weight: 84.4, trendWeight: 84.4 },
  { day: 'Sáb', date: '23 Out', weight: 83.9, trendWeight: 84.3 },
  { day: 'Dom', date: '24 Out', weight: 84.1, trendWeight: 84.2, isToday: true }
];

export const MEASUREMENTS: MeasurementPoint[] = [
  { name: 'Cintura', currentCm: 88, deltaCm: -1.5, type: 'cm', sublabel: 'Gordura visceral' },
  { name: 'Quadril', currentCm: 101, deltaCm: -0.8, type: 'cm', sublabel: 'Gordura periférica' },
  { name: 'Braço (Cont.)', currentCm: 38.5, deltaCm: 0.0, type: 'cm', sublabel: 'Massa mantida' }
];

export const STRENGTH_RECORDS: StrengthRecord[] = [
  { exercise: 'Supino Reto Halteres', details: '3 séries x 8 reps @ RIR 1-2', delta: '+2 kg (34 kg)', isPositive: true },
  { exercise: 'Agachamento Barra', details: '4 séries x 6 reps @ RIR 2', delta: '110 kg (Estável)', isPositive: false },
  { exercise: 'Remada Curvada Pronada', details: '3 séries x 10 reps @ RIR 2', delta: '+1 Repetição', isPositive: true }
];

export const BIOFEEDBACK_ITEMS: BiofeedbackMetric[] = [
  { title: 'Fome Subjetiva', score: '3 / 5', bars: 3, maxBars: 5, statusText: 'Controlada / Normal' },
  { title: 'Disposição & Treino', score: '4 / 5', bars: 4, maxBars: 5, statusText: 'Alta performance', highlight: true },
  { title: 'Sono Reparador', score: '7h 30m', bars: 4, maxBars: 5, statusText: 'Qualidade 4/5' },
  { title: 'Dor Articular', score: 'Zero (0/5)', bars: 1, maxBars: 5, statusText: 'Recuperação total', highlight: true }
];

export const SHOPPING_LIST = [
  { category: 'Açougue & Ovos', items: ['Ovos vermelhos caipiras (2 cartelas)', 'Peito de frango limpo (1,5 kg)', 'Filé de tilápia fresca (1,2 kg)', 'Patinho moído bovino (800g)'] },
  { category: 'Feira & Hortifruti', items: ['Banana prata (1 dúzia)', 'Morangos frescos (2 caixas)', 'Mandioca descascada (1 kg)', 'Batata doce (1 kg)', 'Brócolis e abobrinha (500g cada)', 'Mix de folhas verdes (alface, rúcula)'] },
  { category: 'Mercearia & Grãos', items: ['Arroz branco tipo 1 (1 kg)', 'Feijão carioca (1 kg)', 'Aveia em flocos finos (500g)', 'Pão 100% integral (1 pacote)', 'Azeite de oliva extra virgem'] },
  { category: 'Laticínios & Suplementação', items: ['Iogurte natural desnatado (4 potes 170g)', 'Whey Protein Isolado/Concentrado 80%', 'Queijo coalho light (opcional)'] }
];
