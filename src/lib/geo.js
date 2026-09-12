const AVG_BUS_SPEED_KMPH = 18 // Bangalore peak-hour reality

export function distanceKm(a, b) {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLng = ((b[1] - a[1]) * Math.PI) / 180
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function etaMinutes(from, to) {
  return Math.max(1, Math.round((distanceKm(from, to) / AVG_BUS_SPEED_KMPH) * 60))
}

export function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function isToday(iso) {
  const d = new Date(iso)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

/** Index of the stop nearest to `position` within an ordered stop list. */
export function nearestStopIndex(stops, position) {
  let best = -1
  let bestDistance = Infinity
  stops.forEach((stop, i) => {
    const d = distanceKm(position, [stop.lat, stop.lng])
    if (d < bestDistance) {
      bestDistance = d
      best = i
    }
  })
  return best
}
