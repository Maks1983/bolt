import React from 'react';
import { Volume2 } from 'lucide-react';
import { MediaPlayerDevice } from '../../../types/devices';
import { useDevices } from '../../../context/DeviceContext';
import { useRealtimeDevice } from '../../../hooks/useDeviceUpdates';

interface CompactMediaPlayerControlProps {
  device: MediaPlayerDevice;
}

const CompactMediaPlayerControl: React.FC<CompactMediaPlayerControlProps> = ({ device }) => {
  const { controlMediaPlayer } = useDevices();

  // Use real-time device state
  const currentDevice = useRealtimeDevice(device.entity_id) as MediaPlayerDevice || device;

  const handleToggle = () => {
    const action = currentDevice.state === 'playing' ? 'pause' : 'play';
    controlMediaPlayer(currentDevice.entity_id, action);
  };

  const isPlaying = currentDevice.state === 'playing';

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 device-control">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isPlaying ? 'bg-purple-100' : 'bg-gray-100'}`}>
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-purple-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 text-sm">{currentDevice.friendly_name}</h4>
            <p className="text-xs text-gray-500">
              {isPlaying ? 'Playing' : 'Paused'} • {currentDevice.source || 'Unknown'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
            isPlaying ? 'bg-purple-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 toggle-switch-thumb ${
              isPlaying ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default CompactMediaPlayerControl;