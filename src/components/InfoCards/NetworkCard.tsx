import React from 'react';
import { Wifi } from 'lucide-react';

const NetworkCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200/50 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Wifi className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-blue-900">Network</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-green-600 font-medium">Stable</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-blue-600">Download</span>
          <span className="font-medium text-blue-900">847 Mbps</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-600">Upload</span>
          <span className="font-medium text-blue-900">42 Mbps</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-600">Latency</span>
          <span className="font-medium text-blue-900">12ms</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkCard;