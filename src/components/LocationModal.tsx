import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, X, Navigation, Clock, Battery, Wifi, Car, Home } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in react-leaflet - CRITICAL FIX
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Static home coordinates - replace with your actual home location
const HOME_COORDINATES = {
  latitude: 59.5875217,
  longitude: 11.1392873,
  name: 'Home'
};

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

// Home marker icon with proper house shape
const createHomeIcon = () => {
  return L.divIcon({
    className: 'home-marker',
    html: `<div style="
      width: 32px;
      height: 32px;
      background: #10b981;
      border: 3px solid white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style="display: block;">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
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

// Calculate driving distance and time using Haversine formula (approximate)
const calculateDrivingTime = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  // Estimate driving time (assuming average speed of 50 km/h in city)
  const averageSpeed = 50; // km/h
  const timeInHours = distance / averageSpeed;
  const timeInMinutes = Math.round(timeInHours * 60);
  
  return {
    distance: Math.round(distance * 10) / 10, // Round to 1 decimal
    timeMinutes: timeInMinutes
  };
};

// Format time for display
const formatTravelTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
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
  
  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.classList.add('modal-open');
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

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
      latitude: user.status === 'home' ? HOME_COORDINATES.latitude + 0.001 : 40.7589,
      longitude: user.status === 'home' ? HOME_COORDINATES.longitude + 0.001 : -73.9851,
      address: user.status === 'home' ? 'Near Home' : 'Away Location',
      isReal: false
    };
  };

  const location = getRealLocation();
  const mapCenter: [number, number] = [location.latitude, location.longitude];
  const homeLocation: [number, number] = [HOME_COORDINATES.latitude, HOME_COORDINATES.longitude];

  // Calculate travel times
  const travelToHome = calculateDrivingTime(location.latitude, location.longitude, HOME_COORDINATES.latitude, HOME_COORDINATES.longitude);
  const travelFromHome = calculateDrivingTime(HOME_COORDINATES.latitude, HOME_COORDINATES.longitude, location.latitude, location.longitude);

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

  // Render modal using portal to document.body
  return createPortal(
    <div className="expandable-window">
      <div className="expandable-window-container">
        <div className="expandable-window-content seamless-modal rounded-3xl max-w-4xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-700/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-medium shadow-sm">
                  {user.avatar}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{user.name}'s Location</h2>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      user.status === 'home' ? 'bg-green-500' : 
                      user.status === 'away' || user.status === 'not_home' ? 'bg-blue-500' : 
                      'bg-gray-400'
                    }`}></div>
                    <p className="text-secondary capitalize" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{user.status}</p>
                    {location.isReal && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Live GPS</span>
                    )}
                    {!location.isReal && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Mock Data</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Last Update moved to header */}
              <div className="flex items-center space-x-4">
                {deviceInfo.last_updated && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Last Update</div>
                    <div className="text-xs text-secondary" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {new Date(deviceInfo.last_updated).toLocaleDateString()} {new Date(deviceInfo.last_updated).toLocaleTimeString()}
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={onClose}
                  className="unified-button p-2 rounded-full"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
              <div className="seamless-card rounded-2xl h-96 overflow-hidden relative">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ 
                    height: '100%', 
                    width: '100%',
                    borderRadius: '1rem'
                  }}
                  whenReady={handleMapReady}
                  scrollWheelZoom={true}
                  zoomControl={true}
                  attributionControl={false}
                >
                  <TileLayer
                    attribution=''
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                    tileSize={256}
                    zoomOffset={0}
                    crossOrigin={true}
                  />
                  
                  {/* User location marker */}
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
                  
                  {/* Home location marker */}
                  <Marker 
                    position={homeLocation}
                    icon={createHomeIcon()}
                  >
                    <Popup>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">Home</div>
                        <div className="text-sm text-gray-600">{HOME_COORDINATES.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {HOME_COORDINATES.latitude.toFixed(6)}, {HOME_COORDINATES.longitude.toFixed(6)}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                  
                  {mapReady && <MapController center={mapCenter} />}
                </MapContainer>

                {/* Loading overlay */}
                {!mapReady && (
                  <div className="absolute inset-0 seamless-card flex items-center justify-center rounded-2xl">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <div className="text-secondary">Loading map...</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Location Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Device Info */}
                <div className="seamless-card rounded-xl p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <Wifi className="w-4 h-4 mr-2" />
                    Device Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary">Entity:</span>
                      <span className="font-mono text-xs">{user.entity?.entity_id || 'Unknown'}</span>
                    </div>
                    {deviceInfo.source_type && (
                      <div className="flex justify-between">
                        <span className="text-secondary">Source:</span>
                        <span className="capitalize">{deviceInfo.source_type}</span>
                      </div>
                    )}
                    {deviceInfo.battery && (
                      <div className="flex justify-between items-center">
                        <span className="text-secondary">Battery:</span>
                        <div className="flex items-center space-x-1">
                          <Battery className="w-3 h-3" />
                          <span>{deviceInfo.battery}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Info */}
                <div className="seamless-card rounded-xl p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary">Status:</span>
                      <span className="capitalize font-medium">{user.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Coordinates:</span>
                      <span className="font-mono text-xs">
                        {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </span>
                    </div>
                    {deviceInfo.gps_accuracy && (
                      <div className="flex justify-between">
                        <span className="text-secondary">Accuracy:</span>
                        <span>±{deviceInfo.gps_accuracy}m</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Travel Times and Controls */}
              <div className="mt-6 flex items-center justify-end">
                {/* Travel Times - Bottom Right */}
                <div className="flex items-center space-x-6">
                  {/* Travel time to home */}
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm font-medium text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <Car className="w-4 h-4 text-blue-600" />
                      <Home className="w-4 h-4 text-green-600" />
                      <span>To Home</span>
                    </div>
                    <div className="text-xs text-secondary">
                      {formatTravelTime(travelToHome.timeMinutes)} ({travelToHome.distance} km)
                    </div>
                  </div>
                  
                  {/* Travel time from home */}
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm font-medium text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <Home className="w-4 h-4 text-green-600" />
                      <Car className="w-4 h-4 text-blue-600" />
                      <span>From Home</span>
                    </div>
                    <div className="text-xs text-secondary">
                      {formatTravelTime(travelFromHome.timeMinutes)} ({travelFromHome.distance} km)
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={onClose}
                      className="unified-button px-6 py-2 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>

              {/* Implementation Note */}
              {!location.isReal && (
                <div className="mt-4 p-4 seamless-card rounded-xl">
                  <p className="text-sm text-yellow-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <strong>Note:</strong> Currently showing mock location data. To enable real GPS tracking:
                  </p>
                </div>
              )}
            </div>
          
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LocationModal;