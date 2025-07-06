import React, { useState } from 'react';
import { 
  Home, Shield, Thermometer, Lightbulb, Camera, Activity,
  Wifi, WifiOff, AlertTriangle, User, Lock, Unlock, Eye,
  TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import { formatTemperature } from '../../utils/deviceHelpers';

const CompactStatsRow: React.FC = () => {
  const { state } = useDevices();
  const [showDetails, setShowDetails] = useState(false);
  
  // Get key sensors
  const balconyTemp = useRealtimeDevice('sensor.balcony_temperature_sensor_temperature');
  const entranceLock = useRealtimeDevice('lock.lock_ultra_910e');
  const alarmSystem = useRealtimeDevice('alarm_control_panel.home_security');
  
  // Calculate stats
  const totalDevices = state.devices.length;
  const onlineDevices = state.devices.filter(d => d.available).length;
  const lightsOn = state.devices.filter(d => d.device_type === 'light' && d.state === 'on').length;
  const totalLights = state.devices.filter(d => d.device_type === 'light').length;
  const camerasRecording = state.devices.filter(d => d.device_type === 'camera' && d.state === 'recording').length;
  const activeMotion = state.devices.filter(d => 
    d.device_type === 'binary_sensor' && (d as any).sensor_type === 'motion' && d.state === 'on'
  ).length;
  const cameraDetections = state.devices.filter(d => 
    d.device_type === 'binary_sensor' && 
    ((d as any).detection_type === 'person' || (d as any).detection_type === 'motion') &&
    d.state === 'on'
  ).length;
  
  // Security status
  const isLocked = entranceLock?.state === 'locked';
  const alarmState = alarmSystem?.state || 'unknown';
  const isSecured = isLocked && (alarmState === 'armed_home' || alarmState === 'armed_away');
  
  // Connection status
  const getConnectionIcon = () => {
    switch (state.connectionState) {
      case 'connected': return <Wifi className="w-4 h-4 text-green-600" />;
      case 'connecting': return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <WifiOff className="w-4 h-4 text-gray-500" />;
    }
  };

  const mainStats = [
    {
      id: 'system',
      icon: Home,
      label: 'System',
      value: `${onlineDevices}/${totalDevices}`,
      status: onlineDevices === totalDevices ? 'good' : 'warning',
      detail: 'devices online'
    },
    {
      id: 'security',
      icon: isSecured ? Shield : (isLocked ? Lock : Unlock),
      label: 'Security',
      value: isSecured ? 'Secured' : (isLocked ? 'Locked' : 'Open'),
      status: isSecured ? 'good' : (isLocked ? 'warning' : 'alert'),
      detail: `${alarmState} • ${isLocked ? 'locked' : 'unlocked'}`
    },
    {
      id: 'temperature',
      icon: Thermometer,
      label: 'Outdoor',
      value: balconyTemp ? formatTemperature(balconyTemp.state) : '18°C',
      status: 'good',
      detail: 'balcony sensor'
    },
    {
      id: 'lighting',
      icon: Lightbulb,
      label: 'Lights',
      value: `${lightsOn}/${totalLights}`,
      status: lightsOn > 0 ? 'active' : 'inactive',
      detail: 'lights on'
    },
    {
      id: 'activity',
      icon: User,
      label: 'Motion',
      value: activeMotion.toString(),
      status: activeMotion > 0 ? 'active' : 'inactive',
      detail: 'sensors active'
    },
    {
      id: 'cameras',
      icon: Eye,
      label: 'AI Detection',
      value: cameraDetections.toString(),
      status: cameraDetections > 0 ? 'alert' : 'good',
      detail: 'active detections'
    },
    {
      id: 'recording',
      icon: Camera,
      label: 'Recording',
      value: camerasRecording.toString(),
      status: camerasRecording > 0 ? 'active' : 'inactive',
      detail: 'cameras recording'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'active': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'alert': return 'text-red-600 bg-red-50 border-red-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-sm">
      {/* Main Stats Row */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Main stats */}
          <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
            {mainStats.map((stat) => {
              const IconComponent = stat.icon;
              const statusClasses = getStatusColor(stat.status);
              
              return (
                <div
                  key={stat.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all duration-200 hover:scale-105 ${statusClasses} min-w-0 flex-shrink-0`}
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{stat.value}</div>
                    <div className="text-xs opacity-75 truncate">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Right side - Connection & Details toggle */}
          <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
              {getConnectionIcon()}
              <span className="text-xs font-medium text-gray-700">
                {state.connectionState === 'connected' ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {/* Details Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <span className="text-xs font-medium text-gray-700">Details</span>
              {showDetails ? (
                <ChevronUp className="w-3 h-3 text-gray-600" />
              ) : (
                <ChevronDown className="w-3 h-3 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Expandable Details */}
      {showDetails && (
        <div className="border-t border-gray-200/50 p-4 bg-gray-50/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mainStats.map((stat) => (
              <div key={`detail-${stat.id}`} className="text-center">
                <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm font-medium text-gray-700">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.detail}</div>
              </div>
            ))}
          </div>
          
          {/* Additional System Info */}
          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Update:</span>
                <span className="font-medium">
                  {state.lastUpdate ? state.lastUpdate.toLocaleTimeString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">System Health:</span>
                <span className={`font-medium ${onlineDevices === totalDevices ? 'text-green-600' : 'text-yellow-600'}`}>
                  {Math.round((onlineDevices / totalDevices) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Alerts:</span>
                <span className={`font-medium ${cameraDetections > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {cameraDetections > 0 ? `${cameraDetections} alerts` : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactStatsRow;