import React from 'react';
import { Fan } from 'lucide-react';
import { FanDevice } from '../../types/devices';
import { useDevices } from '../../context/DeviceContext';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import DeviceTimestamp from './DeviceTimestamp';

interface FanControlProps {
  device: FanDevice;
}

const FanControl: React.FC<FanControlProps> = ({ device }) => {
  const { controlFan } = useDevices();

  // Use real-time device state instead of prop
  const currentDevice = useRealtimeDevice(device.entity_id) as FanDevice || device;

  const handleToggle = () => {
    controlFan(currentDevice.entity_id, currentDevice.state === 'off');
  };

  const handleSpeedChange = (percentage: number) => {
    controlFan(currentDevice.entity_id, percentage > 0, percentage);
  };

  const isOn = currentDevice.state === 'on';

  // Debug logging
  console.log(`🌀 FanControl render: ${currentDevice.entity_id} state=${currentDevice.state} isOn=${isOn}`);

  return (
    <div className="device-control rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{currentDevice.friendly_name}</h4>
        <button
          onClick={handleToggle}
          className={`seamless-toggle relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isOn ? 'active' : ''
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {isOn && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Speed</span>
            <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Poppins, sans-serif' }}>{currentDevice.percentage || 0}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={currentDevice.percentage || 0}
            onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
            className="seamless-slider w-full cursor-pointer"
          />
        </div>
      )}

      {/* Device Timestamp */}
      <DeviceTimestamp device={currentDevice} />
    </div>
  );
};

export default FanControl;