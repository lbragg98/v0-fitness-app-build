'use client'

import type { Exercise } from '@/lib/types'

interface ExerciseCardProps {
  exercise: Exercise
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-sm">
      <h4 className="font-semibold text-foreground mb-1">{exercise.name}</h4>
      <div className="space-y-1 text-xs text-muted-foreground">
        {exercise.targetMuscle && (
          <p>Target: {exercise.targetMuscle}</p>
        )}
        {exercise.equipment && (
          <p>Equipment: {exercise.equipment}</p>
        )}
        {exercise.sets && exercise.reps && (
          <p>
            {exercise.sets}x{exercise.reps} reps
          </p>
        )}
        {exercise.restSeconds && (
          <p>Rest: {exercise.restSeconds}s</p>
        )}
      </div>
    </div>
  )
}
