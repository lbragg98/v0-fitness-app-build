'use client'

import type { Exercise } from '@/lib/types'

interface ExerciseViewProps {
  exercise: Exercise
  currentSet: number
  totalSets: number
}

export function ExerciseView({ exercise, currentSet, totalSets }: ExerciseViewProps) {
  // Handle equipment as string or array
  const equipmentDisplay = Array.isArray(exercise.equipment) 
    ? exercise.equipment.join(', ') 
    : exercise.equipment || 'Bodyweight'

  return (
    <div className="space-y-4">
      {/* Exercise Name - Large and prominent */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-foreground mb-1">{exercise.name || 'Unknown Exercise'}</h2>
        <p className="text-primary font-medium">
          Set {currentSet} of {totalSets}
        </p>
      </div>

      {exercise.gifUrl && (
        <div className="rounded-lg overflow-hidden bg-muted flex items-center justify-center h-48">
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="bg-secondary/30 rounded-lg p-3">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Target</p>
          <p className="text-lg font-bold text-foreground capitalize">{exercise.targetMuscle || 'General'}</p>
        </div>
        <div className="bg-secondary/30 rounded-lg p-3">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Equipment</p>
          <p className="text-lg font-bold text-foreground capitalize">{equipmentDisplay}</p>
        </div>
      </div>

      {/* Rep target info */}
      <div className="bg-accent/20 rounded-lg p-3 text-center">
        <p className="text-sm text-muted-foreground">Target</p>
        <p className="text-xl font-bold text-foreground">
          {exercise.repsMin && exercise.repsMax 
            ? `${exercise.repsMin}-${exercise.repsMax} reps`
            : `${exercise.reps || 10} reps`}
        </p>
      </div>

      {exercise.instructions && exercise.instructions.length > 0 && (
        <div className="pt-2">
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Instructions</p>
          <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
            {exercise.instructions.slice(0, 3).map((instruction, idx) => (
              <li key={idx}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
