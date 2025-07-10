import React, { useState, useRef, useEffect } from 'react';
import { Home, Shield, User, Moon, Plane, Wifi, WifiOff, AlertCircle, Loader, RefreshCw, ChevronDown, Clapperboard, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useDevices } from '../context/DeviceContext';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';
import LocationModal from './LocationModal';

interface HeaderProps {
  activeSection: 'status' | 'controls';
  onSectionChange: (section: 'status' | 'controls') => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange }) => {
  const { state, forceUpdate } = useDevices();
  const [showConnectionDropdown, setShowConnectionDropdown] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Get specific device tracker entities
  const NelsonTracker = useRealtimeDevice('device_tracker.lima');
  const ClaudiaTracker = useRealtimeDevice('device_tracker.kitty_phone');
  const EmaTracker = useRealtimeDevice('device_tracker.emaphone');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowConnectionDropdown(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setShowQuickActions(false);
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

  // Calculate system status based on device states
  const getSystemStatus = () => {
    // Check for critical alerts (smoke, flood sensors)
    const criticalAlerts = state.devices.filter(device => 
      device.device_type === 'binary_sensor' && 
      ((device as any).sensor_type === 'smoke' || (device as any).sensor_type === 'flood') &&
      device.state === 'on'
    );

    if (criticalAlerts.length > 0) {
      return { status: 'critical', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle };
    }

    // Check for attention needed (doors/windows open, locks unlocked)
    const attentionNeeded = state.devices.filter(device => 
      (device.device_type === 'binary_sensor' && 
       ((device as any).sensor_type === 'door' || (device as any).sensor_type === 'window') &&
       device.state === 'on') ||
      (device.device_type === 'lock' && device.state === 'unlocked')
    );

    if (attentionNeeded.length > 0) {
      return { status: 'attention', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertTriangle };
    }

    // All normal
    return { status: 'normal', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
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

  const handleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
  };

  const systemStatus = getSystemStatus();

  return (
    <>
      <header className="seamless-header relative z-40 px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* User Presence - Left */}
          <div className="flex items-center space-x-2">
            {users.map((user, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center space-y-1 glass-card rounded-xl px-2 py-1.5 cursor-pointer seamless-transition"
                onClick={() => handleUserClick(user)}
              >
                <div className="relative">
                  <div className="w-6 h-6 neutral-glass rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {user.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${getStatusColor(user.status)} rounded-full flex items-center justify-center text-white`}>
                    {getStatusIcon(user.status)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-secondary font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{getStatusLabel(user.status)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Status/Controls Toggle - Center */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onSectionChange('status')}
              className={`relative px-2 py-1 text-base font-medium seamless-transition ${
                activeSection === 'status'
                  ? 'text-accent'
                  : 'text-muted'
              }`}
              style={{ 
                color: activeSection === 'status' ? '#028ee5' : 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Status
              {activeSection === 'status' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #028ee5, transparent)' }}></div>
              )}
            </button>
            <span className="text-muted font-light" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
            <button
              onClick={() => onSectionChange('controls')}
              className={`relative px-2 py-1 text-base font-medium seamless-transition ${
                activeSection === 'controls'
                  ? 'text-accent'
                  : 'text-muted'
              }`}
              style={{ 
                color: activeSection === 'controls' ? '#028ee5' : 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Controls
              {activeSection === 'controls' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #028ee5, transparent)' }}></div>
              )}
            </button>
          </div>

          {/* Action Icons - Right */}
          <div className="flex items-center space-x-3">
            {/* Quick Actions */}
            <div className="relative" ref={quickActionsRef}>
              <button
                onClick={handleQuickActions}
                className="seamless-button flex items-center justify-center w-10 h-10 rounded-xl"
                title="Quick Actions & Scenes"
              >
                <Clapperboard className="w-5 h-5" style={{ color: '#028ee5' }} />
              </button>

              {/* Quick Actions Dropdown */}
              {showQuickActions && (
                <div className="absolute right-0 top-full mt-2 w-64 seamless-dropdown rounded-xl z-50">
                  <div className="p-4">
                    <h3 className="font-semibold text-primary mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="seamless-button w-full text-left px-3 py-2 rounded-lg">
                        Good Morning Scene
                      </button>
                      <button className="seamless-button w-full text-left px-3 py-2 rounded-lg">
                        Good Night Scene
                      </button>
                      <button className="seamless-button w-full text-left px-3 py-2 rounded-lg">
                        Away Mode
                      </button>
                      <button className="seamless-button w-full text-left px-3 py-2 rounded-lg">
                        Movie Time
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* System Status */}
            <button
              className="seamless-button flex items-center justify-center w-10 h-10 rounded-xl"
              title={`System Status: ${systemStatus.status}`}
            >
              <systemStatus.icon className={`w-5 h-5 ${systemStatus.color}`} />
            </button>

            {/* Connection Status with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowConnectionDropdown(!showConnectionDropdown)}
                className="seamless-button flex items-center justify-center w-10 h-10 rounded-xl"
                title="Home Assistant Connection"
              >
                {getConnectionIcon()}
              </button>

              {/* Connection Dropdown */}
              {showConnectionDropdown && (
                <div className="absolute right-0 top-full mt-2 w-60 seamless-dropdown rounded-xl z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      {getConnectionIcon()}
                      <div>
                        <div className="font-semibold text-primary" style={{ fontFamily: 'Poppins, sans-serif' }}>Home Assistant</div>
                        <div className="text-sm text-secondary" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{getConnectionText()}</div>
                      </div>
                    </div>
                    
                    {state.lastUpdate && (
                      <div className="text-xs text-muted mb-3" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        Last update: {state.lastUpdate.toLocaleTimeString()}
                      </div>
                    )}

                    <button
                      onClick={handleRefresh}
                      className="w-full seamless-button-primary flex items-center justify-center space-x-2 px-3 py-2 text-white rounded-xl"
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
