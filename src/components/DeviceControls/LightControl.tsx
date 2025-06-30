import React from 'react';
import { Lightbulb, Sun } from 'lucide-react';
import { LightDevice } from '../../types/devices';
import { useDevices } from '../../context/DeviceContext';

interface LightControlProps {
  device: LightDevice;
}

const LightControl: React.FC<LightControlProps> = ({ device }) => {
  const { controlLight } = useDevices();

  const handleToggle = () => {
    controlLight(device.entity_id, device.state === 'off');
  };

  const handleBrightnessChange = (brightness: number) => {
    controlLight(device.entity_id, true, brightness);
  };

  const handleColorChange = (color: string) => {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    controlLight(device.entity_id, true, device.brightness, [r, g, b]);
  };

  const rgbToHex = (rgb?: [number, number, number]): string => {
    if (!rgb) return '#ffffff';
    const [r, g, b] = rgb;
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const isOn = device.state === 'on';
  const hasColorSupport = device.supported_color_modes?.includes('rgb') || device.supported_color_modes?.includes('xy');

  return (
    <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: isOn ? (device.rgb_color ? rgbToHex(device.rgb_color) : '#ffffff') : '#e5e7eb' }}
          ></div>
          <h4 className="font-semibold text-gray-900">{device.friendly_name}</h4>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isOn ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
      
      {isOn && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Brightness</span>
              <span className="text-sm text-gray-500">{Math.round((device.brightness || 0) / 255 * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={device.brightness || 0}
              onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          {hasColorSupport && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Color</span>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={rgbToHex(device.rgb_color)}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-gray-300 cursor-pointer"
                />
                <button
                  onClick={() => handleColorChange('#ffffff')}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Sun className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LightControl;