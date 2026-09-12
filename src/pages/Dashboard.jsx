import { useState } from 'react'
import { useStore, logout } from '../lib/store'
import { ROLES } from '../lib/mockData'
import DemoPothole from '../components/DemoPothole'
import DemoCrowd from '../components/DemoCrowd'
import DemoTicket from '../components/DemoTicket'
import NotificationBell from '../components/NotificationBell'
import AlertFeedPanel from '../components/AlertFeedPanel'

const TABS = [
  { id: 'pothole', label: 'Pothole Detection', icon: '🛣️' },
  { id: 'crowd',   label: 'Crowd Detection',   icon: '👥' },
  { id: 'ticket',  label: 'QR Ticket',         icon: '🎫' },
  { id: 'alerts',  label: 'Alert Feed',        icon: '🔔' },
]

export default function Dashboard() {
  const role = useStore((s) => s.role)
  const [tab, setTab] = useState('pothole')

  const roleInfo = ROLES.find((r) => r.id === role) ?? ROLES[0]

  return (
    <div className="flex h-screen flex-col bg-[#F5F7FA]">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-black/5 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B3A6B] text-sm font-bold text-white">N</div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-[#1B3A6B]">NavBharat Transit</h1>
          <p className="text-[10px] text-[#94a3b8]">BMTC Urban Intelligence · Bengaluru</p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden sm:inline rounded-full bg-[#1B3A6B]/5 px-3 py-1 text-[11px] font-semibold text-[#1B3A6B]">
            {roleInfo.icon} {roleInfo.label}
          </span>
          <NotificationBell />
          <button
            onClick={logout}
            className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-[#94a3b8] ring-1 ring-black/10 hover:bg-red-50 hover:text-red-600 hover:ring-red-200 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-black/5 bg-white px-4 py-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
              tab === t.id
                ? 'bg-[#2196F3]/10 text-[#2196F3]'
                : 'text-[#94a3b8] hover:text-[#1B3A6B]'
            }`}
          >
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="min-h-0 flex-1 overflow-y-auto">
        {tab === 'pothole' && <DemoPothole />}
        {tab === 'crowd'   && <DemoCrowd />}
        {tab === 'ticket'  && <DemoTicket />}
        {tab === 'alerts'  && <AlertFeedPanel />}
      </main>
    </div>
  )
}
