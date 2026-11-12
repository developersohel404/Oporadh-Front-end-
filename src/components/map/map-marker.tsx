import { CircleMarker, Popup } from 'react-leaflet';

interface MapMarkerProps {
  latitude: number;
  longitude: number;
  name: string;
  intensity: number;
  color?: string;
}

export function MapMarker({
  latitude,
  longitude,
  name,
  intensity,
  color = '#dc2626',
}: MapMarkerProps) {
  return (
    <CircleMarker
      center={[latitude, longitude]}
      radius={Math.max(6, Math.sqrt(intensity) * 3)}
      fillColor={color}
      color="#fff"
      weight={2}
      fillOpacity={0.7}
    >
      <Popup>
        <strong>{name}</strong>
        <br />
        রিপোর্ট: {intensity}
      </Popup>
    </CircleMarker>
  );
}
