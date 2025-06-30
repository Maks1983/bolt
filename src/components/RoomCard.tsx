import React, { useState } from 'react';
import { 
  Lightbulb, Thermometer, User, Settings, Power, Minus, Plus, Eye, EyeOff, 
  Square, CheckSquare as SquareCheck, Droplets, X, Clock, Play, Pause, 
  Volume2, ChevronUp, ChevronDown, Palette, Sun, Camera, Lock, Unlock,
  Wind, Shield, AlertTriangle, Flame, Waves, Fan, DoorOpen, DoorClosed, Columns2
} from 'lucide-react';

interface Device {
  lights?: Array<{
    id: number;
    name: string;
    on: boolean;
    brightness: number;
    color: string;
    hasColor: boolean;
  }>;
  blinds?: Array<{
    id: number;
    name: string;
    position: number;
  }>;
  curtains?: Array<{
    id: number;
    name: string;
    position: number;
  }>;
  fans?: Array<{
    id: number;
    name: string;
    on: boolean;
  }>;
  media?: {
    playing: boolean;
    title: string;
    volume: number;
    source: string;
  };
  security?: {
    doorbell?: {
      cameras: string[];
      lastRing: string;
    };
    lock?: {
      locked: boolean;
      autoLock: boolean;
    };
  };
  camera?: {
    name: string;
    recording: boolean;
    nightVision: boolean;
  };
  sensors?: {
    temperature?: number;
    humidity?: number;
    window?: boolean;
    windows?: boolean[];
    door?: boolean;
    flood?: boolean | boolean[];
    smoke?: boolean;
  };
}

interface RoomCardProps {
  room: {
    name: string;
    floor: string;
    lights: { on: number; total: number };
    temperature: number;
    humidity: number;
    presence: boolean;
    windowOpen: boolean;
    backgroundImage: string;
    devices?: Device;
  };
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const [expanded, setExpanded] = useState(false);
  const [devices, setDevices] = useState<Device>(room.devices || {});

  const updateLight = (id: number, updates: Partial<Device['lights'][0]>) => {
    if (!devices.lights) return;
    setDevices({
      ...devices,
      lights: devices.lights.map(light => 
        light.id === id ? { ...light, ...updates } : light
      )
    });
  };

  const updateBlind = (id: number, position: number) => {
    if (!devices.blinds) return;
    setDevices({
      ...devices,
      blinds: devices.blinds.map(blind => 
        blind.id === id ? { ...blind, position } : blind
      )
    });
  };

  const updateCurtain = (id: number, position: number) => {
    if (!devices.curtains) return;
    setDevices({
      ...devices,
      curtains: devices.curtains.map(curtain => 
        curtain.id === id ? { ...curtain, position } : curtain
      )
    });
  };

  const updateFan = (id: number, on: boolean) => {
    if (!devices.fans) return;
    setDevices({
      ...devices,
      fans: devices.fans.map(fan => 
        fan.id === id ? { ...fan, on } : fan
      )
    });
  };

  const updateMedia = (updates: Partial<Device['media']>) => {
    if (!devices.media) return;
    setDevices({
      ...devices,
      media: { ...devices.media, ...updates }
    });
  };

  const toggleLock = () => {
    if (!devices.security?.lock) return;
    setDevices({
      ...devices,
      security: {
        ...devices.security,
        lock: {
          ...devices.security.lock,
          locked: !devices.security.lock.locked
        }
      }
    });
  };

  const lastUpdate = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  const getSensorAlerts = () => {
    const alerts = [];
    if (devices.sensors?.flood === true || (Array.isArray(devices.sensors?.flood) && devices.sensors.flood.some(f => f))) {
      alerts.push({ type: 'flood', icon: Waves, color: 'text-blue-600', bg: 'bg-blue-100' });
    }
    if (devices.sensors?.smoke === true) {
      alerts.push({ type: 'smoke', icon: Flame, color: 'text-red-600', bg: 'bg-red-100' });
    }
    return alerts;
  };

  // Determine if this room has doors or windows based on room type
  const getOpenCloseIcon = () => {
    const roomName = room.name.toLowerCase();
    
    // Only entrance has a door
    if (roomName.includes('entrance')) {
      return room.windowOpen ? DoorOpen : DoorClosed;
    }
    
    // All other rooms use Columns2 icon for windows
    return Columns2;
  };

  const getOpenCloseText = () => {
    const roomName = room.name.toLowerCase();
    
    // Only entrance has a door
    if (roomName.includes('entrance')) {
      return room.windowOpen ? 'Door Open' : 'Door Closed';
    }
    
    // All other rooms refer to windows
    return room.windowOpen ? 'Window Open' : 'Window Closed';
  };

  return (
    <>
      <div 
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] min-w-[320px] border border-gray-200/50"
        onClick={() => setExpanded(true)}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${room.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 backdrop-blur-[1px]"></div>
        </div>
        
        {/* Content - Reduced height and informational only */}
        <div className="relative p-6 h-44 flex flex-col">
          {/* Header with room name and status indicators only */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{room.name}</h3>
            </div>
            <div className="flex items-center space-x-2">
              {/* Presence indicator - Always show, green if present, grey if not */}
              <div className={`p-2 ${room.presence ? 'bg-emerald-500/90' : 'bg-gray-500/90'} rounded-full shadow-lg backdrop-blur-sm`}>
                <User className="w-4 h-4 text-white" />
              </div>
              {/* Sensor alerts */}
              {getSensorAlerts().map((alert, index) => (
                <div key={index} className={`p-2 ${alert.bg}/90 rounded-full shadow-lg backdrop-blur-sm`}>
                  <alert.icon className={`w-4 h-4 ${alert.color}`} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Spacer to push content to bottom */}
          <div className="flex-1"></div>
          
          {/* Information at the bottom - purely informational */}
          <div className="space-y-3">
            {/* Lights information */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className={`w-5 h-5 ${room.lights.total > 0 ? 'text-yellow-400' : 'text-gray-400'}`} />
                <span className="text-white text-sm font-semibold">
                  {room.lights.total > 0 ? `${room.lights.on}/${room.lights.total} lights on` : 'No lights'}
                </span>
              </div>
            </div>
            
            {/* Temperature, humidity, and window/door status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-5 h-5 text-blue-400" />
                  <span className="text-white text-sm font-semibold">{room.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-blue-300" />
                  <span className="text-white/90 text-sm font-medium">{room.humidity}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                {React.createElement(getOpenCloseIcon(), { 
                  className: `w-4 h-4 ${room.windowOpen ? 'text-orange-400' : 'text-gray-300'}` 
                })}
                <span className="text-sm font-medium">{getOpenCloseText()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Expanded Modal - Full controls available here */}
      {expanded && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header with Background */}
            <div className="relative h-48 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center scale-110"
                style={{ backgroundImage: `url(${room.backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 backdrop-blur-sm"></div>
              </div>
              <div className="relative p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1">{room.name}</h2>
                    </div>
                    {/* Presence indicator in modal - Always show, green if present, grey if not */}
                    <div className={`p-3 ${room.presence ? 'bg-emerald-500/90' : 'bg-gray-500/90'} rounded-full shadow-lg backdrop-blur-sm`}>
                      <User className="w-5 h-5 text-white" />
                    </div>
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
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{room.temperature}°C</div>
                    <div className="text-white/80 text-sm font-medium">Temperature</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{room.humidity}%</div>
                    <div className="text-white/80 text-sm font-medium">Humidity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{getOpenCloseText()}</div>
                    <div className="text-white/80 text-sm font-medium">Status</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="max-h-[calc(95vh-12rem)] overflow-y-auto">
              <div className="p-6 space-y-8">
                
                {/* Lighting Controls - Only show if room has lights */}
                {devices.lights && devices.lights.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-yellow-100 rounded-xl">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Lighting Controls</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {devices.lights.map((light) => (
                        <div key={light.id} className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: light.on ? light.color : '#e5e7eb' }}
                              ></div>
                              <h4 className="font-semibold text-gray-900">{light.name}</h4>
                            </div>
                            <button
                              onClick={() => updateLight(light.id, { on: !light.on })}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                light.on ? 'bg-blue-500' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                light.on ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                          
                          {light.on && (
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">Brightness</span>
                                  <span className="text-sm text-gray-500">{light.brightness}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={light.brightness}
                                  onChange={(e) => updateLight(light.id, { brightness: parseInt(e.target.value) })}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                />
                              </div>
                              
                              {light.hasColor && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Color</span>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="color"
                                      value={light.color}
                                      onChange={(e) => updateLight(light.id, { color: e.target.value })}
                                      className="w-8 h-8 rounded-lg border border-gray-300 cursor-pointer"
                                    />
                                    <button
                                      onClick={() => updateLight(light.id, { color: '#ffffff' })}
                                      className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                      <Sun className="w-4 h-4 text-gray-600" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Smart Blinds */}
                {devices.blinds && devices.blinds.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <ChevronUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Smart Blinds</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {devices.blinds.map((blind) => (
                        <div key={blind.id} className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">{blind.name}</h4>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateBlind(blind.id, 0)}
                                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                              >
                                Close
                              </button>
                              <button
                                onClick={() => updateBlind(blind.id, 100)}
                                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                              >
                                Open
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Position</span>
                              <span className="text-sm text-gray-500">{blind.position}% open</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={blind.position}
                              onChange={(e) => updateBlind(blind.id, parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Smart Curtains */}
                {devices.curtains && devices.curtains.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-xl">
                        <ChevronDown className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Smart Curtains</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {devices.curtains.map((curtain) => (
                        <div key={curtain.id} className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">{curtain.name}</h4>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateCurtain(curtain.id, 0)}
                                className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                              >
                                Close
                              </button>
                              <button
                                onClick={() => updateCurtain(curtain.id, 100)}
                                className="px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                              >
                                Open
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Position</span>
                              <span className="text-sm text-gray-500">{curtain.position}% open</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={curtain.position}
                              onChange={(e) => updateCurtain(curtain.id, parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fans */}
                {devices.fans && devices.fans.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-cyan-100 rounded-xl">
                        <Fan className="w-5 h-5 text-cyan-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Fans</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {devices.fans.map((fan) => (
                        <div key={fan.id} className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">{fan.name}</h4>
                            <button
                              onClick={() => updateFan(fan.id, !fan.on)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                fan.on ? 'bg-cyan-500' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                fan.on ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Controls */}
                {devices.media && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-xl">
                        <Play className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Media Controls</h3>
                    </div>
                    
                    <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">Now Playing</h4>
                          <p className="text-sm text-gray-600">{devices.media.title}</p>
                          <p className="text-xs text-gray-500 mt-1">Source: {devices.media.source}</p>
                        </div>
                        <button
                          onClick={() => updateMedia({ playing: !devices.media!.playing })}
                          className={`p-3 rounded-full transition-colors ${
                            devices.media.playing ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {devices.media.playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Volume2 className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Volume</span>
                          </div>
                          <span className="text-sm text-gray-500">{devices.media.volume}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={devices.media.volume}
                          onChange={(e) => updateMedia({ volume: parseInt(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Controls */}
                {devices.security && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-red-100 rounded-xl">
                        <Shield className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Security</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {devices.security.lock && (
                        <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {devices.security.lock.locked ? 
                                <Lock className="w-5 h-5 text-red-600" /> : 
                                <Unlock className="w-5 h-5 text-green-600" />
                              }
                              <div>
                                <h4 className="font-semibold text-gray-900">Smart Lock</h4>
                                <p className="text-sm text-gray-600">
                                  {devices.security.lock.locked ? 'Locked' : 'Unlocked'} • Auto-lock: {devices.security.lock.autoLock ? 'On' : 'Off'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={toggleLock}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                devices.security.lock.locked 
                                  ? 'bg-green-500 text-white hover:bg-green-600' 
                                  : 'bg-red-500 text-white hover:bg-red-600'
                              }`}
                            >
                              {devices.security.lock.locked ? 'Unlock' : 'Lock'}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {devices.security.doorbell && (
                        <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Camera className="w-5 h-5 text-blue-600" />
                              <div>
                                <h4 className="font-semibold text-gray-900">Smart Doorbell</h4>
                                <p className="text-sm text-gray-600">Last ring: {devices.security.doorbell.lastRing}</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {devices.security.doorbell.cameras.map((camera, index) => (
                              <div key={index} className="bg-gray-200 rounded-lg p-4 text-center">
                                <Camera className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-700">{camera}</p>
                                <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors">
                                  View Live
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Camera */}
                {devices.camera && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-indigo-100 rounded-xl">
                        <Camera className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Camera</h3>
                    </div>
                    
                    <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{devices.camera.name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`text-sm ${devices.camera.recording ? 'text-red-600' : 'text-gray-500'}`}>
                              {devices.camera.recording ? '● Recording' : '○ Not Recording'}
                            </span>
                            <span className={`text-sm ${devices.camera.nightVision ? 'text-green-600' : 'text-gray-500'}`}>
                              Night Vision: {devices.camera.nightVision ? 'On' : 'Off'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-200 rounded-lg p-8 text-center">
                        <Camera className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 mb-3">Live Camera Feed</p>
                        <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                          <Play className="w-4 h-4 inline mr-2" />
                          View Live
                        </button>
                      </div>
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
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors font-semibold">
                      Save Changes
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