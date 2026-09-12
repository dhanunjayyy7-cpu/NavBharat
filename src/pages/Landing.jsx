import { Link } from 'react-router-dom'

export default function Landing() {
  return <main className="min-h-screen bg-neutral-950 px-5 py-8 text-white sm:px-10"><header className="mx-auto flex max-w-6xl items-center border-b border-white/15 pb-5"><Link to="/" className="font-bold tracking-tight">NAV<span className="text-orange-500">BHARAT</span></Link></header><section className="mx-auto max-w-6xl py-28"><p className="text-xs font-bold uppercase tracking-[.24em] text-orange-500">Urban transit intelligence</p><h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Safer streets. Better journeys.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-neutral-400">NavBharat is an evidence-led mobility operations demonstration for Bengaluru.</p></section></main>
}
