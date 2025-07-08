import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Tv } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface MediaPlayerControlProps {
  deviceId: string;
  roomName?: string;
}

const MediaPlayerControl: React.FC<MediaPlayerControlProps> = ({ deviceId, roomName }) => {
  const { state, dispatch } = useDevices();
  
  // Find the media player device
  const device = state.devices.find(d => d.entity_id === deviceId);
  
  if (!device || device.device_class !== 'media_player') {
    return null;
  }

  const isPlaying = device.state === 'playing';
  const isPaused = device.state === 'paused';
  const isOff = device.state === 'off';
  const volume = device.attributes?.volume_level || 0.5;
  const isMuted = device.attributes?.is_volume_muted || false;
  const mediaTitle = device.attributes?.media_title || 'No media';
  const mediaArtist = device.attributes?.media_artist || '';
  const mediaAlbum = device.attributes?.media_album_name || '';

  const handleAction = (action: string, value?: number) => {
    let newState = device.state;
    let newAttributes = { ...device.attributes };

    switch (action) {
      case 'play':
        newState = 'playing';
        break;
      case 'pause':
        newState = 'paused';
        break;
      case 'stop':
        newState = 'idle';
        break;
      case 'turn_on':
        newState = 'idle';
        break;
      case 'turn_off':
        newState = 'off';
        break;
      case 'volume_set':
        if (value !== undefined) {
          newAttributes.volume_level = value;
        }
        break;
      case 'volume_mute':
        newAttributes.is_volume_muted = !isMuted;
        break;
      case 'media_next_track':
        // Simulate track change
        newAttributes.media_title = 'Next Track';
        break;
      case 'media_previous_track':
        // Simulate track change
        newAttributes.media_title = 'Previous Track';
        break;
    }

    dispatch({
      type: 'UPDATE_DEVICE',
      payload: {
        entity_id: deviceId,
        state: newState,
        attributes: newAttributes,
        last_updated: new Date().toISOString()
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isOff ? 'bg-gray-100 text-gray-400' : 'bg-purple-100 text-purple-600'}`}>
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{device.friendly_name}</h3>
            {roomName && <p className="text-sm text-gray-500">{roomName}</p>}
          </div>
        </div>
        <button
          onClick={() => handleAction(isOff ? 'turn_on' : 'turn_off')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            !isOff ? 'bg-purple-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              !isOff ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {!isOff && (
        <>
          {/* Media Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900 truncate">{mediaTitle}</div>
            {mediaArtist && (
              <div className="text-xs text-gray-600 truncate">{mediaArtist}</div>
            )}
            {mediaAlbum && (
              <div className="text-xs text-gray-500 truncate">{mediaAlbum}</div>
            )}
            <div className="text-xs text-gray-500 mt-1 capitalize">Status: {device.state}</div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={() => handleAction('media_previous_track')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => handleAction(isPlaying ? 'pause' : 'play')}
              className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            
            <button
              onClick={() => handleAction('media_next_track')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Volume</label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{Math.round(volume * 100)}%</span>
                <button
                  onClick={() => handleAction('volume_mute')}
                  className={`p-1 rounded ${isMuted ? 'text-red-600' : 'text-gray-600'} hover:bg-gray-100`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => handleAction('volume_set', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => handleAction('stop')}
              className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              Stop
            </button>
            <button
              onClick={() => handleAction('volume_set', 0.5)}
              className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              50% Volume
            </button>
          </div>
        </>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Status: {device.state}</span>
          <span>Updated: {new Date(device.last_updated).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayerControl;