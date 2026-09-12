-- NavBharat Transit — schema
-- Run in the Supabase SQL editor, then run seed.sql.

create table if not exists public.buses (
  id            text primary key,               -- registration number, e.g. KA-01-F-1234
  route_number  text not null,
  current_lat   double precision not null,
  current_lng   double precision not null,
  last_updated  timestamptz not null default now(),
  status        text not null default 'active'
                check (status in ('active', 'idle', 'maintenance', 'offline'))
);

create table if not exists public.stops (
  id        text primary key,
  name      text not null,
  lat       double precision not null,
  lng       double precision not null,
  route_id  text not null,
  sequence  integer not null                    -- position along the route
);

create table if not exists public.detections (
  id         uuid primary key default gen_random_uuid(),
  type       text not null check (type in ('pothole', 'crack', 'waterlogging')),
  lat        double precision not null,
  lng        double precision not null,
  severity   text not null check (severity in ('low', 'medium', 'high')),
  photo_url  text,
  timestamp  timestamptz not null default now(),
  bus_id     text references public.buses (id) on delete set null
);

create table if not exists public.crowd_alerts (
  id                 uuid primary key default gen_random_uuid(),
  bus_id             text references public.buses (id) on delete cascade,
  passenger_count    integer not null,
  threshold_exceeded boolean not null default false,
  timestamp          timestamptz not null default now()
);

create table if not exists public.incident_reports (
  id         uuid primary key default gen_random_uuid(),
  bus_id     text references public.buses (id) on delete set null,
  type       text not null check (type in ('theft', 'harassment', 'accident', 'other')),
  lat        double precision not null,
  lng        double precision not null,
  timestamp  timestamptz not null default now(),
  status     text not null default 'open'
             check (status in ('open', 'acknowledged', 'resolved'))
);

create index if not exists detections_timestamp_idx on public.detections (timestamp desc);
create index if not exists crowd_alerts_timestamp_idx on public.crowd_alerts (timestamp desc);
create index if not exists incident_reports_timestamp_idx on public.incident_reports (timestamp desc);
create index if not exists stops_route_idx on public.stops (route_id, sequence);

-- Realtime ------------------------------------------------------------------
alter publication supabase_realtime add table public.buses;
alter publication supabase_realtime add table public.detections;
alter publication supabase_realtime add table public.crowd_alerts;
alter publication supabase_realtime add table public.incident_reports;

-- Row level security --------------------------------------------------------
-- Reads are public (the control room and passenger app both use the anon key).
-- The only write the browser performs is a passenger filing an incident report.
alter table public.buses enable row level security;
alter table public.stops enable row level security;
alter table public.detections enable row level security;
alter table public.crowd_alerts enable row level security;
alter table public.incident_reports enable row level security;

create policy "public read buses"            on public.buses            for select using (true);
create policy "public read stops"            on public.stops            for select using (true);
create policy "public read detections"       on public.detections       for select using (true);
create policy "public read crowd alerts"     on public.crowd_alerts     for select using (true);
create policy "public read incident reports" on public.incident_reports for select using (true);

create policy "passengers file reports"      on public.incident_reports for insert with check (status = 'open');

-- Detections, telemetry and crowd counts are written by the on-bus edge devices
-- using the service role key, so no anon insert policy is granted for them.
