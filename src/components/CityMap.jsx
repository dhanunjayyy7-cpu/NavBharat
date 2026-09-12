import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { BANGALORE_CENTER, ROUTES } from '../lib/seedData'
import { busIcon, detectionIcon, incidentIcon } from './mapIcons'
import { DETECTION_LABEL, severityOf } from '../lib/theme'
import { timeAgo } from '../lib/geo'

const BLR_BOUNDS = [
  [12.85, 77.45],
  [13.15, 77.75],
]

function FlyTo({ target }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo(target, 15, { duration: 0.8 })
  }, [target, map])
  return null
}

export default function CityMap({ detections, buses, incidents, focus, layers, newestDetectionId }) {
  return (
    <MapContainer
      center={BANGALORE_CENTER}
      zoom={12}
      minZoom={11}
      maxZoom={18}
      maxBounds={BLR_BOUNDS}
      maxBoundsViscosity={1.0}
      zoomControl={false}
      className="h-full w-full"
      preferCanvas
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
      />

      <FlyTo target={focus} />

      {layers.routes &&
        Object.entries(ROUTES).map(([number, route]) => (
          <Polyline key={number} positions={route.path} pathOptions={{ color: '#2196F3', weight: 3, opacity: 0.35 }} />
        ))}

      {layers.detections &&
        detections.map((d) => (
          <Marker
            key={d.id}
            position={[d.lat, d.lng]}
            icon={detectionIcon(d.severity, d.id === newestDetectionId)}
          >
            <Popup>
              <div className="space-y-1">
                {d.photo_url && (
                  <img src={d.photo_url} alt={d.type} className="mb-1 h-24 w-full rounded object-cover" />
                )}
                <div className="font-semibold text-[#1B3A6B]">{DETECTION_LABEL[d.type] ?? d.type}</div>
                <div style={{ color: severityOf(d.severity).color }} className="font-medium">{severityOf(d.severity).label} severity</div>
                <div className="text-[#64748b]">
                  {d.lat.toFixed(4)}, {d.lng.toFixed(4)}
                </div>
                <div className="text-[#64748b]">
                  {timeAgo(d.timestamp)} · detected by {d.bus_id}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {layers.incidents &&
        incidents.map((i) => (
          <Marker key={i.id} position={[i.lat, i.lng]} icon={incidentIcon()}>
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold capitalize text-[#1B3A6B]">{i.type} reported</div>
                <div className="text-[#64748b]">Bus {i.bus_id}</div>
                <div className="text-[#64748b]">
                  {timeAgo(i.timestamp)} · {i.status}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {layers.fleet &&
        buses.map((b) => (
          <Marker
            key={b.id}
            position={[b.current_lat, b.current_lng]}
            icon={busIcon(b.route_number, b.status === 'active')}
            zIndexOffset={500}
          >
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold text-[#1B3A6B]">Route {b.route_number}</div>
                <div className="text-[#64748b]">{ROUTES[b.route_number]?.name}</div>
                <div className="text-[#64748b]">{b.id}</div>
                <div className="text-[#64748b]">
                  {b.status} · ping {timeAgo(b.last_updated)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  )
}
