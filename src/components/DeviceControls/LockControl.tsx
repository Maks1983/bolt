import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { LockDevice } from '../../types/devices';
import { useDevices } from '../../context/DeviceContext';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';

interface LockControlProps {
  device: LockDevice; 
}

const LockControl: React.FC<LockControlProps> = ({ device }) => {
  const { controlLock } = useDevices();
  const currentDevice = useRealtimeDevice(device.entity_id) as LockDevice || device;

  const isLocked = currentDevice.state === 'locked';

  const handleToggle = () => {
    const action = isLocked ? 'unlock' : 'lock';
    controlLock(currentDevice.entity_id, action);
  };

  return (
    <div className="flex items-center justify-center gap-4 text-white/80 text-sm font-medium">
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
  );
};

export default LockControl;
