import React, { useEffect, useState } from 'react';
import { MapPin, X, Navigation, Clock, Battery, Wifi } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in react-leaflet - CRITICAL FIX
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
      "></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Component to handle map centering
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
    // Force map to invalidate size and redraw tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [center, map]);
  
  return null;
};

interface LocationModalProps {
  user: {
    name: string;
    status: string;
    avatar: string;
    entity: any;
  };
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ user, onClose }) => {
  const [mapReady, setMapReady] = useState(false);

  // Get real GPS coordinates from device tracker entity
  const getRealLocation = () => {
    if (user.entity?.latitude && user.entity?.longitude) {
      return {
        latitude: user.entity.latitude,
        longitude: user.entity.longitude,
        address: user.entity.friendly_name || 'Current Location',
        isReal: true
      };
    }
    
    // Fallback to mock coordinates if no GPS data
    return {
      latitude: user.status === 'home' ? 40.7128 : 40.7589,
      longitude: user.status === 'home' ? -74.0060 : -73.9851,
      address: user.status === 'home' ? 'Home' : 'Away Location',
      isReal: false
    };
  };

  const location = getRealLocation();
  const mapCenter: [number, number] = [location.latitude, location.longitude];

  // Get marker color based on status
  const getMarkerColor = () => {
    switch (user.status) {
      case 'home': return '#10b981'; // green
      case 'away':
      case 'not_home': return '#3b82f6'; // blue
      default: return '#6b7280'; // gray
    }
  };

  // Get additional device info
  const getDeviceInfo = () => {
    const entity = user.entity;
    if (!entity) return {};

    return {
      battery: entity.battery,
      gps_accuracy: entity.gps_accuracy,
      source_type: entity.source_type,
      last_updated: entity.last_updated
    };
  };

  const deviceInfo = getDeviceInfo();

  // Handle map ready event
  const handleMapReady = () => {
    setMapReady(true);
    // Additional delay to ensure tiles load properly
    setTimeout(() => {
      console.log('🗺️ Map fully initialized');
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-medium shadow-sm">
                {user.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}'s Location</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    user.status === 'home' ? 'bg-green-500' : 
                    user.status === 'away' || user.status === 'not_home' ? 'bg-blue-500' : 
                    'bg-gray-400'
                  }`}></div>
                  <p className="text-gray-600 capitalize">{user.status}</p>
                  {location.isReal && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Live GPS</span>
                  )}
                  {!location.isReal && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Mock Data</span>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="p-6">
          <div className="bg-gray-100 rounded-2xl h-96 overflow-hidden relative">
            <MapContainer
              center={mapCenter}
              zoom={15}
              style={{ 
                height: '100%', 
                width: '100%',
                borderRadius: '1rem'
              }}
              whenReady={handleMapReady}
              scrollWheelZoom={true}
              zoomControl={true}
              attributionControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
                tileSize={256}
                zoomOffset={0}
                crossOrigin={true}
              />
              
              <Marker 
                position={mapCenter}
                icon={createCustomIcon(getMarkerColor())}
              >
                <Popup>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">{location.address}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </div>
                    {deviceInfo.gps_accuracy && (
                      <div className="text-xs text-gray-500">
                        Accuracy: ±{deviceInfo.gps_accuracy}m
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
              
              {mapReady && <MapController center={mapCenter} />}
            </MapContainer>

            {/* Loading overlay */}
            {!mapReady && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-2xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <div className="text-gray-500">Loading map...</div>
                </div>
              </div>
            )}
          </div>

          {/* Location Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Device Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Wifi className="w-4 h-4 mr-2" />
                Device Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Entity:</span>
                  <span className="font-mono text-xs">{user.entity?.entity_id || 'Unknown'}</span>
                </div>
                {deviceInfo.source_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source:</span>
                    <span className="capitalize">{deviceInfo.source_type}</span>
                  </div>
                )}
                {deviceInfo.battery && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Battery:</span>
                    <div className="flex items-center space-x-1">
                      <Battery className="w-3 h-3" />
                      <span>{deviceInfo.battery}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="capitalize font-medium">{user.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coordinates:</span>
                  <span className="font-mono text-xs">
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </span>
                </div>
                {deviceInfo.gps_accuracy && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span>±{deviceInfo.gps_accuracy}m</span>
                  </div>
                )}
              </div>
            </div>

            {/* Last Update */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Last Update
              </h3>
              <div className="space-y-2 text-sm">
                {deviceInfo.last_updated ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{new Date(deviceInfo.last_updated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span>{new Date(deviceInfo.last_updated).toLocaleTimeString()}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">No update information</div>
                )}
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Navigation className="w-4 h-4" />
              <span>Powered by OpenStreetMap</span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (mapReady && location.latitude && location.longitude) {
                    window.open(`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=15`, '_blank');
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                View on OSM
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          {/* Implementation Note */}
          {!location.isReal && (
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Currently showing mock location data. To enable real GPS tracking:
              </p>
              <ul className="text-sm text-amber-700 mt-2 list-disc list-inside">
                <li>Ensure your device trackers have GPS coordinates in their attributes</li>
                <li>The map will automatically use real coordinates when available</li>
                <li>GPS accuracy and battery level will be displayed when provided</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;