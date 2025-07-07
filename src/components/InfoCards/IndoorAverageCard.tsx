import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';
import { formatTemperature, formatHumidity } from '../../utils/deviceHelpers';

const IndoorAverageCard: React.FC = () => {
  const { state } = useDevices();

  // Get all temperature and humidity sensors
  const tempSensors = state.devices.filter(device => 
    device.device_type === 'sensor' && (device as any).sensor_type === 'temperature'
  );
  const humiditySensors = state.devices.filter(device => 
    device.device_type === 'sensor' && (device as any).sensor_type === 'humidity'
  );

  // Calculate averages
  const avgTemp = tempSensors.length > 0 
    ? tempSensors.reduce((sum, sensor) => sum + Number(sensor.state), 0) / tempSensors.length
    : 20;
  
  const avgHumidity = humiditySensors.length > 0
    ? humiditySensors.reduce((sum, sensor) => sum + Number(sensor.state), 0) / humiditySensors.length
    : 50;

  // Determine comfort level
  const getComfortLevel = () => {
    if (avgTemp >= 20 && avgTemp <= 24 && avgHumidity >= 40 && avgHumidity <= 60) {
      return { level: 'Optimal', color: 'green' };
    } else if (avgTemp >= 18 && avgTemp <= 26 && avgHumidity >= 30 && avgHumidity <= 70) {
      return { level: 'Good', color: 'blue' };
    } else {
      return { level: 'Poor', color: 'yellow' };
    }
  };

  const comfort = getComfortLevel();

  return (
    <div className={`bg-gradient-to-br from-${comfort.color}-50 to-${comfort.color}-100 rounded-2xl p-4 border border-${comfort.color}-200/50 shadow-sm hover:shadow-md transition-all min-w-[200px]`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 bg-${comfort.color}-600 rounded-lg`}>
            <Thermometer className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Indoor Average</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 bg-${comfort.color}-500 rounded-full`}></div>
          <span className={`text-xs text-${comfort.color}-600 font-medium`}>{comfort.level}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-1">
            <Thermometer className="w-3 h-3" />
            <span>Temperature</span>
          </span>
          <span className="font-medium text-gray-900">{formatTemperature(avgTemp)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-1">
            <Droplets className="w-3 h-3" />
            <span>Humidity</span>
          </span>
          <span className="font-medium text-gray-900">{formatHumidity(avgHumidity)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Sensors</span>
          <span className="font-medium text-gray-900">{tempSensors.length} active</span>
        </div>
      </div>
    </div>
  );
};

export default IndoorAverageCard;