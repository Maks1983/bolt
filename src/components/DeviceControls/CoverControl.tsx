import React from 'react';
import { ChevronUp } from 'lucide-react';
import { BlindDevice } from '../../types/devices';
import { useDevices } from '../../context/DeviceContext';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import DeviceTimestamp from './DeviceTimestamp';

interface CoverControlProps {
  device: BlindDevice;
  type?: 'blind' | 'curtain';
}

const CoverControl: React.FC<CoverControlProps> = ({ device, type = 'blind' }) => {
  const { controlCover } = useDevices();

  // Use real-time device state instead of prop
  const currentDevice = useRealtimeDevice(device.entity_id) as BlindDevice || device;

  const handlePositionChange = (position: number) => {
    controlCover(currentDevice.entity_id, 'set_position', position);
  };

  const handleOpen = () => {
    controlCover(currentDevice.entity_id, 'open');
  };

  const handleClose = () => {
    controlCover(currentDevice.entity_id, 'close');
  };

  const getTypeLabel = () => {
    return type === 'curtain' ? 'Curtain' : 'Blind';
  };

  const getColorScheme = () => {
    return type === 'curtain' ? 'purple' : 'blue';
  };

  const colorClasses = {
    blue: {
      button: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      buttonPrimary: 'bg-blue-500 text-white hover:bg-blue-600'
    },
    purple: {
      button: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      buttonPrimary: 'bg-purple-500 text-white hover:bg-purple-600'
    }
  };

  const colors = colorClasses[getColorScheme()];

  // Debug logging
  console.log(`🪟 CoverControl render: ${currentDevice.entity_id} state=${currentDevice.state} position=${currentDevice.position}`);

  return (
    <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">{currentDevice.friendly_name}</h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClose}
            className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${colors.button}`}
          >
            Close
          </button>
          <button
            onClick={handleOpen}
            className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${colors.buttonPrimary}`}
          >
            Open
          </button>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Position</span>
          <span className="text-sm text-gray-500">{currentDevice.position || 0}% open</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={currentDevice.position || 0}
          onChange={(e) => handlePositionChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Device Timestamp */}
      <DeviceTimestamp device={currentDevice} />
    </div>
  );
};

export default CoverControl;