import React, { useState } from 'react';
import { 
  Shield, 
  Thermometer, 
  Lightbulb, 
  Users, 
  AlertTriangle,
  Wifi,
  Battery,
  Droplets,
  Wind,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Minus,
  Home,
  Activity,
  Clock
} from 'lucide-react';
import { useDevices } from '../context/DeviceContext';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';
import { formatTemperature, formatHumidity } from '../utils/deviceHelpers';

interface Camera {
  id: number;
  name: string;
  location: string;
  recording: boolean;
  nightVision: boolean;
  temperature: number;
  humidity: number;
  backgroundImage: string;
}

interface InfoRowProps {
  cameras: Camera[];
}

const InfoRow: React.FC<InfoRowProps> = ({ cameras }) => {
  const { state } = useDevices();

  // Get real device data
  const balconyTemp = useRealtimeDevice('sensor.balcony_temperature_sensor_temperature');
  const balconyHumidity = useRealtimeDevice('sensor.balcony_temperature_sensor_humidity');
  const entranceLock = useRealtimeDevice('lock.lock_ultra_910e');
  const alarmSystem = useRealtimeDevice('alarm_control_panel.home_security');

  // Calculate comprehensive home statistics
  const homeStats = React.useMemo(() => {
    const allDevices = state.devices;
    
    // Lighting statistics
    const lights = allDevices.filter(d => d.device_type === 'light');
    const lightsOn = lights.filter(l => l.state === 'on').length;
    
    // Security statistics
    const locks = allDevices.filter(d => d.device_type === 'lock');
    const locksSecured = locks.filter(l => l.state === 'locked').length;
    
    // Sensor statistics
    const tempSensors = allDevices.filter(d => 
      d.device_type === 'sensor' && (d as any).sensor_type === 'temperature'
    );
    const avgTemp = tempSensors.length > 0 
      ? tempSensors.reduce((sum, s) => sum + Number(s.state), 0) / tempSensors.length
      : null;
    
    const humiditySensors = allDevices.filter(d => 
      d.device_type === 'sensor' && (d as any).sensor_type === 'humidity'
    );
    const avgHumidity = humiditySensors.length > 0 
      ? humiditySensors.reduce((sum, s) => sum + Number(s.state), 0) / humiditySensors.length
      : null;
    
    // Safety alerts
    const smokeAlerts = allDevices.filter(d => 
      d.device_type === 'binary_sensor' && 
      (d as any).sensor_type === 'smoke' && 
      d.state === 'on'
    ).length;
    
    const floodAlerts = allDevices.filter(d => 
      d.device_type === 'binary_sensor' && 
      (d as any).sensor_type === 'flood' && 
      d.state === 'on'
    ).length;
    
    // Motion/presence detection
    const motionSensors = allDevices.filter(d => 
      d.device_type === 'binary_sensor' && 
      (d as any).sensor_type === 'motion'
    );
    const activeMotion = motionSensors.filter(s => s.state === 'on').length;
    
    // Window/door status
    const windowDoorSensors = allDevices.filter(d => 
      d.device_type === 'binary_sensor' && 
      ((d as any).sensor_type === 'window' || (d as any).sensor_type === 'door')
    );
    const openWindows = windowDoorSensors.filter(s => s.state === 'on').length;
    
    // Device connectivity
    const onlineDevices = allDevices.filter(d => d.available).length;
    const totalDevices = allDevices.length;
    
    // Media activity
    const mediaPlayers = allDevices.filter(d => d.device_type === 'media_player');
    const activeMedia = mediaPlayers.filter(m => m.state === 'playing').length;
    
    return {
      lighting: { on: lightsOn, total: lights.length },
      security: { 
        locked: locksSecured, 
        total: locks.length,
        alarmState: alarmSystem?.state || 'unknown'
      },
      climate: { 
        temperature: avgTemp, 
        humidity: avgHumidity,
        outdoorTemp: balconyTemp ? Number(balconyTemp.state) : null,
        outdoorHumidity: balconyHumidity ? Number(balconyHumidity.state) : null
      },
      safety: { 
        smokeAlerts, 
        floodAlerts, 
        totalAlerts: smokeAlerts + floodAlerts 
      },
      activity: { 
        motion: activeMotion, 
        totalMotionSensors: motionSensors.length,
        openWindows,
        totalWindowDoor: windowDoorSensors.length,
        activeMedia
      },
      connectivity: { 
        online: onlineDevices, 
        total: totalDevices,
        percentage: Math.round((onlineDevices / totalDevices) * 100)
      }
    };
  }, [state.devices, balconyTemp, balconyHumidity, alarmSystem]);

  // Get security status color and text
  const getSecurityStatus = () => {
    const { security, safety } = homeStats;
    
    if (safety.totalAlerts > 0) {
      return { 
        color: 'bg-red-500', 
        text: 'ALERT', 
        bgColor: 'from-red-50 to-red-100',
        borderColor: 'border-red-200'
      };
    }
    
    if (security.alarmState === 'armed_away' || security.alarmState === 'armed_home') {
      return { 
        color: 'bg-blue-500', 
        text: 'ARMED', 
        bgColor: 'from-blue-50 to-blue-100',
        borderColor: 'border-blue-200'
      };
    }
    
    if (security.locked === security.total && security.total > 0) {
      return { 
        color: 'bg-green-500', 
        text: 'SECURE', 
        bgColor: 'from-green-50 to-green-100',
        borderColor: 'border-green-200'
      };
    }
    
    return { 
      color: 'bg-yellow-500', 
      text: 'PARTIAL', 
      bgColor: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200'
    };
  };

  const securityStatus = getSecurityStatus();

  // Get temperature trend (simplified - could be enhanced with historical data)
  const getTempTrend = () => {
    const { climate } = homeStats;
    if (!climate.temperature || !climate.outdoorTemp) return null;
    
    const diff = climate.temperature - climate.outdoorTemp;
    if (Math.abs(diff) < 1) return <Minus className="w-3 h-3 text-gray-500" />;
    return diff > 0 ? 
      <TrendingUp className="w-3 h-3 text-red-500" /> : 
      <TrendingDown className="w-3 h-3 text-blue-500" />;
  };

  return (
    <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Security Overview */}
        <div className={`bg-gradient-to-br ${securityStatus.bgColor} rounded-2xl p-4 border ${securityStatus.borderColor} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white/80 rounded-lg shadow-sm">
                <Shield className="w-4 h-4 text-gray-700" />
              </div>
              <span className="font-semibold text-gray-900">Security</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 ${securityStatus.color} rounded-full`}></div>
              <span className="text-xs font-bold text-gray-700">{securityStatus.text}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Locks</span>
              <div className="flex items-center space-x-1">
                {homeStats.security.locked === homeStats.security.total ? 
                  <Lock className="w-3 h-3 text-green-600" /> : 
                  <Unlock className="w-3 h-3 text-red-600" />
                }
                <span className="font-medium text-gray-900">
                  {homeStats.security.locked}/{homeStats.security.total}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Alarm</span>
              <span className="font-medium text-gray-900 capitalize">
                {homeStats.security.alarmState.replace('_', ' ')}
              </span>
            </div>
            {homeStats.safety.totalAlerts > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-red-600">Alerts</span>
                <span className="font-bold text-red-600">{homeStats.safety.totalAlerts}</span>
              </div>
            )}
          </div>
        </div>

        {/* Climate Control */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-4 border border-blue-200/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Thermometer className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-blue-900">Climate</span>
            </div>
            {getTempTrend()}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-600">Indoor Avg</span>
              <span className="font-medium text-blue-900">
                {homeStats.climate.temperature ? formatTemperature(homeStats.climate.temperature) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600">Outdoor</span>
              <span className="font-medium text-blue-900">
                {homeStats.climate.outdoorTemp ? formatTemperature(homeStats.climate.outdoorTemp) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600">Humidity</span>
              <div className="flex items-center space-x-1">
                <Droplets className="w-3 h-3 text-blue-500" />
                <span className="font-medium text-blue-900">
                  {homeStats.climate.humidity ? formatHumidity(homeStats.climate.humidity) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lighting & Energy */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-4 border border-amber-200/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-600 rounded-lg">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-amber-900">Lighting</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                homeStats.lighting.on > 0 ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-xs font-medium text-amber-700">
                {homeStats.lighting.on > 0 ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-amber-600">Lights On</span>
              <span className="font-medium text-amber-900">
                {homeStats.lighting.on}/{homeStats.lighting.total}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-amber-600">Usage</span>
              <span className="font-medium text-amber-900">
                {homeStats.lighting.total > 0 ? 
                  Math.round((homeStats.lighting.on / homeStats.lighting.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-2">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${homeStats.lighting.total > 0 ? 
                    (homeStats.lighting.on / homeStats.lighting.total) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Activity & Presence */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-4 border border-purple-200/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-purple-900">Activity</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                homeStats.activity.motion > 0 ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-xs font-medium text-purple-700">
                {homeStats.activity.motion > 0 ? 'MOTION' : 'QUIET'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-600">Motion</span>
              <span className="font-medium text-purple-900">
                {homeStats.activity.motion}/{homeStats.activity.totalMotionSensors}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-purple-600">Open</span>
              <span className="font-medium text-purple-900">
                {homeStats.activity.openWindows} windows/doors
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-purple-600">Media</span>
              <span className="font-medium text-purple-900">
                {homeStats.activity.activeMedia} playing
              </span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 border border-emerald-200/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-emerald-900">System</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                state.connectionState === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-xs font-medium text-emerald-700">
                {state.connectionState === 'connected' ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-emerald-600">Devices</span>
              <span className="font-medium text-emerald-900">
                {homeStats.connectivity.online}/{homeStats.connectivity.total}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-emerald-600">Health</span>
              <span className="font-medium text-emerald-900">
                {homeStats.connectivity.percentage}%
              </span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${homeStats.connectivity.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Status Bar */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Last update: {state.lastUpdate?.toLocaleTimeString() || 'Never'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Home className="w-3 h-3" />
            <span>{homeStats.connectivity.total} devices monitored</span>
          </div>
        </div>
        
        {homeStats.safety.totalAlerts > 0 && (
          <div className="flex items-center space-x-1 text-red-600 font-medium">
            <AlertTriangle className="w-3 h-3" />
            <span>{homeStats.safety.totalAlerts} active alert{homeStats.safety.totalAlerts > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoRow;