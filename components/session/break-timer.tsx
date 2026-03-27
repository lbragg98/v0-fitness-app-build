'use client'

import { useState, useEffect } from 'react'

interface BreakTimerProps {
  duration: number // in seconds
  onComplete: () => void
  onSkip: () => void
}

export function BreakTimer({ duration, onComplete, onSkip }: BreakTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0) {
        onComplete()
      }
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, timeLeft, onComplete])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((duration - timeLeft) / duration) * 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border-2 border-primary rounded-lg p-8 text-center max-w-sm mx-4">
        <h3 className="text-2xl font-bold text-foreground mb-6">Rest Time</h3>

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
                strokeDasharray={`${565 * (progress / 100)} 565`}
                strokeDashoffset="0"
                strokeLinecap="round"
                className="text-primary transition-all"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-foreground">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {isActive ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={onSkip}
            className="w-full px-4 py-2 border border-border text-foreground rounded-lg font-semibold hover:bg-secondary transition-colors"
          >
            Skip Rest
          </button>
        </div>
      </div>
    </div>
  )
}
