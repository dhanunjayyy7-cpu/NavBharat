import { ROUTES } from '../lib/seedData'
import { timeAgo } from '../lib/geo'

export default function FleetPanel({ buses, crowdAlerts, onFocus }) {
  const latestCrowd = (busId) =>
    crowdAlerts.filter((c) => c.bus_id === busId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/5 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-wide text-slate-200">Fleet monitor</h2>
        <p className="text-[11px] text-slate-500">
          {buses.filter((b) => b.status === 'active').length} of {buses.length} vehicles in service
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {buses.map((bus) => {
          const crowd = latestCrowd(bus.id)
          const active = bus.status === 'active'
          return (
            <button
              key={bus.id}
              onClick={() => onFocus([bus.current_lat, bus.current_lng])}
              className="block w-full border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-400 pulse-dot' : 'bg-slate-500'}`}
                />
                <span className="text-[13px] font-semibold text-slate-100">Route {bus.route_number}</span>
                <span className="ml-auto text-[10px] text-slate-500">{timeAgo(bus.last_updated)}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-400">{ROUTES[bus.route_number]?.name}</p>
              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-500">
                <span>{bus.id}</span>
                {crowd && (
                  <span className={crowd.threshold_exceeded ? 'text-amber-300' : 'text-slate-500'}>
                    {crowd.passenger_count} pax
                  </span>
                )}
                {!active && <span className="text-slate-400 capitalize">{bus.status}</span>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
