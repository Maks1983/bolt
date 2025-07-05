import React, { useState } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Shield, 
  AlertTriangle, 
  Camera, 
  Eye, 
  EyeOff,
  User,
  Car,
  Baby,
  Flame,
  Volume2,
  Moon,
  Bell,
  X
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
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showCameraFeed, setShowCameraFeed] = useState<string | null>(null);

  // Get real camera entities
  const frontDoorCamera = useRealtimeDevice('camera.g4_doorbell_pro_poe_high_resolution_channel');
  const backyardCamera = useRealtimeDevice('camera.g4_bullet_backyard_high_resolution_channel');

  // Get detection sensors for front door camera
  const frontDoorAnimal = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_animal_detected');
  const frontDoorPerson = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_person_detected');
  const frontDoorVehicle = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_vehicle_detected');
  const frontDoorDoorbell = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_doorbell');
  const frontDoorNightMode = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_is_dark');
  const frontDoorMotion = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_motion');

  // Get detection sensors for backyard camera
  const backyardAnimal = useRealtimeDevice('binary_sensor.g4_bullet_backyard_animal_detected');
  const backyardPerson = useRealtimeDevice('binary_sensor.g4_bullet_backyard_person_detected');
  const backyardVehicle = useRealtimeDevice('binary_sensor.g4_bullet_backyard_vehicle_detected');
  const backyardNightMode = useRealtimeDevice('binary_sensor.g4_bullet_backyard_is_dark');
  const backyardMotion = useRealtimeDevice('binary_sensor.g4_bullet_backyard_motion');

  // Get weather sensors
  const balconyTemp = useRealtimeDevice('sensor.balcony_temperature_sensor_temperature');
  const balconyHumidity = useRealtimeDevice('sensor.balcony_temperature_sensor_humidity');

  const realCameras = [
    {
      id: 'front_door',
      name: 'Front Door Camera',
      entity: frontDoorCamera,
      location: 'Entrance',
      detections: {
        animal: frontDoorAnimal,
        person: frontDoorPerson,
        vehicle: frontDoorVehicle,
        doorbell: frontDoorDoorbell,
        night_mode: frontDoorNightMode,
        motion: frontDoorMotion
      }
    },
    {
      id: 'backyard',
      name: 'Backyard Camera',
      entity: backyardCamera,
      location: 'Living Room',
      detections: {
        animal: backyardAnimal,
        person: backyardPerson,
        vehicle: backyardVehicle,
        night_mode: backyardNightMode,
        motion: backyardMotion
      }
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

  const handleCardClick = (cardType: string) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  const handleCameraFeedToggle = (cameraId: string) => {
    setShowCameraFeed(showCameraFeed === cameraId ? null : cameraId);
  };

  return (
    <>
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Weather Card */}
          <div 
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            onClick={() => handleCardClick('weather')}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Weather</h3>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4" />
                    <span className="text-sm">
                      {balconyTemp ? formatTemperature(balconyTemp.state) : '18.0°C'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm">
                      {balconyHumidity ? formatHumidity(balconyHumidity.state) : '65%'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-3xl">☀️</div>
            </div>
          </div>

          {/* Security Card */}
          <div 
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            onClick={() => handleCardClick('security')}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Security</h3>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">All Systems Normal</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  <span className="text-xs">Armed Away</span>
                </div>
              </div>
              <div className="text-3xl">🛡️</div>
            </div>
          </div>

          {/* NVR Card */}
          <div 
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            onClick={() => handleCardClick('nvr')}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">NVR System</h3>
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span className="text-sm">{realCameras.length} Cameras Online</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-xs">Recording</span>
                </div>
              </div>
              <div className="text-3xl">📹</div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded NVR Modal */}
      {expandedCard === 'nvr' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">NVR Security System</h2>
                  <p className="text-purple-100 mt-1">{realCameras.length} cameras • All systems operational</p>
                </div>
                <button 
                  onClick={() => setExpandedCard(null)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Camera Grid */}
            <div className="p-6 max-h-[calc(95vh-8rem)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {realCameras.map((camera) => (
                  <div key={camera.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                    {/* Camera Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Camera className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{camera.name}</h4>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${camera.entity?.state === 'recording' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                            <span className="text-sm text-gray-600 capitalize">{camera.entity?.state || 'offline'}</span>
                            {camera.detections.night_mode?.state === 'on' && (
                              <Moon className="w-4 h-4 text-purple-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleCameraFeedToggle(camera.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          showCameraFeed === camera.id 
                            ? 'bg-purple-500 text-white hover:bg-purple-600' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {showCameraFeed === camera.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="text-sm font-medium">{showCameraFeed === camera.id ? 'Hide' : 'View'}</span>
                      </button>
                    </div>

                    {/* Camera Feed */}
                    {showCameraFeed === camera.id && (
                      <div className="mb-4">
                        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                          <img
                            src={camera.entity?.entity_picture || `https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800`}
                            alt={`${camera.name} feed`}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Live indicator */}
                          <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/70 rounded-full px-3 py-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-white text-xs font-medium">LIVE</span>
                          </div>
                          
                          {/* Night mode indicator */}
                          {camera.detections.night_mode?.state === 'on' && (
                            <div className="absolute top-3 right-3 bg-purple-500/80 rounded-full p-2">
                              <Moon className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* AI Detection Status */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">AI Detection Status</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(camera.detections).map(([type, sensor]) => {
                          if (!sensor) return null;
                          
                          const IconComponent = getDetectionIcon(type);
                          const isActive = sensor.state === 'on';
                          
                          return (
                            <div
                              key={type}
                              className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${
                                isActive 
                                  ? 'bg-red-50 border-red-200 text-red-700' 
                                  : 'bg-gray-50 border-gray-200 text-gray-600'
                              }`}
                            >
                              {typeof IconComponent === 'string' ? (
                                <span className="text-sm">{IconComponent}</span>
                              ) : (
                                <IconComponent className="w-4 h-4" />
                              )}
                              <div className="flex-1">
                                <div className="text-xs font-medium">{getDetectionLabel(type)}</div>
                                <div className="text-xs opacity-75">
                                  {isActive ? 'Detected' : 'Clear'}
                                </div>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Camera Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Motion Detection</span>
                        </div>
                        {camera.detections.night_mode?.state === 'on' ? (
                          <div className="flex items-center space-x-1">
                            <Moon className="w-4 h-4 text-purple-500" />
                            <span>Night Vision</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <span className="w-4 h-4 text-yellow-500">☀️</span>
                            <span>Day Mode</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs">
                        {Object.values(camera.detections).filter(s => s?.state === 'on').length} active detections
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weather Modal */}
      {expandedCard === 'weather' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Weather Information</h2>
                  <p className="text-blue-100 mt-1">Current conditions from balcony sensors</p>
                </div>
                <button 
                  onClick={() => setExpandedCard(null)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {balconyTemp ? formatTemperature(balconyTemp.state) : '18.0°C'}
                  </div>
                  <div className="text-gray-600">Temperature</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-600 mb-2">
                    {balconyHumidity ? formatHumidity(balconyHumidity.state) : '65%'}
                  </div>
                  <div className="text-gray-600">Humidity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {expandedCard === 'security' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Security Status</h2>
                  <p className="text-green-100 mt-1">All systems operational</p>
                </div>
                <button 
                  onClick={() => setExpandedCard(null)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Alarm System</div>
                      <div className="text-sm text-gray-600">Armed Away</div>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Camera className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Camera System</div>
                      <div className="text-sm text-gray-600">{realCameras.length} cameras recording</div>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoRow;