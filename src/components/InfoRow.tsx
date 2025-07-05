import React, { useState } from 'react';
import { Shield, Thermometer, Droplets, Wifi, Camera, ChevronDown, ChevronUp, Eye, EyeOff, User, Car, AlertTriangle, Moon, Bell, Volume2, Flame } from 'lucide-react';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';

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
  const [cameraFeeds, setCameraFeeds] = useState<Record<string, boolean>>({});

  // Get balcony weather sensors for weather card
  const balconyTemp = useRealtimeDevice('sensor.balcony_temperature_sensor_temperature');
  const balconyHumidity = useRealtimeDevice('sensor.balcony_temperature_sensor_humidity');

  // NVR camera entities and detection sensors
  const frontDoorCamera = useRealtimeDevice('camera.g4_doorbell_pro_poe_high_resolution_channel');
  const backyardCamera = useRealtimeDevice('camera.g4_bullet_backyard_high_resolution_channel');
  
  // Front door detection sensors
  const frontDoorPerson = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_person_detected');
  const frontDoorVehicle = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_vehicle_detected');
  const frontDoorAnimal = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_animal_detected');
  const frontDoorDoorbell = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_doorbell');
  const frontDoorNightMode = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_is_dark');
  const frontDoorSpeaking = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_speaking_detected');
  
  // Backyard detection sensors
  const backyardPerson = useRealtimeDevice('binary_sensor.g4_bullet_backyard_person_detected');
  const backyardVehicle = useRealtimeDevice('binary_sensor.g4_bullet_backyard_vehicle_detected');
  const backyardAnimal = useRealtimeDevice('binary_sensor.g4_bullet_backyard_animal_detected');
  const backyardNightMode = useRealtimeDevice('binary_sensor.g4_bullet_backyard_is_dark');
  const backyardSpeaking = useRealtimeDevice('binary_sensor.g4_bullet_backyard_speaking_detected');

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const toggleCameraFeed = (cameraId: string) => {
    setCameraFeeds(prev => ({
      ...prev,
      [cameraId]: !prev[cameraId]
    }));
  };

  const infoCards = [
    {
      id: 'security',
      title: 'Security',
      value: 'Armed',
      subtitle: 'All systems normal',
      icon: Shield,
      color: 'emerald',
      expandable: false
    },
    {
      id: 'weather',
      title: 'Weather',
      value: balconyTemp ? `${Number(balconyTemp.state).toFixed(1)}°C` : '18.0°C',
      subtitle: balconyHumidity ? `${Math.round(Number(balconyHumidity.state))}% humidity` : '65% humidity',
      icon: Thermometer,
      color: 'blue',
      expandable: false
    },
    {
      id: 'network',
      title: 'Network',
      value: 'Online',
      subtitle: 'All devices connected',
      icon: Wifi,
      color: 'green',
      expandable: false
    },
    {
      id: 'nvr',
      title: 'NVR',
      value: `${cameras.length} Cameras`,
      subtitle: 'All recording',
      icon: Camera,
      color: 'purple',
      expandable: true
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {infoCards.map((card) => (
          <div key={card.id} className="space-y-4">
            <div
              className={`p-4 rounded-2xl border transition-all duration-200 ${getColorClasses(card.color)} ${
                card.expandable ? 'cursor-pointer hover:shadow-md' : ''
              }`}
              onClick={card.expandable ? () => toggleCard(card.id) : undefined}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <card.icon className="w-5 h-5" />
                  <div>
                    <h3 className="font-semibold">{card.title}</h3>
                    <p className="text-sm opacity-80">{card.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{card.value}</div>
                  {card.expandable && (
                    <div className="mt-1">
                      {expandedCard === card.id ? (
                        <ChevronUp className="w-4 h-4 mx-auto" />
                      ) : (
                        <ChevronDown className="w-4 h-4 mx-auto" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* NVR Expanded Content */}
            {card.id === 'nvr' && expandedCard === 'nvr' && (
              <div className="space-y-4">
                {/* Front Door Camera Feed */}
                {frontDoorCamera && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${frontDoorCamera.state === 'recording' ? 'bg-red-100' : 'bg-blue-100'}`}>
                          <Camera className={`w-5 h-5 ${frontDoorCamera.state === 'recording' ? 'text-red-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{frontDoorCamera.friendly_name}</h4>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${frontDoorCamera.state === 'recording' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                            <span className="text-sm text-gray-600 capitalize">{frontDoorCamera.state}</span>
                            {frontDoorNightMode?.state === 'on' && <Moon className="w-4 h-4 text-purple-500" />}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCameraFeed('front_door')}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          cameraFeeds.front_door 
                            ? 'bg-blue-500 text-white hover:bg-blue-600' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {cameraFeeds.front_door ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="text-sm font-medium">{cameraFeeds.front_door ? 'Hide' : 'View'}</span>
                      </button>
                    </div>

                    {/* Camera Feed */}
                    {cameraFeeds.front_door && (
                      <div className="mb-4">
                        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                          <img
                            src={frontDoorCamera.entity_picture || `https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800`}
                            alt="Front Door Camera feed"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800';
                            }}
                          />
                          <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/70 rounded-full px-3 py-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-white text-xs font-medium">LIVE</span>
                          </div>
                          {frontDoorNightMode?.state === 'on' && (
                            <div className="absolute top-3 right-3 bg-purple-500/80 rounded-full p-2">
                              <Moon className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Detection Status */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { sensor: frontDoorPerson, icon: User, label: 'Person' },
                        { sensor: frontDoorVehicle, icon: Car, label: 'Vehicle' },
                        { sensor: frontDoorAnimal, icon: '🐾', label: 'Animal' },
                        { sensor: frontDoorDoorbell, icon: Bell, label: 'Doorbell' },
                        { sensor: frontDoorSpeaking, icon: Volume2, label: 'Speaking' }
                      ].map(({ sensor, icon, label }) => {
                        const isActive = sensor?.state === 'on';
                        const IconComponent = typeof icon === 'string' ? null : icon;
                        
                        return (
                          <div
                            key={label}
                            className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${
                              isActive 
                                ? 'bg-red-50 border-red-200 text-red-700' 
                                : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}
                          >
                            {IconComponent ? (
                              <IconComponent className="w-4 h-4" />
                            ) : (
                              <span className="text-sm">{icon}</span>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">{label}</div>
                              <div className="text-xs opacity-75">
                                {isActive ? 'Active' : 'Clear'}
                              </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Backyard Camera Feed */}
                {backyardCamera && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${backyardCamera.state === 'recording' ? 'bg-red-100' : 'bg-blue-100'}`}>
                          <Camera className={`w-5 h-5 ${backyardCamera.state === 'recording' ? 'text-red-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{backyardCamera.friendly_name}</h4>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${backyardCamera.state === 'recording' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                            <span className="text-sm text-gray-600 capitalize">{backyardCamera.state}</span>
                            {backyardNightMode?.state === 'on' && <Moon className="w-4 h-4 text-purple-500" />}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCameraFeed('backyard')}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          cameraFeeds.backyard 
                            ? 'bg-blue-500 text-white hover:bg-blue-600' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {cameraFeeds.backyard ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="text-sm font-medium">{cameraFeeds.backyard ? 'Hide' : 'View'}</span>
                      </button>
                    </div>

                    {/* Camera Feed */}
                    {cameraFeeds.backyard && (
                      <div className="mb-4">
                        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                          <img
                            src={backyardCamera.entity_picture || `https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800`}
                            alt="Backyard Camera feed"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800';
                            }}
                          />
                          <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/70 rounded-full px-3 py-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-white text-xs font-medium">LIVE</span>
                          </div>
                          {backyardNightMode?.state === 'on' && (
                            <div className="absolute top-3 right-3 bg-purple-500/80 rounded-full p-2">
                              <Moon className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Detection Status */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { sensor: backyardPerson, icon: User, label: 'Person' },
                        { sensor: backyardVehicle, icon: Car, label: 'Vehicle' },
                        { sensor: backyardAnimal, icon: '🐾', label: 'Animal' },
                        { sensor: backyardSpeaking, icon: Volume2, label: 'Speaking' }
                      ].map(({ sensor, icon, label }) => {
                        const isActive = sensor?.state === 'on';
                        const IconComponent = typeof icon === 'string' ? null : icon;
                        
                        return (
                          <div
                            key={label}
                            className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${
                              isActive 
                                ? 'bg-red-50 border-red-200 text-red-700' 
                                : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}
                          >
                            {IconComponent ? (
                              <IconComponent className="w-4 h-4" />
                            ) : (
                              <span className="text-sm">{icon}</span>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">{label}</div>
                              <div className="text-xs opacity-75">
                                {isActive ? 'Active' : 'Clear'}
                              </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoRow;