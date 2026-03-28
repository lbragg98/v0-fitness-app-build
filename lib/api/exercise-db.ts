import type { NormalizedExercise } from '@/lib/types'

// Fallback exercises when API is unavailable
const FALLBACK_EXERCISES: NormalizedExercise[] = [
  { id: 'bench-press', name: 'Barbell Bench Press', targetMuscle: 'chest', equipment: 'barbell', bodyPart: 'upper body', gifUrl: '' },
  { id: 'incline-press', name: 'Incline Dumbbell Press', targetMuscle: 'chest', equipment: 'dumbbell', bodyPart: 'upper body', gifUrl: '' },
  { id: 'cable-fly', name: 'Cable Fly', targetMuscle: 'chest', equipment: 'cable', bodyPart: 'upper body', gifUrl: '' },
  { id: 'push-up', name: 'Push-Up', targetMuscle: 'chest', equipment: 'body weight', bodyPart: 'upper body', gifUrl: '' },
  { id: 'deadlift', name: 'Barbell Deadlift', targetMuscle: 'back', equipment: 'barbell', bodyPart: 'upper body', gifUrl: '' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', targetMuscle: 'back', equipment: 'cable', bodyPart: 'upper body', gifUrl: '' },
  { id: 'bent-over-row', name: 'Barbell Bent Over Row', targetMuscle: 'back', equipment: 'barbell', bodyPart: 'upper body', gifUrl: '' },
  { id: 'pull-up', name: 'Pull-Up', targetMuscle: 'back', equipment: 'body weight', bodyPart: 'upper body', gifUrl: '' },
  { id: 'overhead-press', name: 'Overhead Press', targetMuscle: 'shoulders', equipment: 'barbell', bodyPart: 'upper body', gifUrl: '' },
  { id: 'lateral-raise', name: 'Lateral Raise', targetMuscle: 'shoulders', equipment: 'dumbbell', bodyPart: 'upper body', gifUrl: '' },
  { id: 'face-pull', name: 'Face Pull', targetMuscle: 'shoulders', equipment: 'cable', bodyPart: 'upper body', gifUrl: '' },
  { id: 'barbell-curl', name: 'Barbell Curl', targetMuscle: 'biceps', equipment: 'barbell', bodyPart: 'arms', gifUrl: '' },
  { id: 'hammer-curl', name: 'Hammer Curl', targetMuscle: 'biceps', equipment: 'dumbbell', bodyPart: 'arms', gifUrl: '' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', targetMuscle: 'triceps', equipment: 'cable', bodyPart: 'arms', gifUrl: '' },
  { id: 'skull-crusher', name: 'Skull Crusher', targetMuscle: 'triceps', equipment: 'barbell', bodyPart: 'arms', gifUrl: '' },
  { id: 'squat', name: 'Barbell Squat', targetMuscle: 'quadriceps', equipment: 'barbell', bodyPart: 'legs', gifUrl: '' },
  { id: 'leg-press', name: 'Leg Press', targetMuscle: 'quadriceps', equipment: 'machine', bodyPart: 'legs', gifUrl: '' },
  { id: 'lunges', name: 'Walking Lunges', targetMuscle: 'quadriceps', equipment: 'body weight', bodyPart: 'legs', gifUrl: '' },
  { id: 'leg-curl', name: 'Lying Leg Curl', targetMuscle: 'hamstrings', equipment: 'machine', bodyPart: 'legs', gifUrl: '' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', targetMuscle: 'hamstrings', equipment: 'barbell', bodyPart: 'legs', gifUrl: '' },
  { id: 'calf-raise', name: 'Standing Calf Raise', targetMuscle: 'calves', equipment: 'machine', bodyPart: 'legs', gifUrl: '' },
  { id: 'plank', name: 'Plank', targetMuscle: 'abs', equipment: 'body weight', bodyPart: 'core', gifUrl: '' },
  { id: 'crunch', name: 'Crunch', targetMuscle: 'abs', equipment: 'body weight', bodyPart: 'core', gifUrl: '' },
  { id: 'leg-raise', name: 'Hanging Leg Raise', targetMuscle: 'abs', equipment: 'body weight', bodyPart: 'core', gifUrl: '' },
  { id: 'cable-crunch', name: 'Cable Crunch', targetMuscle: 'abs', equipment: 'cable', bodyPart: 'core', gifUrl: '' },
  { id: 'hip-thrust', name: 'Hip Thrust', targetMuscle: 'glutes', equipment: 'barbell', bodyPart: 'legs', gifUrl: '' },
  { id: 'glute-bridge', name: 'Glute Bridge', targetMuscle: 'glutes', equipment: 'body weight', bodyPart: 'legs', gifUrl: '' },
  { id: 'dumbbell-row', name: 'Single Arm Dumbbell Row', targetMuscle: 'back', equipment: 'dumbbell', bodyPart: 'upper body', gifUrl: '' },
  { id: 'dip', name: 'Dip', targetMuscle: 'triceps', equipment: 'body weight', bodyPart: 'arms', gifUrl: '' },
  { id: 'shrug', name: 'Barbell Shrug', targetMuscle: 'traps', equipment: 'barbell', bodyPart: 'upper body', gifUrl: '' },
]

// RapidAPI AscendAPI configuration
const API_HOST = 'edb-with-videos-and-images-by-ascendapi.p.rapidapi.com'
const API_KEY = process.env.RAPIDAPI_KEY || ''

interface ExerciseDBExercise {
  name: string
  muscle?: string
  target?: string
  equipment?: string
  bodyPart?: string
  type?: string
  gifUrl?: string
  imageUrl?: string
  videoUrl?: string
  secondaryMuscles?: string[]
  instructions?: string | string[]
  exerciseId?: string
}

/**
 * Make authenticated request to RapidAPI AscendAPI
 * Uses environment variable EXERCISEDB_API_KEY for authentication
 */
async function fetchFromAPI(path: string): Promise<unknown> {
  const url = `https://${API_HOST}${path}`

  const response = await fetch(url, {
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': API_HOST,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    console.error(`[v0] API error: ${response.status} for path: ${path}`)
    throw new Error(`AscendAPI error: ${response.status}`)
  }

  return response.json()
}

/**
 * Normalize exercise to our internal format
 */
function normalizeExercise(ex: ExerciseDBExercise): NormalizedExercise {
  return {
    id: ex.exerciseId || ex.name + (ex.muscle || ex.target || ''),
    name: ex.name,
    targetMuscle: ex.muscle || ex.target || '',
    equipment: ex.equipment || '',
    bodyPart: ex.type || ex.bodyPart || '',
    gifUrl: ex.imageUrl || ex.gifUrl || '',
    videoUrl: ex.videoUrl,
    secondaryMuscles: ex.secondaryMuscles,
    instructions: Array.isArray(ex.instructions)
      ? ex.instructions
      : typeof ex.instructions === 'string' && ex.instructions.trim()
        ? [ex.instructions]
        : [],
  }
}

/**
 * Search exercises by keyword
 */
export async function searchExercises(query: string): Promise<NormalizedExercise[]> {
  try {
    const data = await fetchFromAPI(`/api/v1/exercises/search?search=${encodeURIComponent(query)}`)

    let exercises: ExerciseDBExercise[] = []
    if (Array.isArray(data)) {
      exercises = data
    } else if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      if (Array.isArray(obj.exercises)) {
        exercises = obj.exercises as ExerciseDBExercise[]
      } else if (Array.isArray(obj.data)) {
        exercises = obj.data as ExerciseDBExercise[]
      } else if (Array.isArray(obj.results)) {
        exercises = obj.results as ExerciseDBExercise[]
      }
    }

    return exercises.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error searching exercises:', error)
    return []
  }
}

/**
 * Fetch exercises with optional filters
 */
export async function getAllExercises(name?: string, keywords?: string): Promise<NormalizedExercise[]> {
  try {
    let path = '/api/v1/exercises'
    const params = new URLSearchParams()

    if (name) params.append('name', name)
    if (keywords) params.append('keywords', keywords)

    if (params.toString()) {
      path += '?' + params.toString()
    }

    const data = await fetchFromAPI(path)

    let exercises: ExerciseDBExercise[] = []
    if (Array.isArray(data)) {
      exercises = data
    } else if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      if (Array.isArray(obj.exercises)) {
        exercises = obj.exercises as ExerciseDBExercise[]
      } else if (Array.isArray(obj.data)) {
        exercises = obj.data as ExerciseDBExercise[]
      } else if (Array.isArray(obj.results)) {
        exercises = obj.results as ExerciseDBExercise[]
      }
    }

    return exercises.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching all exercises, using fallback:', error)
    return FALLBACK_EXERCISES
  }
}

/**
 * Fetch exercises by muscle group
 */
export async function getExercisesByMuscle(muscle: string): Promise<NormalizedExercise[]> {
  try {
    const data = await fetchFromAPI(`/api/v1/exercises?muscle=${encodeURIComponent(muscle)}`)

    let exercises: ExerciseDBExercise[] = []
    if (Array.isArray(data)) {
      exercises = data
    } else if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      if (Array.isArray(obj.exercises)) {
        exercises = obj.exercises as ExerciseDBExercise[]
      } else if (Array.isArray(obj.data)) {
        exercises = obj.data as ExerciseDBExercise[]
      }
    }

    return exercises.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by muscle:', error)
    return []
  }
}

/**
 * Fetch exercises by equipment
 */
export async function getExercisesByEquipment(equipment: string): Promise<NormalizedExercise[]> {
  try {
    const data = await fetchFromAPI(`/api/v1/exercises?equipment=${encodeURIComponent(equipment)}`)

    let exercises: ExerciseDBExercise[] = []
    if (Array.isArray(data)) {
      exercises = data
    } else if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      if (Array.isArray(obj.exercises)) {
        exercises = obj.exercises as ExerciseDBExercise[]
      } else if (Array.isArray(obj.data)) {
        exercises = obj.data as ExerciseDBExercise[]
      }
    }

    return exercises.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by equipment:', error)
    return []
  }
}

/**
 * Fetch exercises by body part
 */
export async function getExercisesByBodyPart(bodyPart: string): Promise<NormalizedExercise[]> {
  try {
    const data = await fetchFromAPI(`/api/v1/exercises?bodyPart=${encodeURIComponent(bodyPart)}`)

    let exercises: ExerciseDBExercise[] = []
    if (Array.isArray(data)) {
      exercises = data
    } else if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      if (Array.isArray(obj.exercises)) {
        exercises = obj.exercises as ExerciseDBExercise[]
      } else if (Array.isArray(obj.data)) {
        exercises = obj.data as ExerciseDBExercise[]
      }
    }

    return exercises.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by body part:', error)
    return []
  }
}

/**
 * Fetch single exercise by ID
 */
export async function getExerciseById(exerciseId: string): Promise<NormalizedExercise | null> {
  try {
    const data = await fetchFromAPI(`/api/v1/exercises/${encodeURIComponent(exerciseId)}`)

    if (!data || typeof data !== 'object') {
      return null
    }

    return normalizeExercise(data as ExerciseDBExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercise by id:', error)
    return null
  }
}

/**
 * List all available muscles
 */
export async function getMuscles(): Promise<string[]> {
  try {
    const data = await fetchFromAPI('/api/v1/muscles')
    return Array.isArray(data) ? data as string[] : []
  } catch (error) {
    console.error('[v0] Error fetching muscles:', error)
    return []
  }
}

/**
 * List all available body parts
 */
export async function getBodyParts(): Promise<string[]> {
  try {
    const data = await fetchFromAPI('/api/v1/bodyparts')
    return Array.isArray(data) ? data as string[] : []
  } catch (error) {
    console.error('[v0] Error fetching body parts:', error)
    return []
  }
}

/**
 * List all available equipment
 */
export async function getEquipment(): Promise<string[]> {
  try {
    const data = await fetchFromAPI('/api/v1/equipments')
    return Array.isArray(data) ? data as string[] : []
  } catch (error) {
    console.error('[v0] Error fetching equipment:', error)
    return []
  }
}

/**
 * List all exercise types
 */
export async function getExerciseTypes(): Promise<string[]> {
  try {
    const data = await fetchFromAPI('/api/v1/exercisetypes')
    return Array.isArray(data) ? data as string[] : []
  } catch (error) {
    console.error('[v0] Error fetching exercise types:', error)
    return []
  }
}
