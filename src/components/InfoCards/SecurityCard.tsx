import React from 'react';
import { Shield } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

const SecurityCard: React.FC = () => {
  const { state } = useDevices();

  // Get real camera entities and sensors
  const cameras = state.devices.filter(device => device.device_type === 'camera');
  const sensors = state.devices.filter(device => device.device_type === 'binary_sensor');
  const detectionSensors = sensors.filter(sensor => (sensor as any).camera_entity);
  const activeDetections = detectionSensors.filter(sensor => sensor.state === 'on').length;

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-200/50 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-emerald-900">Security</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-green-600 font-medium">Armed</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-emerald-600">Cameras</span>
          <span className="font-medium text-emerald-900">{cameras.length} active</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-emerald-600">Sensors</span>
          <span className="font-medium text-emerald-900">{sensors.length} online</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-emerald-600">Alerts</span>
          <span className="font-medium text-emerald-900">{activeDetections} active</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityCard;