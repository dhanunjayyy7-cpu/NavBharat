import { useState } from 'react'
import { addEvidence } from '../lib/evidenceStore'

const departmentFor = (name) => {
  const value = name.toLowerCase().replaceAll('_', '-').replaceAll(' ', '-')
  if (value.includes('department-2')) return 'dept-2'
  if (value.includes('department-3')) return 'dept-3'
  return 'dept-1'
}
export default function ReportUpload() {
  const [file, setFile] = useState(null); const [notice, setNotice] = useState(null)
  const upload = (event) => { event.preventDefault(); if (!file) return; const department = departmentFor(file.name); addEvidence({ file: file.name, department, date: new Date().toLocaleString('en-IN'), severity: 'High', status: 'New', coordinates: 'Location attached by field unit', location: 'Pending location verification', duration: 'Processing' }); const message = `New video evidence received for Department ${department.slice(-1)}.`; setNotice(message); if ('Notification' in window) { Notification.requestPermission().then((permission) => { if (permission === 'granted') new Notification('NavBharat evidence alert', { body: message }) }) } }
  return <main className="grid min-h-screen place-items-center bg-neutral-950 p-5 text-white"><form onSubmit={upload} className="w-full max-w-lg rounded-xl border border-white/15 bg-neutral-900 p-7"><p className="text-xs font-bold tracking-widest text-orange-500">EVIDENCE UPLOAD ENDPOINT</p><h1 className="mt-3 text-2xl font-semibold">Upload road evidence</h1><p className="mt-2 text-sm leading-6 text-neutral-400">The filename determines the notification route. Use <b>department-1</b>, <b>department-2</b>, or <b>department-3</b> in the video filename.</p><input required type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} className="mt-7 block w-full text-xs text-neutral-400 file:mr-3 file:rounded-md file:border-0 file:bg-orange-500 file:px-3 file:py-2 file:font-bold file:text-black" /><button className="mt-6 w-full rounded-md bg-orange-500 p-3 text-sm font-bold text-black">Upload and notify department</button>{notice && <div role="alert" className="mt-5 rounded-md border border-orange-500/50 bg-orange-500/10 p-4 text-sm text-orange-100"><b>Upload complete.</b><p className="mt-1">{notice}</p></div>}</form></main>
}
