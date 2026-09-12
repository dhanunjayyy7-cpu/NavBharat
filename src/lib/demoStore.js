// In-memory stand-in for Supabase, used when no VITE_SUPABASE_URL is set.
// It emits the same INSERT/UPDATE events the realtime layer does, so every
// component works identically whether or not a backend is wired up.

import { BUSES, CROWD_ALERTS, DETECTIONS, INCIDENT_REPORTS, ROUTES, STOPS } from './seedData'

const tables = {
  buses: BUSES.map((b) => ({ ...b, last_updated: new Date().toISOString() })),
  detections: [...DETECTIONS],
  crowd_alerts: [...CROWD_ALERTS],
  incident_reports: [...INCIDENT_REPORTS],
  stops: [...STOPS],
}

const listeners = new Map()

function emit(table, eventType, row) {
  const set = listeners.get(table)
  if (set) set.forEach((fn) => fn({ eventType, new: row }))
}

export function demoSelect(table) {
  return [...(tables[table] ?? [])]
}

export function demoSubscribe(table, handler) {
  if (!listeners.has(table)) listeners.set(table, new Set())
  listeners.get(table).add(handler)
  return () => listeners.get(table)?.delete(handler)
}

// Keeps two tabs of the demo (control room + passenger) in step with each other.
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('navbharat-demo') : null

function applyInsert(table, row) {
  if (tables[table].some((r) => r.id === row.id)) return
  tables[table].push(row)
  emit(table, 'INSERT', row)
}

channel?.addEventListener('message', (e) => applyInsert(e.data.table, e.data.row))

export function demoInsert(table, row) {
  const withId = { id: `${table}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...row }
  applyInsert(table, withId)
  channel?.postMessage({ table, row: withId })
  return withId
}

// --- simulation -------------------------------------------------------------

// Position is a pure function of wall-clock time, so every tab (and every
// reload) places the fleet identically without needing to share state.
const ROUTE_PERIOD_MS = 6 * 60 * 1000
const PHASE = new Map(BUSES.map((b, i) => [b.id, i * 0.13]))

const progressAt = (busId, now) => ((PHASE.get(busId) ?? 0) + now / ROUTE_PERIOD_MS) % 1

function lerp(a, b, t) {
  return a + (b - a) * t
}

function pointAlong(path, t) {
  const span = path.length - 1
  const scaled = Math.min(t, 0.9999) * span
  const i = Math.floor(scaled)
  const frac = scaled - i
  return [lerp(path[i][0], path[i + 1][0], frac), lerp(path[i][1], path[i + 1][1], frac)]
}

function advanceFleet() {
  const now = Date.now()
  tables.buses = tables.buses.map((bus) => {
    if (bus.status !== 'active' || !ROUTES[bus.route_number]) return bus
    const [lat, lng] = pointAlong(ROUTES[bus.route_number].path, progressAt(bus.id, now))
    const updated = { ...bus, current_lat: lat, current_lng: lng, last_updated: new Date(now).toISOString() }
    emit('buses', 'UPDATE', updated)
    return updated
  })
}

let started = false

export function startDemoSimulation() {
  if (started) return
  started = true

  advanceFleet()
  setInterval(advanceFleet, 2000)

  // The on-bus vision model "finds" a new defect now and then.
  setInterval(() => {
    const bus = tables.buses[Math.floor(Math.random() * tables.buses.length)]
    const types = ['pothole', 'pothole', 'crack', 'waterlogging']
    const severities = ['low', 'medium', 'high']
    demoInsert('detections', {
      type: types[Math.floor(Math.random() * types.length)],
      lat: bus.current_lat + (Math.random() - 0.5) * 0.006,
      lng: bus.current_lng + (Math.random() - 0.5) * 0.006,
      severity: severities[Math.floor(Math.random() * severities.length)],
      photo_url: `https://picsum.photos/seed/live${Date.now()}/320/200`,
      bus_id: bus.id,
      timestamp: new Date().toISOString(),
    })
  }, 22000)

  // Crowd sensor threshold breach.
  setInterval(() => {
    const bus = tables.buses[Math.floor(Math.random() * tables.buses.length)]
    const count = 40 + Math.floor(Math.random() * 45)
    demoInsert('crowd_alerts', {
      bus_id: bus.id,
      passenger_count: count,
      threshold_exceeded: count > 60,
      timestamp: new Date().toISOString(),
    })
  }, 37000)
}
