import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import NVRWebRTCSection from './NVRWebRTCSection';

const InfoRow: React.FC = () => {
  const [showNVR, setShowNVR] = useState(false);

  return (
    <>
      {/* NVR Camera System Modal */}
      {showNVR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl lg:rounded-3xl w-full max-w-sm sm:max-w-2xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">NVR Camera System</h2>
                  <p className="text-green-100 text-sm lg:text-base">Live camera feeds from exterior locations</p>
                </div>
                <button 
                  onClick={() => setShowNVR(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="max-h-[calc(95vh-8rem)] sm:max-h-[calc(90vh-8rem)] overflow-y-auto">
              <NVRWebRTCSection />
            </div>
            
            <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="hidden sm:inline">All cameras online</span>
                    <span className="sm:hidden">Online</span>
                  </div>
                  <div className="flex items-center space-x-2 hidden sm:flex">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowNVR(false)}
                  className="px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 bg-gray-200 text-gray-700 rounded-xl lg:rounded-2xl hover:bg-gray-300 transition-colors font-semibold text-sm lg:text-base"
                >
                  <span className="hidden sm:inline">Close NVR</span>
                  <span className="sm:hidden">Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoRow;