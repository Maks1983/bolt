import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw,
  Wifi,
  WifiOff,
  AlertCircle,
  X
} from 'lucide-react';

// Camera configuration
const CAMERAS = [
  { id: 'Backyard', name: 'Backyard', icon: '🏡' },
  { id: 'Doorbell', name: 'Doorbell', icon: '🚪' },
  { id: 'Package', name: 'Package', icon: '📦' }
];

const BASE_STREAM_URL = "https://nvr.alfcent.com/stream.html?src=";

interface Camera {
  id: string;
  name: string;
  icon: string;
}

interface InfoRowProps {
  cameras?: any[]; // Legacy prop for compatibility
}

const InfoRow: React.FC<InfoRowProps> = () => {
  const [selectedCamera, setSelectedCamera] = useState<Camera>(CAMERAS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle camera switching
  const handleCameraSwitch = (camera: Camera) => {
    if (camera.id === selectedCamera.id) return;
    
    console.log(`📹 Switching to camera: ${camera.name}`);
    setSelectedCamera(camera);
    setIsLoading(true);
    setHasError(false);
    setConnectionStatus('connecting');
  };

  // Handle iframe load events
  const handleIframeLoad = () => {
    console.log(`✅ Camera feed loaded: ${selectedCamera.name}`);
    setIsLoading(false);
    setConnectionStatus('connected');
  };

  const handleIframeError = () => {
    console.error(`❌ Camera feed error: ${selectedCamera.name}`);
    setIsLoading(false);
    setHasError(true);
    setConnectionStatus('error');
  };

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Refresh stream
  const refreshStream = () => {
    console.log(`🔄 Refreshing camera feed: ${selectedCamera.name}`);
    setIsLoading(true);
    setHasError(false);
    setConnectionStatus('connecting');
    
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  // Generate stream URL
  const getStreamUrl = (camera: Camera) => {
    return `${BASE_STREAM_URL}${camera.id}&mode=webrtc&t=${Date.now()}`;
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="w-4 h-4" />;
      case 'connecting': return <Wifi className="w-4 h-4 animate-pulse" />;
      case 'error': return <WifiOff className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Main InfoRow Container */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-600 rounded-xl">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Security Camera System</h2>
                <p className="text-sm text-gray-600">Ultra-low latency WebRTC streaming</p>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-50 border ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="text-sm font-medium capitalize">{connectionStatus}</span>
            </div>
          </div>

          {/* Camera Selection Tabs */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
              {CAMERAS.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => handleCameraSwitch(camera)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCamera.id === camera.id
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <span className="text-lg">{camera.icon}</span>
                  <span className="text-sm font-medium">{camera.name}</span>
                  {selectedCamera.id === camera.id && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-gray-600" />
                ) : (
                  <Volume2 className="w-4 h-4 text-gray-600" />
                )}
              </button>
              
              <button
                onClick={refreshStream}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Refresh Stream"
              >
                <RotateCcw className="w-4 h-4 text-gray-600" />
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Camera Feed Container */}
          <div 
            ref={containerRef}
            className={`relative bg-black rounded-2xl overflow-hidden shadow-lg ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'aspect-video'
            }`}
          >
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-lg font-semibold">Connecting to {selectedCamera.name}</p>
                  <p className="text-sm text-gray-300 mt-1">Establishing WebRTC connection...</p>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {hasError && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                <div className="text-center text-white">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                  <p className="text-lg font-semibold">Connection Failed</p>
                  <p className="text-sm text-gray-300 mt-1">Unable to connect to {selectedCamera.name}</p>
                  <button
                    onClick={refreshStream}
                    className="mt-4 px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* WebRTC Stream Iframe */}
            <iframe
              ref={iframeRef}
              src={getStreamUrl(selectedCamera)}
              className="w-full h-full border-0"
              allow="camera; microphone; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-popups"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={`${selectedCamera.name} Camera Feed`}
            />

            {/* Live Indicator */}
            {connectionStatus === 'connected' && (
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600/90 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-bold">LIVE</span>
              </div>
            )}

            {/* Camera Info */}
            <div className="absolute top-4 right-4 bg-black/70 rounded-lg px-3 py-1.5 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{selectedCamera.icon}</span>
                <span className="text-white text-sm font-medium">{selectedCamera.name}</span>
              </div>
            </div>

            {/* Fullscreen Exit Button */}
            {isFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white rounded-full p-3 hover:bg-black/90 transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>
            )}

            {/* Audio Mute Indicator */}
            {isMuted && (
              <div className="absolute bottom-4 left-4 bg-red-600/90 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <VolumeX className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Muted</span>
                </div>
              </div>
            )}

            {/* Stream Quality Indicator */}
            {connectionStatus === 'connected' && (
              <div className="absolute bottom-4 right-4 bg-black/70 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white text-xs font-medium">WebRTC</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Current: {selectedCamera.name}</span>
              <span>•</span>
              <span>Protocol: WebRTC</span>
              <span>•</span>
              <span>Latency: Ultra-low</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span>Stream URL:</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                nvr.alfcent.com/stream.html
              </code>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoRow;