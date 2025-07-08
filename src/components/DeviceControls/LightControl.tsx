import React from 'react';
import { Lightbulb, Sun, Moon, Palette } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface LightControlProps {
  deviceId: string;
  roomName?: string;
}

const LightControl: React.FC<LightControlProps> = ({ deviceId, roomName }) => {
  const { state, dispatch } = useDevices();
  
  // Find the light device
  const device = state.devices.find(d => d.entity_id === deviceId);
  
  if (!device || device.device_class !== 'light') {
    return null;
  }

  const isOn = device.state === 'on';
  const brightness = device.attributes?.brightness || 0;
  const colorTemp = device.attributes?.color_temp || 2700;
  const rgbColor = device.attributes?.rgb_color || [255, 255, 255];

  const handleToggle = () => {
    dispatch({
      type: 'UPDATE_DEVICE',
      payload: {
        entity_id: deviceId,
        state: isOn ? 'off' : 'on',
        last_updated: new Date().toISOString()
      }
    });
  };

  const handleBrightnessChange = (newBrightness: number) => {
    dispatch({
      type: 'UPDATE_DEVICE',
      payload: {
        entity_id: deviceId,
        state: newBrightness > 0 ? 'on' : 'off',
        attributes: {
          ...device.attributes,
          brightness: newBrightness
        },
        last_updated: new Date().toISOString()
      }
    });
  };

  const handleColorTempChange = (newColorTemp: number) => {
    dispatch({
      type: 'UPDATE_DEVICE',
      payload: {
        entity_id: deviceId,
        attributes: {
          ...device.attributes,
          color_temp: newColorTemp
        },
        last_updated: new Date().toISOString()
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isOn ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{device.friendly_name}</h3>
            {roomName && <p className="text-sm text-gray-500">{roomName}</p>}
          </div>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isOn ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isOn ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isOn && (
        <div className="space-y-4">
          {/* Brightness Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Brightness</label>
              <span className="text-sm text-gray-500">{Math.round((brightness / 255) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={brightness}
              onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Color Temperature Control */}
          {device.attributes?.color_temp !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Color Temperature</label>
                <div className="flex items-center space-x-1">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-500">{colorTemp}K</span>
                  <Moon className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <input
                type="range"
                min="2000"
                max="6500"
                value={colorTemp}
                onChange={(e) => handleColorTempChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-yellow-300 to-blue-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* RGB Color Control */}
          {device.attributes?.rgb_color && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Color</label>
                <Palette className="w-4 h-4 text-gray-500" />
              </div>
              <div 
                className="w-full h-8 rounded-lg border border-gray-200 cursor-pointer"
                style={{ backgroundColor: `rgb(${rgbColor.join(',')})` }}
                onClick={() => {
                  // Color picker functionality could be added here
                }}
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Status: {isOn ? 'On' : 'Off'}</span>
          <span>Updated: {new Date(device.last_updated).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default LightControl;