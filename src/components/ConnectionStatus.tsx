import React from 'react';
import { Wifi, WifiOff, AlertCircle, Loader } from 'lucide-react';
import { useDevices } from '../context/DeviceContext';

const ConnectionStatus: React.FC = () => {
  const { state } = useDevices();
  const { connectionState, connectionError } = state;

  const getStatusIcon = () => {
    switch (connectionState) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-600" />;
      case 'connecting':
        return <Loader className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'connecting':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'disconnected':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case 'connected':
        return 'Connected to Home Assistant';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return connectionError || 'Connection Error';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
};

export default ConnectionStatus;