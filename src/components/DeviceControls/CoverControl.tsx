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
      button: 'seamless-button',
      buttonPrimary: 'seamless-button-primary'
    },
    purple: {
      button: 'seamless-button',
      buttonPrimary: 'seamless-button-primary'
    }
  };

  const colors = colorClasses[getColorScheme()];

  // Debug logging
  console.log(`🪟 CoverControl render: ${currentDevice.entity_id} state=${currentDevice.state} position=${currentDevice.position}`);

  return (
    <div className="device-control rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{currentDevice.friendly_name}</h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClose}
            className={`${colors.button} px-3 py-1.5 rounded-lg transition-colors text-sm font-medium`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Close
          </button>
          <button
            onClick={handleOpen}
            className={`${colors.buttonPrimary} px-3 py-1.5 rounded-lg transition-colors text-sm font-medium`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Open
          </button>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Position</span>
          <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Poppins, sans-serif' }}>{currentDevice.position || 0}% open</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={currentDevice.position || 0}
          onChange={(e) => handlePositionChange(parseInt(e.target.value))}
          className="seamless-slider w-full cursor-pointer"
        />
      </div>

      {/* Device Timestamp */}
      <DeviceTimestamp device={currentDevice} />
    </div>
  );
};

export default CoverControl;