import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { ROUTES } from '../lib/seedData'
import { busIcon, stopIcon } from './mapIcons'

function FollowBus({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.panTo(position, { animate: true, duration: 0.8 })
  }, [position, map])
  return null
}

export default function PassengerMap({ bus, stops, destinationId }) {
  const position = [bus.current_lat, bus.current_lng]
  const path = ROUTES[bus.route_number]?.path ?? []

  return (
    <MapContainer center={position} zoom={14} zoomControl={false} className="map-dark h-full w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <FollowBus position={position} />
      {path.length > 0 && <Polyline positions={path} pathOptions={{ color: '#f97316', weight: 3, opacity: 0.7 }} />}
      {stops.map((s) => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={stopIcon(s.id === destinationId)}>
          <Tooltip direction="top" offset={[0, -6]} opacity={0.9}>
            {s.name}
          </Tooltip>
        </Marker>
      ))}
      <Marker position={position} icon={busIcon(bus.route_number, bus.status === 'active')} zIndexOffset={600} />
    </MapContainer>
  )
}
