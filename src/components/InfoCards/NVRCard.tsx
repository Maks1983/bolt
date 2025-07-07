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
import WebRTCPlayer from '../WebRTCPlayer';

// Camera configuration
const CAMERA_ID = "Backyard";
const STREAM_BASE_URL = "https://nvr.alfcent.com:8555";

interface NVRCardProps {
  onClick: () => void;
}

const NVRCard: React.FC<NVRCardProps> = ({ onClick }) => {
  const { state } = useDevices();
  const [showExpandedView, setShowExpandedView] = useState(false);

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

  const openInNewTab = () => {
    const url = `https://nvr.alfcent.com:8555/stream.html?src=${CAMERA_ID}&video&audio`;
    window.open(url, '_blank');
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
            <span className="font-medium text-slate-900">{CAMERA_ID}</span>
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
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-600 rounded-xl">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{CAMERA_ID} Camera</h2>
                    <p className="text-gray-600">Ultra-low latency WebRTC stream via Go2RTC</p>
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
              <div className="space-y-6">
                {/* Main Stream Container */}
                <div className="relative bg-black rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>
                  <WebRTCPlayer 
                    streamUrl={STREAM_BASE_URL}
                    cameraId={CAMERA_ID}
                    className="rounded-xl"
                    onError={(error) => console.error('WebRTC Error:', error)}
                    onConnected={() => console.log('WebRTC Connected')}
                  />
                </div>

                {/* Stream Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Technical Details */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Stream Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Camera ID:</span>
                        <span className="font-medium text-gray-900">{CAMERA_ID}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Protocol:</span>
                        <span className="font-medium text-gray-900">WebRTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Latency:</span>
                        <span className="font-medium text-green-600">Ultra-Low</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Audio:</span>
                        <span className="font-medium text-gray-900">Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Server:</span>
                        <span className="font-medium text-gray-900">nvr.alfcent.com:8555</span>
                      </div>
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <HardDrive className="w-4 h-4 mr-2" />
                      System Status
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">NVR Status:</span>
                        <span className="font-medium text-green-600">Online</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Storage Used:</span>
                        <span className="font-medium text-gray-900">{storageUsed}TB / {storageTotal}TB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Storage:</span>
                        <span className="font-medium text-gray-900">{Math.round(storagePercentage)}%</span>
                      </div>
                      {activeDetections > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Detections:</span>
                          <span className="font-medium text-red-600">{activeDetections}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={openInNewTab}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in New Tab</span>
                  </button>
                  
                  <button 
                    onClick={() => window.location.reload()}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Refresh Stream</span>
                  </button>
                </div>

                {/* Usage Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 mb-2">WebRTC Stream Features:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ultra-low latency streaming (typically &lt;500ms)</li>
                    <li>• Full audio and video support</li>
                    <li>• Automatic quality adaptation based on network conditions</li>
                    <li>• Click fullscreen button in stream for immersive viewing</li>
                    <li>• Stream automatically reconnects if connection is lost</li>
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
                    <span>Go2RTC Online</span>
                  </div>
                  <div>Camera: {CAMERA_ID}</div>
                  <div>Protocol: WebRTC</div>
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