const EXERCISE_DB_API = 'https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com'
const RAPIDAPI_HOST = 'edb-with-videos-and-images-by-ascendapi.p.rapidapi.com'

// Use the provided API key
const API_KEY = process.env.EXERCISEDB_API_KEY || 'f05ef55276msh84240bd7ffa0aeep14febbjsna57c88773ab6'

export interface ExerciseDBExercise {
  id: string
  name: string
  target: string
  equipment: string
  bodyPart: string
  gifUrl?: string
  videoUrl?: string
  imageUrl?: string
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
  return {
    id: exercise.id,
    name: exercise.name,
    targetMuscle: exercise.target,
    equipment: exercise.equipment,
    bodyPart: exercise.bodyPart,
    gifUrl: exercise.gifUrl || exercise.imageUrl || '',
    videoUrl: exercise.videoUrl,
    secondaryMuscles: exercise.secondaryMuscles,
    instructions: exercise.instructions,
  }
}

/**
 * Get common request headers
 */
function getHeaders() {
  return {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST,
    'Content-Type': 'application/json',
  }
}

/**
 * Fetch all muscles
 */
export async function getMuscles(): Promise<string[]> {
  try {
    const response = await fetch(`${EXERCISE_DB_API}/api/v1/muscles`, {
      headers: getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Error fetching muscles:', error)
    throw error
  }
}

/**
 * Fetch all equipment
 */
export async function getEquipment(): Promise<string[]> {
  try {
    const response = await fetch(`${EXERCISE_DB_API}/api/v1/equipments`, {
      headers: getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Error fetching equipment:', error)
    throw error
  }
}

/**
 * Fetch all body parts
 */
export async function getBodyParts(): Promise<string[]> {
  try {
    const response = await fetch(`${EXERCISE_DB_API}/api/v1/bodyparts`, {
      headers: getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Error fetching body parts:', error)
    throw error
  }
}

/**
 * Fetch exercises by target muscle group
 * Endpoint: /api/v1/muscles/{muscleName}/exercises
 */
export async function getExercisesByMuscle(muscle: string, limit = 20): Promise<NormalizedExercise[]> {
  try {
    const response = await fetch(
      `${EXERCISE_DB_API}/api/v1/muscles/${encodeURIComponent(muscle)}/exercises?limit=${limit}`,
      { headers: getHeaders() }
    )

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`)
    }

    const data: ExerciseDBExercise[] = await response.json()
    return data.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by muscle:', error)
    throw error
  }
}

/**
 * Fetch exercises by equipment type
 * Endpoint: /api/v1/equipments/{equipmentName}/exercises
 */
export async function getExercisesByEquipment(equipment: string, limit = 20): Promise<NormalizedExercise[]> {
  try {
    const response = await fetch(
      `${EXERCISE_DB_API}/api/v1/equipments/${encodeURIComponent(equipment)}/exercises?limit=${limit}`,
      { headers: getHeaders() }
    )

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`)
    }

    const data: ExerciseDBExercise[] = await response.json()
    return data.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by equipment:', error)
    throw error
  }
}

/**
 * Fetch exercises by body part
 * Endpoint: /api/v1/bodyparts/{bodyPartName}/exercises
 */
export async function getExercisesByBodyPart(bodyPart: string, limit = 20): Promise<NormalizedExercise[]> {
  try {
    const response = await fetch(
      `${EXERCISE_DB_API}/api/v1/bodyparts/${encodeURIComponent(bodyPart)}/exercises?limit=${limit}`,
      { headers: getHeaders() }
    )

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`)
    }

    const data: ExerciseDBExercise[] = await response.json()
    return data.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by body part:', error)
    throw error
  }
}

/**
 * Fetch all exercises (with optional pagination)
 * Endpoint: /api/v1/exercises
 */
export async function getAllExercises(limit = 30, offset = 0): Promise<NormalizedExercise[]> {
  try {
    const response = await fetch(
      `${EXERCISE_DB_API}/api/v1/exercises?limit=${limit}&offset=${offset}`,
      { headers: getHeaders() }
    )

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`)
    }

    const data: ExerciseDBExercise[] = await response.json()
    return data.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching all exercises:', error)
    throw error
  }
}

/**
 * Fallback exercises for when API is unavailable
 */
export const FALLBACK_EXERCISES: NormalizedExercise[] = [
  {
    id: 'fallback-1',
    name: 'Barbell Bench Press',
    targetMuscle: 'pectorals',
    equipment: 'barbell',
    bodyPart: 'chest',
    gifUrl: '',
  },
  {
    id: 'fallback-2',
    name: 'Barbell Squat',
    targetMuscle: 'quads',
    equipment: 'barbell',
    bodyPart: 'upper legs',
    gifUrl: '',
  },
  {
    id: 'fallback-3',
    name: 'Deadlift',
    targetMuscle: 'glutes',
    equipment: 'barbell',
    bodyPart: 'upper legs',
    gifUrl: '',
  },
]
