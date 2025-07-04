import React from 'react';
import { Clock, Timer } from 'lucide-react';
import { Device } from '../../types/devices';
import { useLiveTimer } from '../../hooks/useDeviceUpdates';

interface DeviceTimestampProps {
  device: Device;
  showStateTimer?: boolean;
}

const DeviceTimestamp: React.FC<DeviceTimestampProps> = ({ 
  device, 
  showStateTimer = true 
}) => {
  const { timeSinceUpdate, timeInCurrentState, lastUpdatedFormatted, isRecent } = useLiveTimer(device);

  // Get state description for timer
  const getStateDescription = () => {
    switch (device.device_type) {
      case 'light':
        return device.state === 'on' ? 'on' : 'off';
      case 'cover':
        return device.state;
      case 'media_player':
        return device.state;
      case 'fan':
        return device.state === 'on' ? 'running' : 'off';
      case 'lock':
        return device.state;
      case 'sensor':
        return `at ${device.state}${(device as any).unit_of_measurement || ''}`;
      case 'binary_sensor':
        return device.state === 'on' ? 'active' : 'inactive';
      default:
        return device.state;
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200/50 space-y-2">
      {/* Last Updated */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Last updated</span>
        </div>
        <div className={`font-medium ${isRecent ? 'text-green-600' : 'text-gray-600'}`}>
          {lastUpdatedFormatted}
        </div>
      </div>

      {/* Time in Current State */}
      {showStateTimer && timeInCurrentState && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Timer className="w-3 h-3" />
            <span>State duration</span>
          </div>
          <div className="font-medium text-gray-600">
            {getStateDescription()} for {timeInCurrentState}
          </div>
        </div>
      )}

      {/* Time Since Update (alternative view) */}
      {timeSinceUpdate && (
        <div className="text-center">
          <div className={`text-xs ${isRecent ? 'text-green-600' : 'text-gray-400'}`}>
            Updated {timeSinceUpdate}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceTimestamp;