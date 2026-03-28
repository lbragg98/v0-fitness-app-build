'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { NormalizedExercise } from '@/lib/types'

interface SearchResult extends NormalizedExercise {
  instructions?: string[]
}

export default function WorkoutSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [selectedExercise, setSelectedExercise] = useState<SearchResult | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setError('Please enter a search term')
      return
    }

    setLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const response = await fetch(
        `/api/exercises?type=search&query=${encodeURIComponent(searchQuery)}`
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const exercises = Array.isArray(data) ? data : []

      if (exercises.length === 0) {
        setError('No exercises found for your search')
      }

      setResults(exercises)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search exercises'
      setError(message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/workouts" className="text-muted-foreground hover:text-foreground">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Search Exercises</h1>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for exercises (e.g., chest press, deadlift, squats)"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !hasSearched && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">Start searching to find exercises</p>
            <p className="text-sm">Search by exercise name, muscle group, or equipment</p>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && results.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Found {results.length} exercise{results.length === 1 ? '' : 's'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className="text-left border border-border rounded-lg overflow-hidden bg-card hover:shadow-lg hover:border-primary transition-all"
                >
                  {exercise.gifUrl ? (
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      className="w-full h-40 object-cover bg-secondary"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-40 bg-secondary flex items-center justify-center text-muted-foreground text-sm">
                      No image available
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground capitalize mb-2 line-clamp-2">
                      {exercise.name}
                    </h3>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>
                        <span className="font-medium">Target:</span>{' '}
                        {exercise.targetMuscle ? exercise.targetMuscle.charAt(0).toUpperCase() + exercise.targetMuscle.slice(1) : 'N/A'}
                      </p>
                      <p>
                        <span className="font-medium">Equipment:</span>{' '}
                        {exercise.equipment ? exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1) : 'Body weight'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center p-4"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="w-full max-w-2xl rounded-t-2xl sm:rounded-2xl bg-card border border-border p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground capitalize">
                  {selectedExercise.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedExercise.targetMuscle
                    ? selectedExercise.targetMuscle.charAt(0).toUpperCase() +
                      selectedExercise.targetMuscle.slice(1)
                    : 'General'}{' '}
                  •{' '}
                  {selectedExercise.equipment
                    ? selectedExercise.equipment.charAt(0).toUpperCase() +
                      selectedExercise.equipment.slice(1)
                    : 'Bodyweight'}
                </p>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-3 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
              >
                Close
              </button>
            </div>

            {/* GIF Image */}
            {selectedExercise.gifUrl && (
              <div className="rounded-xl overflow-hidden bg-muted mb-6 flex items-center justify-center">
                <img
                  src={selectedExercise.gifUrl}
                  alt={selectedExercise.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}

            {/* Exercise Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-xl bg-secondary/30 p-4">
                <p className="text-xs uppercase font-semibold text-muted-foreground">
                  Target
                </p>
                <p className="text-lg font-bold text-foreground capitalize mt-1">
                  {selectedExercise.targetMuscle || 'General'}
                </p>
              </div>

              <div className="rounded-xl bg-secondary/30 p-4">
                <p className="text-xs uppercase font-semibold text-muted-foreground">
                  Equipment
                </p>
                <p className="text-lg font-bold text-foreground capitalize mt-1">
                  {selectedExercise.equipment || 'Bodyweight'}
                </p>
              </div>

              {selectedExercise.bodyPart && (
                <div className="rounded-xl bg-secondary/30 p-4">
                  <p className="text-xs uppercase font-semibold text-muted-foreground">
                    Body Part
                  </p>
                  <p className="text-lg font-bold text-foreground capitalize mt-1">
                    {selectedExercise.bodyPart}
                  </p>
                </div>
              )}

              {selectedExercise.secondaryMuscles &&
                selectedExercise.secondaryMuscles.length > 0 && (
                  <div className="rounded-xl bg-secondary/30 p-4">
                    <p className="text-xs uppercase font-semibold text-muted-foreground">
                      Secondary
                    </p>
                    <p className="text-lg font-bold text-foreground capitalize mt-1 line-clamp-2">
                      {selectedExercise.secondaryMuscles.join(', ')}
                    </p>
                  </div>
                )}
            </div>

            {/* Instructions */}
            {selectedExercise.instructions && selectedExercise.instructions.length > 0 ? (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                  How To Do It
                </h3>
                <ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                  {selectedExercise.instructions.map((instruction, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {instruction}
                    </li>
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
      )}
    </div>
  )
}
