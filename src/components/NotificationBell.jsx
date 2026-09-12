import { useState } from 'react'
import { useStore, clearNotification, clearAllNotifications } from '../lib/store'

export default function NotificationBell() {
  const role = useStore((s) => s.role)
  const notifications = useStore((s) => s.notifications)
  const [open, setOpen] = useState(false)

  const visible = notifications.filter((n) => {
    if (role === 'admin') return true
    return n.zone === null || n.zone === role
  })

  const unread = visible.filter((n) => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[#64748b] hover:bg-black/5 transition"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-80 rounded-xl bg-white shadow-xl ring-1 ring-black/5 slide-up">
            <div className="flex items-center justify-between border-b border-black/5 px-4 py-2.5">
              <p className="text-sm font-bold text-[#1B3A6B]">Notifications</p>
              {unread > 0 && (
                <button
                  onClick={() => clearAllNotifications()}
                  className="text-[10px] text-[#2196F3] hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {visible.length === 0 && (
                <p className="px-4 py-6 text-center text-xs text-[#94a3b8]">No notifications yet</p>
              )}
              {visible.map((n) => (
                <button
                  key={n.id}
                  onClick={() => clearNotification(n.id)}
                  className={`block w-full border-b border-black/3 px-4 py-2.5 text-left transition hover:bg-[#2196F3]/5 ${
                    n.read ? 'opacity-50' : ''
                  }`}
                >
                  <p className="text-xs text-[#1B3A6B]">{n.message}</p>
                  <p className="mt-0.5 text-[10px] text-[#94a3b8]">
                    {new Date(n.timestamp).toLocaleTimeString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
