-- NavBharat Transit — seed data. Run after schema.sql.
-- Mirrors src/lib/seedData.js so demo mode and live mode look identical.

truncate public.detections, public.crowd_alerts, public.incident_reports, public.stops, public.buses cascade;

insert into public.buses (id, route_number, current_lat, current_lng, status) values
  ('KA-01-F-1234', '500D', 12.9507, 77.6413, 'active'),
  ('KA-01-F-5678', '335E', 12.9903, 77.6220, 'active'),
  ('KA-05-G-9012', '201R', 12.9507, 77.5729, 'active'),
  ('KA-01-H-3456', 'G4',   12.9718, 77.6412, 'active'),
  ('KA-02-J-7890', '356',  12.9345, 77.6101, 'maintenance');

insert into public.stops (id, name, lat, lng, route_id, sequence) values
  ('stop-1',  'Silk Board Junction',      12.9172, 77.6229, '500D', 1),
  ('stop-2',  'BTM Layout',               12.9279, 77.6271, '500D', 2),
  ('stop-3',  'Koramangala Water Tank',   12.9352, 77.6245, '500D', 3),
  ('stop-4',  'Domlur',                   12.9507, 77.6413, '500D', 4),
  ('stop-5',  'Indiranagar',              12.9784, 77.6408, '500D', 5),
  ('stop-6',  'Mekhri Circle',            12.9975, 77.5966, '500D', 6),
  ('stop-7',  'Hebbal',                   13.0358, 77.5971, '500D', 7),
  ('stop-8',  'Kempegowda Bus Station',   12.9774, 77.5726, '335E', 1),
  ('stop-9',  'Shivajinagar',             12.9855, 77.5951, '335E', 2),
  ('stop-10', 'Ulsoor',                   12.9903, 77.6220, '335E', 3),
  ('stop-11', 'Domlur Flyover',           12.9856, 77.6631, '335E', 4),
  ('stop-12', 'Marathahalli Bridge',      12.9857, 77.7000, '335E', 5),
  ('stop-13', 'ITPL Main Gate',           12.9856, 77.7368, '335E', 6),
  ('stop-14', 'Banashankari TTMC',        12.9155, 77.5734, '201R', 1),
  ('stop-15', 'Jayanagar 4th Block',      12.9345, 77.5708, '201R', 2),
  ('stop-16', 'South End Circle',         12.9507, 77.5729, '201R', 3),
  ('stop-17', 'Majestic',                 12.9718, 77.5623, '201R', 4),
  ('stop-18', 'Rajajinagar',              12.9916, 77.5541, '201R', 5),
  ('stop-19', 'Yeshwanthpur',             13.0287, 77.5397, '201R', 6),
  ('stop-20', 'Kempegowda Bus Station',   12.9774, 77.5726, 'G4',   1),
  ('stop-21', 'Trinity Circle',           12.9764, 77.6011, 'G4',   2),
  ('stop-22', 'Indiranagar 100ft Road',   12.9718, 77.6412, 'G4',   3),
  ('stop-23', 'Marathahalli',             12.9718, 77.6871, 'G4',   4),
  ('stop-24', 'Whitefield Main Road',     12.9866, 77.7212, 'G4',   5),
  ('stop-25', 'Kadugodi Depot',           12.9949, 77.7601, 'G4',   6),
  ('stop-26', 'Shivajinagar',             12.9829, 77.6047, '356',  1),
  ('stop-27', 'Richmond Circle',          12.9581, 77.6083, '356',  2),
  ('stop-28', 'Jayadeva Hospital',        12.9345, 77.6101, '356',  3),
  ('stop-29', 'Silk Board Junction',      12.9172, 77.6229, '356',  4),
  ('stop-30', 'Bommanahalli',             12.8893, 77.6421, '356',  5),
  ('stop-31', 'Electronic City Phase 1',  12.8452, 77.6602, '356',  6);

insert into public.detections (type, lat, lng, severity, photo_url, bus_id, timestamp) values
  ('pothole',      12.9352, 77.6245, 'high',   'https://picsum.photos/seed/pothole1/320/200', 'KA-01-F-1234', now() - interval '12 minutes'),
  ('pothole',      12.9698, 77.6412, 'medium', 'https://picsum.photos/seed/pothole2/320/200', 'KA-01-H-3456', now() - interval '28 minutes'),
  ('crack',        12.9891, 77.5981, 'low',    'https://picsum.photos/seed/crack1/320/200',   'KA-01-F-5678', now() - interval '44 minutes'),
  ('waterlogging', 12.9141, 77.6101, 'high',   'https://picsum.photos/seed/water1/320/200',   'KA-02-J-7890', now() - interval '57 minutes'),
  ('pothole',      13.0087, 77.5589, 'medium', 'https://picsum.photos/seed/pothole3/320/200', 'KA-05-G-9012', now() - interval '73 minutes'),
  ('pothole',      12.9279, 77.5804, 'low',    'https://picsum.photos/seed/pothole4/320/200', 'KA-05-G-9012', now() - interval '96 minutes'),
  ('crack',        12.9856, 77.6871, 'medium', 'https://picsum.photos/seed/crack2/320/200',   'KA-01-F-5678', now() - interval '118 minutes'),
  ('pothole',      12.8932, 77.6412, 'high',   'https://picsum.photos/seed/pothole5/320/200', 'KA-02-J-7890', now() - interval '141 minutes'),
  ('waterlogging', 13.0287, 77.5701, 'medium', 'https://picsum.photos/seed/water2/320/200',   'KA-01-F-1234', now() - interval '169 minutes'),
  ('pothole',      12.9601, 77.7012, 'low',    'https://picsum.photos/seed/pothole6/320/200', 'KA-01-H-3456', now() - interval '203 minutes');

insert into public.crowd_alerts (bus_id, passenger_count, threshold_exceeded, timestamp) values
  ('KA-01-F-1234', 68, true,  now() - interval '9 minutes'),
  ('KA-01-F-5678', 74, true,  now() - interval '35 minutes'),
  ('KA-01-H-3456', 52, false, now() - interval '82 minutes');

insert into public.incident_reports (bus_id, type, lat, lng, status, timestamp) values
  ('KA-01-F-1234', 'theft',      12.9507, 77.6413, 'open',         now() - interval '21 minutes'),
  ('KA-02-J-7890', 'harassment', 12.9345, 77.6101, 'acknowledged', now() - interval '64 minutes');
