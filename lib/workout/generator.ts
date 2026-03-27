import { NormalizedExercise, Workout, WorkoutDay } from '@/lib/types'
import { calculateRepRange, calculateSets, calculateRestPeriod } from './rep-calculator'
import type { UserSettings } from '@/lib/types'

/**
 * Split routine patterns based on frequency
 */
function getPushPullLegsRoutine(frequency: number): string[][] {
  const routines: Record<number, string[][]> = {
    3: [['chest', 'shoulders', 'triceps'], ['back', 'biceps'], ['legs']],
    4: [['chest', 'triceps'], ['back', 'biceps'], ['shoulders'], ['legs']],
    5: [
      ['chest'],
      ['back'],
      ['shoulders'],
      ['legs'],
      ['chest', 'back'],
    ],
    6: [
      ['chest'],
      ['back'],
      ['shoulders'],
      ['legs'],
      ['chest', 'back'],
      ['legs'],
    ],
  }
  return routines[frequency] || routines[3]
}

/**
 * Filter exercises by target muscle and equipment
 */
function filterExercisesByMuscle(
  exercises: NormalizedExercise[],
  targetMuscle: string,
  availableEquipment: string[]
): NormalizedExercise[] {
  return exercises.filter(ex => {
    const muscleMatch = ex.targetMuscle?.toLowerCase().includes(targetMuscle.toLowerCase())
    const equipmentMatch = !ex.equipment || availableEquipment.includes(ex.equipment.toLowerCase())
    return muscleMatch && equipmentMatch
  })
}

/**
 * Generate a workout plan based on user settings and available exercises
 */
export function generateWorkoutPlan(
  userSettings: UserSettings,
  availableExercises: NormalizedExercise[]
): Workout {
  const frequency = userSettings.frequency || 3
  const intensity = userSettings.intensity || 'moderate'
  const focusMuscles = userSettings.focusMuscles || []
  const equipment = userSettings.equipment || []
  const limitations = userSettings.injuriesOrLimitations || []

  // Get split routine
  const splitGroups = getPushPullLegsRoutine(frequency)

  // Create workout days
  const workoutDays: WorkoutDay[] = splitGroups.map((muscleGroups, dayIndex) => {
    const dayExercises: NormalizedExercise[] = []

    // Add compound exercises first
    muscleGroups.forEach(muscle => {
      const compoundExercises = filterExercisesByMuscle(
        availableExercises,
        muscle,
        equipment
      ).filter(ex => isCompoundExercise(ex, limitations))

      // Take 1-2 compounds per muscle group
      dayExercises.push(...compoundExercises.slice(0, 1))
    })

    // Add secondary exercises
    muscleGroups.forEach(muscle => {
      const secondaryExercises = filterExercisesByMuscle(
        availableExercises,
        muscle,
        equipment
      ).filter(ex => !isCompoundExercise(ex, limitations) && !dayExercises.includes(ex))

      dayExercises.push(...secondaryExercises.slice(0, 2))
    })

    // Add accessories
    const accessoryExercises = availableExercises.filter(
      ex => !dayExercises.includes(ex) && !isLimitedExercise(ex, limitations)
    )
    dayExercises.push(...accessoryExercises.slice(0, 2))

    // Create day object
    return {
      id: `day-${dayIndex + 1}`,
      dayNumber: dayIndex + 1,
      name: formatDayName(muscleGroups),
      muscleGroups,
      exercises: dayExercises.map((exercise, exIndex) => {
        const isCompound = isCompoundExercise(exercise, limitations)
        const exerciseType = isCompound ? 'compound' : exIndex < 3 ? 'secondary' : 'accessory'
        const reps = calculateRepRange(intensity, exerciseType)
        const sets = calculateSets(intensity, exerciseType)

        return {
          id: exercise.id,
          exerciseName: exercise.name,
          sets,
          repsMin: reps.min,
          repsMax: reps.max,
          restSeconds: calculateRestPeriod(intensity, exerciseType),
          notes: '',
          targetMuscle: exercise.targetMuscle,
          equipment: exercise.equipment,
          bodyPart: exercise.bodyPart,
        }
      }),
    }
  })

  return {
    id: `workout-${Date.now()}`,
    name: `${intensity.charAt(0).toUpperCase() + intensity.slice(1)} ${frequency}x Weekly Split`,
    description: `Custom ${frequency} day workout split focused on ${focusMuscles.join(', ') || 'all muscle groups'}`,
    frequency,
    days: workoutDays,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

/**
 * Check if exercise is a compound movement
 */
function isCompoundExercise(exercise: NormalizedExercise, limitations: string[]): boolean {
  const compoundKeywords = ['squat', 'deadlift', 'bench', 'press', 'row', 'pull']
  const name = exercise.name.toLowerCase()

  if (limitations.some(lim => name.includes(lim.toLowerCase()))) {
    return false
  }

  return compoundKeywords.some(keyword => name.includes(keyword))
}

/**
 * Check if exercise is limited due to user injuries
 */
function isLimitedExercise(exercise: NormalizedExercise, limitations: string[]): boolean {
  if (!limitations || limitations.length === 0) return false

  const name = exercise.name.toLowerCase()
  return limitations.some(lim => name.includes(lim.toLowerCase()))
}

/**
 * Format day name from muscle groups
 */
function formatDayName(muscleGroups: string[]): string {
  const formatted = muscleGroups.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join('/')
  return formatted.length > 20 ? `${formatted.slice(0, 17)}...` : formatted
}
