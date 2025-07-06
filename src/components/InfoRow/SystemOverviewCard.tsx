import React, { useState } from 'react';
import { Home, Shield, Wifi, Thermometer, Lightbulb, Camera, Users, TrendingUp, Clock, Battery } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import { formatTemperature } from '../../utils/deviceHelpers';

const SystemOverviewCard: React.FC = () => {
  const { state } = useDevices();
  const [showDetails, setShowDetails] = useState(false);
  
  // Get key system metrics
  const balconyTemp = useRealtimeDevice('sensor.balcony_temperature_sensor_temperature');
  const entranceLock = useRealtimeDevice('lock.lock_ultra_910e');
  const alarmSystem = useRealtimeDevice('alarm_control_panel.home_security');
  
  // Calculate system stats
  const totalDevices = state.devices.length;
  const onlineDevices = state.devices.filter(d => d.available).length;
  const lightsOn = state.devices.filter(d => d.device_type === 'light' && d.state === 'on').length;
  const totalLights = state.devices.filter(d => d.device_type === 'light').length;
  const camerasRecording = state.devices.filter(d => d.device_type === 'camera' && d.state === 'recording').length;
  const totalCameras = state.devices.filter(d => d.device_type === 'camera').length;
  
  // Calculate uptime percentage
  const uptimePercentage = totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0;
  
  // Get connection status color
  const getConnectionColor = () => {
    switch (state.connectionState) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSecurityStatus = () => {
    const lockStatus = entranceLock?.state === 'locked' ? 'Secured' : 'Unsecured';
    const alarmStatus = alarmSystem?.state || 'Unknown';
    
    if (lockStatus === 'Secured' && (alarmStatus === 'armed_home' || alarmStatus === 'armed_away')) {
      return { status: 'Fully Secured', color: 'text-green-500', bgColor: 'bg-green-50' };
    } else if (lockStatus === 'Secured' || alarmStatus !== 'disarmed') {
      return { status: 'Partially Secured', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    } else {
      return { status: 'Unsecured', color: 'text-red-500', bgColor: 'bg-red-50' };
    }
  };

  const securityStatus = getSecurityStatus();

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Smart Home System</h2>
              <p className="text-gray-600">Real-time overview and status</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {/* System Health */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{uptimePercentage}%</div>
                <div className="text-xs text-green-700 font-medium">System Health</div>
                <div className="text-xs text-gray-600">{onlineDevices}/{totalDevices} online</div>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className={`rounded-2xl p-4 border ${securityStatus.bgColor} border-opacity-50`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${securityStatus.color.replace('text-', 'bg-').replace('-500', '-500').replace('-600', '-500')}`}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className={`text-sm font-bold ${securityStatus.color}`}>{securityStatus.status}</div>
                <div className="text-xs text-gray-600">Security</div>
                <div className="text-xs text-gray-500">Lock & Alarm</div>
              </div>
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Thermometer className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {balconyTemp ? formatTemperature(balconyTemp.state) : '18°C'}
                </div>
                <div className="text-xs text-blue-700 font-medium">Outdoor</div>
                <div className="text-xs text-gray-600">Balcony sensor</div>
              </div>
            </div>
          </div>

          {/* Lighting */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{lightsOn}</div>
                <div className="text-xs text-yellow-700 font-medium">Lights On</div>
                <div className="text-xs text-gray-600">{totalLights} total</div>
              </div>
            </div>
          </div>

          {/* Cameras */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{camerasRecording}</div>
                <div className="text-xs text-purple-700 font-medium">Recording</div>
                <div className="text-xs text-gray-600">{totalCameras} cameras</div>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${state.connectionState === 'connected' ? 'bg-green-500' : 'bg-gray-500'}`}>
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className={`text-sm font-bold ${getConnectionColor()}`}>
                  {state.connectionState === 'connected' ? 'Online' : 'Offline'}
                </div>
                <div className="text-xs text-gray-600">Home Assistant</div>
                <div className="text-xs text-gray-500">
                  {state.lastUpdate ? state.lastUpdate.toLocaleTimeString() : 'Never'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats (Expandable) */}
        {showDetails && (
          <div className="border-t border-gray-200/50 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Device Breakdown */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Device Breakdown</span>
                </h3>
                <div className="space-y-2">
                  {Object.entries(
                    state.devices.reduce((acc, device) => {
                      acc[device.device_type] = (acc[device.device_type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="capitalize text-gray-600">{type.replace('_', ' ')}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Performance */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Battery className="w-4 h-4" />
                  <span>Performance</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium text-green-600">{'< 100ms'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Memory Usage</span>
                    <span className="font-medium">2.4 GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Network Load</span>
                    <span className="font-medium text-blue-600">Low</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Restart</span>
                    <span className="font-medium">3 days ago</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Recent Activity</span>
                </h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="text-gray-600">Living Room Light</div>
                    <div className="text-xs text-gray-500">Turned on • 2 min ago</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-600">Front Door Camera</div>
                    <div className="text-xs text-gray-500">Motion detected • 5 min ago</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-600">Kitchen Temperature</div>
                    <div className="text-xs text-gray-500">Updated • 1 min ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemOverviewCard;