import React, { useState } from 'react';
import { Camera, Eye, EyeOff, AlertTriangle, User, Car, Baby, Flame, Volume2, Moon, Sun, Bell } from 'lucide-react';
import { CameraDevice } from '../../types/devices';
import { useRealtimeDevice, useRoomDevices } from '../../hooks/useDeviceUpdates';
import DeviceTimestamp from './DeviceTimestamp';

interface CameraControlProps {
  device: CameraDevice;
}

const CameraControl: React.FC<CameraControlProps> = ({ device }) => {
  const [showFeed, setShowFeed] = useState(false);
  const [feedError, setFeedError] = useState(false);

  // Use real-time device state
  const currentDevice = useRealtimeDevice(device.entity_id) as CameraDevice || device;
  
  // Get all devices in the same room to find detection sensors
  const roomDevices = useRoomDevices(currentDevice.room);
  
  // Filter detection sensors for this camera
  const detectionSensors = roomDevices.binarySensors.filter(sensor => 
    (sensor as any).camera_entity === currentDevice.entity_id
  );

  // Group detection sensors by type
  const detectionsByType = detectionSensors.reduce((acc, sensor) => {
    const detectionType = (sensor as any).detection_type || 'unknown';
    acc[detectionType] = sensor;
    return acc;
  }, {} as Record<string, any>);

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case 'person': return User;
      case 'animal': return '🐾';
      case 'vehicle': return Car;
      case 'motion': return '👋';
      case 'doorbell': return Bell;
      case 'baby_cry': return Baby;
      case 'speaking': return Volume2;
      case 'smoke_alarm': return Flame;
      case 'co_alarm': return AlertTriangle;
      case 'night_mode': return Moon;
      default: return AlertTriangle;
    }
  };

  const getDetectionColor = (sensor: any) => {
    if (!sensor) return 'text-gray-400';
    return sensor.state === 'on' ? 'text-red-500' : 'text-green-500';
  };

  const getDetectionLabel = (type: string) => {
    switch (type) {
      case 'person': return 'Person';
      case 'animal': return 'Animal';
      case 'vehicle': return 'Vehicle';
      case 'motion': return 'Motion';
      case 'doorbell': return 'Doorbell';
      case 'baby_cry': return 'Baby Cry';
      case 'speaking': return 'Speaking';
      case 'smoke_alarm': return 'Smoke';
      case 'co_alarm': return 'CO Alarm';
      case 'night_mode': return 'Night Mode';
      default: return type.replace('_', ' ');
    }
  };

  const handleFeedToggle = () => {
    setShowFeed(!showFeed);
    setFeedError(false);
  };

  const handleFeedError = () => {
    setFeedError(true);
  };

  const isRecording = currentDevice.state === 'recording';
  const isStreaming = currentDevice.state === 'streaming';

  return (
    <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
      {/* Camera Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isRecording ? 'bg-red-100' : isStreaming ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Camera className={`w-5 h-5 ${isRecording ? 'text-red-600' : isStreaming ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{currentDevice.friendly_name}</h4>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : isStreaming ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600 capitalize">{currentDevice.state}</span>
              {detectionsByType.night_mode?.state === 'on' && (
                <Moon className="w-4 h-4 text-purple-500" />
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleFeedToggle}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            showFeed 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {showFeed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="text-sm font-medium">{showFeed ? 'Hide' : 'View'}</span>
        </button>
      </div>

      {/* Camera Feed */}
      {showFeed && (
        <div className="mb-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {!feedError ? (
              <img
                src={currentDevice.entity_picture || `https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800`}
                alt={`${currentDevice.friendly_name} feed`}
                className="w-full h-full object-cover"
                onError={handleFeedError}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Camera feed unavailable</p>
                  <p className="text-xs text-gray-400 mt-1">Check Home Assistant connection</p>
                </div>
              </div>
            )}
            
            {/* Live indicator */}
            {!feedError && (
              <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/70 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-medium">LIVE</span>
              </div>
            )}
            
            {/* Night mode indicator */}
            {detectionsByType.night_mode?.state === 'on' && (
              <div className="absolute top-3 right-3 bg-purple-500/80 rounded-full p-2">
                <Moon className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Detection Status */}
      {detectionSensors.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700 mb-3">AI Detection Status</h5>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(detectionsByType).map(([type, sensor]) => {
              const IconComponent = getDetectionIcon(type);
              const isActive = sensor.state === 'on';
              
              return (
                <div
                  key={type}
                  className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${
                    isActive 
                      ? 'bg-red-50 border-red-200 text-red-700' 
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {typeof IconComponent === 'string' ? (
                    <span className="text-sm">{IconComponent}</span>
                  ) : (
                    <IconComponent className="w-4 h-4" />
                  )}
                  <div className="flex-1">
                    <div className="text-xs font-medium">{getDetectionLabel(type)}</div>
                    <div className="text-xs opacity-75">
                      {isActive ? 'Detected' : 'Clear'}
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Camera Features */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-4">
          {currentDevice.motion_detection && (
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Motion Detection</span>
            </div>
          )}
          {currentDevice.night_vision && (
            <div className="flex items-center space-x-1">
              {detectionsByType.night_mode?.state === 'on' ? (
                <Moon className="w-4 h-4 text-purple-500" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-500" />
              )}
              <span>Night Vision</span>
            </div>
          )}
        </div>
        
        {/* Active detections count */}
        {detectionSensors.length > 0 && (
          <div className="text-xs">
            {detectionSensors.filter(s => s.state === 'on').length} active detections
          </div>
        )}
      </div>

      {/* Device Timestamp */}
      <DeviceTimestamp device={currentDevice} />
    </div>
  );
};

export default CameraControl;