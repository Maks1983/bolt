import React from 'react';
import { Settings } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface ActionsCardProps {
  onClick?: () => void;
}

const ActionsCard: React.FC<ActionsCardProps> = ({ onClick }) => {
  const { state } = useDevices();

  // Get all lights
  const lights = state.devices.filter(device => device.device_type === 'light');
  const lightsOn = lights.filter(light => light.state === 'on').length;

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer min-w-[120px]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 bg-purple-500/20 rounded-full shadow-lg">
          <Settings className="w-6 h-6 text-purple-600" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Actions</div>
          <div className="text-xs text-gray-600 font-medium">Quick controls</div>
        </div>
      </div>
    </div>
  );
};

export default ActionsCard;