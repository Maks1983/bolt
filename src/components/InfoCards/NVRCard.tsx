import React, { useState } from 'react';
import { 
  Camera, 
  HardDrive, 
  X,
  Grid3X3,
  Maximize2,
  AlertTriangle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

// Configuration for go2rtc streams
const BASE_STREAM_URL = "http://10.150.50.10:1984/stream.html?src=";
const CAMERAS = ["Doorbell", "Package", "Backyard"];

interface Camera {
  name: string;
  streamUrl: string;
  status: 'online' | 'offline' | 'recording';
}

interface NVRCardProps {
  onClick: () => void;
}

const NVRCard: React.FC<NVRCardProps> = ({ onClick }) => {
  const { state } = useDevices();
  const [showExpandedView, setShowExpandedView] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [gridView, setGridView] = useState(true);

  // Create camera objects with stream URLs
  const cameras: Camera[] = CAMERAS.map(cameraName => ({
    name: cameraName,
    streamUrl: BASE_STREAM_URL + cameraName,
    status: Math.random() > 0.1 ? 'recording' : 'offline' // Simulate status
  }));

  // Get real camera entities from Home Assistant for additional data
  const realCameras = state.devices.filter(device => device.device_type === 'camera');
  
  // Get detection sensors for all cameras
  const detectionSensors = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && 
    (device as any).camera_entity
  );

  // Get active detections count
  const activeDetections = detectionSensors.filter(sensor => sensor.state === 'on').length;
  const onlineCameras = cameras.filter(camera => camera.status !== 'offline').length;
  const recordingCameras = cameras.filter(camera => camera.status === 'recording').length;

  // Calculate storage usage (mock data)
  const storageUsed = 2.4; // TB
  const storageTotal = 8.0; // TB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  const handleCameraClick = (camera: Camera) => {
    setSelectedCamera(camera);
    setGridView(false);
  };

  const handleBackToGrid = () => {
    setSelectedCamera(null);
    setGridView(true);
  };

  const handleCardClick = () => {
    setShowExpandedView(true);
    onClick();
  };

  const CameraStream: React.FC<{ camera: Camera; isFullscreen?: boolean }> = ({ camera, isFullscreen = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
      <div className={`relative bg-black rounded-lg overflow-hidden ${isFullscreen ? 'aspect-video' : 'aspect-video'}`}>
        {/* Stream iframe */}
        {!hasError ? (
          <iframe
            src={camera.streamUrl}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Stream unavailable</p>
              <p className="text-xs text-gray-400 mt-1">{camera.name}</p>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">Loading stream...</p>
            </div>
          </div>
        )}

        {/* Camera info overlay */}
        <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/70 rounded-full px-3 py-1">
          <div className={`w-2 h-2 rounded-full ${
            camera.status === 'recording' ? 'bg-red-500 animate-pulse' : 
            camera.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
          }`}></div>
          <span className="text-white text-xs font-medium">{camera.name}</span>
        </div>

        {/* Status indicator */}
        <div className="absolute top-3 right-3 bg-black/70 rounded-full px-2 py-1">
          <span className="text-white text-xs font-medium uppercase">
            {camera.status === 'recording' ? 'REC' : camera.status}
          </span>
        </div>

        {/* Click overlay for grid view */}
        {!isFullscreen && (
          <div 
            className="absolute inset-0 bg-transparent hover:bg-black/20 transition-colors cursor-pointer"
            onClick={() => handleCameraClick(camera)}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {/* Main NVR Card */}
      <div 
        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-slate-600 rounded-lg">
              <HardDrive className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">NVR System</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600 font-medium">Online</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Cameras</span>
            <span className="font-medium text-slate-900">{recordingCameras}/{onlineCameras} recording</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Storage</span>
            <span className="font-medium text-slate-900">{storageUsed}TB / {storageTotal}TB</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-slate-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${storagePercentage}%` }}
            ></div>
          </div>
          {activeDetections > 0 && (
            <div className="flex items-center space-x-1 text-xs text-red-600 font-medium">
              <AlertTriangle className="w-3 h-3" />
              <span>{activeDetections} active detections</span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded NVR View Modal */}
      {showExpandedView && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-600 rounded-xl">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Security Camera System</h2>
                    <p className="text-gray-600">{onlineCameras} cameras online • {recordingCameras} recording</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* View Toggle */}
                  <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200">
                    <button
                      onClick={handleBackToGrid}
                      className={`p-2 rounded-md transition-colors ${
                        gridView ? 'bg-slate-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => selectedCamera && setGridView(false)}
                      className={`p-2 rounded-md transition-colors ${
                        !gridView && selectedCamera ? 'bg-slate-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      disabled={!selectedCamera}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setShowExpandedView(false)}
                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(95vh-8rem)] overflow-y-auto">
              {gridView ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cameras.map((camera, index) => (
                    <div key={index} className="space-y-3">
                      <CameraStream camera={camera} />
                      
                      {/* Camera Controls */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">{camera.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{camera.status}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                            <Volume2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                            <RotateCcw className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                            <Settings className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedCamera ? (
                /* Single Camera View */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Stream */}
                    <div className="lg:col-span-3 space-y-4">
                      <CameraStream camera={selectedCamera} isFullscreen={true} />
                      
                      {/* Main Camera Controls */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{selectedCamera.name}</h3>
                          <p className="text-gray-600">Live Stream • {selectedCamera.status}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                            <Volume2 className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Audio</span>
                          </button>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                            <Play className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Record</span>
                          </button>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                            <Maximize2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Fullscreen</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Camera List Sidebar */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">All Cameras</h4>
                      {cameras.map((camera, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedCamera?.name === camera.name 
                              ? 'border-slate-600 bg-slate-50' 
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                          onClick={() => setSelectedCamera(camera)}
                        >
                          <div className="aspect-video bg-black rounded-md mb-2 overflow-hidden">
                            <iframe
                              src={camera.streamUrl}
                              className="w-full h-full border-0 scale-75 origin-top-left"
                              allow="autoplay"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{camera.name}</span>
                            <div className={`w-2 h-2 rounded-full ${
                              camera.status === 'recording' ? 'bg-red-500' : 
                              camera.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>System Online</span>
                  </div>
                  <div>Storage: {storageUsed}TB / {storageTotal}TB ({storagePercentage.toFixed(1)}%)</div>
                  <div>Streams: WebRTC via go2rtc</div>
                </div>
                
                <button 
                  onClick={() => setShowExpandedView(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NVRCard;