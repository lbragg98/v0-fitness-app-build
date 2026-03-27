const EXERCISE_DB_API = 'https://exercisedb.p.rapidapi.com'

export interface ExerciseDBExercise {
  id: string
  name: string
  target: string
  equipment: string
  bodyPart: string
  gifUrl: string
}

export interface NormalizedExercise {
  id: string
  name: string
  targetMuscle: string
  equipment: string
  bodyPart: string
  gifUrl: string
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
    gifUrl: exercise.gifUrl,
  }
}

/**
 * Fetch exercises by target muscle group
 */
export async function getExercisesByMuscle(muscle: string): Promise<NormalizedExercise[]> {
  try {
    console.log('[v0] Fetching exercises for muscle:', muscle)
    
    const response = await fetch(`${EXERCISE_DB_API}/exercises/target/${muscle}`, {
      headers: {
        'x-rapidapi-key': process.env.EXERCISEDB_API_KEY || '',
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      },
    })

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`)
    }

    const data: ExerciseDBExercise[] = await response.json()
    console.log('[v0] Received exercises:', data.length)
    
    return data.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises:', error)
    throw error
  }
}

/**
 * Fetch exercises by equipment type
 */
export async function getExercisesByEquipment(equipment: string): Promise<NormalizedExercise[]> {
  try {
    console.log('[v0] Fetching exercises for equipment:', equipment)
    
    const response = await fetch(`${EXERCISE_DB_API}/exercises/equipment/${equipment}`, {
      headers: {
        'x-rapidapi-key': process.env.EXERCISEDB_API_KEY || '',
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      },
    })

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`)
    }

    const data: ExerciseDBExercise[] = await response.json()
    return data.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises:', error)
    throw error
  }
}

/**
 * Fetch exercises by body part
 */
export async function getExercisesByBodyPart(bodyPart: string): Promise<NormalizedExercise[]> {
  try {
    console.log('[v0] Fetching exercises for body part:', bodyPart)
    
    const response = await fetch(`${EXERCISE_DB_API}/exercises/bodyPart/${bodyPart}`, {
      headers: {
        'x-rapidapi-key': process.env.EXERCISEDB_API_KEY || '',
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      },
    })

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`)
    }

    const data: ExerciseDBExercise[] = await response.json()
    return data.map(normalizeExercise)
  } catch (error) {
    console.error('[v0] Error fetching exercises:', error)
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
    targetMuscle: 'chest',
    equipment: 'barbell',
    bodyPart: 'chest',
    gifUrl: 'https://via.placeholder.com/400x300?text=Bench+Press',
  },
  {
    id: 'fallback-2',
    name: 'Barbell Squat',
    targetMuscle: 'quadriceps',
    equipment: 'barbell',
    bodyPart: 'legs',
    gifUrl: 'https://via.placeholder.com/400x300?text=Squat',
  },
  {
    id: 'fallback-3',
    name: 'Deadlift',
    targetMuscle: 'back',
    equipment: 'barbell',
    bodyPart: 'back',
    gifUrl: 'https://via.placeholder.com/400x300?text=Deadlift',
  },
]
