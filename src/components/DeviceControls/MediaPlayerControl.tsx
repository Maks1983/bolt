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
    <div className="device-control rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Now Playing</h4>
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>{currentDevice.media_title || 'No media'}</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Poppins, sans-serif' }}>Source: {currentDevice.source || 'Unknown'}</p>
        </div>
        <button
          onClick={handlePlayPause}
          className={`seamless-toggle relative inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
            isPlaying ? 'active' : ''
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
        </button>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Volume</span>
          </div>
          <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Poppins, sans-serif' }}>{volumePercentage}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volumePercentage}
          onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
          className="seamless-slider w-full cursor-pointer"
        />
      </div>

      {/* Device Timestamp */}
      <DeviceTimestamp device={currentDevice} />
    </div>
  );
};

export default MediaPlayerControl;