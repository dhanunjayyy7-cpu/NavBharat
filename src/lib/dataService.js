// One API for both backends: live Supabase when configured, the in-memory
// demo store otherwise. Components never branch on which one is active.

import { isSupabaseConfigured, supabase } from './supabaseClient'
import { demoInsert, demoSelect, demoSubscribe, startDemoSimulation } from './demoStore'

export const usingSupabase = isSupabaseConfigured

if (!usingSupabase) startDemoSimulation()

const ORDER_COLUMN = {
  detections: 'timestamp',
  crowd_alerts: 'timestamp',
  incident_reports: 'timestamp',
  buses: 'last_updated',
  stops: 'sequence',
}

export async function fetchTable(table, { limit = 500 } = {}) {
  if (!usingSupabase) return demoSelect(table)

  const column = ORDER_COLUMN[table] ?? 'id'
  const ascending = column === 'sequence'
  const { data, error } = await supabase.from(table).select('*').order(column, { ascending }).limit(limit)
  if (error) {
    console.error(`[navbharat] failed to load ${table}:`, error.message)
    return []
  }
  return data ?? []
}

/** Subscribe to row changes. Handler receives { eventType, new }. */
export function subscribeTable(table, handler) {
  if (!usingSupabase) return demoSubscribe(table, handler)

  const channel = supabase
    .channel(`realtime:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) =>
      handler({ eventType: payload.eventType, new: payload.new }),
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

export async function insertRow(table, row) {
  if (!usingSupabase) return demoInsert(table, row)

  const { data, error } = await supabase.from(table).insert(row).select().single()
  if (error) throw new Error(error.message)
  return data
}
