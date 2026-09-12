export const ZONES = {
  jpnagar:     { label: 'JP Nagar Zone',     center: [12.9100, 77.5800], color: '#e74c3c' },
  koramangala: { label: 'Koramangala Zone',   center: [12.9350, 77.6200], color: '#f39c12' },
  whitefield:  { label: 'Whitefield Zone',    center: [13.0100, 77.7400], color: '#2196F3' },
}

export const ROLES = [
  { id: 'admin',       label: 'Admin / BMTC HQ',       zone: null,          icon: '🏛️', desc: 'Full access — all zones, all data' },
  { id: 'jpnagar',     label: 'Dept 1 — JP Nagar',      zone: 'jpnagar',     icon: '📍', desc: 'JP Nagar zone detections & alerts' },
  { id: 'koramangala', label: 'Dept 2 — Koramangala',    zone: 'koramangala', icon: '📍', desc: 'Koramangala zone detections & alerts' },
  { id: 'whitefield',  label: 'Dept 3 — Whitefield',     zone: 'whitefield',  icon: '📍', desc: 'Whitefield zone detections & alerts' },
]

export const MOCK_DETECTIONS = [
  { id: 'det-1', type: 'pothole',      severity: 'high',   zone: 'jpnagar',     lat: 12.9100, lng: 77.5800, location: 'JP Nagar 6th Phase, 24th Main' },
  { id: 'det-2', type: 'crack',        severity: 'medium', zone: 'koramangala', lat: 12.9350, lng: 77.6200, location: 'Koramangala 5th Block, 80ft Road' },
  { id: 'det-3', type: 'waterlogging', severity: 'high',   zone: 'whitefield',  lat: 13.0100, lng: 77.7400, location: 'Whitefield Main Road, ITPL Junction' },
]

export const MOCK_VIDEOS = [
  { id: 'v1', label: 'Cam 1 — JP Nagar Route',     zone: 'jpnagar',     thumb: '🎥 Bus KA-01-F-1234 · Route 201R · JP Nagar corridor' },
  { id: 'v2', label: 'Cam 2 — Koramangala Route',   zone: 'koramangala', thumb: '🎥 Bus KA-01-F-5678 · Route 500D · Koramangala corridor' },
  { id: 'v3', label: 'Cam 3 — Whitefield Route',    zone: 'whitefield',  thumb: '🎥 Bus KA-01-H-3456 · Route G4 · Whitefield corridor' },
]

export const STOPS = [
  { id: 's1', name: 'Majestic Bus Station',    lat: 12.9774, lng: 77.5726, seq: 1 },
  { id: 's2', name: 'Shivajinagar',            lat: 12.9855, lng: 77.5951, seq: 2 },
  { id: 's3', name: 'Indiranagar',             lat: 12.9784, lng: 77.6408, seq: 3 },
  { id: 's4', name: 'Koramangala',             lat: 12.9350, lng: 77.6200, seq: 4 },
  { id: 's5', name: 'JP Nagar',                lat: 12.9100, lng: 77.5800, seq: 5 },
]

export const BANGALORE_CENTER = [12.9716, 77.5946]
export const BLR_BOUNDS = [[12.85, 77.45], [13.15, 77.75]]

export const SEVERITY_COLORS = {
  low:    { bg: '#fef3c7', text: '#92400e', dot: '#facc15' },
  medium: { bg: '#ffedd5', text: '#9a3412', dot: '#fb923c' },
  high:   { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
}

export const TYPE_LABELS = {
  pothole: 'Pothole',
  crack: 'Surface Crack',
  waterlogging: 'Waterlogging',
}
