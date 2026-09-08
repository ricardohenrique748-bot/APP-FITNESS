const RAW_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

function framesFor(id: string, frameCount = 2): string[] {
  return Array.from({ length: frameCount }, (_, i) => `${RAW_BASE}${id}/${i}.jpg`);
}

// Verified against yuhonas/free-exercise-db (each id below returns a real 0.jpg/1.jpg pair).
const EXERCISE_MEDIA: Record<string, string[]> = {
  squat: framesFor('Barbell_Squat'),
  legPress: framesFor('Leg_Press'),
  deadlift: framesFor('Barbell_Deadlift'),
  romanianDeadlift: framesFor('Romanian_Deadlift'),
  lunge: framesFor('Dumbbell_Lunges'),
  benchPress: framesFor('Barbell_Bench_Press_-_Medium_Grip'),
  inclineBenchPress: framesFor('Barbell_Incline_Bench_Press_-_Medium_Grip'),
  dumbbellShoulderPress: framesFor('Dumbbell_Shoulder_Press'),
  militaryPress: framesFor('Standing_Military_Press'),
  lateralRaise: framesFor('Side_Lateral_Raise'),
  bentOverRow: framesFor('Bent_Over_Barbell_Row'),
  seatedCableRow: framesFor('Seated_Cable_Rows'),
  latPulldown: framesFor('Wide-Grip_Lat_Pulldown'),
  pullUp: framesFor('Pullups'),
  barbellCurl: framesFor('Barbell_Curl'),
  hammerCurl: framesFor('Alternate_Hammer_Curl'),
  tricepsPushdown: framesFor('Triceps_Pushdown'),
  tricepsExtension: framesFor('Cable_Lying_Triceps_Extension'),
  legCurl: framesFor('Lying_Leg_Curls'),
  seatedLegCurl: framesFor('Seated_Leg_Curl'),
  legExtension: framesFor('Leg_Extensions'),
  calfRaise: framesFor('Donkey_Calf_Raises'),
  plank: framesFor('Plank'),
  crunch: framesFor('Cable_Crunch'),
  hipThrust: framesFor('Barbell_Hip_Thrust'),
  facePull: framesFor('Face_Pull'),
  dips: framesFor('Dips_-_Triceps_Version'),
  chestFly: framesFor('Dumbbell_Flyes'),
  cableCrossover: framesFor('Cable_Crossover'),
  hyperextension: framesFor('Hyperextensions_Back_Extensions'),
  pushUp: framesFor('Pushups')
};

const DEFAULT_MEDIA_KEY = 'benchPress';

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

// Ordered most-specific-first: the first matching entry wins.
const KEYWORD_MEDIA_MAP: { keywords: string[]; mediaKey: string }[] = [
  { keywords: ['leg press'], mediaKey: 'legPress' },
  { keywords: ['agachamento', 'squat'], mediaKey: 'squat' },
  { keywords: ['stiff', 'romeno', 'romanian'], mediaKey: 'romanianDeadlift' },
  { keywords: ['levantamento terra', 'terra', 'deadlift'], mediaKey: 'deadlift' },
  { keywords: ['afundo', 'avanco', 'lunge', 'passada'], mediaKey: 'lunge' },
  { keywords: ['supino inclinado', 'incline bench'], mediaKey: 'inclineBenchPress' },
  { keywords: ['supino', 'bench press'], mediaKey: 'benchPress' },
  { keywords: ['desenvolvimento com halter', 'dumbbell shoulder press'], mediaKey: 'dumbbellShoulderPress' },
  { keywords: ['desenvolvimento', 'militar', 'shoulder press', 'overhead press'], mediaKey: 'militaryPress' },
  { keywords: ['elevacao lateral', 'lateral raise'], mediaKey: 'lateralRaise' },
  { keywords: ['remada curvada', 'bent over row'], mediaKey: 'bentOverRow' },
  { keywords: ['remada baixa', 'remada sentada', 'seated row', 'cable row'], mediaKey: 'seatedCableRow' },
  { keywords: ['remada'], mediaKey: 'bentOverRow' },
  { keywords: ['barra fixa', 'pull-up', 'pullup', 'pull up'], mediaKey: 'pullUp' },
  { keywords: ['puxada', 'pulldown'], mediaKey: 'latPulldown' },
  { keywords: ['rosca martelo', 'hammer curl'], mediaKey: 'hammerCurl' },
  { keywords: ['rosca', 'curl de biceps', 'bicep curl'], mediaKey: 'barbellCurl' },
  { keywords: ['triceps corda', 'triceps pulley', 'triceps pushdown', 'triceps testa', 'triceps frances'], mediaKey: 'tricepsPushdown' },
  { keywords: ['triceps'], mediaKey: 'tricepsExtension' },
  { keywords: ['mesa flexora', 'flexora deitada', 'lying leg curl'], mediaKey: 'legCurl' },
  { keywords: ['cadeira flexora', 'flexora sentada', 'seated leg curl'], mediaKey: 'seatedLegCurl' },
  { keywords: ['cadeira extensora', 'leg extension', 'extensora'], mediaKey: 'legExtension' },
  { keywords: ['panturrilha', 'calf raise', 'gemeos'], mediaKey: 'calfRaise' },
  { keywords: ['prancha', 'plank'], mediaKey: 'plank' },
  { keywords: ['abdominal', 'crunch', 'abdomen'], mediaKey: 'crunch' },
  { keywords: ['elevacao pelvica', 'hip thrust', 'ponte de gluteo', 'glute bridge'], mediaKey: 'hipThrust' },
  { keywords: ['face pull', 'puxada facial'], mediaKey: 'facePull' },
  { keywords: ['mergulho', 'paralelas', 'dips'], mediaKey: 'dips' },
  { keywords: ['crucifixo', 'fly', 'flye', 'voador', 'peck deck'], mediaKey: 'chestFly' },
  { keywords: ['crossover', 'cross over'], mediaKey: 'cableCrossover' },
  { keywords: ['hiperextensao', 'extensao lombar', 'hyperextension', 'back extension'], mediaKey: 'hyperextension' },
  { keywords: ['flexao de braco', 'push-up', 'pushup', 'push up'], mediaKey: 'pushUp' },
  // Muscle-group fallbacks (used when the exercise name itself doesn't match anything above)
  { keywords: ['peito', 'peitoral', 'chest'], mediaKey: 'benchPress' },
  { keywords: ['dorsal', 'costas', 'latissimo', 'back'], mediaKey: 'bentOverRow' },
  { keywords: ['quadriceps', 'perna', 'leg'], mediaKey: 'squat' },
  { keywords: ['posterior de coxa', 'isquiotibiais', 'hamstring'], mediaKey: 'legCurl' },
  { keywords: ['gluteo', 'glute'], mediaKey: 'hipThrust' },
  { keywords: ['ombro', 'deltoide', 'shoulder'], mediaKey: 'lateralRaise' },
  { keywords: ['biceps'], mediaKey: 'barbellCurl' },
  { keywords: ['core', 'oblíquo', 'obliquo'], mediaKey: 'plank' }
];

export function getExerciseMedia(hint: string): string[] {
  const haystack = normalize(hint);
  const match = KEYWORD_MEDIA_MAP.find((entry) => entry.keywords.some((kw) => haystack.includes(kw)));
  const mediaKey = match?.mediaKey ?? DEFAULT_MEDIA_KEY;
  return EXERCISE_MEDIA[mediaKey] ?? EXERCISE_MEDIA[DEFAULT_MEDIA_KEY];
}
