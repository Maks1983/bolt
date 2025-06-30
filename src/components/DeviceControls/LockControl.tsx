import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { LockDevice } from '../../types/devices';
import { useDevices } from '../../context/DeviceContext';

interface LockControlProps {
  device: LockDevice;
}

const LockControl: React.FC<LockControlProps> = ({ device }) => {
  const { controlLock } = useDevices();
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleToggle = () => {
    if (device.code_format && !code) {
      setShowCodeInput(true);
      return;
    }

    const action = device.state === 'locked' ? 'unlock' : 'lock';
    controlLock(device.entity_id, action, code || undefined);
    setCode('');
    setShowCodeInput(false);
  };

  const isLocked = device.state === 'locked';

  return (
    <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {isLocked ? 
            <Lock className="w-5 h-5 text-red-600" /> : 
            <Unlock className="w-5 h-5 text-green-600" />
          }
          <div>
            <h4 className="font-semibold text-gray-900">{device.friendly_name}</h4>
            <p className="text-sm text-gray-600">
              {isLocked ? 'Locked' : 'Unlocked'}
            </p>
          </div>
        </div>
      </div>

      {showCodeInput && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Code
          </label>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter unlock code"
          />
        </div>
      )}

      <button
        onClick={handleToggle}
        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
          isLocked 
            ? 'bg-green-500 text-white hover:bg-green-600' 
            : 'bg-red-500 text-white hover:bg-red-600'
        }`}
      >
        {isLocked ? 'Unlock' : 'Lock'}
      </button>

      {showCodeInput && (
        <button
          onClick={() => {
            setShowCodeInput(false);
            setCode('');
          }}
          className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default LockControl;