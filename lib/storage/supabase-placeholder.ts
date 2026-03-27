/**
 * Supabase storage provider placeholder
 * This will replace LocalDataStore in the future for cloud sync
 */

import type { DataStore } from './storage-provider'

// TODO: Implement Supabase integration
// - Create client with @supabase/supabase-js
// - Map DataStore methods to Supabase queries
// - Add authentication context
// - Add real-time subscriptions

export const createSupabaseDataStore = (): DataStore => {
  throw new Error('Supabase integration not yet implemented')
}
