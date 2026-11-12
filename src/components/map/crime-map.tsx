import 'leaflet/dist/leaflet.css';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';

interface CrimePoint {
  id: string;
  name: string;
  nameBn: string;
  latitude: number;
  longitude: number;
  intensity: number;
  heatLevel: string;
}

interface CrimeMapProps {
  points: CrimePoint[];
  height?: string;
}

const HEAT_COLORS: Record<string, string> = {
  LOW: '#22c55e',
  MEDIUM: '#eab308',
  HIGH: '#f97316',
  CRITICAL: '#dc2626',
};

export function CrimeMap({ points, height = '600px' }: CrimeMapProps) {
  return (
    <MapContainer
      center={[23.685, 90.3563]}
      zoom={7}
      style={{ height, width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.latitude, p.longitude]}
          radius={Math.max(6, Math.sqrt(p.intensity) * 3)}
          fillColor={HEAT_COLORS[p.heatLevel] ?? '#64748b'}
          color="#fff"
          weight={2}
          fillOpacity={0.7}
        >
          <Popup>
            <strong>{p.nameBn || p.name}</strong>
            <br />
            রিপোর্ট: {p.intensity}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
