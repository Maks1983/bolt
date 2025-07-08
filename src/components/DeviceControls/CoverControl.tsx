import React from 'react';
import { ChevronUp, ChevronDown, Square, RotateCcw } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface CoverControlProps {
  deviceId: string;
  roomName?: string;
}

const CoverControl: React.FC<CoverControlProps> = ({ deviceId, roomName }) => {
  const { state, dispatch } = useDevices();
  
  // Find the cover device
  const device = state.devices.find(d => d.entity_id === deviceId);
  
  if (!device || device.device_class !== 'cover') {
    return null;
  }

  const position = device.attributes?.current_position || 0;
  const isOpening = device.state === 'opening';
  const isClosing = device.state === 'closing';
  const isMoving = isOpening || isClosing;

  const handleAction = (action: 'open' | 'close' | 'stop' | 'set_position', position?: number) => {
    let newState = device.state;
    let newAttributes = { ...device.attributes };

    switch (action) {
      case 'open':
        newState = 'opening';
        // Simulate opening over time
        setTimeout(() => {
          dispatch({
            type: 'UPDATE_DEVICE',
            payload: {
              entity_id: deviceId,
              state: 'open',
              attributes: { ...newAttributes, current_position: 100 },
              last_updated: new Date().toISOString()
            }
          });
        }, 2000);
        break;
      case 'close':
        newState = 'closing';
        // Simulate closing over time
        setTimeout(() => {
          dispatch({
            type: 'UPDATE_DEVICE',
            payload: {
              entity_id: deviceId,
              state: 'closed',
              attributes: { ...newAttributes, current_position: 0 },
              last_updated: new Date().toISOString()
            }
          });
        }, 2000);
        break;
      case 'stop':
        newState = 'stopped';
        break;
      case 'set_position':
        if (position !== undefined) {
          newState = position > (device.attributes?.current_position || 0) ? 'opening' : 'closing';
          newAttributes.current_position = position;
          // Simulate movement completion
          setTimeout(() => {
            dispatch({
              type: 'UPDATE_DEVICE',
              payload: {
                entity_id: deviceId,
                state: position === 100 ? 'open' : position === 0 ? 'closed' : 'stopped',
                attributes: newAttributes,
                last_updated: new Date().toISOString()
              }
            });
          }, 1000);
        }
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

  const getCoverIcon = () => {
    if (device.attributes?.device_class === 'blind' || device.attributes?.device_class === 'shade') {
      return '🪟';
    } else if (device.attributes?.device_class === 'garage') {
      return '🚪';
    }
    return '📋';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <span className="text-lg">{getCoverIcon()}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{device.friendly_name}</h3>
            {roomName && <p className="text-sm text-gray-500">{roomName}</p>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">{position}%</div>
          <div className="text-xs text-gray-500 capitalize">{device.state}</div>
        </div>
      </div>

      {/* Position Slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Position</label>
          <span className="text-sm text-gray-500">{position}% Open</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) => handleAction('set_position', parseInt(e.target.value))}
          disabled={isMoving}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50"
        />
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => handleAction('open')}
          disabled={isMoving || position === 100}
          className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronUp className="w-4 h-4" />
          <span className="text-sm font-medium">Open</span>
        </button>
        
        <button
          onClick={() => handleAction('stop')}
          disabled={!isMoving}
          className="flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Square className="w-4 h-4" />
          <span className="text-sm font-medium">Stop</span>
        </button>
        
        <button
          onClick={() => handleAction('close')}
          disabled={isMoving || position === 0}
          className="flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
          <span className="text-sm font-medium">Close</span>
        </button>
      </div>

      {/* Quick Position Buttons */}
      <div className="grid grid-cols-4 gap-1 mb-4">
        {[0, 25, 50, 75, 100].map((pos) => (
          <button
            key={pos}
            onClick={() => handleAction('set_position', pos)}
            disabled={isMoving || position === pos}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              position === pos
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {pos}%
          </button>
        ))}
      </div>

      {/* Status and Animation */}
      {isMoving && (
        <div className="flex items-center justify-center space-x-2 py-2 bg-blue-50 rounded-lg mb-4">
          <RotateCcw className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-sm text-blue-700 font-medium">
            {isOpening ? 'Opening...' : 'Closing...'}
          </span>
        </div>
      )}

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Type: {device.attributes?.device_class || 'Cover'}</span>
          <span>Updated: {new Date(device.last_updated).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CoverControl;