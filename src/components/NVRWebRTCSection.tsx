import React, { useState, useCallback } from 'react';
import { Camera, Play, Pause, RotateCcw, Maximize, Wifi, AlertCircle, X } from 'lucide-react';

interface CameraConfig {
  id: string;
  name: string;
  location: string;
}

const cameras: CameraConfig[] = [
  { id: 'backyard', name: 'Backyard', location: 'Rear Garden' },
  { id: 'doorbell', name: 'Doorbell', location: 'Front Entrance' },
  { id: 'package', name: 'Package', location: 'Delivery Area' }
];

const NVRWebRTCSection: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<string>('backyard');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCameraSwitch = useCallback((cameraId: string) => {
    if (cameraId === selectedCamera) return;
    
    setIsLoading(true);
    setHasError(false);
    setSelectedCamera(cameraId);
    
    // Simulate brief loading state for smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [selectedCamera]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe reload by changing key
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const streamUrl = `https://nvr.alfcent.com/stream.html?src=${selectedCamera}&mode=webrtc`;
  const currentCamera = cameras.find(cam => cam.id === selectedCamera);

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Camera Selection UI - Responsive */}
      <div className="mb-4 lg:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Camera Selection</h3>
        
        {/* Mobile: Vertical stack */}
        <div className="flex flex-col sm:hidden space-y-2">
          {cameras.map((camera) => (
            <button
              key={camera.id}
              onClick={() => handleCameraSwitch(camera.id)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                selectedCamera === camera.id
                  ? 'bg-green-50 border-green-500 text-green-700 shadow-md'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50/50'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${
                selectedCamera === camera.id ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Camera className={`w-4 h-4 ${
                  selectedCamera === camera.id ? 'text-green-600' : 'text-gray-500'
                }`} />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-sm">{camera.name}</div>
                <div className="text-xs opacity-75">{camera.location}</div>
              </div>
              {selectedCamera === camera.id && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">LIVE</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Tablet and Desktop: Horizontal layout */}
        <div className="hidden sm:flex flex-wrap gap-2 lg:gap-3">
          {cameras.map((camera) => (
            <button
              key={camera.id}
              onClick={() => handleCameraSwitch(camera.id)}
              className={`flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border-2 transition-all duration-200 flex-1 sm:flex-none ${
                selectedCamera === camera.id
                  ? 'bg-green-50 border-green-500 text-green-700 shadow-md'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50/50'
              }`}
            >
              <div className={`p-1.5 lg:p-2 rounded-lg ${
                selectedCamera === camera.id ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Camera className={`w-3 h-3 lg:w-4 lg:h-4 ${
                  selectedCamera === camera.id ? 'text-green-600' : 'text-gray-500'
                }`} />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm lg:text-base">{camera.name}</div>
                <div className="text-xs opacity-75 hidden lg:block">{camera.location}</div>
              </div>
              {selectedCamera === camera.id && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">LIVE</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* WebRTC Stream Container - Responsive */}
      <div className={`bg-black rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl ${
        isFullscreen 
          ? 'fixed inset-2 sm:inset-4 z-50' 
          : 'aspect-video w-full'
      }`}>
        {/* Stream Header - Responsive */}
        <div className="relative bg-gradient-to-r from-black/80 to-transparent p-2 sm:p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
              <div className="flex items-center space-x-1 lg:space-x-2">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-xs lg:text-sm font-medium">LIVE</span>
              </div>
              <div className="text-white min-w-0 flex-1">
                <div className="font-bold text-sm lg:text-base truncate">{currentCamera?.name}</div>
                <div className="text-xs opacity-75 truncate hidden sm:block">{currentCamera?.location}</div>
              </div>
              <div className="px-1.5 py-0.5 lg:px-2 lg:py-1 bg-green-500/80 rounded text-white text-xs font-medium">
                WebRTC
              </div>
            </div>
            
            <div className="flex items-center space-x-1 lg:space-x-2 ml-2">
              <button
                onClick={handleRefresh}
                className="p-1.5 lg:p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
                title="Refresh Stream"
              >
                <RotateCcw className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-1.5 lg:p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
                title="Toggle Fullscreen"
              >
                <Maximize className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </button>
              {isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-1.5 lg:p-2 bg-red-500/80 rounded-lg hover:bg-red-600/80 transition-colors"
                  title="Exit Fullscreen"
                >
                  <X className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stream Content - Responsive */}
        <div className="relative" style={{ height: isFullscreen ? 'calc(100% - 60px)' : 'calc(100% - 60px)' }}>
          {isLoading && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
              <div className="text-center text-white px-4">
                <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-b-2 border-green-500 mx-auto mb-3 lg:mb-4"></div>
                <div className="text-sm lg:text-lg font-semibold">Connecting to {currentCamera?.name}</div>
                <div className="text-xs lg:text-sm opacity-75">Establishing WebRTC connection...</div>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
              <div className="text-center text-white px-4">
                <AlertCircle className="w-8 h-8 lg:w-12 lg:h-12 text-red-500 mx-auto mb-3 lg:mb-4" />
                <div className="text-sm lg:text-lg font-semibold mb-2">Connection Failed</div>
                <div className="text-xs lg:text-sm opacity-75 mb-3 lg:mb-4">Unable to connect to {currentCamera?.name}</div>
                <button
                  onClick={handleRefresh}
                  className="px-3 py-1.5 lg:px-4 lg:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          )}

          {/* WebRTC Stream Iframe */}
          <iframe
            key={`${selectedCamera}-${Date.now()}`}
            src={streamUrl}
            className="w-full h-full border-0"
            allow="camera; microphone; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-popups"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={`${currentCamera?.name} Live Stream`}
          />

          {/* Connection Status Overlay - Responsive */}
          <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 flex items-center space-x-1 lg:space-x-2 bg-black/70 rounded-lg px-2 py-1 lg:px-3 lg:py-2">
            <Wifi className="w-3 h-3 lg:w-4 lg:h-4 text-green-400" />
            <span className="text-white text-xs lg:text-sm font-medium">
              Ultra-Low Latency
            </span>
          </div>

          {/* Stream Controls Overlay - Responsive */}
          <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 flex items-center space-x-1 lg:space-x-2">
            <button className="p-1.5 lg:p-2 bg-black/70 rounded-lg hover:bg-black/90 transition-colors">
              <Play className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
            </button>
            <button className="p-1.5 lg:p-2 bg-black/70 rounded-lg hover:bg-black/90 transition-colors">
              <Pause className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Stream Information - Responsive Grid */}
      <div className="mt-4 lg:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        <div className="bg-gray-50 rounded-xl p-3 lg:p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Camera className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900 text-sm lg:text-base">Active Camera</h4>
          </div>
          <div className="text-base lg:text-lg font-bold text-gray-900">{currentCamera?.name}</div>
          <div className="text-xs lg:text-sm text-gray-600">{currentCamera?.location}</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 lg:p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Wifi className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900 text-sm lg:text-base">Stream Quality</h4>
          </div>
          <div className="text-base lg:text-lg font-bold text-blue-600">WebRTC</div>
          <div className="text-xs lg:text-sm text-gray-600">Ultra-low latency</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 lg:p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-2 mb-2">
            <Play className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900 text-sm lg:text-base">Status</h4>
          </div>
          <div className="text-base lg:text-lg font-bold text-green-600">Live</div>
          <div className="text-xs lg:text-sm text-gray-600">Audio & Video</div>
        </div>
      </div>
    </div>
  );
};

export default NVRWebRTCSection;