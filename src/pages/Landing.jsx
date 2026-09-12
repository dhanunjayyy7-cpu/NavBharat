import { Link } from 'react-router-dom'
import { usingSupabase } from '../lib/dataService'

export default function Landing() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-6 py-12">
      <div className="mx-auto max-w-3xl w-full">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#1B3A6B] text-xl font-bold text-white shadow-lg shadow-[#1B3A6B]/20">
            N
          </span>
          <h1 className="mt-4 text-3xl font-bold text-[#1B3A6B]">NavBharat Transit</h1>
          <p className="mt-1 text-sm text-[#64748b]">AI-powered urban intelligence for BMTC, Bengaluru</p>
          {!usingSupabase && (
            <span className="mt-3 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-600 ring-1 ring-amber-200">
              Demo mode — no Supabase connected
            </span>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/official"
            className="group rounded-2xl bg-white p-8 shadow-md shadow-[#1B3A6B]/5 ring-1 ring-[#1B3A6B]/8 transition hover:shadow-lg hover:shadow-[#2196F3]/10 hover:ring-[#2196F3]/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B3A6B]/10 text-2xl">
              🏛️
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#1B3A6B]">Official Dashboard</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
              BMTC Control Room — city-wide GIS map with road defects, live fleet telemetry, crowd alerts,
              incident reports, and real-time analytics.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2196F3] group-hover:underline">
              Open control room
              <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </span>
          </Link>

          <Link
            to="/passenger"
            className="group rounded-2xl bg-white p-8 shadow-md shadow-[#1B3A6B]/5 ring-1 ring-[#1B3A6B]/8 transition hover:shadow-lg hover:shadow-[#2196F3]/10 hover:ring-[#2196F3]/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2196F3]/10 text-2xl">
              🚌
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#1B3A6B]">Passenger Dashboard</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
              Mobile-first experience — live bus tracking, smart arrival alerts, and one-tap incident
              reporting. Accessed via QR code inside the bus.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2196F3] group-hover:underline">
              Open passenger view
              <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
