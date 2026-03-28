'use client'

import { useEffect, useState } from 'react'
import type { ExerciseSet } from '@/lib/types'
import { BreakTimer } from './break-timer'

interface SetTrackerProps {
  sets: ExerciseSet[]
  targetReps: number
  restDuration: number
  onCompleteSet: (setIndex: number, actualReps: number, weight: number) => void
}

export function SetTracker({
  sets,
  targetReps,
  restDuration,
  onCompleteSet,
}: SetTrackerProps) {
  const firstIncompleteSetIndex = sets.findIndex((set) => !set.completed)
  const safeInitialIndex =
    firstIncompleteSetIndex === -1 ? sets.length - 1 : firstIncompleteSetIndex

  const [expandedSet, setExpandedSet] = useState<number | null>(safeInitialIndex)
  const [repsInput, setRepsInput] = useState('')
  const [weightInput, setWeightInput] = useState('')
  const [showBreakTimer, setShowBreakTimer] = useState(false)
  const [currentSetAfterBreak, setCurrentSetAfterBreak] = useState<number | null>(null)

  useEffect(() => {
    const nextIncomplete = sets.findIndex((set) => !set.completed)
    const activeIndex = nextIncomplete === -1 ? sets.length - 1 : nextIncomplete
    const suggestedWeight = activeIndex >= 0 ? sets[activeIndex]?.weight || 0 : 0

    setExpandedSet(activeIndex >= 0 ? activeIndex : null)
    setRepsInput('')
    setWeightInput(suggestedWeight > 0 ? String(suggestedWeight) : '')
  }, [sets])

  const handleCompleteCurrentSet = (setIndex: number) => {
    const reps = parseInt(repsInput, 10) || 0
    const weight = parseFloat(weightInput) || 0

    if (reps <= 0) return

    onCompleteSet(setIndex, reps, weight)

    setRepsInput('')

    if (setIndex + 1 < sets.length) {
      setCurrentSetAfterBreak(setIndex + 1)
      setShowBreakTimer(true)
    } else {
      setExpandedSet(null)
    }
  }

  const handleAdvanceAfterBreak = () => {
    setShowBreakTimer(false)

    if (currentSetAfterBreak !== null) {
      const nextWeight = sets[currentSetAfterBreak]?.weight || 0
      setExpandedSet(currentSetAfterBreak)
      setWeightInput(nextWeight > 0 ? String(nextWeight) : '')
    }
  }

  return (
    <>
      <div>
        <p className="text-xs text-muted-foreground uppercase font-semibold mb-4">
          Set Progress
        </p>

        <div className="space-y-3">
          {sets.map((set, idx) => (
            <div
              key={set.setNumber}
              className={`rounded-lg border transition-colors ${set.completed
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-border bg-card'
                }`}
            >
              <button
                onClick={() => {
                  if (!set.completed) {
                    setExpandedSet(expandedSet === idx ? null : idx)
                    setWeightInput(set.weight > 0 ? String(set.weight) : '')
                    setRepsInput('')
                  }
                }}
                className="w-full p-3 text-left flex items-center justify-between"
              >
                <span className="font-semibold text-foreground">
                  Set {idx + 1} {set.completed && '✓'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {set.completed
                    ? `${set.actualReps}x${set.weight}${set.weightUnit}`
                    : `${targetReps} reps`}
                </span>
              </button>

              {expandedSet === idx && !set.completed && (
                <div className="px-3 pb-3 border-t border-border space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground pt-3">
                      Reps Completed
                    </label>
                    <input
                      type="number"
                      value={repsInput}
                      onChange={(e) => setRepsInput(e.target.value)}
                      placeholder={`Target: ${targetReps}`}
                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-foreground bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Weight Used
                    </label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="number"
                        value={weightInput}
                        onChange={(e) => setWeightInput(e.target.value)}
                        placeholder="0"
                        className="flex-1 px-3 py-2 border border-border rounded-lg text-foreground bg-background"
                      />
                      <span className="px-3 py-2 text-sm text-muted-foreground">
                        lbs
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCompleteCurrentSet(idx)}
                    disabled={!repsInput}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    Complete Set
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showBreakTimer && (
        <BreakTimer
          duration={restDuration}
          onComplete={handleAdvanceAfterBreak}
          onSkip={handleAdvanceAfterBreak}
        />
      )}
    </>
  )
}
