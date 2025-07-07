import React, { useState } from 'react';
import { 
  Camera, 
  HardDrive, 
  X,
  AlertTriangle
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface NVRCardProps {
  onClick: () => void;
}

const NVRCard: React.FC<NVRCardProps> = ({ onClick }) => {
  const { state } = useDevices();
  const [showExpandedView, setShowExpandedView] = useState(false);

  // Get real camera entities from Home Assistant for additional data
  const realCameras = state.devices.filter(device => device.device_type === 'camera');
  
  // Get detection sensors for all cameras
  const detectionSensors = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && 
    (device as any).camera_entity
  );

  // Get active detections count
  const activeDetections = detectionSensors.filter(sensor => sensor.state === 'on').length;
  const onlineCameras = 3; // Simulated
  const recordingCameras = 2; // Simulated

  // Calculate storage usage (mock data)
  const storageUsed = 2.4; // TB
  const storageTotal = 8.0; // TB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  const handleCardClick = () => {
    setShowExpandedView(true);
    onClick();
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
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-600 rounded-xl">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Backyard Camera</h2>
                    <p className="text-gray-600">Live Stream</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowExpandedView(false)}
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Stream Content */}
            <div className="p-6">
              <div className="bg-black rounded-2xl overflow-hidden aspect-video">
                <iframe
                  src="http://10.150.50.10:1984/stream.html?src=Backyard"
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen"
                  title="Backyard Camera Stream"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Stream Online</span>
                  </div>
                  <div>Source: WebRTC via go2rtc</div>
                  <div>Resolution: 1080p</div>
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