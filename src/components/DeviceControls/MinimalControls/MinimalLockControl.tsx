import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { LockDevice } from '../../../types/devices';
import { useDevices } from '../../../context/DeviceContext';
import { useRealtimeDevice } from '../../../hooks/useDeviceUpdates';

interface MinimalLockControlProps {
  device: LockDevice;
}

const MinimalLockControl: React.FC<MinimalLockControlProps> = ({ device }) => {
  const { controlLock } = useDevices();
  
  // Use real-time device state
  const currentDevice = useRealtimeDevice(device.entity_id) as LockDevice || device;

  const handleToggle = () => {
    const action = currentDevice.state === 'locked' ? 'unlock' : 'lock';
    controlLock(currentDevice.entity_id, action);
  };

  const isLocked = currentDevice.state === 'locked';

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isLocked ? 'bg-green-100' : 'bg-red-100'}`}>
            {isLocked ? (
              <Lock className="w-5 h-5 text-green-600" />
            ) : (
              <Unlock className="w-5 h-5 text-red-600" />
            )}
          </div>
          <span className="font-medium text-gray-900">{currentDevice.friendly_name}</span>
        </div>
        
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isLocked ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isLocked ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </div>
  );
};

export default MinimalLockControl;