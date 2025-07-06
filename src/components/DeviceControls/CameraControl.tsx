import React from 'react';
import { Camera, Play, Square, RotateCcw } from 'lucide-react';
import { CameraDevice } from '../../types/devices';
import { useDevices } from '../../context/DeviceContext';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import DeviceTimestamp from './DeviceTimestamp';

interface CameraControlProps {
  device: CameraDevice;
}

const CameraControl: React.FC<CameraControlProps> = ({ device }) => {
  const { controlCamera } = useDevices();

  // Use real-time device state instead of prop
  const currentDevice = useRealtimeDevice(device.entity_id) as CameraDevice || device;

  const handleStartRecording = () => {
    controlCamera(currentDevice.entity_id, 'record');
  };

  const handleStopRecording = () => {
    controlCamera(currentDevice.entity_id, 'stop');
  };

  const handleSnapshot = () => {
    controlCamera(currentDevice.entity_id, 'snapshot');
  };

  const isRecording = currentDevice.state === 'recording';
  const isIdle = currentDevice.state === 'idle';

  // Debug logging
  console.log(`📹 CameraControl render: ${currentDevice.entity_id} state=${currentDevice.state}`);

  return (
    <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-gray-600" />
          <h4 className="font-semibold text-gray-900">{currentDevice.friendly_name}</h4>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isRecording 
            ? 'bg-red-100 text-red-700' 
            : isIdle 
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {currentDevice.state || 'Unknown'}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              <Play className="w-4 h-4" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              <Square className="w-4 h-4" />
              <span>Stop Recording</span>
            </button>
          )}
          
          <button
            onClick={handleSnapshot}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Snapshot</span>
          </button>
        </div>

        {currentDevice.stream_url && (
          <div className="mt-4">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={currentDevice.stream_url} 
                alt="Camera feed"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Device Timestamp */}
      <DeviceTimestamp device={currentDevice} />
    </div>
  );
};

export default CameraControl;