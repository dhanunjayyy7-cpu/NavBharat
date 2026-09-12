import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { STOPS, BANGALORE_CENTER, BLR_BOUNDS } from '../lib/mockData'

const ROUTE_PATH = STOPS.map((s) => [s.lat, s.lng])
const BUS_ID = 'KA-01-F-1234'
const ROUTE = '500C'

function stopIcon(highlight) {
  const c = highlight ? '#2196F3' : '#94a3b8'
  return L.divIcon({
    className: '', iconSize: [12, 12], iconAnchor: [6, 6],
    html: `<div style="width:10px;height:10px;border-radius:50%;background:${c};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.2);"></div>`,
  })
}

function busMarkerIcon() {
  return L.divIcon({
    className: '', iconSize: [36, 36], iconAnchor: [18, 18],
    html: `<div class="pulse-dot" style="width:32px;height:32px;border-radius:50%;background:#1B3A6B;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 10px rgba(27,58,107,.4);font-size:16px;">🚌</div>`,
  })
}

function lerp(a, b, t) { return a + (b - a) * t }

function BusMarker({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.panTo(position, { animate: true, duration: 0.5 })
  }, [position, map])
  if (!position) return null
  return <Marker position={position} icon={busMarkerIcon()} zIndexOffset={999} />
}

export default function PassengerView() {
  const [busPos, setBusPos] = useState(ROUTE_PATH[0])
  const [currentStopIdx, setCurrentStopIdx] = useState(0)
  const [showIncident, setShowIncident] = useState(false)
  const [incidentSent, setIncidentSent] = useState(null)
  const progressRef = useRef(0)
  const animRef = useRef(null)

  useEffect(() => {
    let progress = 0
    const speed = 0.0004

    const tick = () => {
      progress += speed
      if (progress >= ROUTE_PATH.length - 1) progress = 0

      const segIdx = Math.floor(progress)
      const frac = progress - segIdx
      const a = ROUTE_PATH[segIdx]
      const b = ROUTE_PATH[Math.min(segIdx + 1, ROUTE_PATH.length - 1)]
      const lat = lerp(a[0], b[0], frac)
      const lng = lerp(a[1], b[1], frac)

      setBusPos([lat, lng])
      setCurrentStopIdx(segIdx)
      progressRef.current = progress
      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  const distKm = (a, b) => {
    const R = 6371
    const dLat = ((b[0] - a[0]) * Math.PI) / 180
    const dLng = ((b[1] - a[1]) * Math.PI) / 180
    const lat1 = (a[0] * Math.PI) / 180
    const lat2 = (b[0] * Math.PI) / 180
    const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
    return 2 * R * Math.asin(Math.sqrt(h))
  }
  const etaMin = (from, to) => Math.max(1, Math.round((distKm(from, to) / 18) * 60))

  const sendIncident = (type) => {
    setIncidentSent(type)
    setShowIncident(false)
    setTimeout(() => setIncidentSent(null), 5000)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#F5F7FA]">
      {/* Header */}
      <header className="flex items-center gap-2.5 bg-[#1B3A6B] px-4 py-3 text-white">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-sm font-bold">N</div>
        <div>
          <h1 className="text-sm font-bold">Route {ROUTE}</h1>
          <p className="text-[10px] text-white/60">Bus {BUS_ID} · NavBharat Transit</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" /> Live
        </span>
      </header>

      {/* Map */}
      <div className="h-52 shrink-0">
        <MapContainer
          center={BANGALORE_CENTER}
          zoom={12}
          minZoom={11}
          maxZoom={18}
          maxBounds={BLR_BOUNDS}
          maxBoundsViscosity={1.0}
          zoomControl={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />
          <Polyline positions={ROUTE_PATH} pathOptions={{ color: '#2196F3', weight: 4, opacity: 0.5 }} />
          {STOPS.map((s, i) => (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={stopIcon(i === currentStopIdx)}>
              <Popup><span className="text-xs font-semibold">{s.name}</span></Popup>
            </Marker>
          ))}
          <BusMarker position={busPos} />
        </MapContainer>
      </div>

      {/* Stop list with ETAs */}
      <div className="flex-1 space-y-3 p-4">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">Stops & Estimated Arrival</p>
          <div className="mt-3 space-y-0">
            {STOPS.map((s, i) => {
              const isPast = i < currentStopIdx
              const isCurrent = i === currentStopIdx
              const eta = busPos ? etaMin(busPos, [s.lat, s.lng]) : '—'
              return (
                <div key={s.id} className="flex items-center gap-3 py-2">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full border-2 ${
                      isCurrent ? 'border-[#2196F3] bg-[#2196F3]' :
                      isPast ? 'border-[#94a3b8] bg-[#94a3b8]' :
                      'border-[#2196F3] bg-white'
                    }`} />
                    {i < STOPS.length - 1 && (
                      <div className={`h-6 w-0.5 ${isPast ? 'bg-[#94a3b8]' : 'bg-[#2196F3]/30'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${isCurrent ? 'font-bold text-[#1B3A6B]' : isPast ? 'text-[#94a3b8] line-through' : 'font-medium text-[#1B3A6B]'}`}>
                      {s.name}
                    </p>
                  </div>
                  <span className={`text-xs tabular-nums ${isCurrent ? 'font-bold text-[#2196F3]' : isPast ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
                    {isPast ? 'Passed' : isCurrent ? 'Now' : `${eta} min`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Report incident */}
        <button
          onClick={() => setShowIncident(true)}
          className="w-full rounded-xl bg-red-50 py-3 text-center text-sm font-bold text-red-600 ring-1 ring-red-200 transition hover:bg-red-100 active:scale-[0.98]"
        >
          🚨 Report Incident
        </button>

        {incidentSent && (
          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 slide-up">
            ✅ {incidentSent} report sent to control room
          </div>
        )}
      </div>

      {/* Incident modal */}
      {showIncident && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4" onClick={() => setShowIncident(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl slide-up" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-bold text-[#1B3A6B]">Report an Incident</p>
            <p className="mt-1 text-[10px] text-[#94a3b8]">Bus {BUS_ID} · Route {ROUTE} · Location auto-attached</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { id: 'Theft', icon: '🕵️', desc: 'Pickpocketing or stolen items' },
                { id: 'Harassment', icon: '🚨', desc: 'Unsafe behavior' },
                { id: 'Accident', icon: '💥', desc: 'Collision or injury' },
                { id: 'Other', icon: '📝', desc: 'Other issue' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => sendIncident(t.id)}
                  className="rounded-xl bg-[#F5F7FA] p-3 text-left ring-1 ring-black/5 transition hover:ring-red-300 hover:bg-red-50 active:scale-95"
                >
                  <span className="text-xl">{t.icon}</span>
                  <p className="mt-1 text-sm font-bold text-[#1B3A6B]">{t.id}</p>
                  <p className="text-[10px] text-[#94a3b8]">{t.desc}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowIncident(false)}
              className="mt-3 w-full rounded-lg py-2 text-xs font-medium text-[#94a3b8] hover:text-[#1B3A6B]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
