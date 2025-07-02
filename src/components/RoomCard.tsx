import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, Thermometer, User, X, Clock, 
  Droplets, DoorOpen, DoorClosed, Columns2,
  Waves, Flame, Wind, Shield, AlertTriangle, Fan
} from 'lucide-react';
import { useRoomDevices } from '../hooks/useDeviceUpdates';
import LightControl from './DeviceControls/LightControl';
import CoverControl from './DeviceControls/CoverControl';
import MediaPlayerControl from './DeviceControls/MediaPlayerControl';
import FanControl from './DeviceControls/FanControl';
import LockControl from './DeviceControls/LockControl';

interface RoomCardProps {
  roomName: string;
  floor: string;
  backgroundImage: string;
}

const RoomCard: React.FC<RoomCardProps> = ({ roomName, floor, backgroundImage }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Use real-time room devices hook
  const roomDevices = useRoomDevices(roomName);

  // Calculate live room statistics from ONLY configured entities using useMemo
  const roomStats = useMemo(() => {
    const temperatureSensor = roomDevices.sensors.find(s => (s as any).sensor_type === 'temperature');
    const humiditySensor = roomDevices.sensors.find(s => (s as any).sensor_type === 'humidity');
    const motionSensor = roomDevices.binarySensors.find(s => (s as any).sensor_type === 'motion');
    const windowSensors = roomDevices.binarySensors.filter(s => (s as any).sensor_type === 'window');
    const doorSensors = roomDevices.binarySensors.filter(s => (s as any).sensor_type === 'door');
    const floodSensors = roomDevices.binarySensors.filter(s => (s as any).sensor_type === 'flood');
    const smokeSensors = roomDevices.binarySensors.filter(s => (s as any).sensor_type === 'smoke');

    // Live calculated values - use defaults only if no sensors are configured
    const lightsOn = roomDevices.lights.filter(l => l.state === 'on').length;
    const totalLights = roomDevices.lights.length;
    const fansOn = roomDevices.fans.filter(f => f.state === 'on').length;
    const totalFans = roomDevices.fans.length;
    const temperature = temperatureSensor ? Number(temperatureSensor.state) : null;
    const humidity = humiditySensor ? Number(humiditySensor.state) : null;
    const presence = motionSensor ? motionSensor.state === 'on' : null;
    const windowOpen = windowSensors.some(s => s.state === 'on') || doorSensors.some(s => s.state === 'on');
    const floodAlert = floodSensors.some(s => s.state === 'on');
    const smokeAlert = smokeSensors.some(s => s.state === 'on');

    // CRITICAL DEBUG LOG - This should show when lights change
    console.log(`🏠 RoomCard ${roomName}: lights=${lightsOn}/${totalLights}, fans=${fansOn}/${totalFans}, temp=${temperature}, humidity=${humidity}, presence=${presence}, flood=${floodAlert}, smoke=${smokeAlert}, devices=${roomDevices.lights.map(l => `${l.entity_id}:${l.state}`).join(',')}`);

    return {
      lightsOn,
      totalLights,
      fansOn,
      totalFans,
      temperature,
      humidity,
      presence,
      windowOpen,
      floodAlert,
      smokeAlert,
      temperatureSensor,
      humiditySensor,
      motionSensor,
      windowSensors,
      doorSensors,
      floodSensors,
      smokeSensors
    };
  }, [roomName, roomDevices]);

  const lastUpdate = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  const getSensorAlerts = () => {
    const alerts = [];
    
    // Check for flood sensors
    if (roomStats.floodAlert) {
      alerts.push({ type: 'flood', icon: Waves, color: 'text-blue-600', bg: 'bg-blue-100' });
    }
    
    // Check for smoke sensors
    if (roomStats.smokeAlert) {
      alerts.push({ type: 'smoke', icon: Flame, color: 'text-red-600', bg: 'bg-red-100' });
    }
    
    return alerts;
  };

  const getOpenCloseIcon = () => {
    const roomNameLower = roomName.toLowerCase();
    if (roomNameLower.includes('entrance')) {
      return roomStats.windowOpen ? DoorOpen : DoorClosed;
    }
    return Columns2;
  };

  const getOpenCloseText = () => {
    const roomNameLower = roomName.toLowerCase();
    if (roomNameLower.includes('entrance')) {
      return roomStats.windowOpen ? 'Open' : 'Closed';
    }
    return roomStats.windowOpen ? 'Open' : 'Closed';
  };

  // Don't render room card if no devices are configured for this room
  const totalDevices = Object.values(roomDevices).flat().length;
  if (totalDevices === 0) {
    console.log(`⚠️ No devices configured for room: ${roomName}`);
    return null;
  }

  return (
    <>
      <div 
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] min-w-[320px] border border-gray-200/50"
        onClick={() => setExpanded(true)}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 backdrop-blur-[1px]"></div>
        </div>
        
        {/* Content */}
        <div className="relative p-6 h-44 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{roomName}</h3>
            </div>
            <div className="flex items-center space-x-2">
              {/* Presence indicator - only show if motion sensor is configured */}
              {roomStats.motionSensor && (
                <div className={`p-2 ${roomStats.presence ? 'bg-emerald-500/90' : 'bg-gray-500/90'} rounded-full shadow-lg backdrop-blur-sm`}>
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              {/* Sensor alerts */}
              {getSensorAlerts().map((alert, index) => (
                <div key={index} className={`p-2 ${alert.bg}/90 rounded-full shadow-lg backdrop-blur-sm`}>
                  <alert.icon className={`w-4 h-4 ${alert.color}`} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Spacer */}
          <div className="flex-1"></div>
          
          {/* Information */}
          <div className="space-y-3">
            {/* Lights and Fans Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Lights - only show if lights are configured */}
                {roomStats.totalLights > 0 && (
                  <div className="flex items-center space-x-2">
                    <Lightbulb
                      className={`w-5 h-5 ${
                        roomStats.lightsOn > 0 ? 'text-yellow-400' : 'text-gray-400'
                      }`}
                    />
                    <span className="text-white text-sm font-semibold">
                      {roomStats.lightsOn}/{roomStats.totalLights} lights
                    </span>
                  </div>
                )}
                
                {/* Fans - only show if fans are configured */}
                {roomStats.totalFans > 0 && (
                  <div className="flex items-center space-x-2">
                    <Fan
                      className={`w-5 h-5 ${
                        roomStats.fansOn > 0 ? 'text-cyan-400' : 'text-gray-400'
                      }`}
                    />
                    <span className="text-white text-sm font-semibold">
                      {roomStats.fansOn}/{roomStats.totalFans} fans
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Temperature, humidity, and window/door status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Temperature - only show if sensor is configured */}
                {roomStats.temperature !== null && (
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-5 h-5 text-blue-400" />
                    <span className="text-white text-sm font-semibold">{roomStats.temperature}°C</span>
                  </div>
                )}
                {/* Humidity - only show if sensor is configured */}
                {roomStats.humidity !== null && (
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-300" />
                    <span className="text-white/90 text-sm font-medium">{roomStats.humidity}%</span>
                  </div>
                )}
              </div>
              {/* Window/Door status - only show if sensors are configured */}
              {(roomStats.windowSensors.length > 0 || roomStats.doorSensors.length > 0) && (
                <div className="flex items-center space-x-2 text-white/80">
                  {React.createElement(getOpenCloseIcon(), { 
                    className: `w-4 h-4 ${roomStats.windowOpen ? 'text-orange-400' : 'text-gray-300'}` 
                  })}
                  <span className="text-sm font-medium">{getOpenCloseText()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Modal */}
      {expanded && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="relative h-48 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center scale-110"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 backdrop-blur-sm"></div>
              </div>
              <div className="relative p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1">{roomName}</h2>
                    </div>
                    {roomStats.motionSensor && (
                      <div className={`p-3 ${roomStats.presence ? 'bg-emerald-500/90' : 'bg-gray-500/90'} rounded-full shadow-lg backdrop-blur-sm`}>
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {getSensorAlerts().map((alert, index) => (
                      <div key={index} className={`p-3 ${alert.bg}/90 rounded-full shadow-lg backdrop-blur-sm`}>
                        <alert.icon className={`w-5 h-5 ${alert.color}`} />
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setExpanded(false)}
                    className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm shadow-lg"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
                
                <div className="grid grid-cols-4 gap-6">
                  {/* Temperature - only show if configured */}
                  {roomStats.temperature !== null && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{roomStats.temperature}°C</div>
                      <div className="text-white/80 text-sm font-medium">Temperature</div>
                    </div>
                  )}
                  {/* Humidity - only show if configured */}
                  {roomStats.humidity !== null && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{roomStats.humidity}%</div>
                      <div className="text-white/80 text-sm font-medium">Humidity</div>
                    </div>
                  )}
                  {/* Window/Door status - only show if configured */}
                  {(roomStats.windowSensors.length > 0 || roomStats.doorSensors.length > 0) && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{getOpenCloseText()}</div>
                      <div className="text-white/80 text-sm font-medium">Status</div>
                    </div>
                  )}
                  {/* Device Count */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{totalDevices}</div>
                    <div className="text-white/80 text-sm font-medium">Devices</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="max-h-[calc(95vh-12rem)] overflow-y-auto">
              <div className="p-6 space-y-8">
                
                {/* Lighting Controls */}
                {roomDevices.lights.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-yellow-100 rounded-xl">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Lighting Controls</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {roomDevices.lights.map((light) => (
                        <LightControl key={light.entity_id} device={light as any} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover Controls (Blinds/Curtains) */}
                {roomDevices.covers.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <Columns2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Window Covers</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {roomDevices.covers.map((cover) => (
                        <CoverControl 
                          key={cover.entity_id} 
                          device={cover as any}
                          type={cover.friendly_name.toLowerCase().includes('curtain') ? 'curtain' : 'blind'}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Fan Controls */}
                {roomDevices.fans.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-cyan-100 rounded-xl">
                        <Wind className="w-5 h-5 text-cyan-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Fans</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {roomDevices.fans.map((fan) => (
                        <FanControl key={fan.entity_id} device={fan as any} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Controls */}
                {roomDevices.mediaPlayers.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-xl">
                        <Lightbulb className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Media Controls</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {roomDevices.mediaPlayers.map((player) => (
                        <MediaPlayerControl key={player.entity_id} device={player as any} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Controls */}
                {roomDevices.locks.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-red-100 rounded-xl">
                        <Shield className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Security</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {roomDevices.locks.map((lock) => (
                        <LockControl key={lock.entity_id} device={lock as any} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sensors Information */}
                {(roomDevices.sensors.length > 0 || roomDevices.binarySensors.length > 0) && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-xl">
                        <Thermometer className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Sensors</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Temperature Sensors */}
                      {roomDevices.sensors.filter(s => (s as any).sensor_type === 'temperature').map((sensor) => (
                        <div key={sensor.entity_id} className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/50">
                          <div className="flex items-center space-x-3">
                            <Thermometer className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-semibold text-gray-900">{sensor.friendly_name}</h4>
                              <p className="text-lg font-bold text-blue-600">{sensor.state}°C</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Humidity Sensors */}
                      {roomDevices.sensors.filter(s => (s as any).sensor_type === 'humidity').map((sensor) => (
                        <div key={sensor.entity_id} className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/50">
                          <div className="flex items-center space-x-3">
                            <Droplets className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-semibold text-gray-900">{sensor.friendly_name}</h4>
                              <p className="text-lg font-bold text-blue-600">{sensor.state}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Motion Sensors */}
                      {roomDevices.binarySensors.filter(s => (s as any).sensor_type === 'motion').map((sensor) => (
                        <div key={sensor.entity_id} className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/50">
                          <div className="flex items-center space-x-3">
                            <User className={`w-5 h-5 ${sensor.state === 'on' ? 'text-green-600' : 'text-gray-400'}`} />
                            <div>
                              <h4 className="font-semibold text-gray-900">{sensor.friendly_name}</h4>
                              <p className={`text-lg font-bold ${sensor.state === 'on' ? 'text-green-600' : 'text-gray-400'}`}>
                                {sensor.state === 'on' ? 'Motion' : 'No Motion'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Door/Window Sensors */}
                      {roomDevices.binarySensors.filter(s => 
                        (s as any).sensor_type === 'door' || (s as any).sensor_type === 'window'
                      ).map((sensor) => (
                        <div key={sensor.entity_id} className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/50">
                          <div className="flex items-center space-x-3">
                            {(sensor as any).sensor_type === 'door' ? (
                              sensor.state === 'on' ? <DoorOpen className="w-5 h-5 text-orange-600" /> : <DoorClosed className="w-5 h-5 text-green-600" />
                            ) : (
                              <Columns2 className={`w-5 h-5 ${sensor.state === 'on' ? 'text-orange-600' : 'text-green-600'}`} />
                            )}
                            <div>
                              <h4 className="font-semibold text-gray-900">{sensor.friendly_name}</h4>
                              <p className={`text-lg font-bold ${sensor.state === 'on' ? 'text-orange-600' : 'text-green-600'}`}>
                                {sensor.state === 'on' ? 'Open' : 'Closed'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Flood Sensors */}
                      {roomDevices.binarySensors.filter(s => (s as any).sensor_type === 'flood').map((sensor) => (
                        <div key={sensor.entity_id} className={`bg-gray-50/80 rounded-2xl p-4 border ${sensor.state === 'on' ? 'border-red-300 bg-red-50' : 'border-gray-200/50'}`}>
                          <div className="flex items-center space-x-3">
                            <Waves className={`w-5 h-5 ${sensor.state === 'on' ? 'text-red-600' : 'text-blue-600'}`} />
                            <div>
                              <h4 className="font-semibold text-gray-900">{sensor.friendly_name}</h4>
                              <p className={`text-lg font-bold ${sensor.state === 'on' ? 'text-red-600' : 'text-green-600'}`}>
                                {sensor.state === 'on' ? 'FLOOD DETECTED' : 'Normal'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Smoke Sensors */}
                      {roomDevices.binarySensors.filter(s => (s as any).sensor_type === 'smoke').map((sensor) => (
                        <div key={sensor.entity_id} className={`bg-gray-50/80 rounded-2xl p-4 border ${sensor.state === 'on' ? 'border-red-300 bg-red-50' : 'border-gray-200/50'}`}>
                          <div className="flex items-center space-x-3">
                            <Flame className={`w-5 h-5 ${sensor.state === 'on' ? 'text-red-600' : 'text-gray-600'}`} />
                            <div>
                              <h4 className="font-semibold text-gray-900">{sensor.friendly_name}</h4>
                              <p className={`text-lg font-bold ${sensor.state === 'on' ? 'text-red-600' : 'text-green-600'}`}>
                                {sensor.state === 'on' ? 'SMOKE DETECTED' : 'Normal'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Last updated: {lastUpdate}</span>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setExpanded(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomCard;