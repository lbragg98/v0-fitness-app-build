export interface WorkoutCompletion {
  id: string
  sessionId: string
  date: number // timestamp
  workoutName: string
  muscleGroups: string[]
  duration: number // in minutes
  exercisesCompleted: number
  totalExercises: number
  notes?: string
}

export interface FeedItem {
  id: string
  type: 'workout-completion' | 'photo' | 'achievement'
  data: WorkoutCompletion | Photo | Achievement
  createdAt: number
}

export interface Photo {
  id: string
  url: string // base64 or blob URL
  caption?: string
  date: number // timestamp
}

export interface Achievement {
  id: string
  title: string
  description: string
  unlockedAt: number
}

export interface DayStats {
  date: number // timestamp (start of day)
  muscleGroups: string[]
  workoutType: string
  isRestDay: boolean
}

export interface WeeklyStats {
  week: number // ISO week number
  year: number
  days: DayStats[]
  totalWorkouts: number
  totalMinutes: number
}
