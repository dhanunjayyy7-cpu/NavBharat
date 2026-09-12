import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ROUTES } from '../lib/seedData'

/** QR that drops a passenger straight into their bus's dashboard. */
export default function QrPanel({ buses, onClose }) {
  const [busId, setBusId] = useState(buses[0]?.id ?? '')
  const bus = buses.find((b) => b.id === busId)
  const url = `${window.location.origin}/passenger?bus=${encodeURIComponent(busId)}`

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111731] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Passenger QR code</h3>
            <p className="text-[11px] text-slate-500">Print and mount inside the vehicle</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200">
            ✕
          </button>
        </div>

        <select
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 outline-none focus:border-sky-400/50"
        >
          {buses.map((b) => (
            <option key={b.id} value={b.id} className="bg-[#111731]">
              {b.id} — Route {b.route_number}
            </option>
          ))}
        </select>

        <div className="mt-4 flex justify-center rounded-xl bg-white p-4">
          <QRCodeSVG value={url} size={180} level="M" />
        </div>

        <p className="mt-3 text-center text-[11px] text-slate-400">
          Route {bus?.route_number} · {ROUTES[bus?.route_number]?.name}
        </p>
        <p className="mt-1 break-all text-center text-[10px] text-slate-600">{url}</p>

        <a
          href={`/passenger?bus=${encodeURIComponent(busId)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 block rounded-lg bg-sky-500/15 py-2 text-center text-xs font-medium text-sky-300 ring-1 ring-sky-400/30 hover:bg-sky-500/25"
        >
          Open passenger view
        </a>
      </div>
    </div>
  )
}
