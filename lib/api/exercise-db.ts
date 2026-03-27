// Using the free, open-source ExerciseDB API v1
// Docs: https://exercisedb.dev/docs
const EXERCISE_DB_API = 'https://exercisedb.dev'

export interface ExerciseDBExercise {
  exerciseId: string
  name: string
  target: string
  equipment: string
  bodyPart: string
  gifUrl?: string
  imageUrl?: string
  videoUrl?: string
  secondaryMuscles?: string[]
  instructions?: string[]
}

export interface NormalizedExercise {
  id: string
  name: string
  targetMuscle: string
  equipment: string
  bodyPart: string
  gifUrl: string
  videoUrl?: string
  secondaryMuscles?: string[]
  instructions?: string[]
}

/**
 * Normalize ExerciseDB response to our internal format
 */
function normalizeExercise(exercise: ExerciseDBExercise): NormalizedExercise {
  console.log('[v0] Normalizing:', {
    name: exercise.name,
    target: exercise.target,
    bodyPart: exercise.bodyPart,
    equipment: exercise.equipment,
    keys: Object.keys(exercise)
  })
  return {
    id: exercise.exerciseId || String(Math.random()),
    name: exercise.name,
    targetMuscle: exercise.target || '',
    equipment: exercise.equipment || '',
    bodyPart: exercise.bodyPart || '',
    gifUrl: exercise.gifUrl || exercise.imageUrl || '',
    videoUrl: exercise.videoUrl,
    secondaryMuscles: exercise.secondaryMuscles,
    instructions: exercise.instructions,
  }
}

/**
 * Fetch all muscles
 */
export async function getMuscles(): Promise<string[]> {
  try {
    const response = await fetch(`${EXERCISE_DB_API}/api/v1/muscles`)

    if (!response.ok) {
      console.error('[v0] Muscles API error:', response.status)
      return DEFAULT_MUSCLES
    }

    const data = await response.json()
    return Array.isArray(data) ? data : DEFAULT_MUSCLES
  } catch (error) {
    console.error('[v0] Error fetching muscles:', error)
    return DEFAULT_MUSCLES
  }
}

/**
 * Fetch all equipment
 */
export async function getEquipment(): Promise<string[]> {
  try {
    const response = await fetch(`${EXERCISE_DB_API}/api/v1/equipments`)

    if (!response.ok) {
      console.error('[v0] Equipment API error:', response.status)
      return DEFAULT_EQUIPMENT
    }

    const data = await response.json()
    return Array.isArray(data) ? data : DEFAULT_EQUIPMENT
  } catch (error) {
    console.error('[v0] Error fetching equipment:', error)
    return DEFAULT_EQUIPMENT
  }
}

/**
 * Fetch all body parts
 */
export async function getBodyParts(): Promise<string[]> {
  try {
    const response = await fetch(`${EXERCISE_DB_API}/api/v1/bodyparts`)

    if (!response.ok) {
      console.error('[v0] BodyParts API error:', response.status)
      return DEFAULT_BODYPARTS
    }

    const data = await response.json()
    return Array.isArray(data) ? data : DEFAULT_BODYPARTS
  } catch (error) {
    console.error('[v0] Error fetching body parts:', error)
    return DEFAULT_BODYPARTS
  }
}

/**
 * Fetch exercises by target muscle group
 * Endpoint: /api/v1/muscles/{muscleName}/exercises
 */
export async function getExercisesByMuscle(muscle: string, limit = 20): Promise<NormalizedExercise[]> {
  try {
    const url = `${EXERCISE_DB_API}/api/v1/muscles/${encodeURIComponent(muscle)}/exercises?limit=${limit}`
    
    const response = await fetch(url)

    if (!response.ok) {
      console.error('[v0] Muscle exercises API error:', response.status)
      return filterFallbackByMuscle(muscle)
    }

    const rawData = await response.json()
    const exercises = extractExercises(rawData)
    
    if (exercises.length === 0) {
      return filterFallbackByMuscle(muscle)
    }
    
    return exercises.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by muscle:', error)
    return filterFallbackByMuscle(muscle)
  }
}

/**
 * Fetch exercises by equipment type
 * Endpoint: /api/v1/equipments/{equipmentName}/exercises
 */
export async function getExercisesByEquipment(equipment: string, limit = 20): Promise<NormalizedExercise[]> {
  try {
    const url = `${EXERCISE_DB_API}/api/v1/equipments/${encodeURIComponent(equipment)}/exercises?limit=${limit}`
    
    const response = await fetch(url)

    if (!response.ok) {
      console.error('[v0] Equipment exercises API error:', response.status)
      return filterFallbackByEquipment(equipment)
    }

    const rawData = await response.json()
    const exercises = extractExercises(rawData)
    
    if (exercises.length === 0) {
      return filterFallbackByEquipment(equipment)
    }
    
    return exercises.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by equipment:', error)
    return filterFallbackByEquipment(equipment)
  }
}

/**
 * Fetch exercises by body part
 * Endpoint: /api/v1/bodyparts/{bodyPartName}/exercises
 */
export async function getExercisesByBodyPart(bodyPart: string, limit = 20): Promise<NormalizedExercise[]> {
  try {
    const url = `${EXERCISE_DB_API}/api/v1/bodyparts/${encodeURIComponent(bodyPart)}/exercises?limit=${limit}`
    
    const response = await fetch(url)

    if (!response.ok) {
      console.error('[v0] BodyPart exercises API error:', response.status)
      return filterFallbackByBodyPart(bodyPart)
    }

    const rawData = await response.json()
    const exercises = extractExercises(rawData)
    
    if (exercises.length === 0) {
      return filterFallbackByBodyPart(bodyPart)
    }
    
    return exercises.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by body part:', error)
    return filterFallbackByBodyPart(bodyPart)
  }
}

/**
 * Fetch all exercises (with optional pagination)
 * Endpoint: /api/v1/exercises
 */
export async function getAllExercises(limit = 30, offset = 0): Promise<NormalizedExercise[]> {
  try {
    const url = `${EXERCISE_DB_API}/api/v1/exercises?limit=${limit}&offset=${offset}`
    console.log('[v0] Fetching all exercises from:', url)
    const response = await fetch(url)

    if (!response.ok) {
      console.log('[v0] API not OK, returning fallback')
      return FALLBACK_EXERCISES
    }

    const rawData = await response.json()
    console.log('[v0] Raw response type:', Array.isArray(rawData) ? 'array' : typeof rawData)
    console.log('[v0] First raw item:', JSON.stringify(rawData[0] || {}).slice(0, 300))
    
    const exercises = extractExercises(rawData)
    console.log('[v0] Extracted exercises:', exercises.length)
    
    if (exercises.length === 0) {
      return FALLBACK_EXERCISES
    }
    
    const normalized = exercises.map(normalizeExercise)
    console.log('[v0] Normalized first:', JSON.stringify(normalized[0]).slice(0, 300))
    return normalized
  } catch (error) {
    console.error('[v0] Error fetching all exercises:', error)
    return FALLBACK_EXERCISES
  }
}

/**
 * Extract exercises array from various response formats
 */
function extractExercises(data: unknown): ExerciseDBExercise[] {
  if (Array.isArray(data)) {
    return data
  }
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.data)) return obj.data
    if (Array.isArray(obj.exercises)) return obj.exercises
    if (Array.isArray(obj.results)) return obj.results
  }
  return []
}

function filterFallbackByMuscle(muscle: string): NormalizedExercise[] {
  return FALLBACK_EXERCISES.filter(e => 
    e.targetMuscle.toLowerCase().includes(muscle.toLowerCase())
  )
}

function filterFallbackByEquipment(equipment: string): NormalizedExercise[] {
  return FALLBACK_EXERCISES.filter(e => 
    e.equipment.toLowerCase().includes(equipment.toLowerCase())
  )
}

function filterFallbackByBodyPart(bodyPart: string): NormalizedExercise[] {
  return FALLBACK_EXERCISES.filter(e => 
    e.bodyPart.toLowerCase().includes(bodyPart.toLowerCase())
  )
}

// Default values when API is unavailable
const DEFAULT_MUSCLES = [
  'abductors', 'abs', 'adductors', 'biceps', 'calves', 'cardiovascular system',
  'delts', 'forearms', 'glutes', 'hamstrings', 'lats', 'levator scapulae',
  'pectorals', 'quads', 'serratus anterior', 'spine', 'traps', 'triceps', 'upper back'
]

const DEFAULT_EQUIPMENT = [
  'assisted', 'band', 'barbell', 'body weight', 'bosu ball', 'cable',
  'dumbbell', 'elliptical machine', 'ez barbell', 'hammer', 'kettlebell',
  'leverage machine', 'medicine ball', 'olympic barbell', 'resistance band',
  'roller', 'rope', 'skierg machine', 'sled machine', 'smith machine',
  'stability ball', 'stationary bike', 'stepmill machine', 'tire',
  'trap bar', 'upper body ergometer', 'weighted', 'wheel roller'
]

const DEFAULT_BODYPARTS = [
  'back', 'cardio', 'chest', 'lower arms', 'lower legs',
  'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
]

/**
 * Comprehensive fallback exercises for when API is unavailable
 */
export const FALLBACK_EXERCISES: NormalizedExercise[] = [
  // Chest
  { id: 'fb-1', name: 'Barbell Bench Press', targetMuscle: 'pectorals', equipment: 'barbell', bodyPart: 'chest', gifUrl: '' },
  { id: 'fb-2', name: 'Dumbbell Fly', targetMuscle: 'pectorals', equipment: 'dumbbell', bodyPart: 'chest', gifUrl: '' },
  { id: 'fb-3', name: 'Push-Up', targetMuscle: 'pectorals', equipment: 'body weight', bodyPart: 'chest', gifUrl: '' },
  { id: 'fb-4', name: 'Incline Dumbbell Press', targetMuscle: 'pectorals', equipment: 'dumbbell', bodyPart: 'chest', gifUrl: '' },
  { id: 'fb-5', name: 'Cable Crossover', targetMuscle: 'pectorals', equipment: 'cable', bodyPart: 'chest', gifUrl: '' },
  
  // Back
  { id: 'fb-6', name: 'Deadlift', targetMuscle: 'glutes', equipment: 'barbell', bodyPart: 'back', gifUrl: '' },
  { id: 'fb-7', name: 'Lat Pulldown', targetMuscle: 'lats', equipment: 'cable', bodyPart: 'back', gifUrl: '' },
  { id: 'fb-8', name: 'Barbell Row', targetMuscle: 'upper back', equipment: 'barbell', bodyPart: 'back', gifUrl: '' },
  { id: 'fb-9', name: 'Pull-Up', targetMuscle: 'lats', equipment: 'body weight', bodyPart: 'back', gifUrl: '' },
  { id: 'fb-10', name: 'Seated Cable Row', targetMuscle: 'upper back', equipment: 'cable', bodyPart: 'back', gifUrl: '' },
  
  // Shoulders
  { id: 'fb-11', name: 'Overhead Press', targetMuscle: 'delts', equipment: 'barbell', bodyPart: 'shoulders', gifUrl: '' },
  { id: 'fb-12', name: 'Lateral Raise', targetMuscle: 'delts', equipment: 'dumbbell', bodyPart: 'shoulders', gifUrl: '' },
  { id: 'fb-13', name: 'Front Raise', targetMuscle: 'delts', equipment: 'dumbbell', bodyPart: 'shoulders', gifUrl: '' },
  { id: 'fb-14', name: 'Face Pull', targetMuscle: 'delts', equipment: 'cable', bodyPart: 'shoulders', gifUrl: '' },
  
  // Arms
  { id: 'fb-15', name: 'Barbell Curl', targetMuscle: 'biceps', equipment: 'barbell', bodyPart: 'upper arms', gifUrl: '' },
  { id: 'fb-16', name: 'Tricep Pushdown', targetMuscle: 'triceps', equipment: 'cable', bodyPart: 'upper arms', gifUrl: '' },
  { id: 'fb-17', name: 'Hammer Curl', targetMuscle: 'biceps', equipment: 'dumbbell', bodyPart: 'upper arms', gifUrl: '' },
  { id: 'fb-18', name: 'Skull Crusher', targetMuscle: 'triceps', equipment: 'barbell', bodyPart: 'upper arms', gifUrl: '' },
  
  // Legs
  { id: 'fb-19', name: 'Barbell Squat', targetMuscle: 'quads', equipment: 'barbell', bodyPart: 'upper legs', gifUrl: '' },
  { id: 'fb-20', name: 'Leg Press', targetMuscle: 'quads', equipment: 'leverage machine', bodyPart: 'upper legs', gifUrl: '' },
  { id: 'fb-21', name: 'Romanian Deadlift', targetMuscle: 'hamstrings', equipment: 'barbell', bodyPart: 'upper legs', gifUrl: '' },
  { id: 'fb-22', name: 'Leg Curl', targetMuscle: 'hamstrings', equipment: 'leverage machine', bodyPart: 'upper legs', gifUrl: '' },
  { id: 'fb-23', name: 'Calf Raise', targetMuscle: 'calves', equipment: 'leverage machine', bodyPart: 'lower legs', gifUrl: '' },
  { id: 'fb-24', name: 'Lunge', targetMuscle: 'glutes', equipment: 'body weight', bodyPart: 'upper legs', gifUrl: '' },
  
  // Core
  { id: 'fb-25', name: 'Crunch', targetMuscle: 'abs', equipment: 'body weight', bodyPart: 'waist', gifUrl: '' },
  { id: 'fb-26', name: 'Plank', targetMuscle: 'abs', equipment: 'body weight', bodyPart: 'waist', gifUrl: '' },
  { id: 'fb-27', name: 'Russian Twist', targetMuscle: 'abs', equipment: 'body weight', bodyPart: 'waist', gifUrl: '' },
  { id: 'fb-28', name: 'Leg Raise', targetMuscle: 'abs', equipment: 'body weight', bodyPart: 'waist', gifUrl: '' },
  { id: 'fb-29', name: 'Cable Woodchop', targetMuscle: 'abs', equipment: 'cable', bodyPart: 'waist', gifUrl: '' },
  { id: 'fb-30', name: 'Ab Wheel Rollout', targetMuscle: 'abs', equipment: 'wheel roller', bodyPart: 'waist', gifUrl: '' },
]
