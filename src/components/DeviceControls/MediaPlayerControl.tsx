import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface MediaPlayerControlProps {
  deviceId: string;
  name: string;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTrack?: string;
  artist?: string;
  onPlayPause: (deviceId: string) => void;
  onPrevious: (deviceId: string) => void;
  onNext: (deviceId: string) => void;
  onVolumeChange: (deviceId: string, volume: number) => void;
  onMuteToggle: (deviceId: string) => void;
}

const MediaPlayerControl: React.FC<MediaPlayerControlProps> = ({
  deviceId,
  name,
  isPlaying,
  volume,
  isMuted,
  currentTrack = 'No media',
  artist = '',
  onPlayPause,
  onPrevious,
  onNext,
  onVolumeChange,
  onMuteToggle
}) => {
  const handlePlayPause = () => {
    onPlayPause(deviceId);
  };

  const handlePrevious = () => {
    onPrevious(deviceId);
  };

  const handleNext = () => {
    onNext(deviceId);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    onVolumeChange(deviceId, newVolume);
  };

  const handleMuteToggle = () => {
    onMuteToggle(deviceId);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-400'}`} />
      </div>

      {/* Current Track Info */}
      <div className="mb-4 text-center">
        <div className="font-medium text-gray-900 truncate">{currentTrack}</div>
        {artist && <div className="text-sm text-gray-500 truncate">{artist}</div>}
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={handlePrevious}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button
          onClick={handlePlayPause}
          className="p-3 bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>
        
        <button
          onClick={handleNext}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600">Volume</label>
          <span className="text-sm text-gray-500">{isMuted ? 'Muted' : `${volume}%`}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleMuteToggle}
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Status */}
      <div className="mt-3 text-center text-sm text-gray-500">
        {isPlaying ? 'Playing' : 'Paused'}
      </div>
    </div>
  );
};

export default MediaPlayerControl;