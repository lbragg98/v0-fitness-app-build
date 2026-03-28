export interface Exercise {
  id: string
  name: string
  targetMuscle: string
  equipment: string[]
  bodyPart: string
  difficulty: 'beginner' | 'intermediate' | 'expert'
  instructions: string[]
  image?: string
  gifUrl?: string
  exerciseType: 'compound' | 'isolation' | 'accessory'

  sets?: number
  reps?: number
  repsMin?: number
  repsMax?: number
  restSeconds?: number
  notes?: string
}

export interface ExerciseSet {
  setNumber: number
  targetReps: number
  actualReps: number
  weight: number
  weightUnit: 'lbs' | 'kg'
  notes?: string
  completed: boolean
  completedAt?: number
}

export interface TimedExercise extends ExerciseSet {
  targetDuration: number
  actualDuration: number
  isUntilFailure: boolean
}
