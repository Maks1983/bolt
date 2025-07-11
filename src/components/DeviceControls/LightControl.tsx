import React from 'react';
import { Lightbulb, Sun } from 'lucide-react';
import { LightDevice } from '../../types/devices';
import { useDevices } from '../../context/DeviceContext';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import DeviceTimestamp from './DeviceTimestamp';

interface LightControlProps {
  device: LightDevice;
}

const LightControl: React.FC<LightControlProps> = ({ device }) => {
  const { controlLight } = useDevices();
  
  // Use real-time device state instead of prop - THIS IS CRITICAL!
  const currentDevice = useRealtimeDevice(device.entity_id) as LightDevice || device;

  const handleToggle = () => {
    console.log('💡 Light toggle clicked:', currentDevice.entity_id, 'Current state:', currentDevice.state);
    controlLight(currentDevice.entity_id, currentDevice.state === 'off');
  };

  const handleBrightnessChange = (brightness: number) => {
    controlLight(currentDevice.entity_id, true, brightness);
  };

  const handleColorChange = (color: string) => {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    controlLight(currentDevice.entity_id, true, currentDevice.brightness, [r, g, b]);
  };

  const rgbToHex = (rgb?: [number, number, number]): string => {
    if (!rgb) return '#ffffff';
    const [r, g, b] = rgb;
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const isOn = currentDevice.state === 'on';
  const hasColorSupport = currentDevice.supported_color_modes?.includes('rgb') || currentDevice.supported_color_modes?.includes('xy');

  // Debug logging - CRITICAL FOR DEBUGGING
  console.log(`💡 LightControl render: ${currentDevice.entity_id} state=${currentDevice.state} isOn=${isOn} brightness=${currentDevice.brightness}`);

  return (
    <div className="device-control rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: isOn ? (currentDevice.rgb_color ? rgbToHex(currentDevice.rgb_color) : '#ffffff') : '#e5e7eb' }}
          ></div>
          <h4 className="font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{currentDevice.friendly_name}</h4>
        </div>
        <button
          onClick={handleToggle}
          className={`seamless-toggle relative inline-flex h-6 w-11 items-center rounded-full ${
            isOn ? 'active' : ''
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
              <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Brightness</span>
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Poppins, sans-serif' }}>{Math.round((currentDevice.brightness || 0) / 255 * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={currentDevice.brightness || 0}
              onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
              className="seamless-slider w-full cursor-pointer"
            />
          </div>
          
          {hasColorSupport && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>Color</span>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={rgbToHex(currentDevice.rgb_color)}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer"
                />
                <button
                  onClick={() => handleColorChange('#ffffff')}
                  className="seamless-button p-2 rounded-lg"
                >
                  <Sun className="w-4 h-4 text-yellow-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Device Timestamp */}
      <DeviceTimestamp device={currentDevice} />
    </div>
  );
};

export default LightControl;