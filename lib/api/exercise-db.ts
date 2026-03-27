import type { UserSettings, NormalizedExercise } from './index'

const EXERCISE_DB_API = 'https://api.api-ninjas.com/v1'

export interface ExerciseDBExercise {
  name: string
  type?: string
  muscle?: string
  equipment?: string
  difficulty?: string
  instructions?: string
  // Legacy field names from other APIs
  target?: string
  bodyPart?: string
  exerciseId?: string
  gifUrl?: string
  imageUrl?: string
  videoUrl?: string
  secondaryMuscles?: string[]
}

/**
 * Normalize exercise to our internal format
 */
function normalizeExercise(ex: ExerciseDBExercise): NormalizedExercise {
  return {
    id: ex.name + (ex.muscle || ''),
    name: ex.name,
    targetMuscle: ex.muscle || ex.target || '',
    equipment: ex.equipment || '',
    bodyPart: ex.type || ex.bodyPart || '',
    gifUrl: ex.gifUrl || ex.imageUrl || '',
    videoUrl: ex.videoUrl,
    secondaryMuscles: ex.secondaryMuscles,
    instructions: ex.instructions ? [ex.instructions] : undefined,
  }
}

/**
 * Fallback exercises with full data
 */
const FALLBACK_EXERCISES: NormalizedExercise[] = [
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    targetMuscle: 'chest',
    equipment: 'barbell',
    bodyPart: 'chest',
    gifUrl: 'https://api.api-ninjas.com/v1/exercises?muscle=chest&offset=0',
    instructions: ['Lie on a flat bench', 'Grip the bar slightly wider than shoulder width', 'Lower the bar to your chest', 'Press back up to starting position'],
  },
  {
    id: 'squat',
    name: 'Barbell Squat',
    targetMuscle: 'quadriceps',
    equipment: 'barbell',
    bodyPart: 'legs',
    instructions: ['Position bar on upper back', 'Lower your body by bending knees', 'Keep chest up and core tight', 'Return to standing position'],
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    targetMuscle: 'back',
    equipment: 'barbell',
    bodyPart: 'back',
    instructions: ['Stand with feet hip-width apart', 'Grip bar with hands just outside legs', 'Keep back straight and lift', 'Return bar to ground with control'],
  },
]

/**
 * Fetch exercises by muscle group
 */
export async function getExercisesByMuscle(muscle: string): Promise<NormalizedExercise[]> {
  try {
    const url = `${EXERCISE_DB_API}/exercises?muscle=${encodeURIComponent(muscle)}`
    const response = await fetch(url)
    
    if (!response.ok) return filterFallbackByMuscle(muscle)
    
    const data = await response.json()
    if (!Array.isArray(data)) return filterFallbackByMuscle(muscle)
    
    return data.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by muscle:', error)
    return filterFallbackByMuscle(muscle)
  }
}

/**
 * Fetch exercises by equipment
 */
export async function getExercisesByEquipment(equipment: string): Promise<NormalizedExercise[]> {
  try {
    const url = `${EXERCISE_DB_API}/exercises?equipment=${encodeURIComponent(equipment)}`
    const response = await fetch(url)
    
    if (!response.ok) return filterFallbackByEquipment(equipment)
    
    const data = await response.json()
    if (!Array.isArray(data)) return filterFallbackByEquipment(equipment)
    
    return data.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by equipment:', error)
    return filterFallbackByEquipment(equipment)
  }
}

/**
 * Fetch exercises by body part
 */
export async function getExercisesByBodyPart(bodyPart: string): Promise<NormalizedExercise[]> {
  try {
    const url = `${EXERCISE_DB_API}/exercises?type=${encodeURIComponent(bodyPart)}`
    const response = await fetch(url)
    
    if (!response.ok) return filterFallbackByBodyPart(bodyPart)
    
    const data = await response.json()
    if (!Array.isArray(data)) return filterFallbackByBodyPart(bodyPart)
    
    return data.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by body part:', error)
    return filterFallbackByBodyPart(bodyPart)
  }
}

/**
 * Fetch all exercises with pagination
 */
export async function getAllExercises(limit = 30, offset = 0): Promise<NormalizedExercise[]> {
  try {
    const url = `${EXERCISE_DB_API}/exercises?limit=${limit}&offset=${offset}`
    const response = await fetch(url)
    
    if (!response.ok) return FALLBACK_EXERCISES
    
    const data = await response.json()
    if (!Array.isArray(data)) return FALLBACK_EXERCISES
    
    return data.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching all exercises:', error)
    return FALLBACK_EXERCISES
  }
}

/**
 * Get list of available muscles
 */
export async function getMuscles(): Promise<string[]> {
  const muscles = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'legs', 'quadriceps', 'hamstrings', 'glutes']
  return muscles
}

/**
 * Get list of available equipment
 */
export async function getEquipment(): Promise<string[]> {
  const equipment = ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'resistance band']
  return equipment
}

/**
 * Get list of available body parts
 */
export async function getBodyParts(): Promise<string[]> {
  const bodyParts = ['chest', 'back', 'shoulders', 'arms', 'forearms', 'legs', 'calves', 'core', 'full body']
  return bodyParts
}

/**
 * Filter fallback exercises by muscle
 */
function filterFallbackByMuscle(muscle: string): NormalizedExercise[] {
  return FALLBACK_EXERCISES.filter(ex => ex.targetMuscle.toLowerCase().includes(muscle.toLowerCase()))
}

/**
 * Normalize exercise to our internal format
 */
function normalizeExercise(ex: ExerciseDBExercise): NormalizedExercise {
  return {
    id: ex.name + (ex.muscle || ''),
    name: ex.name,
    targetMuscle: ex.muscle || ex.target || '',
    equipment: ex.equipment || '',
    bodyPart: ex.type || ex.bodyPart || '',
    gifUrl: ex.gifUrl || ex.imageUrl || '',
    videoUrl: ex.videoUrl,
    secondaryMuscles: ex.secondaryMuscles,
    instructions: ex.instructions ? [ex.instructions] : undefined,
  }
}

/**
 * Filter fallback exercises by body part
 */
function filterFallbackByBodyPart(bodyPart: string): NormalizedExercise[] {
  return FALLBACK_EXERCISES.filter(ex => ex.bodyPart.toLowerCase().includes(bodyPart.toLowerCase()))
}
