import { useEffect, useMemo, useRef, useState } from 'react'
import CityMap from '../components/CityMap'
import StatCards from '../components/StatCards'
import DetailPanel from '../components/DetailPanel'
import { useLiveTable } from '../lib/useLiveTable'
import { usingSupabase } from '../lib/dataService'
import { startDemoSimulation } from '../lib/demoStore'
import { isToday } from '../lib/geo'

const LAYER_TOGGLES = [
  { id: 'detections', label: 'Road defects', icon: '🛣️' },
  { id: 'fleet', label: 'Fleet', icon: '🚌' },
  { id: 'incidents', label: 'Incidents', icon: '🚨' },
  { id: 'routes', label: 'Routes', icon: '📍' },
]

export default function OfficialDashboard() {
  const { rows: detections } = useLiveTable('detections')
  const { rows: buses } = useLiveTable('buses')
  const { rows: crowdAlerts } = useLiveTable('crowd_alerts')
  const { rows: incidents } = useLiveTable('incident_reports')

  const [focus, setFocus] = useState(null)
  const [layers, setLayers] = useState({ detections: true, fleet: true, incidents: true, routes: true })
  const [toast, setToast] = useState(null)
  const [activeCard, setActiveCard] = useState(null)
  const [demoRunning, setDemoRunning] = useState(false)

  const newestDetectionId = detections[0]?.id
  const seenNewest = useRef(null)
  useEffect(() => {
    if (!newestDetectionId) return
    if (seenNewest.current === null) {
      seenNewest.current = newestDetectionId
      return
    }
    if (seenNewest.current !== newestDetectionId) {
      seenNewest.current = newestDetectionId
      const d = detections[0]
      setToast(`New ${d.type} detected · ${d.severity} severity`)
      const t = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(t)
    }
  }, [newestDetectionId, detections])

  const stats = useMemo(
    () => ({
      potholesToday: detections.filter((d) => isToday(d.timestamp)).length,
      highSeverity: detections.filter((d) => isToday(d.timestamp) && d.severity === 'high').length,
      crowdToday: crowdAlerts.filter((c) => isToday(c.timestamp) && c.threshold_exceeded).length,
      incidentsToday: incidents.filter((i) => isToday(i.timestamp)).length,
      activeBuses: buses.filter((b) => b.status === 'active').length,
    }),
    [detections, crowdAlerts, incidents, buses],
  )

  const toggleLayer = (id) => setLayers((prev) => ({ ...prev, [id]: !prev[id] }))

  const handleCardClick = (card) => {
    setActiveCard((prev) => (prev === card ? null : card))
  }

  const handleStartDemo = () => {
    startDemoSimulation()
    setDemoRunning(true)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F7FA]">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-black/5 bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#1B3A6B] text-sm font-bold text-white">
            N
          </span>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-[#1B3A6B]">NavBharat Transit</h1>
            <p className="text-[10px] font-medium text-[#94a3b8]">BMTC Urban Intelligence · Bengaluru Control Room</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ${
              usingSupabase
                ? 'bg-emerald-50 text-emerald-600 ring-emerald-200'
                : 'bg-amber-50 text-amber-600 ring-amber-200'
            }`}
          >
            {usingSupabase ? '● Supabase realtime' : '● Demo simulation'}
          </span>
        </div>
      </header>

      {/* Map + overlays */}
      <main className="relative min-h-0 flex-1">
        <CityMap
          detections={detections}
          buses={buses}
          incidents={incidents}
          focus={focus}
          layers={layers}
          newestDetectionId={newestDetectionId}
        />

        {/* Stat cards overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[400] p-4">
          <div className="pointer-events-auto">
            <StatCards
              {...stats}
              activeCard={activeCard}
              onCardClick={handleCardClick}
            />
          </div>
        </div>

        {/* Layer toggle pills */}
        <div className="pointer-events-auto absolute bottom-4 left-4 z-[400] flex flex-wrap gap-1.5 rounded-xl bg-white/90 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur">
          {LAYER_TOGGLES.map((l) => (
            <button
              key={l.id}
              onClick={() => toggleLayer(l.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
                layers[l.id]
                  ? 'bg-[#2196F3]/10 text-[#2196F3] ring-1 ring-[#2196F3]/20'
                  : 'text-[#94a3b8] hover:text-[#1B3A6B]'
              }`}
            >
              <span className="text-xs">{l.icon}</span>
              {l.label}
            </button>
          ))}
        </div>

        {/* Severity legend */}
        <div className="absolute bottom-4 right-4 z-[400] rounded-xl bg-white/90 px-3 py-2 text-[10px] text-[#64748b] shadow-lg ring-1 ring-black/5 backdrop-blur">
          <p className="mb-1 font-bold uppercase tracking-wider text-[#94a3b8]">Severity</p>
          <div className="flex gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" /> Low
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" /> Medium
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> High
            </span>
          </div>
        </div>

        {/* Demo simulation button — small, bottom right, above severity legend */}
        {!usingSupabase && (
          <button
            onClick={handleStartDemo}
            disabled={demoRunning}
            className={`absolute bottom-16 right-4 z-[400] rounded-lg px-3 py-1.5 text-[10px] font-medium shadow-lg ring-1 transition ${
              demoRunning
                ? 'bg-emerald-50 text-emerald-600 ring-emerald-200'
                : 'bg-white/90 text-[#64748b] ring-black/5 backdrop-blur hover:text-[#1B3A6B]'
            }`}
          >
            {demoRunning ? '● Simulation running' : '▶ Start demo'}
          </button>
        )}

        {/* Toast notification */}
        {toast && (
          <div className="absolute left-1/2 top-28 z-[500] -translate-x-1/2 rounded-full bg-rose-500 px-4 py-2 text-xs font-medium text-white shadow-lg">
            {toast}
          </div>
        )}

        {/* Detail panel — slides up from bottom */}
        {activeCard && (
          <div className="absolute inset-x-0 bottom-0 z-[450] mx-4 mb-14">
            <DetailPanel
              type={activeCard}
              detections={detections}
              crowdAlerts={crowdAlerts}
              incidents={incidents}
              buses={buses}
              onFocus={setFocus}
              onClose={() => setActiveCard(null)}
            />
          </div>
        )}
      </main>
    </div>
  )
}
