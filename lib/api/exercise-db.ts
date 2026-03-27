import type { NormalizedExercise } from '@/lib/types'

// RapidAPI AscendAPI configuration
const API_HOST = 'edb-with-videos-and-images-by-ascendapi.p.rapidapi.com'
const API_KEY = process.env.EXERCISEDB_API_KEY || ''

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
  instructions?: string
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
    id: ex.name + (ex.muscle || ''),
    name: ex.name,
    targetMuscle: ex.muscle || ex.target || '',
    equipment: ex.equipment || '',
    bodyPart: ex.type || ex.bodyPart || '',
    gifUrl: ex.imageUrl || ex.gifUrl || '',
    videoUrl: ex.videoUrl,
    secondaryMuscles: ex.secondaryMuscles,
    instructions: ex.instructions ? [ex.instructions] : undefined,
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
        exercises = obj.exercises
      } else if (Array.isArray(obj.data)) {
        exercises = obj.data
      } else if (Array.isArray(obj.results)) {
        exercises = obj.results
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
        exercises = obj.exercises
      } else if (Array.isArray(obj.data)) {
        exercises = obj.data
      } else if (Array.isArray(obj.results)) {
        exercises = obj.results
      }
    }
    
    return exercises.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching all exercises:', error)
    return []
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
        exercises = obj.exercises
      } else if (Array.isArray(obj.data)) {
        exercises = obj.data
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
        exercises = obj.exercises
      } else if (Array.isArray(obj.data)) {
        exercises = obj.data
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
        exercises = obj.exercises
      } else if (Array.isArray(obj.data)) {
        exercises = obj.data
      }
    }
    
    return exercises.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises by body part:', error)
    return []
  }
}

/**
 * List all available muscles
 */
export async function getMuscles(): Promise<string[]> {
  try {
    const data = await fetchFromAPI('/api/v1/muscles')
    return Array.isArray(data) ? data : []
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
    return Array.isArray(data) ? data : []
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
    return Array.isArray(data) ? data : []
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
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[v0] Error fetching exercise types:', error)
    return []
  }
}
