import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PassengerMap from '../components/PassengerMap'
import { useLiveTable } from '../lib/useLiveTable'
import { insertRow } from '../lib/dataService'
import { ROUTES } from '../lib/seedData'
import { etaMinutes, nearestStopIndex, timeAgo } from '../lib/geo'
import { INCIDENT_TYPES } from '../lib/theme'

const ALERT_STOPS_BEFORE = 3

export default function PassengerDashboard() {
  const [params, setParams] = useSearchParams()
  const { rows: buses } = useLiveTable('buses')
  const { rows: stops } = useLiveTable('stops')

  const busId = params.get('bus')
  const bus = useMemo(() => buses.find((b) => b.id === busId) ?? buses[0], [buses, busId])

  const routeStops = useMemo(
    () =>
      bus ? [...stops.filter((s) => s.route_id === bus.route_number)].sort((a, b) => a.sequence - b.sequence) : [],
    [stops, bus],
  )

  const [destinationId, setDestinationId] = useState('')
  const [alert, setAlert] = useState(null)
  const [pendingIncident, setPendingIncident] = useState(null)
  const [submitted, setSubmitted] = useState(null)
  const [sending, setSending] = useState(false)
  const [coords, setCoords] = useState(null)
  const alertFired = useRef(false)

  // Passenger GPS is preferred for incident reports; the bus ping is the fallback.
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (p) => setCoords([p.coords.latitude, p.coords.longitude]),
      () => setCoords(null),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }, [])

  const chooseDestination = (id) => {
    alertFired.current = false
    setAlert(null)
    setDestinationId(id)
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission()
  }

  const position = bus ? [bus.current_lat, bus.current_lng] : null
  const currentIndex = position && routeStops.length ? nearestStopIndex(routeStops, position) : -1
  const nextStop = currentIndex >= 0 ? routeStops[Math.min(currentIndex + 1, routeStops.length - 1)] : null
  const destination = routeStops.find((s) => s.id === destinationId) ?? null
  const stopsAway = destination && currentIndex >= 0 ? destination.sequence - routeStops[currentIndex].sequence : null
  const eta = destination && position ? etaMinutes(position, [destination.lat, destination.lng]) : null

  useEffect(() => {
    if (!destination || stopsAway === null) return
    if (stopsAway > 0 && stopsAway <= ALERT_STOPS_BEFORE && !alertFired.current) {
      alertFired.current = true
      const message = `${destination.name} is ${stopsAway} stop${stopsAway > 1 ? 's' : ''} away — get ready to alight.`
      setAlert(message)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('NavBharat Transit', { body: message })
      }
    }
  }, [stopsAway, destination])

  const sendIncident = async () => {
    if (!pendingIncident || !bus) return
    setSending(true)
    const [lat, lng] = coords ?? [bus.current_lat, bus.current_lng]
    try {
      await insertRow('incident_reports', {
        bus_id: bus.id,
        type: pendingIncident.id,
        lat,
        lng,
        status: 'open',
        timestamp: new Date().toISOString(),
      })
      setSubmitted(pendingIncident)
      setPendingIncident(null)
      setTimeout(() => setSubmitted(null), 6000)
    } catch (err) {
      setAlert(`Could not send report: ${err.message}`)
      setPendingIncident(null)
    } finally {
      setSending(false)
    }
  }

  if (!bus) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0b1020] text-sm text-slate-400">
        Loading your bus…
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#0b1020]">
      <header className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-bold text-[#06121f]">
          N
        </span>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-slate-100">Route {bus.route_number}</h1>
          <p className="truncate text-[11px] text-slate-500">{ROUTES[bus.route_number]?.name}</p>
        </div>
        <select
          value={bus.id}
          onChange={(e) => setParams({ bus: e.target.value })}
          className="ml-auto rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300 outline-none"
        >
          {buses.map((b) => (
            <option key={b.id} value={b.id} className="bg-[#111731]">
              {b.id}
            </option>
          ))}
        </select>
      </header>

      <div className="h-56 shrink-0 border-b border-white/8">
        <PassengerMap bus={bus} stops={routeStops} destinationId={destinationId} />
      </div>

      <div className="flex-1 space-y-4 p-4">
        <section className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Live tracking</p>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" /> {timeAgo(bus.last_updated)}
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-100">{nextStop?.name ?? '—'}</p>
          <p className="text-[11px] text-slate-500">
            Next stop · {nextStop && position ? `${etaMinutes(position, [nextStop.lat, nextStop.lng])} min away` : '—'}
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            Vehicle {bus.id} · {bus.current_lat.toFixed(4)}, {bus.current_lng.toFixed(4)}
          </p>
        </section>

        <section className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Smart arrival alert</p>
          <select
            value={destinationId}
            onChange={(e) => chooseDestination(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-sky-400/50"
          >
            <option value="" className="bg-[#111731]">
              Choose your destination stop…
            </option>
            {routeStops.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#111731]">
                {s.sequence}. {s.name}
              </option>
            ))}
          </select>

          {destination && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 px-3 py-2">
                <p className="text-[10px] text-slate-500">Stops away</p>
                <p className="text-xl font-semibold tabular-nums text-sky-300">
                  {stopsAway !== null && stopsAway > 0 ? stopsAway : stopsAway === 0 ? 'Here' : 'Passed'}
                </p>
              </div>
              <div className="rounded-lg bg-white/5 px-3 py-2">
                <p className="text-[10px] text-slate-500">Estimated arrival</p>
                <p className="text-xl font-semibold tabular-nums text-sky-300">{eta} min</p>
              </div>
            </div>
          )}
          <p className="mt-2 text-[11px] text-slate-500">
            You'll be alerted {ALERT_STOPS_BEFORE} stops before you arrive.
          </p>
        </section>

        <section className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Report an incident</p>
          <p className="mt-1 text-[11px] text-slate-500">
            One tap sends your bus number, route, location and time to the BMTC control room.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {INCIDENT_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setPendingIncident(t)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left transition active:scale-[0.98] hover:border-rose-400/40 hover:bg-rose-500/10"
              >
                <span className="text-lg">{t.icon}</span>
                <p className="mt-1 text-sm font-medium text-slate-100">{t.label}</p>
                <p className="text-[10px] leading-tight text-slate-500">{t.blurb}</p>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-slate-600">
            Location source: {coords ? 'your device GPS' : 'bus telemetry'} · For emergencies call 112.
          </p>
        </section>
      </div>

      {alert && (
        <div className="sticky bottom-0 z-20 border-t border-sky-400/30 bg-sky-500/15 px-4 py-3 backdrop-blur">
          <div className="flex items-start gap-2">
            <span className="text-base">🔔</span>
            <p className="flex-1 text-xs text-sky-100">{alert}</p>
            <button onClick={() => setAlert(null)} className="text-sky-300">
              ✕
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="sticky bottom-0 z-20 border-t border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-xs text-emerald-100 backdrop-blur">
          {submitted.label} report sent to the control room. Reference logged against bus {bus.id}.
        </div>
      )}

      {pendingIncident && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/70 p-4" onClick={() => setPendingIncident(null)}>
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111731] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-semibold text-slate-100">
              {pendingIncident.icon} Report {pendingIncident.label.toLowerCase()}?
            </p>
            <div className="mt-3 space-y-1 text-[11px] text-slate-400">
              <p>Bus: {bus.id}</p>
              <p>
                Route: {bus.route_number} — {ROUTES[bus.route_number]?.name}
              </p>
              <p>
                Location: {(coords ?? [bus.current_lat, bus.current_lng])[0].toFixed(4)},{' '}
                {(coords ?? [bus.current_lat, bus.current_lng])[1].toFixed(4)}
              </p>
              <p>Time: {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setPendingIncident(null)}
                className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={sendIncident}
                disabled={sending}
                className="flex-1 rounded-lg bg-rose-500 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {sending ? 'Sending…' : 'Send report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
