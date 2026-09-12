export const SEVERITY = {
  low: { color: '#facc15', label: 'Low', ring: 'ring-yellow-400/40', text: 'text-yellow-300', bg: 'bg-yellow-400/10' },
  medium: { color: '#fb923c', label: 'Medium', ring: 'ring-orange-400/40', text: 'text-orange-300', bg: 'bg-orange-400/10' },
  high: { color: '#f43f5e', label: 'High', ring: 'ring-rose-500/40', text: 'text-rose-300', bg: 'bg-rose-500/10' },
}

export const DETECTION_LABEL = {
  pothole: 'Pothole',
  crack: 'Surface crack',
  waterlogging: 'Waterlogging',
}

export const INCIDENT_TYPES = [
  { id: 'theft', label: 'Theft', icon: '🕵️', blurb: 'Pickpocketing or stolen belongings' },
  { id: 'harassment', label: 'Harassment', icon: '🚨', blurb: 'Unsafe or inappropriate behaviour' },
  { id: 'accident', label: 'Accident', icon: '💥', blurb: 'Collision, fall or injury on board' },
  { id: 'other', label: 'Other', icon: '📝', blurb: 'Anything else needing attention' },
]

export const severityOf = (s) => SEVERITY[s] ?? SEVERITY.low
