import { NextRequest, NextResponse } from 'next/server'
import {
  getExercisesByMuscle,
  getExercisesByEquipment,
  getExercisesByBodyPart,
  getAllExercises,
  getMuscles,
  getEquipment,
  getBodyParts,
  FALLBACK_EXERCISES,
} from '@/lib/api/exercise-db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/exercises?type=muscle&value=chest
 * GET /api/exercises?type=all&limit=50&offset=0
 * GET /api/exercises?type=list&category=muscles
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const value = searchParams.get('value')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!type) {
      return NextResponse.json(
        { error: 'Missing required parameter: type' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'muscle':
        if (!value) {
          return NextResponse.json({ error: 'Missing value for muscle type' }, { status: 400 })
        }
        result = await getExercisesByMuscle(value, limit)
        break
      case 'equipment':
        if (!value) {
          return NextResponse.json({ error: 'Missing value for equipment type' }, { status: 400 })
        }
        result = await getExercisesByEquipment(value, limit)
        break
      case 'bodypart':
        if (!value) {
          return NextResponse.json({ error: 'Missing value for bodypart type' }, { status: 400 })
        }
        result = await getExercisesByBodyPart(value, limit)
        break
      case 'all':
        result = await getAllExercises(limit, offset)
        break
      case 'list':
        if (category === 'muscles') {
          result = await getMuscles()
        } else if (category === 'equipment') {
          result = await getEquipment()
        } else if (category === 'bodyparts') {
          result = await getBodyParts()
        } else {
          return NextResponse.json({ error: 'Invalid category. Use: muscles, equipment, or bodyparts' }, { status: 400 })
        }
        break
      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: muscle, equipment, bodypart, all, or list' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] Exercise API error:', error)
    return NextResponse.json(FALLBACK_EXERCISES)
  }
}
