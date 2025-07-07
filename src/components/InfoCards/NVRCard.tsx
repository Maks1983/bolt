import React, { useState } from 'react';
import { 
  Camera, 
  HardDrive, 
  X,
  AlertTriangle,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

// Simplified configuration for single camera
const CAMERA_STREAM_URL = "https://nvr.alfcent.com/stream.html?src=Backyard";

interface NVRCardProps {
  onClick: () => void;
}

const NVRCard: React.FC<NVRCardProps> = ({ onClick }) => {
  const { state } = useDevices();
  const [showExpandedView, setShowExpandedView] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get detection sensors for additional data
  const detectionSensors = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && 
    (device as any).camera_entity
  );

  const activeDetections = detectionSensors.filter(sensor => sensor.state === 'on').length;

  // Calculate storage usage (mock data)
  const storageUsed = 2.4; // TB
  const storageTotal = 8.0; // TB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  const handleCardClick = () => {
    setShowExpandedView(true);
    onClick();
  };

  const handleStreamLoad = () => {
    console.log('📹 Stream loaded successfully');
    setIsLoading(false);
    setStreamError(false);
  };

  const handleStreamError = () => {
    console.error('❌ Stream failed to load');
    setStreamError(true);
    setIsLoading(false);
  };

  const handleRetry = () => {
    console.log('🔄 Retrying stream...');
    setStreamError(false);
    setIsLoading(true);
    // Force iframe reload by changing src
    const iframe = document.querySelector('#backyard-stream') as HTMLIFrameElement;
    if (iframe) {
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = currentSrc + '?t=' + Date.now();
      }, 100);
    }
  };

  const openInNewTab = () => {
    window.open(CAMERA_STREAM_URL, '_blank');
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
            <span className="text-slate-600">Camera</span>
            <span className="font-medium text-slate-900">Backyard</span>
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
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-600 rounded-xl">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Backyard Camera</h2>
                    <p className="text-gray-600">Live stream from go2rtc</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={openInNewTab}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">Open in Tab</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowExpandedView(false)}
                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stream Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Stream Container */}
                <div className="relative bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  {!streamError ? (
                    <>
                      <iframe
                        id="backyard-stream"
                        src={CAMERA_STREAM_URL}
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen; camera; microphone"
                        allowFullScreen
                        onLoad={handleStreamLoad}
                        onError={handleStreamError}
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                        title="Backyard Camera Stream"
                      />
                      
                      {/* Loading overlay */}
                      {isLoading && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p className="text-lg font-medium">Loading Backyard Camera...</p>
                            <p className="text-sm text-gray-300 mt-2">Connecting to go2rtc stream</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Stream info overlay */}
                      {!isLoading && (
                        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/70 rounded-full px-4 py-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-white text-sm font-medium">LIVE - Backyard</span>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Error State */
                    <div className="flex items-center justify-center h-full text-white bg-gray-800">
                      <div className="text-center max-w-md">
                        <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-2">Stream Unavailable</h3>
                        <p className="text-gray-300 mb-4">
                          Unable to load the camera stream. This could be due to:
                        </p>
                        <ul className="text-sm text-gray-400 text-left mb-6 space-y-1">
                          <li>• CORS policy restrictions</li>
                          <li>• Network connectivity issues</li>
                          <li>• go2rtc server configuration</li>
                          <li>• Camera offline</li>
                        </ul>
                        <div className="flex flex-col space-y-3">
                          <button 
                            onClick={handleRetry}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Retry Stream</span>
                          </button>
                          <button 
                            onClick={openInNewTab}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Open Direct Link</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stream Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Stream URL:</span>
                      <p className="text-gray-600 break-all">{CAMERA_STREAM_URL}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Protocol:</span>
                      <p className="text-gray-600">WebRTC via go2rtc</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className={`font-medium ${streamError ? 'text-red-600' : isLoading ? 'text-yellow-600' : 'text-green-600'}`}>
                        {streamError ? 'Error' : isLoading ? 'Loading...' : 'Connected'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Debug Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Troubleshooting Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Check browser console for detailed error messages</li>
                    <li>• Verify the go2rtc server is running on nvr.alfcent.com</li>
                    <li>• Try opening the stream URL directly in a new tab</li>
                    <li>• Ensure your browser allows iframe embedding from the domain</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>NVR Online</span>
                  </div>
                  <div>Storage: {storageUsed}TB / {storageTotal}TB</div>
                  <div>Camera: Backyard</div>
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