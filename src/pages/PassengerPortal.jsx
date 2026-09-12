import { useMemo, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import PassengerMap from '../components/PassengerMap'
import { BUSES, ROUTES, STOPS } from '../lib/seedData'

export default function PassengerPortal() {
  const [params] = useSearchParams()
  const ticketId = params.get('ticket')
  const busId = params.get('bus') || 'KA-01-F-1234'
  const routeId = params.get('route') || '500D'
  const fromName = params.get('from')
  const toName = params.get('to')
  const fare = params.get('fare')
  const destParam = params.get('dest')

  const [destinationId, setDestinationId] = useState(destParam || 'stop-7')
  const [issue, setIssue] = useState('')
  const [sent, setSent] = useState(false)

  const rawBus = BUSES.find((b) => b.id === busId) || BUSES[0]

  // Simulate bus movement along route
  const [busLat, setBusLat] = useState(rawBus.current_lat)
  const [busLng, setBusLng] = useState(rawBus.current_lng)
  const progressRef = useRef(0)

  const bus = useMemo(() => ({
    ...rawBus,
    current_lat: busLat,
    current_lng: busLng,
  }), [rawBus, busLat, busLng])

  const stops = useMemo(
    () => STOPS.filter((x) => x.route_id === bus.route_number).sort((a, b) => a.sequence - b.sequence),
    [bus.route_number],
  )

  const routePath = ROUTES[bus.route_number]?.path ?? []

  // Animate bus along route
  useEffect(() => {
    if (routePath.length < 2) return
    let progress = 0
    const speed = 0.0003

    function lerp(a, b, t) { return a + (b - a) * t }

    const tick = () => {
      progress += speed
      if (progress >= routePath.length - 1) progress = 0

      const segIdx = Math.floor(progress)
      const frac = progress - segIdx
      const a = routePath[segIdx]
      const b = routePath[Math.min(segIdx + 1, routePath.length - 1)]

      setBusLat(lerp(a[0], b[0], frac))
      setBusLng(lerp(a[1], b[1], frac))
      progressRef.current = progress
      rafRef.current = requestAnimationFrame(tick)
    }

    const rafRef = { current: null }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [routePath])

  const destination = stops.find((x) => x.id === destinationId)

  // Compute current stop index from bus position
  const distKm = (a, b) => {
    const R = 6371
    const dLat = ((b[0] - a[0]) * Math.PI) / 180
    const dLng = ((b[1] - a[1]) * Math.PI) / 180
    const lat1 = (a[0] * Math.PI) / 180
    const lat2 = (b[0] * Math.PI) / 180
    const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
    return 2 * R * Math.asin(Math.sqrt(h))
  }

  const currentIdx = useMemo(() => {
    let best = 0, bestD = Infinity
    stops.forEach((s, i) => {
      const d = distKm([busLat, busLng], [s.lat, s.lng])
      if (d < bestD) { bestD = d; best = i }
    })
    return best
  }, [stops, busLat, busLng])

  const currentStop = stops[currentIdx]
  const nextStop = stops[Math.min(currentIdx + 1, stops.length - 1)]
  const etaMin = (from, to) => Math.max(1, Math.round((distKm(from, to) / 18) * 60))
  const stopsAway = destination ? Math.max(0, destination.sequence - (currentStop?.sequence || 1)) : 0
  const etaToDest = destination ? etaMin([busLat, busLng], [destination.lat, destination.lng]) : null

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-white/15 px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-wider text-orange-500">NAVBHARAT PASSENGER</p>
            <h1 className="mt-1 text-sm font-semibold">Your live journey</h1>
          </div>
          <span className="rounded-full border border-orange-500/40 px-3 py-1 text-xs text-orange-300">
            {ticketId ? `Ticket active · ₹${fare || '60'}` : 'Live tracking'}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl p-5">

        {/* Ticket banner — only shows when opened via QR scan */}
        {ticketId && (
          <section className="mb-4 rounded-xl border border-orange-500/40 bg-orange-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-lg">
                🎫
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-orange-300">E-Ticket Active</p>
                  <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[9px] font-bold text-orange-400">
                    {ticketId}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-neutral-400">
                  {fromName && toName ? (
                    <>{fromName} <span className="text-orange-500">→</span> {toName} · ₹{fare}</>
                  ) : (
                    <>Bus {busId} · Route {routeId}</>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-orange-400">₹{fare || '60'}</p>
                <p className="text-[9px] text-neutral-500">Single journey</p>
              </div>
            </div>
          </section>
        )}

        {/* Bus info cards */}
        <section className="grid gap-4 rounded-xl border border-white/15 bg-neutral-900 p-5 md:grid-cols-3">
          <div>
            <p className="text-xs text-neutral-500">BUS & ROUTE</p>
            <p className="mt-2 text-lg font-semibold">{bus.route_number} · {bus.id}</p>
            <p className="mt-1 text-sm text-neutral-400">{ROUTES[bus.route_number]?.name}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">CURRENT LOCATION</p>
            <p className="mt-2 font-medium">{currentStop?.name || 'En route'}</p>
            <p className="mt-1 text-sm text-neutral-400">
              {busLat.toFixed(4)}, {busLng.toFixed(4)} · <span className="text-emerald-400">Moving</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">NEXT STOP</p>
            <p className="mt-2 font-medium">{nextStop?.name}</p>
            <p className="mt-1 text-sm text-orange-300">
              Approx. {etaMin([busLat, busLng], [nextStop?.lat ?? 0, nextStop?.lng ?? 0])} minutes
            </p>
          </div>
        </section>

        {/* Map + stops */}
        <section className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
          <div className="h-[360px] overflow-hidden rounded-xl border border-white/15">
            <PassengerMap bus={bus} stops={stops} destinationId={destinationId} />
          </div>

          <div className="rounded-xl border border-white/15 bg-neutral-900 p-5">
            <p className="text-xs font-bold tracking-wider text-orange-500">DESTINATION & STOPS</p>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="mt-3 w-full rounded-md border border-white/15 bg-neutral-800 p-3 text-sm outline-none"
            >
              {stops.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.sequence}. {x.name}
                </option>
              ))}
            </select>

            <div className="mt-4 rounded-lg bg-white/[.04] p-3">
              <p className="text-xs text-neutral-500">YOUR DESTINATION</p>
              <p className="mt-1 font-semibold">{destination?.name}</p>
              <p className="mt-1 text-sm text-orange-300">
                {stopsAway} stop{stopsAway !== 1 ? 's' : ''} away · Estimated {etaToDest} min
              </p>
            </div>

            {/* All stops with live ETA */}
            <div className="mt-4 space-y-0">
              {stops.map((s, i) => {
                const isPast = i < currentIdx
                const isCurrent = i === currentIdx
                const eta = etaMin([busLat, busLng], [s.lat, s.lng])
                return (
                  <div className="flex gap-3 py-2 text-sm" key={s.id}>
                    <span className={isCurrent ? 'text-orange-400' : isPast ? 'text-neutral-600' : 'text-neutral-500'}>
                      {isCurrent ? '●' : isPast ? '✓' : '○'}
                    </span>
                    <span className={
                      s.id === destinationId ? 'font-semibold text-orange-300' :
                      isPast ? 'text-neutral-600 line-through' :
                      'text-neutral-300'
                    }>
                      {s.name}
                    </span>
                    <span className="ml-auto text-xs text-neutral-500">
                      {isPast ? 'Passed' : isCurrent ? 'Now' : `${eta} min`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Safety report */}
        <section className="mt-4 rounded-xl border border-white/15 bg-neutral-900 p-5">
          <p className="text-xs font-bold tracking-wider text-orange-500">REPORT A SAFETY ISSUE</p>
          <p className="mt-1 text-sm text-neutral-400">
            Your bus, route, location, and time are attached automatically.
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              { type: 'Theft', icon: '🕵️' },
              { type: 'Harassment', icon: '🚨' },
              { type: 'Accident', icon: '💥' },
              { type: 'Other', icon: '📝' },
            ].map((t) => (
              <button
                key={t.type}
                onClick={() => { setSent(true); setIssue(t.type); setTimeout(() => setSent(false), 6000) }}
                className="flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-3 text-xs transition hover:border-orange-500/40 hover:bg-orange-500/10 active:scale-95"
              >
                <span className="text-xl">{t.icon}</span>
                <span>{t.type}</span>
              </button>
            ))}
          </div>
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Optional: add details about the incident..."
            className="mt-3 min-h-20 w-full rounded-md border border-white/15 bg-neutral-800 p-3 text-sm outline-none focus:border-orange-500"
          />
          {sent && (
            <p role="alert" className="mt-3 rounded-md bg-orange-500/10 p-3 text-sm text-orange-200">
              ✅ Safety report sent to transit control. Reference: PS-{Date.now().toString().slice(-4)}.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
