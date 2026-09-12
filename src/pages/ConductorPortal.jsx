import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { STOPS, ROUTES } from '../lib/seedData'

const routeStops = STOPS.filter((s) => s.route_id === '500D').sort((a, b) => a.sequence - b.sequence)

export default function ConductorPortal() {
  const [ticket, setTicket] = useState(null)
  const [count, setCount] = useState(59)
  const [from, setFrom] = useState('stop-1')
  const [to, setTo] = useState('stop-5')

  const fromStop = routeStops.find((s) => s.id === from)
  const toStop = routeStops.find((s) => s.id === to)
  const fare = Math.abs((toStop?.sequence ?? 1) - (fromStop?.sequence ?? 1)) * 15 || 15

  const generate = () => {
    const number = count + 1
    setCount(number)
    setTicket({
      id: `BMTC-${Date.now().toString().slice(-6)}`,
      number,
      time: new Date().toLocaleTimeString('en-IN'),
      from: fromStop,
      to: toStop,
      fare,
    })
  }

  const qrUrl = ticket
    ? `${window.location.origin}/passenger?ticket=${ticket.id}&bus=KA-01-F-1234&route=500D&from=${encodeURIComponent(ticket.from?.name || '')}&to=${encodeURIComponent(ticket.to?.name || '')}&fare=${ticket.fare}&dest=${ticket.to?.id || ''}`
    : ''

  return (
    <main className="min-h-screen bg-neutral-950 p-5 text-white">
      <div className="mx-auto max-w-md">
        <Link to="/" className="text-xs font-bold text-orange-500">← NAVBHARAT</Link>

        <header className="mt-7 border-b border-white/15 pb-5">
          <p className="text-xs font-bold tracking-widest text-orange-500">CONDUCTOR TERMINAL</p>
          <h1 className="mt-2 text-2xl font-semibold">KA 01 F 1234</h1>
          <p className="mt-1 text-sm text-neutral-400">Route 500D · {ROUTES['500D'].name}</p>
        </header>

        {/* Capacity */}
        <section className="mt-5 rounded-xl border border-white/15 bg-neutral-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Passenger capacity</p>
            <span className="text-xs text-orange-300">Limit 59</span>
          </div>
          <p className="mt-4 text-4xl font-semibold">
            {count}<span className="text-lg text-neutral-500"> / 59</span>
          </p>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((count / 59) * 100, 100)}%`,
                backgroundColor: count >= 59 ? '#ef4444' : count >= 50 ? '#f59e0b' : '#f97316',
              }}
            />
          </div>
        </section>

        {/* Route selection */}
        <section className="mt-4 rounded-xl border border-white/15 bg-neutral-900 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">From</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/15 bg-neutral-800 p-2.5 text-sm outline-none"
              >
                {routeStops.map((s) => (
                  <option key={s.id} value={s.id} disabled={s.id === to}>
                    {s.sequence}. {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">To</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/15 bg-neutral-800 p-2.5 text-sm outline-none"
              >
                {routeStops.map((s) => (
                  <option key={s.id} value={s.id} disabled={s.id === from}>
                    {s.sequence}. {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between text-sm">
            <span>{fromStop?.name} → {toStop?.name}</span>
            <b className="text-orange-300">₹{fare}</b>
          </div>

          <button
            onClick={generate}
            className="mt-5 w-full rounded-md bg-orange-500 p-3 text-sm font-bold text-black"
          >
            Generate ticket · ₹{fare}
          </button>
        </section>

        {/* Generated ticket */}
        {ticket && (
          <>
            <section className="mt-4 rounded-xl border border-orange-500/50 bg-white p-5 text-black">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold tracking-widest text-orange-600">NAVBHARAT TICKET</p>
                  <p className="mt-2 text-xl font-semibold">₹{ticket.fare}.00</p>
                  <p className="mt-2 text-xs text-neutral-600">
                    {ticket.id} · {ticket.time}
                  </p>
                  <p className="text-xs text-neutral-600">
                    Bus KA 01 F 1234 · Route 500D
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-orange-600">
                    <span>{ticket.from?.name}</span>
                    <span className="text-neutral-400">→</span>
                    <span>{ticket.to?.name}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <QRCodeSVG value={qrUrl} size={108} />
                  <p className="text-[8px] text-neutral-400">Scan to track</p>
                </div>
              </div>
              <p className="mt-4 border-t border-black/10 pt-3 text-xs text-neutral-600">
                Scan this QR to open the passenger journey page with live map, stops, and safety reporting.
              </p>
            </section>

            {count >= 59 && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-orange-500/50 bg-orange-500/10 p-4 text-sm text-orange-100"
              >
                <b>Capacity alert: bus overloaded by {count - 59} person{count - 59 !== 1 ? 's' : ''}.</b>
                <p className="mt-1 text-xs text-orange-200/80">
                  5 people are waiting at the next stop. Consider dispatching support.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
