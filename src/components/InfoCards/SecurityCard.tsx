import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface SecurityCardProps {
  onClick?: () => void;
}

const SecurityCard: React.FC<SecurityCardProps> = ({ onClick }) => {
  const { state } = useDevices();

  // Get all locks and security sensors
  const locks = state.devices.filter(device => device.device_type === 'lock');
  const securitySensors = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && 
    ((device as any).sensor_type === 'door' || (device as any).sensor_type === 'window')
  );

  const lockedCount = locks.filter(lock => lock.state === 'locked').length;
  const totalLocks = locks.length;
  const openSensors = securitySensors.filter(sensor => sensor.state === 'on').length;

  const isSecure = lockedCount === totalLocks && openSensors === 0 && totalLocks > 0;

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer min-w-[120px]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className={`p-3 rounded-full ${isSecure ? 'bg-green-500/20' : 'bg-red-500/20'} shadow-lg`}>
          {isSecure ? (
            <Lock className="w-6 h-6 text-green-600" />
          ) : (
            <Unlock className="w-6 h-6 text-red-600" />
          )}
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Security</div>
          <div className={`text-xs font-medium ${isSecure ? 'text-green-600' : 'text-red-600'}`}>
            {totalLocks === 0 ? 'No Locks' : isSecure ? 'Secure' : 'Unsecured'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCard;