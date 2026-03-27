export type FitnessGoal = 'muscle-gain' | 'fat-loss' | 'strength' | 'endurance' | 'flexibility'
export type IntensityLevel = 'low' | 'moderate' | 'high'
export type WorkoutFrequency = 3 | 4 | 5 | 6

export interface UserProfile {
  id: string
  name: string
  age: number
  weight: number // in lbs
  height: number // in inches
  goal: FitnessGoal
  intensity: IntensityLevel
  frequency: WorkoutFrequency
  equipment: string[] // e.g., ['barbell', 'dumbbell', 'cable']
  injuriesOrLimitations: string[]
  createdAt: number
  updatedAt: number
}

export interface UserPreferences {
  timerBreakDuration: number // in seconds
  timerSoundEnabled: boolean
  timerVibrationEnabled: boolean
  useMetric: boolean
}

export interface UserSettings extends UserProfile, UserPreferences {}
