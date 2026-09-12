import L from 'leaflet'
import { severityOf } from '../lib/theme'

export function detectionIcon(severity, fresh = false) {
  const { color } = severityOf(severity)
  return L.divIcon({
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `<div class="${fresh ? 'pulse-dot' : ''}" style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 8px ${color}88, 0 1px 4px rgba(0,0,0,.2);"></div>`,
  })
}

export function busIcon(routeNumber, active = true) {
  const bg = active ? '#1B3A6B' : '#94a3b8'
  return L.divIcon({
    className: '',
    iconSize: [52, 24],
    iconAnchor: [26, 12],
    html: `<div style="display:flex;align-items:center;gap:4px;background:${bg};color:#fff;font:600 10px/1 ui-sans-serif,system-ui;padding:4px 8px;border-radius:99px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25);white-space:nowrap;">🚌 ${routeNumber}</div>`,
  })
}

export function incidentIcon() {
  return L.divIcon({
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `<div class="pulse-dot" style="width:20px;height:20px;border-radius:50%;background:#9333ea;display:flex;align-items:center;justify-content:center;font-size:11px;border:2px solid #fff;color:#fff;font-weight:bold;box-shadow:0 2px 8px rgba(147,51,234,.4);">!</div>`,
  })
}

export function stopIcon(highlight = false) {
  const color = highlight ? '#2196F3' : '#94a3b8'
  return L.divIcon({
    className: '',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    html: `<div style="width:8px;height:8px;border-radius:50%;background:${color};border:1px solid #fff;"></div>`,
  })
}
