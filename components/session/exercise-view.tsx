'use client'

import type { Exercise } from '@/lib/types'

interface ExerciseViewProps {
  exercise: Exercise
  currentSet: number
  totalSets: number
}

function formatLabel(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export function ExerciseView({ exercise, currentSet, totalSets }: ExerciseViewProps) {
  const equipmentDisplay = Array.isArray(exercise.equipment)
    ? exercise.equipment.map(formatLabel).join(', ')
    : exercise.equipment
      ? formatLabel(exercise.equipment)
      : 'Bodyweight'

  return (
    <div className="space-y-4">
      <div className="py-4 text-center">
        <h2 className="mb-1 text-2xl font-bold text-foreground">
          {exercise.name || 'Unknown Exercise'}
        </h2>
        <p className="font-medium text-primary">
          Set {currentSet} of {totalSets}
        </p>
      </div>

      {exercise.gifUrl && (
        <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg bg-muted">
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="rounded-lg bg-secondary/30 p-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Target</p>
          <p className="text-lg font-bold capitalize text-foreground">
            {formatLabel(exercise.targetMuscle || 'General')}
          </p>
        </div>
        <div className="rounded-lg bg-secondary/30 p-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Equipment</p>
          <p className="text-lg font-bold text-foreground">{equipmentDisplay}</p>
        </div>
      </div>

      <div className="rounded-lg bg-accent/20 p-3 text-center">
        <p className="text-sm text-muted-foreground">Target</p>
        <p className="text-xl font-bold text-foreground">
          {exercise.repsMin && exercise.repsMax
            ? `${exercise.repsMin}-${exercise.repsMax} reps`
            : `${exercise.reps || 10} reps`}
        </p>
      </div>

      {exercise.instructions && exercise.instructions.length > 0 && (
        <div className="pt-2">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Instructions
          </p>
          <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            {exercise.instructions.slice(0, 3).map((instruction, idx) => (
              <li key={idx}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
