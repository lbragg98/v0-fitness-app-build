'use client'

import type { Exercise, ExerciseSet } from '@/lib/types'

interface ExerciseViewProps {
  exercise: Exercise
  currentSet: number
  totalSets: number
}

export function ExerciseView({ exercise, currentSet, totalSets }: ExerciseViewProps) {
  return (
    <div className="space-y-6">
      {exercise.gifUrl && (
        <div className="rounded-lg overflow-hidden bg-muted flex items-center justify-center h-64">
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="24" fill="%236b7280"%3ENo image%3C/text%3E%3C/svg%3E'
            }}
          />
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">{exercise.name}</h2>
        <p className="text-muted-foreground">
          Set {currentSet} of {totalSets}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {exercise.targetMuscle && (
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Target</p>
            <p className="text-lg font-bold text-foreground">{exercise.targetMuscle}</p>
          </div>
        )}
        {exercise.equipment && exercise.equipment.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Equipment</p>
            <p className="text-lg font-bold text-foreground">{exercise.equipment[0]}</p>
          </div>
        )}
      </div>

      {exercise.instructions && exercise.instructions.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Instructions</p>
          <ol className="space-y-2 text-sm text-foreground list-decimal list-inside">
            {exercise.instructions.map((instruction, idx) => (
              <li key={idx}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
