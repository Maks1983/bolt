import React, { useState } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Zap, 
  Wifi, 
  Shield, 
  Camera, 
  X, 
  Play,
  Eye,
  AlertTriangle,
  User,
  Car,
  Baby,
  Flame,
  Volume2,
  Moon,
  Bell
} from 'lucide-react';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';
import { formatTemperature, formatHumidity } from '../utils/deviceHelpers';

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
  const [showNVR, setShowNVR] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  // Get real camera entities from Home Assistant
  const frontDoorCamera = useRealtimeDevice('camera.g4_doorbell_pro_poe_high_resolution_channel');
  const backyardCamera = useRealtimeDevice('camera.g4_bullet_backyard_high_resolution_channel');

  // Get detection sensors for front door camera
  const frontDoorDetections = {
    person: useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_person_detected'),
    animal: useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_animal_detected'),
    vehicle: useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_vehicle_detected'),
    motion: useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_motion'),
    doorbell: useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_doorbell'),
    baby_cry: useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_baby_cry_detected'),
    speaking: useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_speaking_detected'),
    smoke_alarm: useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_smoke_alarm_detected'),
    co_alarm: useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_co_alarm_detected'),
    night_mode: useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_is_dark')
  };

  // Get detection sensors for backyard camera
  const backyardDetections = {
    person: useRealtimeDevice('binary_sensor.g4_bullet_backyard_person_detected'),
    animal: useRealtimeDevice('binary_sensor.g4_bullet_backyard_animal_detected'),
    vehicle: useRealtimeDevice('binary_sensor.g4_bullet_backyard_vehicle_detected'),
    motion: useRealtimeDevice('binary_sensor.g4_bullet_backyard_motion'),
    baby_cry: useRealtimeDevice('binary_sensor.g4_bullet_backyard_baby_cry_detected'),
    speaking: useRealtimeDevice('binary_sensor.g4_bullet_backyard_speaking_detected'),
    smoke_alarm: useRealtimeDevice('binary_sensor.g4_bullet_backyard_smoke_alarm_detected'),
    co_alarm: useRealtimeDevice('binary_sensor.g4_bullet_backyard_co_alarm_detected'),
    night_mode: useRealtimeDevice('binary_sensor.g4_bullet_backyard_is_dark')
  };

  // Get weather sensors
  const balconyTemp = useRealtimeDevice('sensor.balcony_temperature_sensor_temperature');
  const balconyHumidity = useRealtimeDevice('sensor.balcony_temperature_sensor_humidity');

  // Real camera data from Home Assistant
  const realCameras = [
    {
      entity_id: 'camera.g4_doorbell_pro_poe_high_resolution_channel',
      name: 'Front Door Camera',
      location: 'Entrance',
      device: frontDoorCamera,
      detections: frontDoorDetections,
      backgroundImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      entity_id: 'camera.g4_bullet_backyard_high_resolution_channel',
      name: 'Backyard Camera',
      location: 'Living Room',
      device: backyardCamera,
      detections: backyardDetections,
      backgroundImage: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case 'person': return User;
      case 'animal': return '🐾';
      case 'vehicle': return Car;
      case 'motion': return '👋';
      case 'doorbell': return Bell;
      case 'baby_cry': return Baby;
      case 'speaking': return Volume2;
      case 'smoke_alarm': return Flame;
      case 'co_alarm': return AlertTriangle;
      case 'night_mode': return Moon;
      default: return AlertTriangle;
    }
  };

  const getDetectionLabel = (type: string) => {
    switch (type) {
      case 'person': return 'Person';
      case 'animal': return 'Animal';
      case 'vehicle': return 'Vehicle';
      case 'motion': return 'Motion';
      case 'doorbell': return 'Doorbell';
      case 'baby_cry': return 'Baby Cry';
      case 'speaking': return 'Speaking';
      case 'smoke_alarm': return 'Smoke';
      case 'co_alarm': return 'CO Alarm';
      case 'night_mode': return 'Night Mode';
      default: return type.replace('_', ' ');
    }
  };

  // Count active detections across all cameras
  const activeDetections = realCameras.reduce((count, camera) => {
    return count + Object.values(camera.detections).filter(sensor => sensor?.state === 'on').length;
  }, 0);

  return (
    <>
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Weather Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold opacity-90">Weather</h3>
              <Thermometer className="w-5 h-5 opacity-80" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                {balconyTemp ? formatTemperature(balconyTemp.state) : '18.0°C'}
              </div>
              <div className="flex items-center space-x-2 text-sm opacity-90">
                <Droplets className="w-4 h-4" />
                <span>{balconyHumidity ? formatHumidity(balconyHumidity.state) : '65%'}</span>
              </div>
            </div>
          </div>

          {/* Energy Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold opacity-90">Energy</h3>
              <Zap className="w-5 h-5 opacity-80" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">2.4 kW</div>
              <div className="text-sm opacity-90">Current usage</div>
            </div>
          </div>

          {/* Network Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold opacity-90">Network</h3>
              <Wifi className="w-5 h-5 opacity-80" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">47 devices</div>
              <div className="text-sm opacity-90">Connected</div>
            </div>
          </div>

          {/* Security/NVR Card */}
          <div 
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-lg cursor-pointer hover:from-red-600 hover:to-red-700 transition-all"
            onClick={() => setShowNVR(true)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold opacity-90">Security</h3>
              <div className="flex items-center space-x-1">
                <Camera className="w-5 h-5 opacity-80" />
                {activeDetections > 0 && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{realCameras.length} cameras</div>
              <div className="text-sm opacity-90">
                {activeDetections > 0 ? `${activeDetections} active detections` : 'All clear'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NVR Modal */}
      {showNVR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-500 to-red-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Security System</h2>
                    <p className="text-red-100">Network Video Recorder</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowNVR(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(95vh-8rem)] overflow-y-auto">
              {selectedCamera ? (
                /* Single Camera View */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      {realCameras.find(c => c.entity_id === selectedCamera)?.name}
                    </h3>
                    <button
                      onClick={() => setSelectedCamera(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Back to Grid
                    </button>
                  </div>
                  
                  {(() => {
                    const camera = realCameras.find(c => c.entity_id === selectedCamera);
                    if (!camera) return null;
                    
                    return (
                      <div className="space-y-6">
                        {/* Large Camera Feed */}
                        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                          <img
                            src={camera.device?.entity_picture || camera.backgroundImage}
                            alt={`${camera.name} feed`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/70 rounded-full px-3 py-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-white text-sm font-medium">LIVE</span>
                          </div>
                          {camera.detections.night_mode?.state === 'on' && (
                            <div className="absolute top-4 right-4 bg-purple-500/80 rounded-full p-2">
                              <Moon className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Detection Status */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Detection Status</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.entries(camera.detections).map(([type, sensor]) => {
                              if (!sensor) return null;
                              const IconComponent = getDetectionIcon(type);
                              const isActive = sensor.state === 'on';
                              
                              return (
                                <div
                                  key={type}
                                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                                    isActive 
                                      ? 'bg-red-50 border-red-200 text-red-700' 
                                      : 'bg-gray-50 border-gray-200 text-gray-600'
                                  }`}
                                >
                                  {typeof IconComponent === 'string' ? (
                                    <span className="text-lg">{IconComponent}</span>
                                  ) : (
                                    <IconComponent className="w-5 h-5" />
                                  )}
                                  <div className="flex-1">
                                    <div className="font-medium">{getDetectionLabel(type)}</div>
                                    <div className="text-sm opacity-75">
                                      {isActive ? 'Detected' : 'Clear'}
                                    </div>
                                  </div>
                                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* Camera Grid View */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Camera Overview</h3>
                    <div className="text-sm text-gray-600">
                      {activeDetections > 0 && (
                        <span className="text-red-600 font-medium">
                          {activeDetections} active detection{activeDetections !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {realCameras.map((camera) => {
                      const activeDetectionCount = Object.values(camera.detections).filter(sensor => sensor?.state === 'on').length;
                      
                      return (
                        <div key={camera.entity_id} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                          {/* Camera Feed */}
                          <div className="relative aspect-video bg-black">
                            <img
                              src={camera.device?.entity_picture || camera.backgroundImage}
                              alt={`${camera.name} feed`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/70 rounded-full px-3 py-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-white text-xs font-medium">LIVE</span>
                            </div>
                            {camera.detections.night_mode?.state === 'on' && (
                              <div className="absolute top-3 right-3 bg-purple-500/80 rounded-full p-2">
                                <Moon className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {activeDetectionCount > 0 && (
                              <div className="absolute bottom-3 left-3 bg-red-500/90 rounded-full px-3 py-1">
                                <span className="text-white text-xs font-medium">
                                  {activeDetectionCount} detection{activeDetectionCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Camera Info */}
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{camera.name}</h4>
                                <p className="text-sm text-gray-600">{camera.location}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setSelectedCamera(camera.entity_id)}
                                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Active Detections */}
                            {activeDetectionCount > 0 && (
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-gray-700">Active Detections:</div>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(camera.detections).map(([type, sensor]) => {
                                    if (!sensor || sensor.state !== 'on') return null;
                                    const IconComponent = getDetectionIcon(type);
                                    
                                    return (
                                      <div key={type} className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                                        {typeof IconComponent === 'string' ? (
                                          <span>{IconComponent}</span>
                                        ) : (
                                          <IconComponent className="w-3 h-3" />
                                        )}
                                        <span>{getDetectionLabel(type)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoRow;