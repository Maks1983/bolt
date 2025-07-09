import React from 'react';
import { Fan } from 'lucide-react';
import { FanDevice } from '../../../types/devices';
import { useDevices } from '../../../context/DeviceContext';
import { useRealtimeDevice } from '../../../hooks/useDeviceUpdates';

interface MinimalFanControlProps {
  device: FanDevice;
}

const MinimalFanControl: React.FC<MinimalFanControlProps> = ({ device }) => {
  const { controlFan } = useDevices();
  
  // Use real-time device state
  const currentDevice = useRealtimeDevice(device.entity_id) as FanDevice || device;

  const handleToggle = () => {
    controlFan(currentDevice.entity_id, currentDevice.state === 'off');
  };

  const isOn = currentDevice.state === 'on';

  return (
    <div className="bg-gray-700 rounded-xl p-4 border border-gray-600 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isOn ? 'bg-cyan-900/50' : 'bg-gray-600'}`}>
            <Fan className={`w-5 h-5 ${isOn ? 'text-cyan-400' : 'text-gray-400'}`} />
          </div>
          <span className="font-medium text-white">{currentDevice.friendly_name}</span>
        </div>
        
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isOn ? 'bg-cyan-600' : 'bg-gray-500'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </div>
  );
};

export default MinimalFanControl;