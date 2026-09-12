import { useStore } from '../lib/store'
import { SEVERITY_COLORS } from '../lib/mockData'

export default function AlertFeedPanel() {
  const role = useStore((s) => s.role)
  const alerts = useStore((s) => s.alerts)

  const visible = alerts.filter((a) => {
    if (role === 'admin') return true
    return a.zone === null || a.zone === role
  })

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#1B3A6B]">Alert Feed</h2>
        <p className="text-xs text-[#94a3b8]">{visible.length} alerts · {role === 'admin' ? 'All zones' : `${role} zone only`}</p>
      </div>

      {visible.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-4xl">📡</p>
          <p className="mt-3 text-sm font-semibold text-[#1B3A6B]">No alerts yet</p>
          <p className="mt-1 text-xs text-[#94a3b8]">Run a detection demo to generate alerts</p>
        </div>
      )}

      <div className="space-y-2">
        {visible.map((a) => {
          const sev = SEVERITY_COLORS[a.severity] ?? SEVERITY_COLORS.medium
          return (
            <div
              key={a.id}
              className="flex items-start gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5 slide-up"
            >
              <span
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: sev.dot }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#1B3A6B]">{a.message}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: sev.bg, color: sev.text }}
                  >
                    {a.severity}
                  </span>
                  <span className="text-[10px] text-[#94a3b8]">
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </span>
                  {a.type === 'crowd' && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                      CROWD ALERT
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
