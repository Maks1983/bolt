import React from 'react';
import { Lock, Unlock, AlertTriangle } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

const SecurityCard: React.FC = () => {
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
  const totalSensors = securitySensors.length;

  const getSecurityStatus = () => {
    if (totalLocks === 0) return { status: 'No Locks', color: 'gray' };
    if (lockedCount === totalLocks && openSensors === 0) {
      return { status: 'Secure', color: 'green' };
    } else if (lockedCount === totalLocks && openSensors > 0) {
      return { status: 'Locked, Open Windows', color: 'yellow' };
    } else {
      return { status: 'Unsecured', color: 'red' };
    }
  };

  const securityStatus = getSecurityStatus();

  return (
    <div className={`bg-gradient-to-br from-${securityStatus.color}-50 to-${securityStatus.color}-100 rounded-2xl p-4 border border-${securityStatus.color}-200/50 shadow-sm hover:shadow-md transition-all min-w-[200px]`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 bg-${securityStatus.color}-600 rounded-lg`}>
            {securityStatus.color === 'green' ? (
              <Lock className="w-4 h-4 text-white" />
            ) : securityStatus.color === 'red' ? (
              <Unlock className="w-4 h-4 text-white" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-white" />
            )}
          </div>
          <span className="font-semibold text-gray-900">Security</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 bg-${securityStatus.color}-500 rounded-full`}></div>
          <span className={`text-xs text-${securityStatus.color}-600 font-medium`}>{securityStatus.status}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Locks</span>
          <span className="font-medium text-gray-900">{lockedCount}/{totalLocks} locked</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Openings</span>
          <span className="font-medium text-gray-900">{openSensors}/{totalSensors} open</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityCard;