import React from 'react';
import { Columns2 } from 'lucide-react';
import { BlindDevice } from '../../../types/devices';
import { useDevices } from '../../../context/DeviceContext';
import { useRealtimeDevice } from '../../../hooks/useDeviceUpdates';

interface CompactCoverControlProps {
  device: BlindDevice;
  type?: 'blind' | 'curtain';
}

const CompactCoverControl: React.FC<CompactCoverControlProps> = ({ device, type = 'blind' }) => {
  const { controlCover } = useDevices();

  // Use real-time device state
  const currentDevice = useRealtimeDevice(device.entity_id) as BlindDevice || device;

  const handleToggle = () => {
    const isOpen = currentDevice.state === 'open' || (currentDevice.position && currentDevice.position > 50);
    if (isOpen) {
      controlCover(currentDevice.entity_id, 'close');
    } else {
      controlCover(currentDevice.entity_id, 'open');
    }
  };

  const isOpen = currentDevice.state === 'open' || (currentDevice.position && currentDevice.position > 50);
  const getTypeLabel = () => type === 'curtain' ? 'Curtain' : 'Blind';

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 device-control">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isOpen ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Columns2 className={`w-5 h-5 ${isOpen ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 text-sm">{currentDevice.friendly_name}</h4>
            <p className="text-xs text-gray-500">
              {currentDevice.position !== undefined ? `${currentDevice.position}% open` : (isOpen ? 'Open' : 'Closed')}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isOpen ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 toggle-switch-thumb ${
              isOpen ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default CompactCoverControl;