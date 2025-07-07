import React from 'react';
import { 
  Camera, 
  HardDrive, 
  AlertTriangle
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
      className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
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
          <span className="font-medium text-slate-900">{recordingCameras}/{totalCameras} recording</span>
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
  );
};

export default NVRCard;