import React from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { MediaPlayerDevice } from '../../types/devices';
import { useDevices } from '../../context/DeviceContext';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import DeviceTimestamp from './DeviceTimestamp';

interface MediaPlayerControlProps {
  device: MediaPlayerDevice;
}

const MediaPlayerControl: React.FC<MediaPlayerControlProps> = ({ device }) => {
  const { controlMediaPlayer } = useDevices();

  // Use real-time device state instead of prop
  const currentDevice = useRealtimeDevice(device.entity_id) as MediaPlayerDevice || device;

  const handlePlayPause = () => {
    const action = currentDevice.state === 'playing' ? 'pause' : 'play';
    controlMediaPlayer(currentDevice.entity_id, action);
  };

  const handleVolumeChange = (volume: number) => {
    controlMediaPlayer(currentDevice.entity_id, 'volume', volume / 100);
  };

  const isPlaying = currentDevice.state === 'playing';
  const volumePercentage = Math.round((currentDevice.volume_level || 0) * 100);

  // Debug logging
  console.log(`🎵 MediaPlayerControl render: ${currentDevice.entity_id} state=${currentDevice.state} isPlaying=${isPlaying}`);

  return (
    <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-gray-900">Now Playing</h4>
          <p className="text-sm text-gray-600">{currentDevice.media_title || 'No media'}</p>
          <p className="text-xs text-gray-500 mt-1">Source: {currentDevice.source || 'Unknown'}</p>
        </div>
        <button
          onClick={handlePlayPause}
          className={`p-3 rounded-full transition-colors ${
            isPlaying ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Volume</span>
          </div>
          <span className="text-sm text-gray-500">{volumePercentage}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volumePercentage}
          onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Device Timestamp */}
      <DeviceTimestamp device={currentDevice} />
    </div>
  );
};

export default MediaPlayerControl;