import React, { useState } from 'react';
import { 
  Shield, 
  Thermometer, 
  Zap, 
  Camera, 
  AlertTriangle,
  ChevronRight,
  Home,
  Lock,
  Unlock,
  Flame,
  Waves,
  User,
  Eye,
  EyeOff,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  Play,
  Pause,
  Grid3X3,
  Maximize2,
  Bell,
  Volume2,
  Moon,
  Car
} from 'lucide-react';
import { useDevices } from '../context/DeviceContext';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';
import { formatTemperature, formatHumidity } from '../utils/deviceHelpers';
import AlarmControl from './DeviceControls/AlarmControl';

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
  const { state, controlLight } = useDevices();
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [showEnergyDetails, setShowEnergyDetails] = useState(false);
  const [showNVR, setShowNVR] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [nvrView, setNvrView] = useState<'grid' | 'single'>('grid');

  // Get alarm system
  const alarmSystem = useRealtimeDevice('alarm_control_panel.home_security');
  
  // Get all cameras and their detection sensors
  const realCameras = state.devices.filter(device => device.device_type === 'camera');
  const detectionSensors = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && 
    (device as any).camera_entity
  );

  // Get all locks
  const allLocks = state.devices.filter(device => device.device_type === 'lock');
  
  // Get all lights for energy calculation
  const allLights = state.devices.filter(device => device.device_type === 'light');
  const lightsOn = allLights.filter(light => light.state === 'on');
  
  // Get all temperature sensors for average
  const tempSensors = state.devices.filter(device => 
    device.device_type === 'sensor' && (device as any).sensor_type === 'temperature'
  );
  
  // Get safety sensors
  const smokeSensors = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && (device as any).sensor_type === 'smoke'
  );
  const floodSensors = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && (device as any).sensor_type === 'flood'
  );

  // Calculate statistics
  const activeDetections = detectionSensors.filter(sensor => sensor.state === 'on').length;
  const totalCameras = realCameras.length;
  const recordingCameras = realCameras.filter(camera => camera.state === 'recording').length;
  
  const averageTemp = tempSensors.length > 0 
    ? tempSensors.reduce((sum, sensor) => sum + Number(sensor.state), 0) / tempSensors.length
    : 21.5;
  
  const estimatedPower = lightsOn.length * 12; // Rough estimate: 12W per light
  const totalDevices = state.devices.length;
  const onlineDevices = state.devices.filter(d => d.available).length;
  
  const hasAlerts = smokeSensors.some(s => s.state === 'on') || 
                   floodSensors.some(s => s.state === 'on') ||
                   activeDetections > 0;

  const allLocksLocked = allLocks.length > 0 && allLocks.every(lock => lock.state === 'locked');
  const securityStatus = alarmSystem?.state === 'disarmed' ? 'Disarmed' : 
                        alarmSystem?.state === 'armed_home' ? 'Armed Home' :
                        alarmSystem?.state === 'armed_away' ? 'Armed Away' : 'Unknown';

  // Quick actions
  const handleAllLightsOff = () => {
    lightsOn.forEach(light => {
      controlLight(light.entity_id, false);
    });
  };

  const handleCameraSelect = (cameraId: string) => {
    setSelectedCamera(cameraId);
    setNvrView('single');
  };

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case 'person': return User;
      case 'vehicle': return Car;
      case 'doorbell': return Bell;
      case 'speaking': return Volume2;
      case 'night_mode': return Moon;
      default: return AlertTriangle;
    }
  };

  return (
    <>
      <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Security & Safety */}
          <div 
            className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200/50 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => setShowSecurityPanel(true)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${hasAlerts ? 'bg-red-500' : alarmSystem?.state === 'disarmed' ? 'bg-orange-500' : 'bg-green-500'}`}>
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Security</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${hasAlerts ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Alarm</span>
                <span className="font-medium text-gray-900">{securityStatus}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Locks</span>
                <div className="flex items-center space-x-1">
                  {allLocksLocked ? 
                    <Lock className="w-3 h-3 text-green-600" /> : 
                    <Unlock className="w-3 h-3 text-red-600" />
                  }
                  <span className="font-medium text-gray-900">
                    {allLocks.filter(l => l.state === 'locked').length}/{allLocks.length}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Alerts</span>
                <span className={`font-medium ${hasAlerts ? 'text-red-600' : 'text-green-600'}`}>
                  {hasAlerts ? `${activeDetections} active` : 'All clear'}
                </span>
              </div>
            </div>
          </div>

          {/* Climate & Energy */}
          <div 
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200/50 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => setShowEnergyDetails(true)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Thermometer className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Climate & Energy</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Temp</span>
                <span className="font-medium text-gray-900">{formatTemperature(averageTemp)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Lights On</span>
                <span className="font-medium text-gray-900">{lightsOn.length}/{allLights.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Est. Power</span>
                <span className="font-medium text-gray-900">{estimatedPower}W</span>
              </div>
            </div>
          </div>

          {/* Surveillance */}
          <div 
            className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-200/50 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => setShowNVR(true)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Surveillance</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${activeDetections > 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cameras</span>
                <span className="font-medium text-gray-900">{recordingCameras}/{totalCameras} recording</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Detections</span>
                <span className={`font-medium ${activeDetections > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {activeDetections > 0 ? `${activeDetections} active` : 'None'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Storage</span>
                <span className="font-medium text-gray-900">2.4TB / 8TB</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Quick Actions</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">Ready</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={handleAllLightsOff}
                disabled={lightsOn.length === 0}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  lightsOn.length > 0 
                    ? 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Turn Off All Lights ({lightsOn.length})
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                  <div className="text-lg font-bold text-gray-900">{onlineDevices}</div>
                  <div className="text-xs text-gray-600">Online</div>
                </div>
                <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                  <div className="text-lg font-bold text-gray-900">{totalDevices}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Panel Modal */}
      {showSecurityPanel && alarmSystem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-500 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Security Control</h2>
                    <p className="text-gray-600">Manage your home security system</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSecurityPanel(false)}
                  className="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <AlarmControl device={alarmSystem as any} />
              
              {/* Additional Security Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Door Locks</h3>
                  <div className="space-y-2">
                    {allLocks.map(lock => (
                      <div key={lock.entity_id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{lock.friendly_name}</span>
                        <div className="flex items-center space-x-1">
                          {lock.state === 'locked' ? 
                            <Lock className="w-3 h-3 text-green-600" /> : 
                            <Unlock className="w-3 h-3 text-red-600" />
                          }
                          <span className="text-sm font-medium capitalize">{lock.state}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Safety Sensors</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Smoke Detectors</span>
                      <span className={`text-sm font-medium ${smokeSensors.some(s => s.state === 'on') ? 'text-red-600' : 'text-green-600'}`}>
                        {smokeSensors.some(s => s.state === 'on') ? 'Alert' : 'Clear'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Flood Sensors</span>
                      <span className={`text-sm font-medium ${floodSensors.some(s => s.state === 'on') ? 'text-red-600' : 'text-green-600'}`}>
                        {floodSensors.some(s => s.state === 'on') ? 'Alert' : 'Clear'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Camera Alerts</span>
                      <span className={`text-sm font-medium ${activeDetections > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {activeDetections > 0 ? `${activeDetections} active` : 'None'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Energy Details Modal */}
      {showEnergyDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <Thermometer className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Climate & Energy Overview</h2>
                    <p className="text-gray-600">Temperature monitoring and energy consumption</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEnergyDetails(false)}
                  className="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Temperature Overview */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Temperature Monitoring</h3>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-blue-600">{formatTemperature(averageTemp)}</div>
                    <div className="text-gray-600">Average Temperature</div>
                  </div>
                  
                  <div className="space-y-3">
                    {tempSensors.map(sensor => (
                      <div key={sensor.entity_id} className="flex items-center justify-between bg-white rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-900">{sensor.friendly_name}</span>
                        <span className="text-lg font-bold text-blue-600">{formatTemperature(sensor.state)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Energy Consumption */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Energy Consumption</h3>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-green-600">{estimatedPower}W</div>
                    <div className="text-gray-600">Estimated Current Usage</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-900">Lights Active</span>
                      <span className="text-lg font-bold text-green-600">{lightsOn.length}/{allLights.length}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-900">Daily Est.</span>
                      <span className="text-lg font-bold text-green-600">{(estimatedPower * 24 / 1000).toFixed(1)} kWh</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-900">Monthly Est.</span>
                      <span className="text-lg font-bold text-green-600">{(estimatedPower * 24 * 30 / 1000).toFixed(0)} kWh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Energy Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleAllLightsOff}
                    disabled={lightsOn.length === 0}
                    className={`p-4 rounded-lg font-medium transition-colors ${
                      lightsOn.length > 0 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Turn Off All Lights
                  </button>
                  <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-gray-900">{onlineDevices}</div>
                    <div className="text-sm text-gray-600">Devices Online</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-gray-900">{((onlineDevices / totalDevices) * 100).toFixed(0)}%</div>
                    <div className="text-sm text-gray-600">System Health</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NVR Modal - Enhanced */}
      {showNVR && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-7xl h-[90vh] overflow-hidden shadow-2xl border border-gray-700">
            {/* NVR Header */}
            <div className="p-6 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Security Camera System</h2>
                    <p className="text-gray-400">
                      {recordingCameras} of {totalCameras} cameras recording • {activeDetections} active detections
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* View Toggle */}
                  <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setNvrView('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        nvrView === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setNvrView('single')}
                      className={`p-2 rounded-md transition-colors ${
                        nvrView === 'single' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setShowNVR(false)}
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* NVR Content */}
            <div className="flex h-[calc(90vh-120px)]">
              {/* Camera List Sidebar */}
              <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Cameras ({totalCameras})</h3>
                  
                  <div className="space-y-3">
                    {realCameras.map((camera) => {
                      const cameraDetections = detectionSensors.filter(d => (d as any).camera_entity === camera.entity_id);
                      const activeDetectionsForCamera = cameraDetections.filter(d => d.state === 'on');
                      const isSelected = selectedCamera === camera.entity_id;
                      
                      return (
                        <div
                          key={camera.entity_id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-purple-600 border-purple-500' 
                              : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                          }`}
                          onClick={() => handleCameraSelect(camera.entity_id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Camera className="w-4 h-4 text-white" />
                              <span className="text-white font-medium">{camera.friendly_name}</span>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              camera.state === 'recording' ? 'bg-red-500' : 
                              camera.state === 'streaming' ? 'bg-blue-500' : 'bg-gray-400'
                            }`}></div>
                          </div>
                          
                          <div className="text-xs text-gray-300 mb-2">
                            Status: <span className="capitalize">{camera.state}</span>
                          </div>
                          
                          {/* Active Detections */}
                          {activeDetectionsForCamera.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {activeDetectionsForCamera.slice(0, 3).map((detection) => {
                                const detectionType = (detection as any).detection_type;
                                const IconComponent = getDetectionIcon(detectionType);
                                
                                return (
                                  <div
                                    key={detection.entity_id}
                                    className="flex items-center space-x-1 bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs"
                                  >
                                    <IconComponent className="w-3 h-3" />
                                    <span className="capitalize">{detectionType.replace('_', ' ')}</span>
                                  </div>
                                );
                              })}
                              {activeDetectionsForCamera.length > 3 && (
                                <div className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">
                                  +{activeDetectionsForCamera.length - 3} more
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Camera Feed Area */}
              <div className="flex-1 bg-black">
                {nvrView === 'grid' ? (
                  /* Grid View */
                  <div className="grid grid-cols-2 gap-2 p-4 h-full">
                    {realCameras.map((camera) => (
                      <div
                        key={camera.entity_id}
                        className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                        onClick={() => handleCameraSelect(camera.entity_id)}
                      >
                        <div className="aspect-video bg-gray-900 flex items-center justify-center">
                          <img
                            src={camera.entity_picture || `https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800`}
                            alt={`${camera.friendly_name} feed`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden flex-col items-center text-gray-400">
                            <Camera className="w-12 h-12 mb-2" />
                            <p className="text-sm">Feed Unavailable</p>
                          </div>
                        </div>
                        
                        {/* Camera Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-white font-medium text-sm">{camera.friendly_name}</h4>
                                <p className="text-gray-300 text-xs capitalize">{camera.state}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  camera.state === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                                }`}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Single View */
                  <div className="h-full flex flex-col">
                    {selectedCamera && (
                      <>
                        {(() => {
                          const camera = realCameras.find(c => c.entity_id === selectedCamera);
                          if (!camera) return null;
                          
                          return (
                            <>
                              <div className="flex-1 flex items-center justify-center p-4">
                                <div className="relative w-full max-w-4xl">
                                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                                    <img
                                      src={camera.entity_picture || `https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800`}
                                      alt={`${camera.friendly_name} feed`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                    <div className="hidden flex-col items-center justify-center h-full text-gray-400">
                                      <Camera className="w-16 h-16 mb-4" />
                                      <p>Camera feed unavailable</p>
                                    </div>
                                  </div>
                                  
                                  {/* Live indicator */}
                                  <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/70 rounded-full px-3 py-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-white text-sm font-medium">LIVE</span>
                                  </div>
                                  
                                  {/* Camera info */}
                                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-4">
                                    <h3 className="text-white text-xl font-semibold mb-2">{camera.friendly_name}</h3>
                                    <div className="flex items-center justify-between">
                                      <div className="text-gray-300 text-sm">
                                        Status: <span className="capitalize">{camera.state}</span>
                                      </div>
                                      <div className="text-gray-300 text-sm">
                                        {new Date().toLocaleTimeString()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoRow;