import { DETECTION_LABEL, severityOf } from '../lib/theme'
import { timeAgo } from '../lib/geo'
import { ROUTES } from '../lib/seedData'

const STATUS_BADGE = {
  open: 'bg-red-50 text-red-600 ring-red-200',
  acknowledged: 'bg-amber-50 text-amber-600 ring-amber-200',
  resolved: 'bg-emerald-50 text-emerald-600 ring-emerald-200',
  new: 'bg-red-50 text-red-600 ring-red-200',
  reviewed: 'bg-amber-50 text-amber-600 ring-amber-200',
}

function PanelHeader({ title, count, onClose }) {
  return (
    <div className="flex items-center justify-between border-b border-black/5 px-5 py-3">
      <div>
        <h3 className="text-sm font-bold text-[#1B3A6B]">{title}</h3>
        <p className="text-[11px] text-[#94a3b8]">{count} records</p>
      </div>
      <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#94a3b8] hover:bg-black/5 hover:text-[#1B3A6B]">
        ✕
      </button>
    </div>
  )
}

function DefectsPanel({ detections, onFocus, onClose }) {
  return (
    <div>
      <PanelHeader title="Road Defects" count={detections.length} onClose={onClose} />
      <div className="max-h-[320px] overflow-y-auto">
        {detections.map((d) => {
          const sev = severityOf(d.severity)
          return (
            <button
              key={d.id}
              onClick={() => onFocus([d.lat, d.lng])}
              className="flex w-full items-start gap-3 border-b border-black/5 px-5 py-3 text-left transition hover:bg-[#2196F3]/5"
            >
              {d.photo_url && (
                <img src={d.photo_url} alt={d.type} className="h-12 w-16 shrink-0 rounded-lg object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[#1B3A6B]">{DETECTION_LABEL[d.type] ?? d.type}</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1" style={{ color: sev.color, background: sev.color + '15', borderColor: sev.color + '40' }}>
                    {sev.label}
                  </span>
                  <span className="ml-auto text-[10px] text-[#94a3b8]">{timeAgo(d.timestamp)}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-[#64748b]">{d.lat.toFixed(4)}, {d.lng.toFixed(4)} · Bus {d.bus_id}</p>
              </div>
            </button>
          )
        })}
        {detections.length === 0 && <p className="px-5 py-6 text-center text-xs text-[#94a3b8]">No defects detected today.</p>}
      </div>
    </div>
  )
}

function CrowdPanel({ crowdAlerts, buses, onFocus, onClose }) {
  const busMap = Object.fromEntries(buses.map((b) => [b.id, b]))
  return (
    <div>
      <PanelHeader title="Crowd Alerts" count={crowdAlerts.length} onClose={onClose} />
      <div className="max-h-[320px] overflow-y-auto">
        {crowdAlerts.map((c) => {
          const bus = busMap[c.bus_id]
          return (
            <button
              key={c.id}
              onClick={() => bus && onFocus([bus.current_lat, bus.current_lng])}
              className="flex w-full items-center gap-3 border-b border-black/5 px-5 py-3 text-left transition hover:bg-[#2196F3]/5"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${c.threshold_exceeded ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                {c.passenger_count}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[#1B3A6B]">{c.bus_id}</span>
                  {bus && <span className="text-[11px] text-[#64748b]">Route {bus.route_number}</span>}
                  <span className="ml-auto text-[10px] text-[#94a3b8]">{timeAgo(c.timestamp)}</span>
                </div>
                <p className="mt-0.5 text-[11px]">
                  {c.threshold_exceeded
                    ? <span className="font-medium text-amber-600">Threshold exceeded — {c.passenger_count} passengers</span>
                    : <span className="text-[#64748b]">{c.passenger_count} passengers — within limit</span>
                  }
                </p>
              </div>
            </button>
          )
        })}
        {crowdAlerts.length === 0 && <p className="px-5 py-6 text-center text-xs text-[#94a3b8]">No crowd alerts today.</p>}
      </div>
    </div>
  )
}

function ReportsPanel({ incidents, onFocus, onClose }) {
  const typeIcon = { theft: '🕵️', harassment: '🚨', accident: '💥', other: '📝' }
  return (
    <div>
      <PanelHeader title="Passenger Reports" count={incidents.length} onClose={onClose} />
      <div className="max-h-[320px] overflow-y-auto">
        {incidents.map((i) => (
          <button
            key={i.id}
            onClick={() => onFocus([i.lat, i.lng])}
            className="flex w-full items-start gap-3 border-b border-black/5 px-5 py-3 text-left transition hover:bg-[#2196F3]/5"
          >
            <span className="mt-0.5 text-lg">{typeIcon[i.type] ?? '📝'}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold capitalize text-[#1B3A6B]">{i.type}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ring-1 ${STATUS_BADGE[i.status] ?? STATUS_BADGE.new}`}>
                  {i.status}
                </span>
                <span className="ml-auto text-[10px] text-[#94a3b8]">{timeAgo(i.timestamp)}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[#64748b]">Bus {i.bus_id} · {i.lat.toFixed(4)}, {i.lng.toFixed(4)}</p>
            </div>
          </button>
        ))}
        {incidents.length === 0 && <p className="px-5 py-6 text-center text-xs text-[#94a3b8]">No incidents reported today.</p>}
      </div>
    </div>
  )
}

function FleetDetailPanel({ buses, crowdAlerts, onFocus, onClose }) {
  const latestCrowd = (busId) =>
    crowdAlerts.filter((c) => c.bus_id === busId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]

  return (
    <div>
      <PanelHeader title="Fleet Status" count={buses.length} onClose={onClose} />
      <div className="max-h-[320px] overflow-y-auto">
        {buses.map((bus) => {
          const crowd = latestCrowd(bus.id)
          const active = bus.status === 'active'
          return (
            <button
              key={bus.id}
              onClick={() => onFocus([bus.current_lat, bus.current_lng])}
              className="flex w-full items-center gap-3 border-b border-black/5 px-5 py-3 text-left transition hover:bg-[#2196F3]/5"
            >
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${active ? 'bg-emerald-500 pulse-dot' : 'bg-slate-400'}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[#1B3A6B]">Route {bus.route_number}</span>
                  <span className="text-[11px] text-[#64748b]">{ROUTES[bus.route_number]?.name}</span>
                  <span className="ml-auto text-[10px] text-[#94a3b8]">{timeAgo(bus.last_updated)}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-[11px] text-[#64748b]">
                  <span>{bus.id}</span>
                  {crowd && (
                    <span className={crowd.threshold_exceeded ? 'font-medium text-amber-600' : ''}>
                      {crowd.passenger_count} pax
                    </span>
                  )}
                  <span className={`capitalize ${active ? 'text-emerald-600' : 'text-slate-400'}`}>{bus.status}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function DetailPanel({ type, detections, crowdAlerts, incidents, buses, onFocus, onClose }) {
  return (
    <div className="detail-panel-enter rounded-t-2xl bg-white shadow-xl shadow-black/10 ring-1 ring-black/5">
      {type === 'defects' && <DefectsPanel detections={detections} onFocus={onFocus} onClose={onClose} />}
      {type === 'crowd' && <CrowdPanel crowdAlerts={crowdAlerts} buses={buses} onFocus={onFocus} onClose={onClose} />}
      {type === 'reports' && <ReportsPanel incidents={incidents} onFocus={onFocus} onClose={onClose} />}
      {type === 'fleet' && <FleetDetailPanel buses={buses} crowdAlerts={crowdAlerts} onFocus={onFocus} onClose={onClose} />}
    </div>
  )
}
