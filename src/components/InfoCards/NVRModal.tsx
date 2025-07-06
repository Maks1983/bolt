import React, { useState } from 'react';
import { 
  Camera, 
  X,
  Grid3X3,
  Maximize2,
  AlertTriangle,
  User,
  Car,
  Volume2,
  Moon,
  Bell
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface NVRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NVRModal: React.FC<NVRModalProps> = ({ isOpen, onClose }) => {
  const { state } = useDevices();
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [nvrView, setNvrView] = useState<'grid' | 'single'>('grid');

  // Get real camera entities from Home Assistant
  const realCameras = state.devices.filter(device => device.device_type === 'camera');
  
  // Get detection sensors for all cameras
  const detectionSensors = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && 
    (device as any).camera_entity
  );

  // Group detection sensors by camera
  const detectionsByCamera = detectionSensors.reduce((acc, sensor) => {
    const cameraEntity = (sensor as any).camera_entity;
    if (!acc[cameraEntity]) acc[cameraEntity] = [];
    acc[cameraEntity].push(sensor);
    return acc;
  }, {} as Record<string, any[]>);

  // Get active detections count
  const activeDetections = detectionSensors.filter(sensor => sensor.state === 'on').length;
  const totalCameras = realCameras.length;
  const recordingCameras = realCameras.filter(camera => camera.state === 'recording').length;

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case 'person': return User;
      case 'animal': return '🐾';
      case 'vehicle': return Car;
      case 'motion': return '👋';
      case 'doorbell': return Bell;
      case 'baby_cry': return '👶';
      case 'speaking': return Volume2;
      case 'smoke_alarm': return '🔥';
      case 'co_alarm': return AlertTriangle;
      case 'night_mode': return Moon;
      default: return AlertTriangle;
    }
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

  const handleCameraSelect = (cameraId: string) => {
    setSelectedCamera(cameraId);
    setNvrView('single');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-7xl h-[90vh] overflow-hidden shadow-2xl border border-gray-700">
        {/* NVR Header */}
        <div className="p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Security Camera System</h2>
                <p className="text-gray-400">
                  {recordingCameras} of {totalCameras} cameras recording • {activeDetections} active detections
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setNvrView('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    nvrView === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setNvrView('single')}
                  className={`p-2 rounded-md transition-colors ${
                    nvrView === 'single' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={onClose}
                className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
        
        {/* NVR Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Camera List Sidebar */}
          <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Cameras ({totalCameras})</h3>
              
              <div className="space-y-3">
                {realCameras.map((camera) => {
                  const cameraDetections = detectionsByCamera[camera.entity_id] || [];
                  const activeDetectionsForCamera = cameraDetections.filter(d => d.state === 'on');
                  const isSelected = selectedCamera === camera.entity_id;
                  
                  return (
                    <div
                      key={camera.entity_id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-500' 
                          : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                      }`}
                      onClick={() => handleCameraSelect(camera.entity_id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Camera className="w-4 h-4 text-white" />
                          <span className="text-white font-medium">{camera.friendly_name}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          camera.state === 'recording' ? 'bg-red-500' : 
                          camera.state === 'streaming' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      
                      <div className="text-xs text-gray-300 mb-2">
                        Status: <span className="capitalize">{camera.state}</span>
                      </div>
                      
                      {/* Active Detections */}
                      {activeDetectionsForCamera.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {activeDetectionsForCamera.slice(0, 3).map((detection) => {
                            const detectionType = (detection as any).detection_type;
                            const IconComponent = getDetectionIcon(detectionType);
                            
                            return (
                              <div
                                key={detection.entity_id}
                                className="flex items-center space-x-1 bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs"
                              >
                                {typeof IconComponent === 'string' ? (
                                  <span>{IconComponent}</span>
                                ) : (
                                  <IconComponent className="w-3 h-3" />
                                )}
                                <span>{getDetectionLabel(detectionType)}</span>
                              </div>
                            );
                          })}
                          {activeDetectionsForCamera.length > 3 && (
                            <div className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">
                              +{activeDetectionsForCamera.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Camera Feed Area */}
          <div className="flex-1 bg-black">
            {nvrView === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-2 gap-2 p-4 h-full">
                {realCameras.map((camera) => (
                  <div
                    key={camera.entity_id}
                    className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    onClick={() => handleCameraSelect(camera.entity_id)}
                  >
                    <div className="aspect-video bg-gray-900 flex items-center justify-center">
                      <img
                        src={camera.entity_picture || `https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800`}
                        alt={`${camera.friendly_name} feed`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden flex-col items-center text-gray-400">
                        <Camera className="w-12 h-12 mb-2" />
                        <p className="text-sm">Feed Unavailable</p>
                      </div>
                    </div>
                    
                    {/* Camera Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium text-sm">{camera.friendly_name}</h4>
                            <p className="text-gray-300 text-xs capitalize">{camera.state}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${
                              camera.state === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                            }`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Single View */
              <div className="h-full flex flex-col">
                {selectedCamera && (
                  <>
                    {(() => {
                      const camera = realCameras.find(c => c.entity_id === selectedCamera);
                      if (!camera) return null;
                      
                      return (
                        <>
                          <div className="flex-1 flex items-center justify-center p-4">
                            <div className="relative w-full max-w-4xl">
                              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                                <img
                                  src={camera.entity_picture || `https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800`}
                                  alt={`${camera.friendly_name} feed`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                                <div className="hidden flex-col items-center justify-center h-full text-gray-400">
                                  <Camera className="w-16 h-16 mb-4" />
                                  <p>Camera feed unavailable</p>
                                </div>
                              </div>
                              
                              {/* Live indicator */}
                              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/70 rounded-full px-3 py-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-white text-sm font-medium">LIVE</span>
                              </div>
                              
                              {/* Camera info */}
                              <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-4">
                                <h3 className="text-white text-xl font-semibold mb-2">{camera.friendly_name}</h3>
                                <div className="flex items-center justify-between">
                                  <div className="text-gray-300 text-sm">
                                    Status: <span className="capitalize">{camera.state}</span>
                                  </div>
                                  <div className="text-gray-300 text-sm">
                                    {new Date().toLocaleTimeString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Detection Panel */}
                          {detectionsByCamera[selectedCamera] && (
                            <div className="bg-gray-800 border-t border-gray-700 p-4">
                              <h4 className="text-white font-medium mb-3">AI Detection Status</h4>
                              <div className="grid grid-cols-4 gap-3">
                                {detectionsByCamera[selectedCamera].map((detection) => {
                                  const detectionType = (detection as any).detection_type;
                                  const IconComponent = getDetectionIcon(detectionType);
                                  const isActive = detection.state === 'on';
                                  
                                  return (
                                    <div
                                      key={detection.entity_id}
                                      className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                                        isActive 
                                          ? 'bg-red-500/20 border-red-500/50 text-red-300' 
                                          : 'bg-gray-700 border-gray-600 text-gray-400'
                                      }`}
                                    >
                                      {typeof IconComponent === 'string' ? (
                                        <span className="text-lg">{IconComponent}</span>
                                      ) : (
                                        <IconComponent className="w-5 h-5" />
                                      )}
                                      <div>
                                        <div className="text-sm font-medium">{getDetectionLabel(detectionType)}</div>
                                        <div className="text-xs opacity-75">
                                          {isActive ? 'Detected' : 'Clear'}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NVRModal;