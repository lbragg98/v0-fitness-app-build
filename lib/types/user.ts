export type FitnessGoal =
  | 'muscle-gain'
  | 'fat-loss'
  | 'strength'
  | 'endurance'
  | 'flexibility'

export type IntensityLevel = 'low' | 'moderate' | 'high'

export type WorkoutFrequency = 2 | 3 | 4 | 5 | 6

export type SplitPreference =
  | 'auto'
  | 'full_body'
  | 'upper_lower'
  | 'push_pull_legs'
  | 'full_body_focus'
  | 'body_part'

export interface UserProfile {
  id: string
  name: string
  age: number
  weight: number
  height: number
  goal: FitnessGoal
  intensity: IntensityLevel
  frequency: WorkoutFrequency
  equipment: string[]
  injuriesOrLimitations: string[]
  focusMuscles?: string[]
  splitPreference?: SplitPreference
  createdAt: number
  updatedAt: number
}

export interface UserPreferences {
  timerBreakDuration: number
  timerSoundEnabled: boolean
  timerVibrationEnabled: boolean
  useMetric: boolean
}

export interface UserSettings extends UserProfile, UserPreferences { }