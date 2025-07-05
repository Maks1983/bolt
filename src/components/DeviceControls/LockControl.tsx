import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { LockDevice } from '../../types/devices';
import { useDevices } from '../../context/DeviceContext';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import DeviceTimestamp from './DeviceTimestamp';

interface LockControlProps {
  device: LockDevice;
  variant?: 'card' | 'icon';
}

const LockControl: React.FC<LockControlProps> = ({ device, variant = 'card' }) => {
  const { controlLock } = useDevices();
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  const currentDevice = useRealtimeDevice(device.entity_id) as LockDevice || device;
  const isLocked = currentDevice.state === 'locked';

  const handleToggle = () => {
    if (currentDevice.code_format && !code) {
      setShowCodeInput(true);
      return;
    }

    const action = isLocked ? 'unlock' : 'lock';
    controlLock(currentDevice.entity_id, action, code || undefined);
    setCode('');
    setShowCodeInput(false);
  };

  if (variant === 'icon') {
    return (
      <div className="flex flex-col items-center gap-2 text-white/80 text-sm font-medium">
        <div className="flex items-center justify-center gap-4">
          <div className="text-right">
            <div className="text-base font-semibold text-white">Doorlock</div>
            <div>{isLocked ? 'Locked' : 'Unlocked'}</div>
          </div>
          <button
            onClick={handleToggle}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 shadow transition-all cursor-pointer"
            aria-label={isLocked ? 'Unlock' : 'Lock'}
          >
            {isLocked ? (
              <Lock className="w-6 h-6 text-green-600" />
            ) : (
              <Unlock className="w-6 h-6 text-red-600" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // Default: full card variant
  return (
    <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {isLocked ? (
            <Lock className="w-6 h-6 text-green-600" />
          ) : (
            <Unlock className="w-6 h-6 text-red-600" />
          )}
          <div>
            <h4 className="font-semibold text-gray-900">{currentDevice.friendly_name}</h4>
            <p className="text-sm text-gray-600">{isLocked ? 'Locked' : 'Unlocked'}</p>
          </div>
        </div>

        <div className="ml-6">
          <button
            onClick={handleToggle}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLocked ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isLocked ? 'Unlock' : 'Lock'}
          </button>
        </div>
      </div>

      <DeviceTimestamp device={currentDevice} />
    </div>
  );
};

export default LockControl;
