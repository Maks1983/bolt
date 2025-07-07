import React, { useState } from 'react';
import { 
  Camera, 
  HardDrive, 
  X,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface NVRCardProps {
  onClick: () => void;
}

const NVRCard: React.FC<NVRCardProps> = ({ onClick }) => {
  const [showExpandedView, setShowExpandedView] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Simple mock data for the card
  const onlineCameras = 3;
  const recordingCameras = 2;
  const storageUsed = 2.4; // TB
  const storageTotal = 8.0; // TB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  const streamUrl = "http://nvr.alfcent.com/stream.html?src=Backyard";

  const handleCardClick = () => {
    setShowExpandedView(true);
    onClick();
  };

  const handleRefresh = () => {
    setStreamError(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleIframeError = () => {
    console.log('Iframe failed to load - likely CORS/X-Frame-Options blocking');
    setStreamError(true);
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
        </div>
      </div>

      {/* Expanded View Modal */}
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
                    <p className="text-gray-600">Live Stream via go2rtc</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleRefresh}
                    className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Refresh stream"
                  >
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                  </button>
                  
                  <a 
                    href={streamUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4 text-green-600" />
                  </a>
                  
                  <button 
                    onClick={() => setShowExpandedView(false)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stream Content */}
            <div className="p-6">
              <div className="bg-black rounded-2xl overflow-hidden aspect-video relative">
                {!streamError ? (
                  <iframe
                    key={refreshKey}
                    src={streamUrl}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; camera; microphone; display-capture"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Backyard Camera Stream"
                    onLoad={() => {
                      console.log('✅ Stream iframe loaded successfully');
                    }}
                    onError={handleIframeError}
                    style={{
                      border: 'none',
                      outline: 'none'
                    }}
                  />
                ) : (
                  /* Fallback when iframe is blocked */
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center space-y-4">
                      <Camera className="w-16 h-16 mx-auto text-gray-400" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Stream Cannot Be Embedded</h3>
                        <p className="text-sm text-gray-300 mb-4">
                          The go2rtc server is blocking iframe embedding for security reasons.
                        </p>
                        <div className="space-y-2">
                          <a 
                            href={streamUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Open Stream in New Tab</span>
                          </a>
                          <div className="text-xs text-gray-400 mt-2">
                            <p>To fix this, you can:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li>Configure go2rtc to allow iframe embedding</li>
                              <li>Use a reverse proxy without X-Frame-Options</li>
                              <li>Access the stream directly via WebRTC</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>go2rtc Server Online</span>
                  </div>
                  <div>Stream URL: {streamUrl}</div>
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