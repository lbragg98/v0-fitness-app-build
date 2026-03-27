'use client'

import { useState } from 'react'
import type { ExerciseSet } from '@/lib/types'
import { BreakTimer } from './break-timer'

interface SetTrackerProps {
  sets: ExerciseSet[]
  targetReps: number
  restDuration: number // in seconds
  onCompleteSet: (setIndex: number, actualReps: number, weight: number) => void
}

export function SetTracker({ sets, targetReps, restDuration, onCompleteSet }: SetTrackerProps) {
  const [expandedSet, setExpandedSet] = useState<number | null>(0)
  const [repsInput, setRepsInput] = useState<string>('')
  const [weightInput, setWeightInput] = useState<string>('')
  const [showBreakTimer, setShowBreakTimer] = useState(false)
  const [currentSetAfterBreak, setCurrentSetAfterBreak] = useState<number | null>(null)

  const handleCompleteSet = (setIndex: number) => {
    const reps = parseInt(repsInput) || 0
    const weight = parseFloat(weightInput) || 0

    if (reps > 0 && weight > 0) {
      onCompleteSet(setIndex, reps, weight)
      setRepsInput('')
      setWeightInput('')

      // Show break timer if not the last set
      if (setIndex + 1 < sets.length) {
        setCurrentSetAfterBreak(setIndex + 1)
        setShowBreakTimer(true)
      } else {
        setExpandedSet(null)
      }
    }
  }

  const handleBreakComplete = () => {
    setShowBreakTimer(false)
    if (currentSetAfterBreak !== null) {
      setExpandedSet(currentSetAfterBreak)
    }
  }

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase font-semibold">Set Progress</p>
        
        {sets.map((set, idx) => (
          <div
            key={idx}
            className={`rounded-lg border transition-all cursor-pointer ${
              set.completed
                ? 'border-green-500 bg-green-500/10'
                : expandedSet === idx
                  ? 'border-primary bg-primary/5'
                  : 'border-border'
            }`}
          >
            <button
              onClick={() => setExpandedSet(expandedSet === idx ? null : idx)}
              className="w-full p-3 text-left flex items-center justify-between"
            >
              <span className="font-semibold text-foreground">
                Set {idx + 1}
                {set.completed && <span className="text-green-600 ml-2">✓</span>}
              </span>
              <span className="text-muted-foreground text-sm">
                {set.completed ? `${set.actualReps}x${set.weight}${set.weightUnit}` : targetReps + ' reps'}
              </span>
            </button>

            {expandedSet === idx && !set.completed && (
              <div className="border-t border-border p-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Reps Completed</label>
                  <input
                    type="number"
                    min="1"
                    value={repsInput}
                    onChange={(e) => setRepsInput(e.target.value)}
                    placeholder={`Target: ${targetReps}`}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-foreground bg-background"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Weight Used</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      step="0.5"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      placeholder="0"
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-foreground bg-background"
                    />
                    <select className="px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                      <option>lbs</option>
                      <option>kg</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => handleCompleteSet(idx)}
                  disabled={!repsInput || !weightInput}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  Complete Set
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showBreakTimer && (
        <BreakTimer
          duration={restDuration}
          onComplete={handleBreakComplete}
          onSkip={handleBreakComplete}
        />
      )}
    </>
  )
}
