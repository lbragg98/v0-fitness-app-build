import type {
  Exercise,
  SplitPreference,
  UserSettings,
  Workout,
  WorkoutDay,
} from '@/lib/types'

type CandidateExercise = {
  id: string
  name: string
  targetMuscle?: string
  bodyPart?: string
  equipment?: string[] | string
  instructions?: string[]
  gifUrl?: string
  image?: string
}

type WorkoutSlot =
  | 'full_body'
  | 'upper'
  | 'lower'
  | 'push'
  | 'pull'
  | 'legs'
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'

const CALENDAR_SLOTS: Record<number, number[]> = {
  2: [1, 4], // Mon Thu
  3: [1, 3, 5], // Mon Wed Fri
  4: [1, 2, 4, 5], // Mon Tue Thu Fri
  5: [1, 2, 3, 5, 6], // Mon Tue Wed Fri Sat
  6: [1, 2, 3, 4, 5, 6], // Mon-Sat
}

const SLOT_MUSCLES: Record<WorkoutSlot, string[]> = {
  full_body: ['chest', 'back', 'legs', 'shoulders'],
  upper: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  lower: ['legs', 'glutes', 'hamstrings', 'quads', 'calves'],
  push: ['chest', 'shoulders', 'triceps'],
  pull: ['back', 'biceps'],
  legs: ['legs', 'glutes', 'hamstrings', 'quads', 'calves'],
  chest: ['chest'],
  back: ['back'],
  shoulders: ['shoulders'],
  arms: ['biceps', 'triceps'],
}

const SLOT_LABELS: Record<WorkoutSlot, string> = {
  full_body: 'Full Body',
  upper: 'Upper Body',
  lower: 'Lower Body',
  push: 'Push',
  pull: 'Pull',
  legs: 'Legs',
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  arms: 'Arms',
}

function normalizeEquipment(equipment?: string[] | string): string[] {
  if (!equipment) return []
  return Array.isArray(equipment)
    ? equipment.map((item) => item.toLowerCase())
    : [equipment.toLowerCase()]
}

function normalizeText(value?: string): string {
  return (value || '').trim().toLowerCase()
}

function chooseSplitPreference(
  frequency: number,
  splitPreference?: SplitPreference
): SplitPreference {
  if (!splitPreference || splitPreference === 'auto') {
    if (frequency <= 2) return 'full_body'
    if (frequency === 3) return 'push_pull_legs'
    if (frequency === 4) return 'upper_lower'
    if (frequency >= 5) return 'push_pull_legs'
    return 'full_body'
  }

  return splitPreference
}

function getSplitTemplate(
  frequency: number,
  splitPreference?: SplitPreference
): WorkoutSlot[] {
  const choice = chooseSplitPreference(frequency, splitPreference)

  switch (choice) {
    case 'full_body':
      return Array.from({ length: frequency }, () => 'full_body')

    case 'upper_lower':
      if (frequency === 2) return ['upper', 'lower']
      if (frequency === 4) return ['upper', 'lower', 'upper', 'lower']
      return ['upper', 'lower', 'upper'].slice(0, frequency)

    case 'push_pull_legs':
      if (frequency === 3) return ['push', 'pull', 'legs']
      if (frequency === 4) return ['push', 'pull', 'legs', 'upper']
      if (frequency === 5) return ['push', 'pull', 'legs', 'upper', 'lower']
      if (frequency === 6) return ['push', 'pull', 'legs', 'push', 'pull', 'legs']
      return ['push', 'pull', 'legs'].slice(0, frequency)

    case 'full_body_focus':
      if (frequency === 4) return ['full_body', 'upper', 'full_body', 'lower']
      if (frequency === 5) {
        return ['full_body', 'upper', 'lower', 'full_body', 'arms']
      }
      return Array.from({ length: frequency }, () => 'full_body')

    case 'body_part':
      if (frequency === 5) return ['chest', 'back', 'legs', 'shoulders', 'arms']
      if (frequency === 6) {
        return ['chest', 'back', 'legs', 'shoulders', 'arms', 'full_body']
      }
      return ['chest', 'back', 'legs'].slice(0, frequency)

    default:
      return Array.from({ length: frequency }, () => 'full_body')
  }
}

function getCalendarDays(frequency: number): number[] {
  return CALENDAR_SLOTS[frequency] || CALENDAR_SLOTS[3]
}

function scoreExercise(
  exercise: CandidateExercise,
  muscles: string[],
  availableEquipment: string[],
  limitations: string[],
  usedIds: Set<string>,
  goal: UserSettings['goal']
): number {
  if (!exercise.id || usedIds.has(exercise.id)) return -999

  const name = normalizeText(exercise.name)
  const targetMuscle = normalizeText(exercise.targetMuscle)
  const bodyPart = normalizeText(exercise.bodyPart)
  const exerciseEquipment = normalizeEquipment(exercise.equipment)

  if (
    limitations.some((limitation) => {
      const lim = limitation.toLowerCase()
      return name.includes(lim) || targetMuscle.includes(lim) || bodyPart.includes(lim)
    })
  ) {
    return -999
  }

  let score = 0

  if (muscles.some((muscle) => targetMuscle.includes(muscle.toLowerCase()))) score += 6
  if (muscles.some((muscle) => bodyPart.includes(muscle.toLowerCase()))) score += 4

  if (availableEquipment.length === 0) {
    score += exerciseEquipment.length === 0 ? 2 : 0
  } else if (exerciseEquipment.length === 0) {
    score += 2
  } else if (exerciseEquipment.some((eq) => availableEquipment.includes(eq))) {
    score += 5
  } else {
    score -= 6
  }

  if (isCompoundExercise(name)) score += 2

  if (goal === 'strength' && isCompoundExercise(name)) score += 3
  if (goal === 'muscle-gain' && !isCompoundExercise(name)) score += 1
  if (goal === 'endurance' && /plank|carry|jump|burpee|mountain climber/.test(name)) score += 3

  return score
}

function isCompoundExercise(name: string): boolean {
  return /squat|deadlift|bench|press|row|pull.?up|chin.?up|lunge/.test(name)
}

function determineExerciseRole(
  exerciseName: string,
  currentIndex: number
): 'compound' | 'secondary' | 'accessory' {
  if (isCompoundExercise(exerciseName) && currentIndex < 2) return 'compound'
  if (currentIndex < 4) return 'secondary'
  return 'accessory'
}

function getRepRange(role: 'compound' | 'secondary' | 'accessory') {
  if (role === 'compound') return { min: 6, max: 8, sets: 4, restSeconds: 120 }
  if (role === 'secondary') return { min: 8, max: 12, sets: 3, restSeconds: 90 }
  return { min: 10, max: 15, sets: 3, restSeconds: 60 }
}

function toExercise(
  exercise: CandidateExercise,
  role: 'compound' | 'secondary' | 'accessory'
): Exercise {
  const prescription = getRepRange(role)

  return {
    id: exercise.id,
    name: exercise.name,
    targetMuscle: exercise.targetMuscle || exercise.bodyPart || 'general',
    equipment: normalizeEquipment(exercise.equipment),
    bodyPart: exercise.bodyPart || exercise.targetMuscle || 'general',
    difficulty: role === 'compound' ? 'intermediate' : 'beginner',
    instructions: exercise.instructions || [],
    image: exercise.image,
    gifUrl: exercise.gifUrl,
    exerciseType: role === 'compound' ? 'compound' : role === 'secondary' ? 'isolation' : 'accessory',
    sets: prescription.sets,
    reps: prescription.min,
    repsMin: prescription.min,
    repsMax: prescription.max,
    restSeconds: prescription.restSeconds,
    notes:
      'Choose a weight that makes the target rep range challenging while keeping good form.',
  }
}

function estimateDuration(exercises: Exercise[]): number {
  return exercises.reduce((total, exercise) => {
    const sets = exercise.sets || 3
    const workMinutes = sets * 1
    const restMinutes = Math.ceil(((exercise.restSeconds || 60) * Math.max(sets - 1, 0)) / 60)
    return total + workMinutes + restMinutes
  }, 5)
}

function buildWorkoutDay(
  slot: WorkoutSlot,
  index: number,
  calendarDay: number,
  availableExercises: CandidateExercise[],
  userSettings: UserSettings
): WorkoutDay {
  const muscles = SLOT_MUSCLES[slot]
  const availableEquipment = (userSettings.equipment || []).map((item) => item.toLowerCase())
  const limitations = (userSettings.injuriesOrLimitations || []).map((item) =>
    item.toLowerCase()
  )

  const ranked = availableExercises
    .map((exercise) => ({
      exercise,
      score: scoreExercise(
        exercise,
        muscles,
        availableEquipment,
        limitations,
        new Set<string>(),
        userSettings.goal
      ),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  const usedIds = new Set<string>()
  const chosen: Exercise[] = []

  for (const entry of ranked) {
    if (chosen.length >= 6) break
    if (usedIds.has(entry.exercise.id)) continue

    const role = determineExerciseRole(entry.exercise.name.toLowerCase(), chosen.length)
    chosen.push(toExercise(entry.exercise, role))
    usedIds.add(entry.exercise.id)
  }

  return {
    id: `day-${index + 1}`,
    dayNumber: calendarDay,
    calendarDay,
    name: SLOT_LABELS[slot],
    splitKey: slot,
    muscleGroups: muscles,
    exercises: chosen,
    isRestDay: false,
    estimatedDuration: estimateDuration(chosen),
  }
}

export function generateWorkoutPlan(
  userSettings: UserSettings,
  availableExercises: CandidateExercise[]
): Workout {
  const frequency = userSettings.frequency || 3
  const splitPreference = chooseSplitPreference(
    frequency,
    userSettings.splitPreference
  )

  const template = getSplitTemplate(frequency, splitPreference)
  const calendarDays = getCalendarDays(frequency)

  const days = template.map((slot, index) =>
    buildWorkoutDay(slot, index, calendarDays[index], availableExercises, userSettings)
  )

  return {
    id: `workout-${Date.now()}`,
    name: `${template.length} Day ${splitPreference
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')}`,
    description: `Generated ${template.length}-day plan using the ${splitPreference.replaceAll('_', ' ')} split.`,
    frequency,
    splitPreference,
    days,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isActive: true,
  }
}
