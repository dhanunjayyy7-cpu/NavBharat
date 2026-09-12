// Canonical seed set. Mirrored by supabase/seed.sql — keep the two in sync.

export const BANGALORE_CENTER = [12.9716, 77.5946]

// Each route carries an ordered waypoint list so the demo simulator can drive
// buses along something that resembles the real corridor.
export const ROUTES = {
  '500D': {
    name: 'Silk Board → Hebbal',
    path: [
      [12.9172, 77.6229],
      [12.9279, 77.6271],
      [12.9507, 77.6413],
      [12.9784, 77.6408],
      [12.9975, 77.5966],
      [13.0358, 77.5971],
    ],
  },
  '335E': {
    name: 'Kempegowda BS → ITPL',
    path: [
      [12.9774, 77.5726],
      [12.9855, 77.5951],
      [12.9903, 77.622],
      [12.9856, 77.6631],
      [12.9857, 77.7],
      [12.9856, 77.7368],
    ],
  },
  '201R': {
    name: 'Banashankari TTMC → Yeshwanthpur',
    path: [
      [12.9155, 77.5734],
      [12.9345, 77.5708],
      [12.9507, 77.5729],
      [12.9718, 77.5623],
      [12.9916, 77.5541],
      [13.0287, 77.5397],
    ],
  },
  G4: {
    name: 'Kempegowda BS → Kadugodi',
    path: [
      [12.9774, 77.5726],
      [12.9764, 77.6011],
      [12.9718, 77.6412],
      [12.9718, 77.6871],
      [12.9866, 77.7212],
      [12.9949, 77.7601],
    ],
  },
  356: {
    name: 'Shivajinagar → Electronic City',
    path: [
      [12.9829, 77.6047],
      [12.9581, 77.6083],
      [12.9345, 77.6101],
      [12.9172, 77.6229],
      [12.8893, 77.6421],
      [12.8452, 77.6602],
    ],
  },
}

export const BUSES = [
  { id: 'KA-01-F-1234', route_number: '500D', current_lat: 12.9507, current_lng: 77.6413, status: 'active' },
  { id: 'KA-01-F-5678', route_number: '335E', current_lat: 12.9903, current_lng: 77.622, status: 'active' },
  { id: 'KA-05-G-9012', route_number: '201R', current_lat: 12.9507, current_lng: 77.5729, status: 'active' },
  { id: 'KA-01-H-3456', route_number: 'G4', current_lat: 12.9718, current_lng: 77.6412, status: 'active' },
  { id: 'KA-02-J-7890', route_number: '356', current_lat: 12.9345, current_lng: 77.6101, status: 'maintenance' },
]

const minsAgo = (m) => new Date(Date.now() - m * 60_000).toISOString()

const photo = (seed) => `https://picsum.photos/seed/${seed}/320/200`

export const DETECTIONS = [
  { id: 'det-1', type: 'pothole', lat: 12.9352, lng: 77.6245, severity: 'high', photo_url: photo('pothole1'), bus_id: 'KA-01-F-1234', timestamp: minsAgo(12) },
  { id: 'det-2', type: 'pothole', lat: 12.9698, lng: 77.6412, severity: 'medium', photo_url: photo('pothole2'), bus_id: 'KA-01-H-3456', timestamp: minsAgo(28) },
  { id: 'det-3', type: 'crack', lat: 12.9891, lng: 77.5981, severity: 'low', photo_url: photo('crack1'), bus_id: 'KA-01-F-5678', timestamp: minsAgo(44) },
  { id: 'det-4', type: 'waterlogging', lat: 12.9141, lng: 77.6101, severity: 'high', photo_url: photo('water1'), bus_id: 'KA-02-J-7890', timestamp: minsAgo(57) },
  { id: 'det-5', type: 'pothole', lat: 13.0087, lng: 77.5589, severity: 'medium', photo_url: photo('pothole3'), bus_id: 'KA-05-G-9012', timestamp: minsAgo(73) },
  { id: 'det-6', type: 'pothole', lat: 12.9279, lng: 77.5804, severity: 'low', photo_url: photo('pothole4'), bus_id: 'KA-05-G-9012', timestamp: minsAgo(96) },
  { id: 'det-7', type: 'crack', lat: 12.9856, lng: 77.6871, severity: 'medium', photo_url: photo('crack2'), bus_id: 'KA-01-F-5678', timestamp: minsAgo(118) },
  { id: 'det-8', type: 'pothole', lat: 12.8932, lng: 77.6412, severity: 'high', photo_url: photo('pothole5'), bus_id: 'KA-02-J-7890', timestamp: minsAgo(141) },
  { id: 'det-9', type: 'waterlogging', lat: 13.0287, lng: 77.5701, severity: 'medium', photo_url: photo('water2'), bus_id: 'KA-01-F-1234', timestamp: minsAgo(169) },
  { id: 'det-10', type: 'pothole', lat: 12.9601, lng: 77.7012, severity: 'low', photo_url: photo('pothole6'), bus_id: 'KA-01-H-3456', timestamp: minsAgo(203) },
]

export const CROWD_ALERTS = [
  { id: 'crowd-1', bus_id: 'KA-01-F-1234', passenger_count: 68, threshold_exceeded: true, timestamp: minsAgo(9) },
  { id: 'crowd-2', bus_id: 'KA-01-F-5678', passenger_count: 74, threshold_exceeded: true, timestamp: minsAgo(35) },
  { id: 'crowd-3', bus_id: 'KA-01-H-3456', passenger_count: 52, threshold_exceeded: false, timestamp: minsAgo(82) },
]

export const INCIDENT_REPORTS = [
  { id: 'inc-1', bus_id: 'KA-01-F-1234', type: 'theft', lat: 12.9507, lng: 77.6413, status: 'open', timestamp: minsAgo(21) },
  { id: 'inc-2', bus_id: 'KA-02-J-7890', type: 'harassment', lat: 12.9345, lng: 77.6101, status: 'acknowledged', timestamp: minsAgo(64) },
]

// `sequence` is the stop's order along its route — the arrival alert counts
// stops with it, so it must stay monotonic per route_id.
export const STOPS = [
  { id: 'stop-1', name: 'Silk Board Junction', lat: 12.9172, lng: 77.6229, route_id: '500D', sequence: 1 },
  { id: 'stop-2', name: 'BTM Layout', lat: 12.9279, lng: 77.6271, route_id: '500D', sequence: 2 },
  { id: 'stop-3', name: 'Koramangala Water Tank', lat: 12.9352, lng: 77.6245, route_id: '500D', sequence: 3 },
  { id: 'stop-4', name: 'Domlur', lat: 12.9507, lng: 77.6413, route_id: '500D', sequence: 4 },
  { id: 'stop-5', name: 'Indiranagar', lat: 12.9784, lng: 77.6408, route_id: '500D', sequence: 5 },
  { id: 'stop-6', name: 'Mekhri Circle', lat: 12.9975, lng: 77.5966, route_id: '500D', sequence: 6 },
  { id: 'stop-7', name: 'Hebbal', lat: 13.0358, lng: 77.5971, route_id: '500D', sequence: 7 },
  { id: 'stop-8', name: 'Kempegowda Bus Station', lat: 12.9774, lng: 77.5726, route_id: '335E', sequence: 1 },
  { id: 'stop-9', name: 'Shivajinagar', lat: 12.9855, lng: 77.5951, route_id: '335E', sequence: 2 },
  { id: 'stop-10', name: 'Ulsoor', lat: 12.9903, lng: 77.622, route_id: '335E', sequence: 3 },
  { id: 'stop-11', name: 'Domlur Flyover', lat: 12.9856, lng: 77.6631, route_id: '335E', sequence: 4 },
  { id: 'stop-12', name: 'Marathahalli Bridge', lat: 12.9857, lng: 77.7, route_id: '335E', sequence: 5 },
  { id: 'stop-13', name: 'ITPL Main Gate', lat: 12.9856, lng: 77.7368, route_id: '335E', sequence: 6 },
  { id: 'stop-14', name: 'Banashankari TTMC', lat: 12.9155, lng: 77.5734, route_id: '201R', sequence: 1 },
  { id: 'stop-15', name: 'Jayanagar 4th Block', lat: 12.9345, lng: 77.5708, route_id: '201R', sequence: 2 },
  { id: 'stop-16', name: 'South End Circle', lat: 12.9507, lng: 77.5729, route_id: '201R', sequence: 3 },
  { id: 'stop-17', name: 'Majestic', lat: 12.9718, lng: 77.5623, route_id: '201R', sequence: 4 },
  { id: 'stop-18', name: 'Rajajinagar', lat: 12.9916, lng: 77.5541, route_id: '201R', sequence: 5 },
  { id: 'stop-19', name: 'Yeshwanthpur', lat: 13.0287, lng: 77.5397, route_id: '201R', sequence: 6 },
  { id: 'stop-20', name: 'Kempegowda Bus Station', lat: 12.9774, lng: 77.5726, route_id: 'G4', sequence: 1 },
  { id: 'stop-21', name: 'Trinity Circle', lat: 12.9764, lng: 77.6011, route_id: 'G4', sequence: 2 },
  { id: 'stop-22', name: 'Indiranagar 100ft Road', lat: 12.9718, lng: 77.6412, route_id: 'G4', sequence: 3 },
  { id: 'stop-23', name: 'Marathahalli', lat: 12.9718, lng: 77.6871, route_id: 'G4', sequence: 4 },
  { id: 'stop-24', name: 'Whitefield Main Road', lat: 12.9866, lng: 77.7212, route_id: 'G4', sequence: 5 },
  { id: 'stop-25', name: 'Kadugodi Depot', lat: 12.9949, lng: 77.7601, route_id: 'G4', sequence: 6 },
  { id: 'stop-26', name: 'Shivajinagar', lat: 12.9829, lng: 77.6047, route_id: '356', sequence: 1 },
  { id: 'stop-27', name: 'Richmond Circle', lat: 12.9581, lng: 77.6083, route_id: '356', sequence: 2 },
  { id: 'stop-28', name: 'Jayadeva Hospital', lat: 12.9345, lng: 77.6101, route_id: '356', sequence: 3 },
  { id: 'stop-29', name: 'Silk Board Junction', lat: 12.9172, lng: 77.6229, route_id: '356', sequence: 4 },
  { id: 'stop-30', name: 'Bommanahalli', lat: 12.8893, lng: 77.6421, route_id: '356', sequence: 5 },
  { id: 'stop-31', name: 'Electronic City Phase 1', lat: 12.8452, lng: 77.6602, route_id: '356', sequence: 6 },
]
