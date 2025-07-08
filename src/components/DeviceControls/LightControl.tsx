import React from 'react';
import { Lightbulb, Palette } from 'lucide-react';

interface LightControlProps {
  deviceId: string;
  name: string;
  isOn: boolean;
  brightness: number;
  color?: string;
  supportsBrightness?: boolean;
  supportsColor?: boolean;
  onToggle: (deviceId: string, isOn: boolean) => void;
  onBrightnessChange: (deviceId: string, brightness: number) => void;
  onColorChange?: (deviceId: string, color: string) => void;
}

const LightControl: React.FC<LightControlProps> = ({
  deviceId,
  name,
  isOn,
  brightness,
  color = '#ffffff',
  supportsBrightness = true,
  supportsColor = false,
  onToggle,
  onBrightnessChange,
  onColorChange
}) => {
  const handleToggle = () => {
    onToggle(deviceId, !isOn);
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBrightness = parseInt(e.target.value);
    onBrightnessChange(deviceId, newBrightness);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onColorChange) {
      onColorChange(deviceId, e.target.value);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <div className="flex items-center gap-2">
          <Lightbulb 
            className={`w-5 h-5 ${isOn ? 'text-yellow-500' : 'text-gray-400'}`}
            fill={isOn ? 'currentColor' : 'none'}
          />
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
      </div>

      {/* Brightness Control */}
      {supportsBrightness && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-600">Brightness</label>
            <span className="text-sm text-gray-500">{brightness}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={brightness}
            onChange={handleBrightnessChange}
            disabled={!isOn}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50"
          />
        </div>
      )}

      {/* Color Control */}
      {supportsColor && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-600 flex items-center gap-1">
              <Palette className="w-4 h-4" />
              Color
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              disabled={!isOn}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer disabled:opacity-50"
            />
            <div 
              className="flex-1 h-8 rounded border border-gray-300"
              style={{ backgroundColor: isOn ? color : '#f3f4f6' }}
            />
          </div>
        </div>
      )}

      {/* Status */}
      <div className="text-sm text-gray-500 text-center">
        {isOn ? 'On' : 'Off'}
        {isOn && supportsBrightness && ` • ${brightness}% brightness`}
      </div>
    </div>
  );
};

export default LightControl;