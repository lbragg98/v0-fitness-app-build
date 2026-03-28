'use client'

import type { Exercise } from '@/lib/types'

interface ExerciseDetailsModalProps {
  exercise: Exercise | null
  isOpen: boolean
  onClose: () => void
}

function formatLabel(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export function ExerciseDetailsModal({
  exercise,
  isOpen,
  onClose,
}: ExerciseDetailsModalProps) {
  if (!isOpen || !exercise) return null

  const equipmentDisplay = Array.isArray(exercise.equipment)
    ? exercise.equipment.map(formatLabel).join(', ')
    : exercise.equipment
      ? formatLabel(exercise.equipment)
      : 'Bodyweight'

  const repDisplay =
    exercise.repsMin && exercise.repsMax
      ? `${exercise.repsMin}-${exercise.repsMax} reps`
      : `${exercise.reps || 10} reps`

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center">
      <div className="w-full max-w-2xl rounded-t-2xl sm:rounded-2xl bg-card border border-border p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {exercise.name || 'Unknown Exercise'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {formatLabel(exercise.targetMuscle || 'General')} • {equipmentDisplay}
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg border border-border text-foreground hover:bg-secondary"
          >
            Close
          </button>
        </div>

        {exercise.gifUrl && (
          <div className="rounded-xl overflow-hidden bg-muted mb-5 flex items-center justify-center">
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl bg-secondary/30 p-4">
            <p className="text-xs uppercase font-semibold text-muted-foreground">
              Target
            </p>
            <p className="text-lg font-bold text-foreground">
              {formatLabel(exercise.targetMuscle || 'General')}
            </p>
          </div>

          <div className="rounded-xl bg-secondary/30 p-4">
            <p className="text-xs uppercase font-semibold text-muted-foreground">
              Equipment
            </p>
            <p className="text-lg font-bold text-foreground">
              {equipmentDisplay}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-accent/20 p-4 mb-5">
          <p className="text-xs uppercase font-semibold text-muted-foreground">
            Prescription
          </p>
          <p className="text-lg font-bold text-foreground mt-1">
            {exercise.sets || 3} sets • {repDisplay}
          </p>
        </div>

        {exercise.instructions && exercise.instructions.length > 0 ? (
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">
              How To Do It
            </p>
            <ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
              {exercise.instructions.map((instruction, idx) => (
                <li key={idx}>{instruction}</li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No detailed instructions available for this exercise yet.
          </p>
        )}
      </div>
    </div>
  )
}
