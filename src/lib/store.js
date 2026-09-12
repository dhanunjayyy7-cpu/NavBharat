import { useSyncExternalStore } from 'react'

let state = {
  role: null,
  detections: [],
  alerts: [],
  crowdCount: 0,
  crowdAlertActive: false,
  notifications: [],
}

const listeners = new Set()

function emit() { listeners.forEach((fn) => fn()) }

export function getState() { return state }

function update(patch) {
  state = { ...state, ...patch }
  emit()
}

export function useStore(selector) {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => selector(state),
  )
}

export function login(role) { update({ role }) }
export function logout() {
  update({
    role: null, detections: [], alerts: [], crowdCount: 0,
    crowdAlertActive: false, notifications: [],
  })
}

export function addDetection(det) {
  const ts = new Date().toISOString()
  const d = { ...det, timestamp: ts }
  update({
    detections: [...state.detections, d],
    alerts: [
      { id: `alert-${Date.now()}-${d.id}`, type: 'detection', zone: d.zone, message: `${d.type === 'pothole' ? 'Pothole' : d.type === 'crack' ? 'Surface Crack' : 'Waterlogging'} detected — ${d.severity} severity at ${d.location}`, timestamp: ts, severity: d.severity },
      ...state.alerts,
    ],
  })
  addNotification(d.zone, `New ${d.type} detected at ${d.location}`)
}

export function setCrowdCount(n) {
  const count = Math.max(0, n)
  const wasOver = state.crowdAlertActive
  const isOver = count >= 60

  const patches = { crowdCount: count }

  if (isOver && !wasOver) {
    patches.crowdAlertActive = true
    const ts = new Date().toISOString()
    patches.alerts = [
      { id: `crowd-${Date.now()}`, type: 'crowd', zone: null, message: '⚠️ Bus Overcrowded — Threshold Reached — Bus KA-01-F-1234, Route 500C', timestamp: ts, severity: 'high' },
      ...state.alerts,
    ]
    addNotification(null, '⚠️ Bus KA-01-F-1234 overcrowded — 60+ passengers')
  } else if (!isOver && count < 55 && wasOver) {
    patches.crowdAlertActive = false
  }

  update(patches)
}

export function addNotification(zone, message) {
  const n = { id: `notif-${Date.now()}-${Math.random()}`, zone, message, timestamp: new Date().toISOString(), read: false }
  update({ notifications: [n, ...state.notifications] })

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('NavBharat Transit', { body: message })
  }
}

export function clearNotification(id) {
  update({ notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })
}

export function clearAllNotifications() {
  update({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })
}
