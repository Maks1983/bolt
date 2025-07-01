import React from 'react';
import { Shield, Camera, Thermometer, Droplets, AlertTriangle, CheckCircle } from 'lucide-react';
import { useDevices } from '../context/DeviceContext';

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
  const { state, getDevicesByType } = useDevices();
  
  // Get real device data from context
  const temperatureSensors = getDevicesByType('sensor').filter(d => 
    (d as any).sensor_type === 'temperature'
  );
  const humiditySensors = getDevicesByType('sensor').filter(d => 
    (d as any).sensor_type === 'humidity'
  );
  const smokeSensors = getDevicesByType('binary_sensor').filter(d => 
    (d as any).sensor_type === 'smoke' && d.state === 'on'
  );
  const floodSensors = getDevicesByType('binary_sensor').filter(d => 
    (d as any).sensor_type === 'flood' && d.state === 'on'
  );
  const cameraDevices = getDevicesByType('camera');
  const alarmDevices = getDevicesByType('alarm_control_panel');

  // Calculate averages from real sensor data
  const avgTemp = temperatureSensors.length > 0 
    ? Math.round(temperatureSensors.reduce((sum, sensor) => sum + Number(sensor.state), 0) / temperatureSensors.length)
    : 20;
  
  const avgHumidity = humiditySensors.length > 0
    ? Math.round(humiditySensors.reduce((sum, sensor) => sum + Number(sensor.state), 0) / humiditySensors.length)
    : 50;

  // Security status from alarm system
  const securityStatus = alarmDevices.length > 0 ? alarmDevices[0].state : 'disarmed';
  const hasAlerts = smokeSensors.length > 0 || floodSensors.length > 0;

  // Camera status from real devices
  const activeCameras = cameraDevices.filter(c => c.state === 'recording' || c.state === 'streaming').length;
  const totalCameras = Math.max(cameraDevices.length, cameras.length); // Use real count or fallback

  const getSecurityStatusColor = () => {
    if (hasAlerts) return 'bg-red-100 text-red-700 border-red-200';
    switch (securityStatus) {
      case 'armed_home':
      case 'armed_away':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'disarmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'triggered':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSecurityStatusText = () => {
    if (hasAlerts) return 'Security Alert';
    switch (securityStatus) {
      case 'armed_home':
        return 'Armed Home';
      case 'armed_away':
        return 'Armed Away';
      case 'disarmed':
        return 'System Disarmed';
      case 'triggered':
        return 'ALARM TRIGGERED';
      default:
        return 'System Status';
    }
  };

  const getSecurityIcon = () => {
    if (hasAlerts) return AlertTriangle;
    switch (securityStatus) {
      case 'armed_home':
      case 'armed_away':
        return Shield;
      case 'disarmed':
        return CheckCircle;
      case 'triggered':
        return AlertTriangle;
      default:
        return Shield;
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Security Status */}
          <div className={`flex items-center space-x-3 p-4 rounded-2xl border ${getSecurityStatusColor()} shadow-sm`}>
            {React.createElement(getSecurityIcon(), { className: "w-6 h-6" })}
            <div>
              <div className="text-sm font-bold">{getSecurityStatusText()}</div>
              <div className="text-xs opacity-75">
                {hasAlerts ? `${smokeSensors.length + floodSensors.length} alerts` : 'All systems normal'}
              </div>
            </div>
          </div>

          {/* Temperature Overview */}
          <div className="flex items-center space-x-3 p-4 bg-blue-50/80 rounded-2xl border border-blue-200/50 shadow-sm">
            <Thermometer className="w-6 h-6 text-blue-600" />
            <div>
              <div className="text-lg font-bold text-gray-900">{avgTemp}°C</div>
              <div className="text-sm text-blue-600 font-medium">
                Avg Temperature ({temperatureSensors.length} sensors)
              </div>
            </div>
          </div>

          {/* Humidity Overview */}
          <div className="flex items-center space-x-3 p-4 bg-cyan-50/80 rounded-2xl border border-cyan-200/50 shadow-sm">
            <Droplets className="w-6 h-6 text-cyan-600" />
            <div>
              <div className="text-lg font-bold text-gray-900">{avgHumidity}%</div>
              <div className="text-sm text-cyan-600 font-medium">
                Avg Humidity ({humiditySensors.length} sensors)
              </div>
            </div>
          </div>

          {/* Camera System */}
          <div className="flex items-center space-x-3 p-4 bg-purple-50/80 rounded-2xl border border-purple-200/50 shadow-sm">
            <Camera className="w-6 h-6 text-purple-600" />
            <div>
              <div className="text-lg font-bold text-gray-900">{activeCameras}/{totalCameras}</div>
              <div className="text-sm text-purple-600 font-medium">Cameras Active</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InfoRow;