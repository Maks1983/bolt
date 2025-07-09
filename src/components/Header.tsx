import React, { useState, useRef, useEffect } from 'react';
import { Home, Shield, User, Moon, Plane, Sun, Wifi, WifiOff, AlertCircle, Loader, RefreshCw, ChevronDown } from 'lucide-react';
import { useDevices } from '../context/DeviceContext';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';
import { formatTemperature, formatHumidity } from '../utils/deviceHelpers';
import LocationModal from './LocationModal';

const Header: React.FC = () => {
  const { state, forceUpdate } = useDevices();
  const [showConnectionDropdown, setShowConnectionDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get specific device tracker entities
  const NelsonTracker = useRealtimeDevice('device_tracker.lima');
  const ClaudiaTracker = useRealtimeDevice('device_tracker.kitty_phone');
  const EmaTracker = useRealtimeDevice('device_tracker.emaphone');

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
      name: 'Nelson', 
      status: NelsonTracker?.state || 'unknown', 
      avatar: '👩‍💻',
      entity: NelsonTracker
    },
    { 
      name: 'Claudia', 
      status: ClaudiaTracker?.state || 'unknown', 
      avatar: '👨‍💼',
      entity: ClaudiaTracker
    },
    { 
      name: 'Ema', 
      status: EmaTracker?.state || 'unknown', 
      avatar: '👧',
      entity: EmaTracker
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
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
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
      <header className="relative z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 px-6 py-2 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* User Presence - Left */}
          <div className="flex items-center space-x-2">
            {users.map((user, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center space-y-1 bg-gray-800/80 rounded-lg px-2 py-1.5 border border-gray-600/40 shadow-sm cursor-pointer hover:bg-gray-700/80 transition-colors"
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
                  <div className="text-xs text-gray-400 font-medium">{getStatusLabel(user.status)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* System Status - Center */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-emerald-900/50 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-700/50 shadow-sm">
              <Shield className="w-3 h-3" />
              <div className="text-xs font-bold">All Systems Normal</div>
            </div>
          </div>

          {/* Weather, Date, Time and Connection Status - Right */}
          <div className="flex items-center space-x-3">
            {/* Weather from Balcony Sensors */}
            <div className="flex items-center space-x-2 bg-blue-900/50 rounded-lg px-3 py-1.5 border border-blue-700/50 shadow-sm">
              <Sun className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-sm font-bold text-white">
                  {balconyTemp ? formatTemperature(balconyTemp.state) : '18.0°C'}
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  {balconyHumidity ? formatHumidity(balconyHumidity.state) : '65%'}
                </div>
              </div>
            </div>
            
            {/* Date and Time */}
            <div className="text-right">
              <div className="text-base font-bold text-white">{currentTime}</div>
              <div className="text-xs text-gray-400 font-medium">{currentDate}</div>
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
                <div className="absolute right-0 top-full mt-2 w-60 bg-gray-800 rounded-lg shadow-lg border border-gray-600 z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      {getConnectionIcon()}
                      <div>
                        <div className="font-semibold text-white">Home Assistant</div>
                        <div className="text-sm text-gray-300">{getConnectionText()}</div>
                      </div>
                    </div>
                    
                    {state.lastUpdate && (
                      <div className="text-xs text-gray-400 mb-3">
                        Last update: {state.lastUpdate.toLocaleTimeString()}
                      </div>
                    )}

                    <button
                      onClick={handleRefresh}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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