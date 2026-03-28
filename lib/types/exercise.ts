export interface Exercise {
  id: string
  name: string
  targetMuscle: string
  equipment: string | string[]
  bodyPart: string
  difficulty?: 'beginner' | 'intermediate' | 'expert'
  instructions?: string[]
  image?: string
  gifUrl?: string
  videoUrl?: string
  exerciseType?: 'compound' | 'isolation' | 'accessory'
  secondaryMuscles?: string[]

  sets?: number
  reps?: number
  repsMin?: number
  repsMax?: number
  restSeconds?: number
  notes?: string
}

export interface NormalizedExercise {
  id: string
  name: string
  targetMuscle: string
  equipment: string
  bodyPart: string
  gifUrl?: string
  videoUrl?: string
  secondaryMuscles?: string[]
  instructions?: string[]
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
