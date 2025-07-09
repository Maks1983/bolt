import React from 'react';
import { Columns2 } from 'lucide-react';
import { BlindDevice } from '../../../types/devices';
import { useDevices } from '../../../context/DeviceContext';
import { useRealtimeDevice } from '../../../hooks/useDeviceUpdates';

interface MinimalCoverControlProps {
  device: BlindDevice;
}

const MinimalCoverControl: React.FC<MinimalCoverControlProps> = ({ device }) => {
  const { controlCover } = useDevices();
  
  // Use real-time device state
  const currentDevice = useRealtimeDevice(device.entity_id) as BlindDevice || device;

  const handleToggle = () => {
    const action = currentDevice.state === 'open' ? 'close' : 'open';
    controlCover(currentDevice.entity_id, action);
  };

  const isOpen = currentDevice.state === 'open';

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isOpen ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Columns2 className={`w-5 h-5 ${isOpen ? 'text-blue-600' : 'text-gray-500'}`} />
          </div>
          <span className="font-medium text-gray-900">{currentDevice.friendly_name}</span>
        </div>
        
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isOpen ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOpen ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </div>
  );
};

export default MinimalCoverControl;