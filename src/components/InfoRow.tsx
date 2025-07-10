import React from 'react';
import { Camera, Thermometer, Droplets, Shield, Wifi, Users, Home, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { useDevices } from '../context/DeviceContext';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';

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
  
  // Get balcony weather sensors for system overview
  const balconyTemp = useRealtimeDevice('sensor.balcony_temperature_sensor_temperature');
  const balconyHumidity = useRealtimeDevice('sensor.balcony_temperature_sensor_humidity');

  // Calculate system statistics
  const totalDevices = state.devices.length;
  const onlineDevices = state.devices.filter(d => d.available).length;
  const lightsOn = state.devices.filter(d => d.device_type === 'light' && d.state === 'on').length;
  const totalLights = state.devices.filter(d => d.device_type === 'light').length;
  
  // Check for critical alerts
  const criticalAlerts = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && 
    ((device as any).sensor_type === 'smoke' || (device as any).sensor_type === 'flood') &&
    device.state === 'on'
  ).length;

  // Check for attention needed
  const attentionNeeded = state.devices.filter(device => 
    (device.device_type === 'binary_sensor' && 
     ((device as any).sensor_type === 'door' || (device as any).sensor_type === 'window') &&
     device.state === 'on') ||
    (device.device_type === 'lock' && device.state === 'unlocked')
  ).length;

  // Get people home count
  const peopleHome = state.devices.filter(device => 
    device.device_type === 'device_tracker' && device.state === 'home'
  ).length;

  const getSystemStatusIcon = () => {
    if (criticalAlerts > 0) return <AlertTriangle className="w-5 h-5 text-red-400" />;
    if (attentionNeeded > 0) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    return <CheckCircle className="w-5 h-5 text-green-400" />;
  };

  const getSystemStatusText = () => {
    if (criticalAlerts > 0) return 'Critical Alert';
    if (attentionNeeded > 0) return 'Attention Needed';
    return 'All Systems Normal';
  };

  const getSystemStatusColor = () => {
    if (criticalAlerts > 0) return 'text-red-400';
    if (attentionNeeded > 0) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* System Overview */}
        <div className="glass-card rounded-2xl p-4 seamless-transition">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5" style={{ color: '#028ee5' }} />
              <h3 className="font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>System Overview</h3>
            </div>
            {getSystemStatusIcon()}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Status</span>
              <span className={`text-sm font-medium ${getSystemStatusColor()}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                {getSystemStatusText()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Devices Online</span>
              <span className="text-sm font-medium text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {onlineDevices}/{totalDevices}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Lights On</span>
              <span className="text-sm font-medium text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {lightsOn}/{totalLights}
              </span>
            </div>
          </div>
        </div>

        {/* Weather Information */}
        <div className="glass-card rounded-2xl p-4 seamless-transition">
          <div className="flex items-center space-x-2 mb-3">
            <Thermometer className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Weather</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Temperature</span>
              <span className="text-sm font-medium text-blue-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {balconyTemp ? `${Number(balconyTemp.state).toFixed(1)}°C` : '18.0°C'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Humidity</span>
              <span className="text-sm font-medium text-cyan-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {balconyHumidity ? `${Math.round(Number(balconyHumidity.state))}%` : '65%'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Location</span>
              <span className="text-sm font-medium text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Balcony</span>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="glass-card rounded-2xl p-4 seamless-transition">
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Security</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>People Home</span>
              <span className="text-sm font-medium text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {peopleHome}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Alerts</span>
              <span className={`text-sm font-medium ${criticalAlerts > 0 ? 'text-red-400' : 'text-green-400'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                {criticalAlerts > 0 ? `${criticalAlerts} Critical` : 'None'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Connection</span>
              <div className="flex items-center space-x-1">
                <Wifi className={`w-3 h-3 ${state.connectionState === 'connected' ? 'text-green-400' : 'text-red-400'}`} />
                <span className={`text-sm font-medium ${state.connectionState === 'connected' ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {state.connectionState === 'connected' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Status */}
        <div className="glass-card rounded-2xl p-4 seamless-transition">
          <div className="flex items-center space-x-2 mb-3">
            <Camera className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Cameras</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Active</span>
              <span className="text-sm font-medium text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {cameras.filter(c => c.recording).length}/{cameras.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Recording</span>
              <span className="text-sm font-medium text-green-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {cameras.filter(c => c.recording).length > 0 ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Night Vision</span>
              <span className="text-sm font-medium text-purple-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {cameras.filter(c => c.nightVision).length} Enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoRow;