import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Lightbulb, Thermometer, User, X, Clock, 
  Droplets, DoorOpen, DoorClosed, Columns2,
  Waves, Flame, Wind, Shield, AlertTriangle, Fan, Lock, Unlock, Camera
} from 'lucide-react';
import { useRoomDevices } from '../hooks/useDeviceUpdates';
import { formatTemperature, formatHumidity } from '../utils/deviceHelpers';
import LightControl from './DeviceControls/LightControl';
import CoverControl from './DeviceControls/CoverControl';
import MediaPlayerControl from './DeviceControls/MediaPlayerControl';
import FanControl from './DeviceControls/FanControl';
import LockControl from './DeviceControls/LockControl';
import CameraControl from './DeviceControls/CameraControl';

interface RoomCardProps {
  roomName: string;
  floor: string;
  backgroundImage: string;
}

const RoomCard: React.FC<RoomCardProps> = ({ roomName, floor, backgroundImage }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (expanded) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [expanded]);
  
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
    
    // Lock status
    const lockDevices = roomDevices.locks;
    const hasLocks = lockDevices.length > 0;
    const isLocked = lockDevices.some(l => l.state === 'locked');

    // CRITICAL DEBUG LOG - This should show when lights change
    console.log(`🏠 RoomCard ${roomName}: lights=${lightsOn}/${totalLights}, fans=${fansOn}/${totalFans}, temp=${temperature}, humidity=${humidity}, presence=${presence}, flood=${floodAlert}, smoke=${smokeAlert}, locks=${hasLocks ? (isLocked ? 'locked' : 'unlocked') : 'none'}, devices=${roomDevices.lights.map(l => `${l.entity_id}:${l.state}`).join(',')}`);

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
      hasLocks,
      isLocked,
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

  // Render expandable modal using portal to document.body
  const renderExpandableModal = () => {
    if (!expanded) return null;

    return createPortal(
      <div className="expandable-window">
        <div className="expandable-window-container">
          <div className="expandable-window-content seamless-modal rounded-3xl max-w-4xl animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="relative h-48 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center scale-110"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30"></div>
              </div>
              <div className="relative p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{roomName}</h2>
                    </div>
                    {/* Sensor Icons in Modal - Same layout as card */}
                    <div className="flex items-center space-x-3">
                      {roomStats.motionSensor && (
                        <div className={`p-3 ${roomStats.presence ? 'primary-glass' : 'glass-card'} rounded-full`}>
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {(roomStats.windowSensors.length > 0 || roomStats.doorSensors.length > 0) && (
                        <div className={`p-3 ${roomStats.windowOpen ? 'bg-orange-500/60' : 'glass-card'} rounded-full`}>
                          {React.createElement(getOpenCloseIcon(), { 
                            className: `w-4 h-4 ${roomStats.windowOpen ? 'text-white' : 'text-white'}` 
                          })}                        
                        </div>
                      )}
                      {roomStats.floodSensors.length > 0 && (
                        <div className={`p-3 ${roomStats.floodAlert ? 'bg-red-500/60' : 'glass-card'} rounded-full`}>
                          <Waves className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {roomStats.smokeSensors.length > 0 && (
                        <div className={`p-3 ${roomStats.smokeAlert ? 'bg-red-500/60' : 'glass-card'} rounded-full`}>
                          <Flame className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => setExpanded(false)}
                    className="unified-button p-3 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  {roomStats.temperature !== null && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{formatTemperature(roomStats.temperature)}</div>
                      <div className="text-white/80 text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Temperature</div>
                    </div>
                  )}
                  {roomStats.humidity !== null && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{formatHumidity(roomStats.humidity)}</div>
                      <div className="text-white/80 text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Humidity</div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    {roomDevices.locks.map((lock) => (
                      <div key={lock.entity_id}>
                        <LockControl device={lock as any} variant="icon"  />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-8">
              
              {/* Lighting Controls */}
              {roomDevices.lights.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 glass-card rounded-xl">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Lighting Controls</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {roomDevices.lights.map((light) => (
                      <LightControl key={light.entity_id} device={light as any} />
                    ))}
                  </div>
                </div>
              )}

              {/* Security Controls */}
              {roomDevices.locks.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 glass-card rounded-xl">
                      <Shield className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Security</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {roomDevices.locks.map((lock) => (
                      <LockControl key={lock.entity_id} device={lock as any} variant="card" />
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Controls (Blinds/Curtains) */}
              {roomDevices.covers.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 glass-card rounded-xl">
                      <Columns2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Window Covers</h3>
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
                    <div className="p-2 glass-card rounded-xl">
                      <Wind className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Fans</h3>
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
                    <div className="p-2 glass-card rounded-xl">
                      <Lightbulb className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Media Controls</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {roomDevices.mediaPlayers.map((player) => (
                      <MediaPlayerControl key={player.entity_id} device={player as any} />
                    ))}
                  </div>
                </div>
              )}

              {/* Camera Controls */}
              {roomDevices.cameras.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 glass-card rounded-xl">
                      <Camera className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Security Cameras</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {roomDevices.cameras.map((camera) => (
                      <CameraControl key={camera.entity_id} device={camera as any} />
                    ))}
                  </div>
                </div>
              )}

              {/* Sensors Information */}
              {(roomDevices.sensors.length > 0 || roomDevices.binarySensors.length > 0) && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 glass-card rounded-xl">
                      <Thermometer className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Sensors</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Temperature Sensors */}
                    {roomDevices.sensors.filter(s => (s as any).sensor_type === 'temperature').map((sensor) => (
                      <div key={sensor.entity_id} className="seamless-card rounded-2xl p-4">
                        <div className="flex items-center space-x-3">
                          <Thermometer className="w-5 h-5 text-blue-400" />
                          <div>
                            <h4 className="font-semibold text-white">{sensor.friendly_name}</h4>
                            <p className="text-lg font-bold text-blue-400">{formatTemperature(sensor.state)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Humidity Sensors */}
                    {roomDevices.sensors.filter(s => (s as any).sensor_type === 'humidity').map((sensor) => (
                      <div key={sensor.entity_id} className="seamless-card rounded-2xl p-4">
                        <div className="flex items-center space-x-3">
                          <Droplets className="w-5 h-5 text-cyan-400" />
                          <div>
                            <h4 className="font-semibold text-white">{sensor.friendly_name}</h4>
                            <p className="text-lg font-bold text-cyan-400">{formatHumidity(sensor.state)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Motion Sensors */}
                    {roomDevices.binarySensors.filter(s => (s as any).sensor_type === 'motion').map((sensor) => (
                      <div key={sensor.entity_id} className="seamless-card rounded-2xl p-4">
                        <div className="flex items-center space-x-3">
                          <User className={`w-5 h-5 ${sensor.state === 'on' ? 'text-cyan-400' : 'text-gray-500'}`} />
                          <div>
                            <h4 className="font-semibold text-white">{sensor.friendly_name}</h4>
                            <p className={`text-lg font-bold ${sensor.state === 'on' ? 'text-cyan-400' : 'text-gray-500'}`}>
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
                      <div key={sensor.entity_id} className="seamless-card rounded-2xl p-4">
                        <div className="flex items-center space-x-3">
                          {(sensor as any).sensor_type === 'door' ? (
                            sensor.state === 'on' ? <DoorOpen className="w-5 h-5 text-orange-400" /> : <DoorClosed className="w-5 h-5 text-green-400" />
                          ) : (
                            <Columns2 className={`w-5 h-5 ${sensor.state === 'on' ? 'text-orange-400' : 'text-green-400'}`} />
                          )}
                          <div>
                            <h4 className="font-semibold text-white">{sensor.friendly_name}</h4>
                            <p className={`text-lg font-bold ${sensor.state === 'on' ? 'text-orange-400' : 'text-green-400'}`}>
                              {sensor.state === 'on' ? 'Open' : 'Closed'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Flood Sensors */}
                    {roomDevices.binarySensors.filter(s => (s as any).sensor_type === 'flood').map((sensor) => (
                      <div key={sensor.entity_id} className={`seamless-card rounded-2xl p-4 ${sensor.state === 'on' ? 'subtle-glow-red' : ''}`}>
                        <div className="flex items-center space-x-3">
                          <Waves className={`w-5 h-5 ${sensor.state === 'on' ? 'text-red-400' : 'text-blue-400'}`} />
                          <div>
                            <h4 className="font-semibold text-white">{sensor.friendly_name}</h4>
                            <p className={`text-lg font-bold ${sensor.state === 'on' ? 'text-red-400' : 'text-green-400'}`}>
                              {sensor.state === 'on' ? 'FLOOD DETECTED' : 'Dry'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Smoke Sensors */}
                    {roomDevices.binarySensors.filter(s => (s as any).sensor_type === 'smoke').map((sensor) => (
                      <div key={sensor.entity_id} className={`seamless-card rounded-2xl p-4 ${sensor.state === 'on' ? 'subtle-glow-red' : ''}`}>
                        <div className="flex items-center space-x-3">
                          <Flame className={`w-5 h-5 ${sensor.state === 'on' ? 'text-red-400' : 'text-orange-400'}`} />
                          <div>
                            <h4 className="font-semibold text-white">{sensor.friendly_name}</h4>
                            <p className={`text-lg font-bold ${sensor.state === 'on' ? 'text-red-400' : 'text-green-400'}`}>
                              {sensor.state === 'on' ? 'SMOKE DETECTED' : 'Clear'}
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
            <div className="p-6 glass-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <Clock className="w-4 h-4" />
                  <span className="text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Last updated: {lastUpdate}</span>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setExpanded(false)}
                    className="unified-button px-6 py-3 rounded-2xl font-semibold"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div 
        className="room-card relative rounded-3xl overflow-hidden cursor-pointer w-full max-w-sm mx-auto"
        onClick={() => setExpanded(true)}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative p-6 h-44 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{roomName}</h3>
            </div>

            {/* Sensor Icons - Always visible in top right corner */}
            <div className="flex flex-row items-center space-x-2">
              {/* Smoke sensor - only show if configured */}
              {roomStats.smokeSensors.length > 0 && (
                <div className={`p-2 ${roomStats.smokeAlert ? 'bg-red-500/60' : 'glass-card'} rounded-full`}>
                  <Flame className="w-4 h-4 text-white" />
                </div>
              )}
              {/* Flood sensor - only show if configured */}
              {roomStats.floodSensors.length > 0 && (
                <div className={`p-2 ${roomStats.floodAlert ? 'bg-red-500/60' : 'glass-card'} rounded-full`}>
                  <Waves className="w-4 h-4 text-white" />
                </div>
              )}
              {/* Lock status - only show if configured */}
              {roomStats.hasLocks && (
                <div className={`p-2 ${roomStats.isLocked ? 'bg-green-500/60' : 'bg-red-500/60'} rounded-full`}>
                  {roomStats.isLocked ? (
                    <Lock className="w-4 h-4 text-white" />
                  ) : (
                    <Unlock className="w-4 h-4 text-white" />
                  )}
                </div>
              )}
              {/* Presence sensor - only show if configured */}
              {roomStats.motionSensor && (
                <div className={`p-2 ${roomStats.presence ? 'primary-glass' : 'glass-card'} rounded-full`}>
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
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
                        roomStats.lightsOn > 0 ? 'text-yellow-400' : 'text-gray-500'
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
                        roomStats.fansOn > 0 ? 'text-cyan-400' : 'text-gray-500'
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
                    <span className="text-white text-sm font-semibold">{formatTemperature(roomStats.temperature)}</span>
                  </div>
                )}
                {/* Humidity - only show if sensor is configured */}
                {roomStats.humidity !== null && (
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-300" />
                    <span className="text-white/90 text-sm font-medium">{formatHumidity(roomStats.humidity)}</span>
                  </div>
                )}
              </div>
              {/* Window/Door status - only show if sensors are configured */}
              {(roomStats.windowSensors.length > 0 || roomStats.doorSensors.length > 0) && (
                <div className="flex items-center space-x-2 text-white/80">
                  {React.createElement(getOpenCloseIcon(), { 
                    className: `w-4 h-4 ${roomStats.windowOpen ? 'text-orange-400' : 'text-white/60'}` 
                  })}
                  <span className="text-sm font-medium">{getOpenCloseText()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render expandable modal using React Portal */}
      {renderExpandableModal()}
    </>
  );
};

export default RoomCard;