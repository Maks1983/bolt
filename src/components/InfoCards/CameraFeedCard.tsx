import React, { useState } from 'react';
import { Camera, X, ExternalLink } from 'lucide-react';
import CameraWebRTC from '../CameraWebRTC';

// Camera configuration
const CAMERA_ID = "Backyard";

interface CameraFeedCardProps {
  onClick?: () => void;
}

const CameraFeedCard: React.FC<CameraFeedCardProps> = ({ onClick }) => {
  const [showFeed, setShowFeed] = useState(false);

  const handleCardClick = () => {
    setShowFeed(true);
    if (onClick) onClick();
  };

  const openInNewTab = () => {
    const url = `https://nvr.alfcent.com:8555/stream.html?src=${CAMERA_ID}&video&audio`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Camera Feed Card */}
      <div 
        className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 border border-indigo-200/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-indigo-900">Camera Feed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-indigo-600">Camera:</span>
            <span className="font-medium text-indigo-900">{CAMERA_ID}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-indigo-600">Protocol:</span>
            <span className="font-medium text-indigo-900">WebRTC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-indigo-600">Latency:</span>
            <span className="font-medium text-green-600">Ultra-Low</span>
          </div>
        </div>
      </div>

      {/* Camera Feed Modal */}
      {showFeed && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{CAMERA_ID} Live Feed</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">WebRTC Stream</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={openInNewTab}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>New Tab</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowFeed(false)}
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Feed */}
            <div className="p-4">
              <div className="relative bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <CameraWebRTC 
                  cameraId={CAMERA_ID}
                  className="rounded-xl"
                />
                
                {/* Live indicator overlay */}
                <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/70 rounded-full px-3 py-1 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-xs font-medium">LIVE</span>
                </div>

                {/* WebRTC badge */}
                <div className="absolute top-3 right-3 bg-green-500/90 rounded-full px-2 py-1 backdrop-blur-sm">
                  <span className="text-white text-xs font-medium">WebRTC</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Connected</span>
                  </div>
                  <span>Ultra-low latency streaming</span>
                  <span>Audio & Video enabled</span>
                </div>
                
                <button 
                  onClick={() => setShowFeed(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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

export default CameraFeedCard;