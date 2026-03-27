export interface Exercise {
  id: string
  name: string
  targetMuscle: string // e.g., 'chest', 'back', 'legs'
  equipment: string[] // e.g., ['barbell', 'dumbbell']
  bodyPart: string // e.g., 'chest', 'back', 'legs'
  difficulty: 'beginner' | 'intermediate' | 'expert'
  instructions: string[]
  image?: string // URL or base64
  gifUrl?: string
  exerciseType: 'compound' | 'isolation' | 'accessory'
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
  targetDuration: number // in seconds
  actualDuration: number // in seconds
  isUntilFailure: boolean
}
