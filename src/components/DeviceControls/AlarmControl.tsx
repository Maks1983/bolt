import React, { useState } from 'react';
import { Shield, Lock, Home, Plane, AlertTriangle, Clock } from 'lucide-react';
import { AlarmControlPanelDevice } from '../../types/devices';
import { useDevices } from '../../context/DeviceContext';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import DeviceTimestamp from './DeviceTimestamp';

interface AlarmControlProps {
  device: AlarmControlPanelDevice;
}

const AlarmControl: React.FC<AlarmControlProps> = ({ device }) => {
  const { controlAlarm } = useDevices();
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [entryDelay, setEntryDelay] = useState(0);

  // Use real-time device state instead of prop
  const currentDevice = useRealtimeDevice(device.entity_id) as AlarmControlPanelDevice || device;

  const handleNumberClick = (num: string) => {
    if (code.length < 6) {
      setCode(code + num);
    }
  };

  const handleBackspace = () => {
    setCode(code.slice(0, -1));
  };

  const handleClear = () => {
    setCode('');
  };

  const handleAction = (action: 'arm_home' | 'arm_away' | 'disarm' | 'panic') => {
    if (action === 'panic') {
      // Panic doesn't require code
      controlAlarm(currentDevice.entity_id, 'arm_away', '9999'); // Special panic code
      return;
    }

    if (!code && currentDevice.code_format) {
      alert('Please enter your alarm code');
      return;
    }

    controlAlarm(currentDevice.entity_id, action, code);
    setCode('');
    
    // Simulate entry/exit delay for demo
    if (action !== 'disarm') {
      setEntryDelay(30);
      const timer = setInterval(() => {
        setEntryDelay(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const getStatusColor = () => {
    switch (currentDevice.state) {
      case 'disarmed':
        return 'glass-card text-green-400';
      case 'armed_home':
        return 'glass-card text-blue-400';
      case 'armed_away':
        return 'glass-card text-orange-400';
      case 'pending':
        return 'glass-card text-yellow-400';
      case 'triggered':
        return 'glass-card-strong text-red-400';
      default:
        return 'glass-card';
    }
  };

  const getStatusIcon = () => {
    switch (currentDevice.state) {
      case 'disarmed':
        return <Shield className="w-6 h-6 text-green-600" />;
      case 'armed_home':
        return <Home className="w-6 h-6 text-blue-600" />;
      case 'armed_away':
        return <Plane className="w-6 h-6 text-orange-600" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'triggered':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default:
        return <Shield className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (currentDevice.state) {
      case 'disarmed':
        return 'System Disarmed';
      case 'armed_home':
        return 'Armed Home';
      case 'armed_away':
        return 'Armed Away';
      case 'pending':
        return 'Pending';
      case 'triggered':
        return 'ALARM TRIGGERED';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className="device-control rounded-2xl p-6">
      {/* Status Display */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>{getStatusText()}</span>
        </div>
        
        {entryDelay > 0 && (
          <div className="mt-4 p-3 glass-card-strong rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Entry/Exit Delay: {entryDelay}s
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Code Input */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>
            Enter Security Code
          </label>
          <div className="flex justify-center">
            <div className="glass-card rounded-lg px-4 py-3 min-w-[200px] text-center">
              <span className="text-2xl font-mono tracking-wider text-white">
                {showCode ? code : '•'.repeat(code.length)}
                {code.length === 0 && <span className="text-gray-400">----</span>}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowCode(!showCode)}
            className="mt-2 text-sm seamless-button px-3 py-1 rounded-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {showCode ? 'Hide' : 'Show'} Code
          </button>
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="glass-card rounded-lg py-4 text-xl font-semibold text-white hover:glass-card-strong transition-colors"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="glass-card rounded-lg py-4 text-sm font-semibold text-white hover:glass-card-strong transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Clear
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="glass-card rounded-lg py-4 text-xl font-semibold text-white hover:glass-card-strong transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="glass-card rounded-lg py-4 text-sm font-semibold text-white hover:glass-card-strong transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            ⌫
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAction('arm_home')}
          className="seamless-button-primary flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <Home className="w-5 h-5" />
          <span>Arm Home</span>
        </button>
        
        <button
          onClick={() => handleAction('arm_away')}
          className="seamless-button-primary flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <Plane className="w-5 h-5" />
          <span>Arm Away</span>
        </button>
        
        <button
          onClick={() => handleAction('disarm')}
          className="seamless-button-primary flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <Shield className="w-5 h-5" />
          <span>Disarm</span>
        </button>
        
        <button
          onClick={() => handleAction('panic')}
          className="seamless-button flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold text-red-400 hover:text-red-300"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <AlertTriangle className="w-5 h-5" />
          <span>Panic</span>
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>
        <p>Last changed by: {currentDevice.changed_by || 'System'}</p>
      </div>

      {/* Device Timestamp */}
      <DeviceTimestamp device={currentDevice} />
    </div>
  );
};

export default AlarmControl;