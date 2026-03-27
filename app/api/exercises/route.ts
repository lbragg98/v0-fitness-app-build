import { NextRequest, NextResponse } from 'next/server'
import {
  getExercisesByMuscle,
  getExercisesByEquipment,
  getExercisesByBodyPart,
  FALLBACK_EXERCISES,
} from '@/lib/api/exercise-db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/exercises?type=muscle&value=chest
 * Proxy to ExerciseDB API with fallback
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const value = searchParams.get('value')

    if (!type || !value) {
      return NextResponse.json(
        { error: 'Missing required parameters: type and value' },
        { status: 400 }
      )
    }

    console.log('[v0] Exercise API request:', { type, value })

    let exercises

    switch (type) {
      case 'muscle':
        exercises = await getExercisesByMuscle(value)
        break
      case 'equipment':
        exercises = await getExercisesByEquipment(value)
        break
      case 'bodypart':
        exercises = await getExercisesByBodyPart(value)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: muscle, equipment, or bodypart' },
          { status: 400 }
        )
    }

    return NextResponse.json(exercises)
  } catch (error) {
    console.error('[v0] Exercise API error:', error)

    // Return fallback exercises on error
    return NextResponse.json(FALLBACK_EXERCISES)
  }
}
