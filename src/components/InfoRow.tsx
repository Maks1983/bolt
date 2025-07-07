import React, { useState } from 'react';
import { Camera, Thermometer, Shield, Users, Video, Monitor } from 'lucide-react';

interface Camera {
  id: number;
  name: string;
  location: string;
  recording: boolean;
  nightVision: boolean;
  temperature: number;
  humidity: number;
  backgroundImage: string;
}

interface InfoRowProps {
  cameras: Camera[];
}

const InfoRow: React.FC<InfoRowProps> = ({ cameras }) => {
  const [selectedCameraId, setSelectedCameraId] = useState<string>('backyard');

  // Camera options for WebRTC streaming
  const streamingCameras = [
    { id: 'backyard', name: 'Backyard', icon: '🏡' },
    { id: 'doorbell', name: 'Doorbell', icon: '🚪' },
    { id: 'package', name: 'Package', icon: '📦' }
  ];

  const handleCameraSwitch = (cameraId: string) => {
    setSelectedCameraId(cameraId);
  };

  return (
    <div className="px-6 py-4 bg-white/95 backdrop-blur-xl border-b border-gray-200/50">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        
        {/* System Overview */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200/50 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900">System Status</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Security</span>
              <span className="text-sm font-semibold text-emerald-600">Armed</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Devices</span>
              <span className="text-sm font-semibold text-gray-900">24 Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Alerts</span>
              <span className="text-sm font-semibold text-gray-500">None</span>
            </div>
          </div>
        </div>

        {/* Environmental */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200/50 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Thermometer className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900">Environment</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Temp</span>
              <span className="text-sm font-semibold text-gray-900">21.5°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Humidity</span>
              <span className="text-sm font-semibold text-gray-900">52%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Air Quality</span>
              <span className="text-sm font-semibold text-green-600">Good</span>
            </div>
          </div>
        </div>

        {/* Occupancy */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-200/50 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900">Occupancy</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">People Home</span>
              <span className="text-sm font-semibold text-gray-900">2 of 3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Rooms</span>
              <span className="text-sm font-semibold text-gray-900">4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Motion</span>
              <span className="text-sm font-semibold text-blue-600">Living Room</span>
            </div>
          </div>
        </div>

        {/* NVR Section - Redesigned with WebRTC Support */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-200/50 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-gray-100 rounded-xl">
              <Video className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-bold text-gray-900">Live Camera</h3>
          </div>
          
          {/* Camera Selection UI */}
          <div className="flex space-x-1 mb-3 bg-gray-100 rounded-lg p-1">
            {streamingCameras.map((camera) => (
              <button
                key={camera.id}
                onClick={() => handleCameraSwitch(camera.id)}
                className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedCameraId === camera.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{camera.icon}</span>
                <span>{camera.name}</span>
              </button>
            ))}
          </div>

          {/* WebRTC Live Stream */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <iframe
              src={`https://nvr.alfcent.com/stream.html?src=${selectedCameraId}&mode=webrtc`}
              className="w-full h-full border-0"
              allow="camera; microphone; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-popups"
              title={`Live stream from ${streamingCameras.find(c => c.id === selectedCameraId)?.name}`}
            />
            
            {/* Live Indicator */}
            <div className="absolute top-2 left-2 flex items-center space-x-1 bg-red-500/90 rounded-full px-2 py-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium">LIVE</span>
            </div>
            
            {/* Camera Name Overlay */}
            <div className="absolute bottom-2 left-2 bg-black/70 rounded-md px-2 py-1">
              <span className="text-white text-xs font-medium">
                {streamingCameras.find(c => c.id === selectedCameraId)?.name}
              </span>
            </div>
            
            {/* Fullscreen Button */}
            <button 
              className="absolute bottom-2 right-2 p-1.5 bg-black/70 rounded-md hover:bg-black/80 transition-colors"
              onClick={() => {
                const iframe = document.querySelector('iframe');
                if (iframe?.requestFullscreen) {
                  iframe.requestFullscreen();
                }
              }}
            >
              <Monitor className="w-3 h-3 text-white" />
            </button>
          </div>
          
          {/* Stream Status */}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>WebRTC • Ultra-low latency</span>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoRow;