const KEY = 'navbharat-evidence'
export const seedEvidence = [
  { id: 'NB-2041', file: 'dept-1_mg-road_0912.mp4', department: 'dept-1', date: '12 Sep 2026, 09:42', severity: 'High', status: 'New', coordinates: '12.9716, 77.5946', location: 'M.G. Road, near Trinity Circle', duration: '00:18' },
  { id: 'NB-2040', file: 'dept-1_indiranagar_0908.mp4', department: 'dept-1', date: '08 Sep 2026, 16:10', severity: 'Medium', status: 'Assigned', coordinates: '12.9784, 77.6408', location: '100 Ft Road, Indiranagar', duration: '00:26' },
  { id: 'NB-2039', file: 'dept-2_jayanagar_0905.mp4', department: 'dept-2', date: '05 Sep 2026, 12:08', severity: 'Low', status: 'In review', coordinates: '12.9299, 77.5825', location: 'Jayanagar 4th Block', duration: '00:14' },
]
export function evidence() { try { return JSON.parse(localStorage.getItem(KEY)) || seedEvidence } catch { return seedEvidence } }
export function saveEvidence(items) { localStorage.setItem(KEY, JSON.stringify(items)); window.dispatchEvent(new Event('evidence-update')) }
export function addEvidence(item) { saveEvidence([{ id: `NB-${2042 + evidence().length}`, ...item }, ...evidence()]) }
