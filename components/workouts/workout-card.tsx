'use client'

import type { Workout } from '@/lib/types'

interface WorkoutCardProps {
  workout: Workout
  isActive: boolean
  onSelect: (workout: Workout) => void
  onDelete: (workoutId: string) => void
}

export function WorkoutCard({ workout, isActive, onSelect, onDelete }: WorkoutCardProps) {
  const totalExercises = workout.days.reduce((sum, day) => sum + (day.exercises.length || 0), 0)
  const restDays = workout.days.filter((d) => d.isRestDay).length
  const totalDuration = workout.days.reduce((sum, day) => sum + (day.estimatedDuration || 0), 0)

  return (
    <div
      className={`
        rounded-lg border-2 p-4 transition-all cursor-pointer
        ${isActive
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
        }
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">{workout.name}</h3>
          {workout.description && (
            <p className="text-sm text-muted-foreground mt-1">{workout.description}</p>
          )}
        </div>
        {isActive && (
          <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold">
            Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Days</p>
          <p className="text-lg font-bold text-foreground">{workout.frequency}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Exercises</p>
          <p className="text-lg font-bold text-foreground">{totalExercises}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Rest</p>
          <p className="text-lg font-bold text-foreground">{restDays}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total</p>
          <p className="text-lg font-bold text-foreground">{totalDuration}m</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onSelect(workout)}
          className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          {isActive ? 'Active' : 'Activate'}
        </button>
        <button
          onClick={() => onDelete(workout.id)}
          className="px-3 py-2 border border-destructive text-destructive rounded font-semibold text-sm hover:bg-destructive/10 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
