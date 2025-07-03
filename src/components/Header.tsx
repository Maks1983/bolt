import React, { useState, useRef, useEffect } from 'react';
import { Home, Shield, User, Moon, Plane, Sun, Wifi, WifiOff, AlertCircle, Loader, RefreshCw, ChevronDown, MapPin, X } from 'lucide-react';
import { useDevices } from '../context/DeviceContext';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';
import { formatTemperature, formatHumidity } from '../utils/deviceHelpers';

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
  // Mock location data - you can replace this with real GPS coordinates from device tracker
  const mockLocation = {
    latitude: user.status === 'home' ? 40.7128 : 40.7589, // Home vs Away coordinates
    longitude: user.status === 'home' ? -74.0060 : -73.9851,
    address: user.status === 'home' ? 'Home' : 'Central Park, NYC'
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-medium shadow-sm">
                {user.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}'s Location</h2>
                <p className="text-gray-600">Current status: {user.status}</p>
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
          <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-100 to-green-200"></div>
            
            {/* Map Grid Lines */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(10)].map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 10}%` }} />
              ))}
              {[...Array(10)].map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 10}%` }} />
              ))}
            </div>

            {/* Location Marker */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="mt-4 bg-white px-4 py-2 rounded-lg shadow-lg border">
                <p className="text-sm font-semibold text-gray-900">{mockLocation.address}</p>
                <p className="text-xs text-gray-600">
                  {mockLocation.latitude.toFixed(4)}, {mockLocation.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Mock Streets */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute w-full h-2 bg-gray-600" style={{ top: '30%' }}></div>
              <div className="absolute w-full h-2 bg-gray-600" style={{ top: '70%' }}></div>
              <div className="absolute h-full w-2 bg-gray-600" style={{ left: '25%' }}></div>
              <div className="absolute h-full w-2 bg-gray-600" style={{ left: '75%' }}></div>
            </div>
          </div>

          {/* Location Details */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Device Info</h3>
              <p className="text-sm text-gray-600">Entity: {user.entity?.entity_id || 'Unknown'}</p>
              <p className="text-sm text-gray-600">Last Update: {user.entity?.last_updated ? new Date(user.entity.last_updated).toLocaleString() : 'Unknown'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
              <p className="text-sm text-gray-600">Current: {user.status}</p>
              <p className="text-sm text-gray-600">Zone: {user.status === 'home' ? 'Home Zone' : 'Away'}</p>
            </div>
          </div>

          {/* Note */}
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a mock map interface. To implement real GPS tracking, you'll need:
            </p>
            <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
              <li>GPS coordinates from device tracker attributes (latitude, longitude)</li>
              <li>Map service integration (Google Maps, OpenStreetMap, etc.)</li>
              <li>Real-time location updates from Home Assistant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const { state, forceUpdate } = useDevices();
  const [showConnectionDropdown, setShowConnectionDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get specific device tracker entities
  const sarahTracker = useRealtimeDevice('device_tracker.lima');
  const mikeTracker = useRealtimeDevice('device_tracker.kitty_phone');
  const emmaTracker = useRealtimeDevice('device_tracker.emaphone');

  // Get balcony weather sensors
  const balconyTemp = useRealtimeDevice('sensor.balcony_temperature_sensor_temperature');
  const balconyHumidity = useRealtimeDevice('sensor.balcony_temperature_sensor_humidity');

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowConnectionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const users = [
    { 
      name: 'Sarah', 
      status: sarahTracker?.state || 'unknown', 
      avatar: '👩‍💻',
      entity: sarahTracker
    },
    { 
      name: 'Mike', 
      status: mikeTracker?.state || 'unknown', 
      avatar: '👨‍💼',
      entity: mikeTracker
    },
    { 
      name: 'Emma', 
      status: emmaTracker?.state || 'unknown', 
      avatar: '👧',
      entity: emmaTracker
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'home': return <Home className="w-2 h-2" />;
      case 'away':
      case 'not_home': return <Plane className="w-2 h-2" />;
      case 'sleep': return <Moon className="w-2 h-2" />;
      default: return <User className="w-2 h-2" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'home': return 'bg-emerald-500';
      case 'away':
      case 'not_home': return 'bg-blue-500';
      case 'sleep': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'home': return 'Home';
      case 'away':
      case 'not_home': return 'Away';
      case 'sleep': return 'Sleep';
      default: return 'Unknown';
    }
  };

  const getConnectionIcon = () => {
    switch (state.connectionState) {
      case 'connected':
        return <Wifi className="w-5 h-5 text-green-600" />;
      case 'connecting':
        return <Loader className="w-5 h-5 text-yellow-600 animate-spin" />;
      case 'disconnected':
        return <WifiOff className="w-5 h-5 text-gray-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <WifiOff className="w-5 h-5 text-gray-500" />;
    }
  };

  const getConnectionColor = () => {
    switch (state.connectionState) {
      case 'connected':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'connecting':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'disconnected':
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
      case 'error':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const getConnectionText = () => {
    switch (state.connectionState) {
      case 'connected':
        return 'Connected to Home Assistant';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected from Home Assistant';
      case 'error':
        return state.connectionError || 'Connection Error';
      default:
        return 'Unknown Status';
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    forceUpdate();
    setShowConnectionDropdown(false);
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-6 py-2 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* User Presence - Left */}
          <div className="flex items-center space-x-2">
            {users.map((user, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center space-y-1 bg-gray-50/80 rounded-lg px-2 py-1.5 border border-gray-200/40 shadow-sm cursor-pointer hover:bg-gray-100/80 transition-colors"
                onClick={() => handleUserClick(user)}
              >
                <div className="relative">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm">
                    {user.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${getStatusColor(user.status)} rounded-full flex items-center justify-center text-white border border-white shadow-sm`}>
                    {getStatusIcon(user.status)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 font-medium">{getStatusLabel(user.status)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* System Status - Center */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-emerald-50/80 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200/50 shadow-sm">
              <Shield className="w-3 h-3" />
              <div className="text-xs font-bold">All Systems Normal</div>
            </div>
          </div>

          {/* Weather, Date, Time and Connection Status - Right */}
          <div className="flex items-center space-x-3">
            {/* Weather from Balcony Sensors */}
            <div className="flex items-center space-x-2 bg-blue-50/80 rounded-lg px-3 py-1.5 border border-blue-200/50 shadow-sm">
              <Sun className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-sm font-bold text-gray-900">
                  {balconyTemp ? formatTemperature(balconyTemp.state) : '18.0°C'}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {balconyHumidity ? formatHumidity(balconyHumidity.state) : '65%'}
                </div>
              </div>
            </div>
            
            {/* Date and Time */}
            <div className="text-right">
              <div className="text-base font-bold text-gray-900">{currentTime}</div>
              <div className="text-xs text-gray-500 font-medium">{currentDate}</div>
            </div>

            {/* Connection Status with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowConnectionDropdown(!showConnectionDropdown)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${getConnectionColor()}`}
              >
                {getConnectionIcon()}
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${showConnectionDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Connection Dropdown */}
              {showConnectionDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      {getConnectionIcon()}
                      <div>
                        <div className="font-semibold text-gray-900">Home Assistant</div>
                        <div className="text-sm text-gray-600">{getConnectionText()}</div>
                      </div>
                    </div>
                    
                    {state.lastUpdate && (
                      <div className="text-xs text-gray-500 mb-3">
                        Last update: {state.lastUpdate.toLocaleTimeString()}
                      </div>
                    )}

                    <button
                      onClick={handleRefresh}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      {selectedUser && (
        <LocationModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </>
  );
};

export default Header;