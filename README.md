# NavBharat Transit

AI-powered urban intelligence platform for BMTC, Bengaluru. Two dashboards over one live data
layer: a control room for BMTC authorities and a mobile passenger view reached by scanning the QR
code inside the bus.

## Routes

| Path | Who it's for |
| --- | --- |
| `/` | Landing page with links and a sample QR code |
| `/official` | Control room — GIS map, alert feed, fleet monitor, daily analytics |
| `/passenger?bus=KA-01-F-1234` | Passenger view — live tracking, arrival alert, incident reporting |

## Running it

```bash
npm install
npm run dev
```

It boots straight into **demo mode**: an in-memory simulator seeded with 5 buses, 10 road defects,
3 crowd alerts and 2 incident reports. Buses move along their real corridors, the vision model
"detects" new defects every ~20s, and everything streams into the UI exactly as it would over
Supabase realtime. Two browser tabs stay in sync with each other, so you can file a report from the
passenger view and watch it land on the control room map.

## Wiring up Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor, then `supabase/seed.sql`.
3. Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Restart the dev server. The badge in the header flips from *Demo simulation* to *Supabase
realtime*, and every component switches over without a code change — `src/lib/dataService.js` is
the only file that knows which backend is live.

`schema.sql` enables row level security: reads are public for both dashboards, and the only write
the browser can make is a passenger filing an incident report. Detections, telemetry and crowd
counts are expected to come from the on-bus edge devices using the service role key.

## Deploying to Vercel

Import the repo, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables, and
deploy. `vercel.json` already rewrites all paths to `index.html` so the client-side routes resolve.
Build command `npm run build`, output directory `dist` — both auto-detected.

## Layout

```
src/
  lib/
    supabaseClient.js   Supabase client; reports whether env vars are present
    dataService.js      fetch / subscribe / insert against Supabase or the demo store
    demoStore.js        in-memory tables, fleet simulation, cross-tab sync
    seedData.js         routes, buses, stops and the seeded alert history
    useLiveTable.js     hook: rows + realtime updates for one table
    geo.js              haversine distance, ETA, nearest stop, relative time
  components/           map canvas, markers, alert feed, fleet panel, stat cards, QR panel
  pages/                Landing, OfficialDashboard, PassengerDashboard
supabase/
  schema.sql            tables, indexes, realtime publication, RLS policies
  seed.sql              the same seed data as seedData.js
```

## Notes

- Maps are Leaflet with OpenStreetMap tiles — no API key, no tile budget.
- Photos in the seed data point at `picsum.photos` placeholders. Swap `photo_url` for Supabase
  Storage URLs when the real camera pipeline is connected.
- The arrival alert fires three stops out and uses the browser Notification API when the passenger
  grants permission; the in-page banner is the fallback.
