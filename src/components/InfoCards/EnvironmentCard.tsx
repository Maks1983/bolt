import React from 'react';
import { Thermometer } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';
import { calculateAverageTemperature } from '../../utils/deviceHelpers';

const EnvironmentCard: React.FC = () => {
  const { state } = useDevices();

  // Calculate average temperature from all rooms
  const avgTemp = calculateAverageTemperature(state.rooms);
  
  // Get humidity sensors for average calculation
  const humiditySensors = state.devices.filter(device => 
    device.device_type === 'sensor' && (device as any).sensor_type === 'humidity'
  );
  
  const avgHumidity = humiditySensors.length > 0 
    ? Math.round(humiditySensors.reduce((sum, sensor) => sum + Number(sensor.state), 0) / humiditySensors.length)
    : 52;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4 border border-amber-200/50 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-600 rounded-lg">
            <Thermometer className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-amber-900">Environment</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-green-600 font-medium">Normal</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-amber-600">Avg Temp</span>
          <span className="font-medium text-amber-900">{avgTemp.toFixed(1)}°C</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-amber-600">Humidity</span>
          <span className="font-medium text-amber-900">{avgHumidity}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-amber-600">Air Quality</span>
          <span className="font-medium text-amber-900">Good</span>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentCard;