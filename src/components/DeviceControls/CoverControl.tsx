import React from 'react';
import { ChevronUp, ChevronDown, Square } from 'lucide-react';

interface CoverControlProps {
  deviceId: string;
  name: string;
  position: number;
  isMoving?: boolean;
  onPositionChange: (deviceId: string, position: number) => void;
}

const CoverControl: React.FC<CoverControlProps> = ({
  deviceId,
  name,
  position,
  isMoving = false,
  onPositionChange
}) => {
  const handleOpen = () => {
    onPositionChange(deviceId, 100);
  };

  const handleClose = () => {
    onPositionChange(deviceId, 0);
  };

  const handleStop = () => {
    // Stop command would be handled by the parent component
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseInt(e.target.value);
    onPositionChange(deviceId, newPosition);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <div className="text-sm text-gray-500">
          {position}% open
        </div>
      </div>

      {/* Position Slider */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={handleSliderChange}
          disabled={isMoving}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleOpen}
          disabled={isMoving || position === 100}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronUp className="w-4 h-4" />
          Open
        </button>
        
        <button
          onClick={handleStop}
          disabled={!isMoving}
          className="flex items-center justify-center p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Square className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleClose}
          disabled={isMoving || position === 0}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
          Close
        </button>
      </div>

      {isMoving && (
        <div className="mt-3 text-center text-sm text-blue-600">
          Moving...
        </div>
      )}
    </div>
  );
};

export default CoverControl;