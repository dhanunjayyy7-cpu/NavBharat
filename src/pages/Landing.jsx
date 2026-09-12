import { Link } from 'react-router-dom'

const routes = [
  ['Report evidence', '/report', 'Upload a pothole clip. The filename routes it to its department.'],
  ['Department login', '/login', 'Review evidence, coordinates, date, and action status.'],
  ['Admin operations', '/admin', 'A separate operations endpoint for totals and actions.'],
  ['Conductor console', '/conductor', 'Generate a ₹60 ticket and monitor bus capacity.'],
]
export default function Landing() {
  return <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 sm:px-10"><header className="mx-auto flex max-w-6xl items-center justify-between border-b border-white/10 pb-5"><Link to="/" className="font-bold tracking-tight">NAV<span className="text-cyan-400">BHARAT</span></Link><Link to="/report" className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold text-slate-950">Report a road issue</Link></header><section className="mx-auto max-w-6xl py-20"><p className="text-xs font-bold uppercase tracking-[.24em] text-cyan-400">Urban evidence routing</p><h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">One clear route for every road report.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">Upload a field clip, route it to the responsible department, and keep operational oversight independent from department login.</p><div className="mt-12 grid gap-3 md:grid-cols-2">{routes.map(([name, url, detail], index) => <Link key={name} to={url} className="group rounded-xl border border-white/10 bg-white/[.03] p-5 transition hover:border-cyan-400/60 hover:bg-white/[.06]"><span className="text-xs text-slate-500">0{index + 1}</span><h2 className="mt-5 text-lg font-semibold">{name} <span className="inline-block text-cyan-400 transition group-hover:translate-x-1">→</span></h2><p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p></Link>)}</div></section></main>
}
