import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useStore, addDetection } from '../lib/store'
import { MOCK_DETECTIONS, MOCK_VIDEOS, BANGALORE_CENTER, BLR_BOUNDS, SEVERITY_COLORS, TYPE_LABELS, ZONES } from '../lib/mockData'

function FlyTo({ target }) {
  const map = useMap()
  useEffect(() => { if (target) map.flyTo(target, 15, { duration: 0.8 }) }, [target, map])
  return null
}

function makeIcon(severity) {
  const color = SEVERITY_COLORS[severity]?.dot ?? '#fb923c'
  return L.divIcon({
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `<div class="pulse-dot" style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 8px ${color}88;"></div>`,
  })
}

export default function DemoPothole() {
  const role = useStore((s) => s.role)
  const detections = useStore((s) => s.detections)
  const [scanning, setScanning] = useState(null)
  const [progress, setProgress] = useState(0)
  const [revealCount, setRevealCount] = useState(0)
  const [flyTarget, setFlyTarget] = useState(null)
  const timerRef = useRef(null)

  const visible = detections.filter((d) => role === 'admin' || d.zone === role)

  const runDetection = (videoId) => {
    if (scanning) return
    setScanning(videoId)
    setProgress(0)
    setRevealCount(0)

    let p = 0
    const interval = setInterval(() => {
      p += 5
      setProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        revealDetections()
      }
    }, 100)
    timerRef.current = interval
  }

  const revealDetections = () => {
    MOCK_DETECTIONS.forEach((det, i) => {
      setTimeout(() => {
        const existing = detections.find((d) => d.id === det.id)
        if (!existing) addDetection(det)
        setRevealCount((c) => c + 1)
        setFlyTarget([det.lat, det.lng])
      }, (i + 1) * 800)
    })
    setTimeout(() => setScanning(null), MOCK_DETECTIONS.length * 800 + 500)
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Left: Video clips panel */}
      <div className="w-full overflow-y-auto border-b border-black/5 bg-white p-4 lg:w-[380px] lg:border-b-0 lg:border-r">
        <h2 className="text-lg font-bold text-[#1B3A6B]">AI Pothole Detection</h2>
        <p className="mt-1 text-xs text-[#94a3b8]">Select a bus camera feed and run AI detection</p>

        <div className="mt-4 space-y-3">
          {MOCK_VIDEOS.map((v) => (
            <div key={v.id} className="rounded-xl bg-[#F5F7FA] p-4 ring-1 ring-black/5">
              {/* Mock video area */}
              <div className="relative mb-3 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#1B3A6B] to-[#2196F3]">
                <div className="text-center">
                  <p className="text-3xl">📹</p>
                  <p className="mt-1 text-[10px] font-medium text-white/80">{v.thumb}</p>
                </div>
                {scanning === v.id && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                    <div className="h-0.5 w-full absolute" style={{ top: `${progress}%` }}>
                      <div className="h-0.5 w-full bg-[#2196F3] shadow-[0_0_10px_#2196F3]" />
                    </div>
                    <p className="text-sm font-bold text-white">AI Analyzing...</p>
                    <p className="text-xs text-white/70">{progress}%</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#1B3A6B]">{v.label}</p>
                <button
                  onClick={() => runDetection(v.id)}
                  disabled={!!scanning}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${
                    scanning
                      ? 'bg-[#94a3b8]/20 text-[#94a3b8] cursor-not-allowed'
                      : 'bg-[#2196F3] text-white hover:bg-[#1976D2] active:scale-95'
                  }`}
                >
                  {scanning === v.id ? 'Scanning...' : 'Run Detection'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detection results */}
        {visible.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-[#1B3A6B]">Detections ({visible.length})</h3>
            <div className="mt-2 space-y-2">
              {visible.map((d) => {
                const sev = SEVERITY_COLORS[d.severity]
                return (
                  <button
                    key={d.id}
                    onClick={() => setFlyTarget([d.lat, d.lng])}
                    className="w-full rounded-lg bg-white px-3 py-2.5 text-left ring-1 ring-black/5 transition hover:ring-[#2196F3]/30 slide-up"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: sev.dot }} />
                      <span className="text-xs font-semibold text-[#1B3A6B]">{TYPE_LABELS[d.type]}</span>
                      <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: sev.bg, color: sev.text }}>
                        {d.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] text-[#64748b]">{d.location}</p>
                    <p className="text-[10px] text-[#94a3b8]">{d.lat.toFixed(4)}°N, {d.lng.toFixed(4)}°E · {new Date(d.timestamp).toLocaleTimeString()}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right: Map */}
      <div className="min-h-[300px] flex-1 lg:min-h-0">
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
          <FlyTo target={flyTarget} />
          {visible.map((d) => (
            <Marker key={d.id} position={[d.lat, d.lng]} icon={makeIcon(d.severity)}>
              <Popup>
                <div>
                  <p className="font-bold text-[#1B3A6B]">{TYPE_LABELS[d.type]}</p>
                  <p style={{ color: SEVERITY_COLORS[d.severity]?.text }}>{d.severity} severity</p>
                  <p className="text-[#64748b] text-[11px]">{d.location}</p>
                  <p className="text-[#94a3b8] text-[10px]">{new Date(d.timestamp).toLocaleTimeString()}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
