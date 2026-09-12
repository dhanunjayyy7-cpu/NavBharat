import { useStore, setCrowdCount } from '../lib/store'

export default function DemoCrowd() {
  const count = useStore((s) => s.crowdCount)
  const alertActive = useStore((s) => s.crowdAlertActive)

  const threshold = 60
  const pct = Math.min((count / threshold) * 100, 100)
  const barColor = count >= 60 ? '#ef4444' : count >= 50 ? '#f59e0b' : count >= 30 ? '#2196F3' : '#22c55e'
  const statusColor = count >= 60 ? 'text-red-600' : count >= 50 ? 'text-amber-600' : 'text-emerald-600'

  return (
    <div className="mx-auto max-w-xl p-4">
      <h2 className="text-lg font-bold text-[#1B3A6B]">Crowd Detection Demo</h2>
      <p className="mt-1 text-xs text-[#94a3b8]">Simulate passenger boarding and alighting</p>

      {/* Bus card */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#94a3b8]">BUS KA-01-F-1234</p>
            <p className="text-sm font-bold text-[#1B3A6B]">Route 500C · Majestic → Whitefield</p>
          </div>
          <span className="text-3xl">🚌</span>
        </div>

        {/* Passenger count */}
        <div className="mt-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">Current Passengers</p>
          <p className={`mt-1 text-6xl font-bold tabular-nums ${statusColor}`}>{count}</p>
          <p className="text-xs text-[#94a3b8]">Threshold: {threshold} passengers</p>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-[#94a3b8] mb-1">
            <span>0</span>
            <span>{pct.toFixed(0)}% capacity</span>
            <span>{threshold}</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-[#F5F7FA]">
            <div
              className="progress-bar h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>
        </div>

        {/* Alert banner */}
        {alertActive && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200 slide-up">
            <p className="text-sm font-bold text-red-700">⚠️ Bus Overcrowded — Threshold Reached</p>
            <p className="text-xs text-red-600">Bus KA-01-F-1234, Route 500C · {count} passengers on board</p>
          </div>
        )}

        {!alertActive && count > 0 && count < 55 && (
          <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
            <p className="text-sm font-semibold text-emerald-700">✅ Bus capacity normal</p>
          </div>
        )}

        {/* Controls */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            onClick={() => setCrowdCount(count - 1)}
            disabled={count <= 0}
            className="rounded-xl bg-[#F5F7FA] py-3 text-center font-bold text-[#1B3A6B] ring-1 ring-black/5 transition hover:bg-red-50 hover:text-red-600 active:scale-95 disabled:opacity-30"
          >
            <span className="text-lg">−</span>
            <p className="text-[10px] font-medium">Alight</p>
          </button>

          <button
            onClick={() => setCrowdCount(count + 1)}
            className="rounded-xl bg-[#2196F3] py-3 text-center font-bold text-white transition hover:bg-[#1976D2] active:scale-95"
          >
            <span className="text-lg">+</span>
            <p className="text-[10px] font-medium">Board</p>
          </button>

          <button
            onClick={() => setCrowdCount(58)}
            className="rounded-xl bg-amber-50 py-3 text-center font-bold text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100 active:scale-95"
          >
            <span className="text-sm">⚡</span>
            <p className="text-[10px] font-medium">Fill to 58</p>
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setCrowdCount(count + 5)}
            className="flex-1 rounded-lg bg-[#F5F7FA] py-2 text-xs font-medium text-[#1B3A6B] ring-1 ring-black/5 hover:bg-[#2196F3]/5"
          >
            +5 Board
          </button>
          <button
            onClick={() => setCrowdCount(count - 5)}
            disabled={count < 5}
            className="flex-1 rounded-lg bg-[#F5F7FA] py-2 text-xs font-medium text-[#1B3A6B] ring-1 ring-black/5 hover:bg-red-50 disabled:opacity-30"
          >
            −5 Alight
          </button>
          <button
            onClick={() => setCrowdCount(0)}
            className="flex-1 rounded-lg bg-[#F5F7FA] py-2 text-xs font-medium text-[#94a3b8] ring-1 ring-black/5 hover:bg-red-50 hover:text-red-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
