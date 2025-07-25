import React from 'react';
import { Lightbulb } from 'lucide-react';
import { LightDevice } from '../../../types/devices';
import { useDevices } from '../../../context/DeviceContext';
import { useRealtimeDevice } from '../../../hooks/useDeviceUpdates';

interface MinimalLightControlProps {
  device: LightDevice;
}

const MinimalLightControl: React.FC<MinimalLightControlProps> = ({ device }) => {
  const { controlLight } = useDevices();
  
  // Use real-time device state
  const currentDevice = useRealtimeDevice(device.entity_id) as LightDevice || device;

  const handleToggle = () => {
    controlLight(currentDevice.entity_id, currentDevice.state === 'off');
  };

  const isOn = currentDevice.state === 'on';

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isOn ? 'bg-yellow-100' : 'bg-gray-100'}`}>
            <Lightbulb className={`w-5 h-5 ${isOn ? 'text-yellow-600' : 'text-gray-500'}`} />
          </div>
          <span className="font-medium text-gray-900">{currentDevice.friendly_name}</span>
        </div>
        
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isOn ? 'bg-blue-500' : 'bg-gray-300'
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

export default MinimalLightControl;