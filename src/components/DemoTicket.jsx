import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { STOPS } from '../lib/mockData'

function genTicketNum() {
  return `NBT-2026-${String(Math.floor(1000 + Math.random() * 9000))}`
}

export default function DemoTicket() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [ticket, setTicket] = useState(null)
  const [flipped, setFlipped] = useState(false)

  const seat = `${String.fromCharCode(65 + Math.floor(Math.random() * 4))}${Math.floor(1 + Math.random() * 30)}`

  const generateTicket = () => {
    if (!from || !to || from === to) return
    const fromStop = STOPS.find((s) => s.id === from)
    const toStop = STOPS.find((s) => s.id === to)
    setTicket({
      number: genTicketNum(),
      from: fromStop,
      to: toStop,
      bus: 'KA-01-F-1234',
      seat,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    })
    setFlipped(false)
  }

  const passengerUrl = `${window.location.origin}/passenger`

  return (
    <div className="mx-auto max-w-md p-4">
      <h2 className="text-lg font-bold text-[#1B3A6B]">QR Ticket Generator</h2>
      <p className="mt-1 text-xs text-[#94a3b8]">Book a ticket and generate a QR code</p>

      {/* Booking form */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/5">
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">From</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#1B3A6B] outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3]"
            >
              <option value="">Select departure stop</option>
              {STOPS.map((s) => (
                <option key={s.id} value={s.id} disabled={s.id === to}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">To</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#1B3A6B] outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3]"
            >
              <option value="">Select destination stop</option>
              {STOPS.map((s) => (
                <option key={s.id} value={s.id} disabled={s.id === from}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">Seat</label>
              <div className="mt-1 rounded-lg border border-black/10 bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#1B3A6B]">{seat}</div>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">Date</label>
              <div className="mt-1 rounded-lg border border-black/10 bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#1B3A6B]">
                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
          <button
            onClick={generateTicket}
            disabled={!from || !to || from === to}
            className="w-full rounded-xl bg-[#1B3A6B] py-3 text-sm font-bold text-white transition hover:bg-[#142d54] active:scale-[0.98] disabled:opacity-40"
          >
            Generate Ticket
          </button>
        </div>
      </div>

      {/* Ticket display */}
      {ticket && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[#1B3A6B]">Your Ticket</p>
            <button
              onClick={() => setFlipped(!flipped)}
              className="rounded-lg bg-[#2196F3]/10 px-3 py-1.5 text-[11px] font-semibold text-[#2196F3] transition hover:bg-[#2196F3]/20"
            >
              {flipped ? 'Show Front' : 'Show QR (Back)'}
            </button>
          </div>

          <div className="ticket-flip" style={{ height: 360 }}>
            <div className={`ticket-inner w-full ${flipped ? 'flipped' : ''}`} style={{ height: 360 }}>
              {/* FRONT */}
              <div className="ticket-front rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5" style={{ height: 360 }}>
                <div className="flex items-center gap-2 border-b border-dashed border-black/10 pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B3A6B] text-sm font-bold text-white">N</div>
                  <div>
                    <p className="text-sm font-bold text-[#1B3A6B]">NavBharat Transit</p>
                    <p className="text-[9px] text-[#94a3b8]">BMTC Bengaluru · E-Ticket</p>
                  </div>
                  <span className="ml-auto text-[10px] font-mono font-bold text-[#2196F3]">{ticket.number}</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-[9px] font-semibold uppercase text-[#94a3b8]">From</p>
                    <p className="text-sm font-bold text-[#1B3A6B]">{ticket.from.name}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-[#2196F3]">
                      <span className="h-px w-6 bg-[#2196F3]" />
                      <span className="text-sm">🚌</span>
                      <span className="h-px w-6 bg-[#2196F3]" />
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-[9px] font-semibold uppercase text-[#94a3b8]">To</p>
                    <p className="text-sm font-bold text-[#1B3A6B]">{ticket.to.name}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[9px] font-semibold uppercase text-[#94a3b8]">Bus</p>
                    <p className="text-xs font-bold text-[#1B3A6B]">{ticket.bus}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold uppercase text-[#94a3b8]">Seat</p>
                    <p className="text-xs font-bold text-[#1B3A6B]">{ticket.seat}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold uppercase text-[#94a3b8]">Date</p>
                    <p className="text-xs font-bold text-[#1B3A6B]">{ticket.date}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-[#F5F7FA] px-3 py-2 text-center">
                  <p className="text-[10px] font-semibold text-[#94a3b8]">Boarding time: {ticket.time}</p>
                </div>

                <p className="mt-3 text-center text-[9px] font-medium text-[#94a3b8]">Valid for single journey only</p>
              </div>

              {/* BACK */}
              <div className="ticket-back flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5" style={{ height: 360 }}>
                <div className="rounded-xl bg-white p-3 shadow-inner ring-1 ring-black/5">
                  <QRCodeSVG value={passengerUrl} size={180} level="M" />
                </div>
                <p className="mt-4 text-sm font-bold text-[#1B3A6B]">Scan for live tracking</p>
                <p className="mt-1 text-center text-[10px] text-[#94a3b8]">
                  Live bus tracking & passenger services
                </p>
                <a
                  href="/passenger"
                  target="_blank"
                  rel="noopener"
                  className="mt-3 rounded-lg bg-[#2196F3] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1976D2]"
                >
                  Open Passenger View →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
