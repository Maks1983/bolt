import React, { useState } from 'react';
import { 
  Camera, 
  HardDrive, 
  X,
  Grid3X3,
  Maximize2,
  AlertTriangle,
  User,
  Car,
  Volume2,
  Moon,
  Bell
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface NVRCardProps {
  onClick: () => void;
}

const NVRCard: React.FC<NVRCardProps> = ({ onClick }) => {
  const { state } = useDevices();

  // Get real camera entities from Home Assistant
  const realCameras = state.devices.filter(device => device.device_type === 'camera');
  
  // Get detection sensors for all cameras
  const detectionSensors = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && 
    (device as any).camera_entity
  );

  // Get active detections count
  const activeDetections = detectionSensors.filter(sensor => sensor.state === 'on').length;
  const totalCameras = realCameras.length;
  const recordingCameras = realCameras.filter(camera => camera.state === 'recording').length;

  // Calculate storage usage (mock data)
  const storageUsed = 2.4; // TB
  const storageTotal = 8.0; // TB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer min-w-[120px]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 bg-slate-500/20 rounded-full shadow-lg">
          <HardDrive className="w-6 h-6 text-slate-600" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">NVR</div>
          <div className="text-xs text-gray-600 font-medium">{recordingCameras}/{totalCameras} recording</div>
        </div>
      </div>
    </div>
  );
};

export default NVRCard;