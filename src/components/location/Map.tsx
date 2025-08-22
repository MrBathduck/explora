import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Location } from '../../types/Location';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Fix for default markers in React Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerRetina,
});

interface MapProps {
  locations: Location[];
  favorites?: string[];
}

const Map: React.FC<MapProps> = ({ locations, favorites = [] }) => {
  // Center the map on Vienna
  const viennaCenter: [number, number] = [48.2082, 16.3738];

  // Create custom icon for favorite locations
  const createCustomIcon = (isFavorite: boolean) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-container ${isFavorite ? 'favorite-marker' : 'regular-marker'}">
          <div class="marker-icon">
            ${isFavorite ? '❤️' : '📍'}
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  return (
    <MapContainer
      center={viennaCenter}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="leaflet-map"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {locations.map((location) => {
        const isFavorite = favorites.includes(location.id);
        return (
          <Marker 
            key={location.id}
            position={[location.coordinates.lat, location.coordinates.lng]}
            icon={createCustomIcon(isFavorite)}
          >
          <Popup>
            <div className="map-popup">
              <h3>{location.name}</h3>
              <p className="category">{location.category}</p>
              <p className="description">{location.description}</p>
              {location.rating && (
                <p className="rating">⭐ {location.rating}/5</p>
              )}
              {location.address && (
                <p className="address">📍 {location.address}</p>
              )}
            </div>
          </Popup>
        </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;