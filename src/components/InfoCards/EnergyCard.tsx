import React from 'react';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

const EnergyCard: React.FC = () => {
  const { state } = useDevices();

  // Get all lights and calculate energy usage estimate
  const lights = state.devices.filter(device => device.device_type === 'light');
  const lightsOn = lights.filter(light => light.state === 'on');
  
  // Mock energy data - in real implementation, you'd get this from energy sensors
  const currentUsage = lightsOn.length * 0.01; // Rough estimate: 10W per light
  const dailyUsage = 12.4; // kWh
  const monthlyEstimate = dailyUsage * 30;
  const trend = 'down'; // 'up' or 'down'
  const trendPercentage = 8.2;

  const getUsageColor = () => {
    if (currentUsage < 0.5) return 'green';
    if (currentUsage < 1.0) return 'yellow';
    return 'red';
  };

  const usageColor = getUsageColor();
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className={`bg-gradient-to-br from-${usageColor}-50 to-${usageColor}-100 rounded-2xl p-4 border border-${usageColor}-200/50 shadow-sm hover:shadow-md transition-all min-w-[200px]`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 bg-${usageColor}-600 rounded-lg`}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Energy</span>
        </div>
        <div className="flex items-center space-x-1">
          <TrendIcon className={`w-3 h-3 ${trend === 'up' ? 'text-red-500' : 'text-green-500'}`} />
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
            {trendPercentage}%
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Current</span>
          <span className="font-medium text-gray-900">{currentUsage.toFixed(2)} kW</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Today</span>
          <span className="font-medium text-gray-900">{dailyUsage} kWh</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Monthly Est.</span>
          <span className="font-medium text-gray-900">{monthlyEstimate.toFixed(0)} kWh</span>
        </div>
      </div>
    </div>
  );
};

export default EnergyCard;