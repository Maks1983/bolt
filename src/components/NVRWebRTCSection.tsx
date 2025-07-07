import React, { useState, useCallback } from 'react';
import { Camera, Play, Pause, RotateCcw, Maximize, Wifi, AlertCircle, X } from 'lucide-react';

interface CameraConfig {
  id: string;
  name: string;
  location: string;
}

const cameras: CameraConfig[] = [
  { id: 'Backyard', name: 'Backyard', location: 'Rear Garden' },
  { id: 'Doorbell', name: 'Doorbell', location: 'Front Entrance' },
  { id: 'Package', name: 'Package', location: 'Delivery Area' }
];

const NVRWebRTCSection: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<string>('Backyard');
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
    <div className="p-6">
      {/* Camera Selection UI */}
      <div className="mb-6">
        <div className="flex space-x-3">
            {cameras.map((camera) => (
            <button
                key={camera.id}
                onClick={() => handleCameraSwitch(camera.id)}
                className={`flex-1 flex items-center justify-between space-x-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                selectedCamera === camera.id
                    ? 'bg-green-50 border-green-500 text-green-700 shadow-md'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50/50'
                }`}
            >
                <div className={`p-2 rounded-lg ${
                selectedCamera === camera.id ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                <Camera className={`w-4 h-4 ${
                    selectedCamera === camera.id ? 'text-green-600' : 'text-gray-500'
                }`} />
                </div>
                <div className="flex-1 text-left">
                <div className="font-semibold">{camera.name}</div>
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
    </div>


      {/* WebRTC Stream Container */}
      <div className={`bg-black rounded-2xl overflow-hidden shadow-2xl ${
        isFullscreen ? 'fixed inset-4 z-50' : 'aspect-video'
      }`}>
        {/* Stream Header */}
        <div className="relative bg-gradient-to-r from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">LIVE</span>
              </div>
              <div className="text-white">
                <div className="font-bold">{currentCamera?.name}</div>
                <div className="text-xs opacity-75">{currentCamera?.location}</div>
              </div>
              <div className="px-2 py-1 bg-green-500/80 rounded text-white text-xs font-medium">
                WebRTC
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
                title="Refresh Stream"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
                title="Toggle Fullscreen"
              >
                <Maximize className="w-4 h-4 text-white" />
              </button>
              {isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 bg-red-500/80 rounded-lg hover:bg-red-600/80 transition-colors"
                  title="Exit Fullscreen"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stream Content */}
        <div className="relative h-full">
          {isLoading && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <div className="text-lg font-semibold">Connecting to {currentCamera?.name}</div>
                <div className="text-sm opacity-75">Establishing WebRTC connection...</div>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
              <div className="text-center text-white">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <div className="text-lg font-semibold mb-2">Connection Failed</div>
                <div className="text-sm opacity-75 mb-4">Unable to connect to {currentCamera?.name}</div>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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

          {/* Connection Status Overlay */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/70 rounded-lg px-3 py-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-medium">
              Ultra-Low Latency
            </span>
          </div>

          {/* Stream Controls Overlay */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            <button className="p-2 bg-black/70 rounded-lg hover:bg-black/90 transition-colors">
              <Play className="w-4 h-4 text-white" />
            </button>
            <button className="p-2 bg-black/70 rounded-lg hover:bg-black/90 transition-colors">
              <Pause className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NVRWebRTCSection;
