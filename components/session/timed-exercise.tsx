'use client'

import { useState, useEffect } from 'react'

interface TimedExerciseProps {
  targetDuration: number // in seconds
  onComplete: (actualDuration: number) => void
  exerciseName: string
}

export function TimedExercise({ targetDuration, onComplete, exerciseName }: TimedExerciseProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showCountdown, setShowCountdown] = useState(true)
  const [countdown, setCountdown] = useState(5)

  // Countdown before exercise starts
  useEffect(() => {
    if (!showCountdown || countdown <= 0) {
      setShowCountdown(false)
      setIsRunning(true)
      return
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [showCountdown, countdown])

  // Exercise timer
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  const minutes = Math.floor(timeElapsed / 60)
  const seconds = timeElapsed % 60
  const progress = (timeElapsed / targetDuration) * 100

  if (showCountdown) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card border-2 border-primary rounded-lg p-12 text-center max-w-sm mx-4">
          <h3 className="text-xl font-bold text-foreground mb-4">Get Ready</h3>
          <div className="text-8xl font-bold text-primary mb-4">{countdown}</div>
          <p className="text-muted-foreground">{exerciseName}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border-2 border-primary rounded-lg p-8 text-center max-w-sm mx-4">
        <h3 className="text-2xl font-bold text-foreground mb-2">{exerciseName}</h3>
        <p className="text-muted-foreground mb-6">Hold for {Math.floor(targetDuration)}s</p>

        <div className="mb-8">
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${565 * Math.min(progress / 100, 1)} 565`}
                strokeLinecap="round"
                className="text-primary transition-all"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-foreground">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {progress > 100 ? '+' : ''}{Math.floor(Math.min(progress, 100))}%
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={() => onComplete(timeElapsed)}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  )
}
