import { DETECTION_LABEL, severityOf } from '../lib/theme'
import { timeAgo } from '../lib/geo'

const SOURCE_STYLE = {
  ai: { tag: 'AI VISION', className: 'bg-sky-400/10 text-sky-300 ring-sky-400/30' },
  crowd: { tag: 'CROWD SENSOR', className: 'bg-amber-400/10 text-amber-300 ring-amber-400/30' },
  passenger: { tag: 'PASSENGER', className: 'bg-fuchsia-400/10 text-fuchsia-300 ring-fuchsia-400/30' },
}

/** Merge the three alert sources into one reverse-chronological stream. */
export function buildAlertStream({ detections, crowdAlerts, incidents }) {
  const items = [
    ...detections.map((d) => ({
      id: `d-${d.id}`,
      source: 'ai',
      title: `${DETECTION_LABEL[d.type] ?? d.type} detected`,
      detail: `${severityOf(d.severity).label} severity · ${d.lat.toFixed(4)}, ${d.lng.toFixed(4)}`,
      meta: `Bus ${d.bus_id}`,
      accent: severityOf(d.severity).color,
      timestamp: d.timestamp,
      position: [d.lat, d.lng],
    })),
    ...crowdAlerts.map((c) => ({
      id: `c-${c.id}`,
      source: 'crowd',
      title: c.threshold_exceeded ? 'Overcrowding threshold breached' : 'Crowd level logged',
      detail: `${c.passenger_count} passengers on board`,
      meta: `Bus ${c.bus_id}`,
      accent: c.threshold_exceeded ? '#fbbf24' : '#64748b',
      timestamp: c.timestamp,
      position: null,
    })),
    ...incidents.map((i) => ({
      id: `i-${i.id}`,
      source: 'passenger',
      title: `${i.type[0].toUpperCase()}${i.type.slice(1)} reported`,
      detail: `Status: ${i.status} · ${i.lat.toFixed(4)}, ${i.lng.toFixed(4)}`,
      meta: `Bus ${i.bus_id}`,
      accent: '#c084fc',
      timestamp: i.timestamp,
      position: [i.lat, i.lng],
    })),
  ]
  return items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export default function AlertFeed({ items, onFocus, filter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'ai', label: 'AI' },
    { id: 'crowd', label: 'Crowd' },
    { id: 'passenger', label: 'Reports' },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-200">Live alert feed</h2>
          <p className="text-[11px] text-slate-500">{items.length} alerts in window</p>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" /> live
        </span>
      </div>

      <div className="flex gap-1 border-b border-white/5 px-3 py-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`rounded-full px-2.5 py-1 text-[11px] transition ${
              filter === f.id ? 'bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.map((item) => {
          const style = SOURCE_STYLE[item.source]
          return (
            <button
              key={item.id}
              onClick={() => item.position && onFocus(item.position)}
              className="block w-full border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/5"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: item.accent }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider ring-1 ${style.className}`}>
                      {style.tag}
                    </span>
                    <span className="ml-auto text-[10px] text-slate-500">{timeAgo(item.timestamp)}</span>
                  </div>
                  <p className="mt-1 truncate text-[13px] font-medium text-slate-200">{item.title}</p>
                  <p className="truncate text-[11px] text-slate-400">{item.detail}</p>
                  <p className="text-[11px] text-slate-500">{item.meta}</p>
                </div>
              </div>
            </button>
          )
        })}
        {items.length === 0 && <p className="px-4 py-6 text-center text-xs text-slate-500">No alerts in this filter.</p>}
      </div>
    </div>
  )
}
