import React, { useState, useEffect } from 'react';
import { Shield, Lock, Zap, TrendingDown, Thermometer, Activity, Clock, DoorOpen, Lightbulb, User, Bell, X, Settings, Moon, Plane, Users, Sun, Coffee, Camera, Play, Pause, RotateCcw, Maximize, Home, AlertTriangle, CheckCircle, Power, Wifi, WifiOff, Delete, Hash, BarChart3, TrendingUp, Droplets, Wind } from 'lucide-react';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';
import AlarmCard from './InfoCards/AlarmCard';
import SecurityCard from './InfoCards/SecurityCard';
import EnergyCard from './InfoCards/EnergyCard';
import IndoorAverageCard from './InfoCards/IndoorAverageCard';
import ActivityCard from './InfoCards/ActivityCard';
import ActionsCard from './InfoCards/ActionsCard';
import NVRCard from './InfoCards/NVRCard';

interface InfoRowProps {
  cameras?: any[]; // Keep for backward compatibility but won't use
}

const InfoRow: React.FC<InfoRowProps> = () => {
  const [showActivity, setShowActivity] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showNVR, setShowNVR] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showEnergy, setShowEnergy] = useState(false);
  const [showTemperature, setShowTemperature] = useState(false);
  
  // Alarm state
  const [alarmStatus, setAlarmStatus] = useState<'disarmed' | 'armed_home' | 'armed_away' | 'pending' | 'triggered'>('disarmed');
  const [alarmCode, setAlarmCode] = useState('');
  const [entryDelay, setEntryDelay] = useState(0);
  const [exitDelay, setExitDelay] = useState(0);

  // Energy state
  const [energyTimeframe, setEnergyTimeframe] = useState<'24h' | '7d'>('24h');
  
  // Temperature state
  const [tempTimeframe, setTempTimeframe] = useState<'24h' | '7d'>('24h');

  // Get real camera entities and detection sensors from Home Assistant
  const frontDoorCamera = useRealtimeDevice('camera.g4_doorbell_pro_poe_high_resolution_channel');
  const backyardCamera = useRealtimeDevice('camera.g4_bullet_backyard_high_resolution_channel');
  
  // Get detection sensors for front door camera
  const frontDoorMotion = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_motion');
  const frontDoorPerson = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_person_detected');
  const frontDoorAnimal = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_animal_detected');
  const frontDoorVehicle = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_vehicle_detected');
  const frontDoorDoorbell = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_doorbell');
  const frontDoorNightMode = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_is_dark');
  
  // Get detection sensors for backyard camera
  const backyardMotion = useRealtimeDevice('binary_sensor.g4_bullet_backyard_motion');
  const backyardPerson = useRealtimeDevice('binary_sensor.g4_bullet_backyard_person_detected');
  const backyardAnimal = useRealtimeDevice('binary_sensor.g4_bullet_backyard_animal_detected');
  const backyardVehicle = useRealtimeDevice('binary_sensor.g4_bullet_backyard_vehicle_detected');
  const backyardNightMode = useRealtimeDevice('binary_sensor.g4_bullet_backyard_is_dark');

  // Create camera objects from real entities
  const realCameras = [
    {
      id: 1,
      name: frontDoorCamera?.friendly_name || 'Front Door Camera',
      location: 'Front Door',
      recording: frontDoorCamera?.state === 'recording',
      nightVision: frontDoorNightMode?.state === 'on',
      temperature: 15, // Could be pulled from nearby sensor if available
      humidity: 60,    // Could be pulled from nearby sensor if available
      backgroundImage: frontDoorCamera?.entity_picture || 
        `${import.meta.env.VITE_HA_WEBSOCKET_URL?.replace('ws://', 'http://').replace('/api/websocket', '')}/api/camera_proxy/${frontDoorCamera?.entity_id}` ||
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      entity: frontDoorCamera,
      detections: {
        motion: frontDoorMotion?.state === 'on',
        person: frontDoorPerson?.state === 'on',
        animal: frontDoorAnimal?.state === 'on',
        vehicle: frontDoorVehicle?.state === 'on',
        doorbell: frontDoorDoorbell?.state === 'on'
      }
    },
    {
      id: 2,
      name: backyardCamera?.friendly_name || 'Backyard Camera',
      location: 'Backyard',
      recording: backyardCamera?.state === 'recording',
      nightVision: backyardNightMode?.state === 'on',
      temperature: 16, // Could be pulled from nearby sensor if available
      humidity: 58,    // Could be pulled from nearby sensor if available
      backgroundImage: backyardCamera?.entity_picture || 
        `${import.meta.env.VITE_HA_WEBSOCKET_URL?.replace('ws://', 'http://').replace('/api/websocket', '')}/api/camera_proxy/${backyardCamera?.entity_id}` ||
        'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800',
      entity: backyardCamera,
      detections: {
        motion: backyardMotion?.state === 'on',
        person: backyardPerson?.state === 'on',
        animal: backyardAnimal?.state === 'on',
        vehicle: backyardVehicle?.state === 'on'
      }
    }
  ].filter(camera => camera.entity); // Only include cameras that exist in HA

  // Count active detections across all cameras
  const totalActiveDetections = realCameras.reduce((total, camera) => {
    return total + Object.values(camera.detections).filter(Boolean).length;
  }, 0);

  const activities = [
    {
      id: 1,
      icon: DoorOpen,
      title: 'Front door opened',
      description: 'Sarah entered through main entrance',
      time: '2 minutes ago',
      color: 'text-blue-500'
    },
    {
      id: 2,
      icon: Lightbulb,
      title: 'Living room lights turned on',
      description: 'Automatically activated by motion sensor',
      time: '5 minutes ago',
      color: 'text-yellow-500'
    },
    {
      id: 3,
      icon: Thermometer,
      title: 'Temperature adjusted',
      description: 'Bedroom thermostat set to 21°C',
      time: '12 minutes ago',
      color: 'text-green-500'
    },
    {
      id: 4,
      icon: Shield,
      title: 'Security system armed',
      description: 'All zones secured for night mode',
      time: '1 hour ago',
      color: 'text-red-500'
    },
    {
      id: 5,
      icon: User,
      title: 'Mike left home',
      description: 'Detected exit through garage door',
      time: '2 hours ago',
      color: 'text-purple-500'
    },
    {
      id: 6,
      icon: Bell,
      title: 'Doorbell rang',
      description: 'Package delivery at front door',
      time: '3 hours ago',
      color: 'text-orange-500'
    }
  ];

  const actions = [
    { name: 'Guest Mode', icon: Users, color: 'from-emerald-500 to-emerald-600', active: false },
    { name: 'Sleep', icon: Moon, color: 'from-purple-500 to-purple-600', active: false },
    { name: 'Leaving Home', icon: Plane, color: 'from-blue-500 to-blue-600', active: false },
    { name: 'Security', icon: Shield, color: 'from-red-500 to-red-600', active: true },
    { name: 'Good Morning', icon: Sun, color: 'from-amber-500 to-orange-500', active: false },
    { name: 'Movie Night', icon: Coffee, color: 'from-indigo-500 to-indigo-600', active: false },
  ];

  // Security zones data
  const securityZones = [
    { id: 1, name: 'Front Door', type: 'Entry', status: 'secure', icon: DoorOpen, lastTriggered: 'Never' },
    { id: 2, name: 'Back Door', type: 'Entry', status: 'secure', icon: DoorOpen, lastTriggered: '2 days ago' },
    { id: 3, name: 'Living Room Motion', type: 'Motion', status: 'secure', icon: User, lastTriggered: '5 minutes ago' },
    { id: 4, name: 'Kitchen Motion', type: 'Motion', status: 'secure', icon: User, lastTriggered: '1 hour ago' },
    { id: 5, name: 'Master Bedroom Motion', type: 'Motion', status: 'secure', icon: User, lastTriggered: '3 hours ago' },
    { id: 6, name: 'Office Motion', type: 'Motion', status: 'secure', icon: User, lastTriggered: '6 hours ago' },
    { id: 7, name: 'Front Window', type: 'Window', status: 'secure', icon: Home, lastTriggered: 'Never' },
    { id: 8, name: 'Kitchen Windows', type: 'Window', status: 'secure', icon: Home, lastTriggered: 'Never' },
    { id: 9, name: 'Smoke Detector - Kitchen', type: 'Smoke', status: 'secure', icon: AlertTriangle, lastTriggered: 'Never' },
    { id: 10, name: 'Smoke Detector - Living Room', type: 'Smoke', status: 'secure', icon: AlertTriangle, lastTriggered: 'Never' },
    { id: 11, name: 'Water Sensor - Bathroom', type: 'Water', status: 'secure', icon: Thermometer, lastTriggered: 'Never' },
    { id: 12, name: 'Water Sensor - Laundry', type: 'Water', status: 'secure', icon: Thermometer, lastTriggered: 'Never' }
  ];

  // Energy data
  const energyData24h = [
    { time: '00:00', consumption: 1.2, cost: 0.15 },
    { time: '04:00', consumption: 0.8, cost: 0.10 },
    { time: '08:00', consumption: 2.8, cost: 0.35 },
    { time: '12:00', consumption: 3.2, cost: 0.40 },
    { time: '16:00', consumption: 2.1, cost: 0.26 },
    { time: '20:00', consumption: 4.1, cost: 0.51 }
  ];

  const energyData7d = [
    { time: 'Mon', consumption: 45.2, cost: 5.65 },
    { time: 'Tue', consumption: 38.7, cost: 4.84 },
    { time: 'Wed', consumption: 42.1, cost: 5.26 },
    { time: 'Thu', consumption: 39.8, cost: 4.98 },
    { time: 'Fri', consumption: 44.3, cost: 5.54 },
    { time: 'Sat', consumption: 41.9, cost: 5.24 },
    { time: 'Sun', consumption: 43.6, cost: 5.45 }
  ];

  const highUseDevices = [
    { name: 'HVAC System', consumption: 1.8, percentage: 45, status: 'Heating', color: 'text-red-600' },
    { name: 'Water Heater', consumption: 0.9, percentage: 22, status: 'Standby', color: 'text-blue-600' },
    { name: 'Kitchen Appliances', consumption: 0.7, percentage: 18, status: 'Active', color: 'text-green-600' }
  ];

  // Temperature data
  const tempData24h = [
    { time: '00:00', indoor: 20.5, outdoor: 12.3 },
    { time: '04:00', indoor: 19.8, outdoor: 10.1 },
    { time: '08:00', indoor: 21.2, outdoor: 14.5 },
    { time: '12:00', indoor: 22.1, outdoor: 18.2 },
    { time: '16:00', indoor: 22.8, outdoor: 19.7 },
    { time: '20:00', indoor: 21.9, outdoor: 16.4 }
  ];

  const tempData7d = [
    { time: 'Mon', indoor: 21.2, outdoor: 15.3 },
    { time: 'Tue', indoor: 20.8, outdoor: 13.7 },
    { time: 'Wed', indoor: 21.5, outdoor: 16.2 },
    { time: 'Thu', indoor: 21.1, outdoor: 14.8 },
    { time: 'Fri', indoor: 21.7, outdoor: 17.1 },
    { time: 'Sat', indoor: 21.3, outdoor: 15.9 },
    { time: 'Sun', indoor: 21.6, outdoor: 16.5 }
  ];

  const roomTemperatures = [
    { name: 'Living Room', temp: 22.1, humidity: 48, trend: 'stable', lastUpdated: '1 min ago', status: 'optimal' },
    { name: 'Kitchen', temp: 23.2, humidity: 52, trend: 'up', lastUpdated: '2 min ago', status: 'warm' },
    { name: 'Master Bedroom', temp: 20.5, humidity: 45, trend: 'down', lastUpdated: '1 min ago', status: 'cool' },
    { name: 'Bedroom', temp: 21.0, humidity: 50, trend: 'stable', lastUpdated: '3 min ago', status: 'optimal' },
    { name: 'Bathroom', temp: 22.8, humidity: 65, trend: 'up', lastUpdated: '1 min ago', status: 'humid' },
    { name: 'Office', temp: 21.5, humidity: 44, trend: 'stable', lastUpdated: '4 min ago', status: 'optimal' },
    { name: 'Laundry', temp: 20.2, humidity: 55, trend: 'down', lastUpdated: '2 min ago', status: 'cool' },
    { name: 'Entrance', temp: 19.8, humidity: 47, trend: 'stable', lastUpdated: '5 min ago', status: 'cool' }
  ];

  const getZoneStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'text-green-600 bg-green-100';
      case 'triggered': return 'text-red-600 bg-red-100';
      case 'bypassed': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getZoneTypeColor = (type: string) => {
    switch (type) {
      case 'Entry': return 'text-blue-600 bg-blue-50';
      case 'Motion': return 'text-purple-600 bg-purple-50';
      case 'Window': return 'text-indigo-600 bg-indigo-50';
      case 'Smoke': return 'text-red-600 bg-red-50';
      case 'Water': return 'text-cyan-600 bg-cyan-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlarmStatusColor = (status: string) => {
    switch (status) {
      case 'disarmed': return { bg: 'from-gray-500 to-gray-600', text: 'DISARMED' };
      case 'armed_home': return { bg: 'from-blue-500 to-blue-600', text: 'ARMED HOME' };
      case 'armed_away': return { bg: 'from-red-500 to-red-600', text: 'ARMED AWAY' };
      case 'pending': return { bg: 'from-yellow-500 to-orange-500', text: 'PENDING' };
      case 'triggered': return { bg: 'from-red-600 to-red-700', text: 'TRIGGERED' };
      default: return { bg: 'from-gray-500 to-gray-600', text: 'UNKNOWN' };
    }
  };

  const getTempStatusColor = (status: string) => {
    switch (status) {
      case 'cool': return 'text-blue-600 bg-blue-100';
      case 'optimal': return 'text-green-600 bg-green-100';
      case 'warm': return 'text-orange-600 bg-orange-100';
      case 'hot': return 'text-red-600 bg-red-100';
      case 'humid': return 'text-cyan-600 bg-cyan-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-red-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-blue-500" />;
      case 'stable': return <div className="w-3 h-0.5 bg-gray-400 rounded"></div>;
      default: return null;
    }
  };

  // Alarm functions
  const handleNumpadClick = (digit: string) => {
    if (alarmCode.length < 6) {
      setAlarmCode(alarmCode + digit);
    }
  };

  const handleBackspace = () => {
    setAlarmCode(alarmCode.slice(0, -1));
  };

  const handleAlarmAction = (action: 'arm_home' | 'arm_away' | 'disarm' | 'panic') => {
    if (action === 'panic') {
      setAlarmStatus('triggered');
      setAlarmCode('');
      return;
    }

    if (action === 'disarm' && alarmCode === '1234') {
      setAlarmStatus('disarmed');
      setAlarmCode('');
      setEntryDelay(0);
      setExitDelay(0);
    } else if ((action === 'arm_home' || action === 'arm_away') && alarmCode === '1234') {
      setAlarmStatus('pending');
      setExitDelay(30);
      setAlarmCode('');
      
      const countdown = setInterval(() => {
        setExitDelay(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            setAlarmStatus(action === 'arm_home' ? 'armed_home' : 'armed_away');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Entry delay simulation
  useEffect(() => {
    if (entryDelay > 0) {
      const countdown = setInterval(() => {
        setEntryDelay(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            if (alarmCode !== '1234') {
              setAlarmStatus('triggered');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [entryDelay, alarmCode]);

  return (
    <>
      <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/60 px-6 py-2 border-b border-gray-200/40">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide">
            {/* Alarm Status - Clickable */}
            <button 
              onClick={() => setShowAlarm(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className={`p-1.5 ${alarmStatus === 'disarmed' ? 'bg-gray-100' : alarmStatus === 'triggered' ? 'bg-red-100' : 'bg-emerald-100'} rounded-md`}>
                <Shield className={`w-3 h-3 ${alarmStatus === 'disarmed' ? 'text-gray-600' : alarmStatus === 'triggered' ? 'text-red-600' : 'text-emerald-600'}`} />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Alarm</div>
                <div className={`text-xs font-bold ${alarmStatus === 'disarmed' ? 'text-gray-600' : alarmStatus === 'triggered' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {getAlarmStatusColor(alarmStatus).text}
                </div>
              </div>
            </button>

            {/* Security Status - Clickable */}
            <button 
              onClick={() => setShowSecurity(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className="p-1.5 bg-blue-100 rounded-md">
                <Lock className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Security</div>
                <div className="text-xs text-blue-600 font-bold">Secured</div>
              </div>
            </button>

            {/* Energy Usage - Clickable */}
            <button 
              onClick={() => setShowEnergy(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className="p-1.5 bg-orange-100 rounded-md">
                <Zap className="w-3 h-3 text-orange-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Energy</div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-orange-600 font-bold">2.4kW</span>
                  <TrendingDown className="w-2 h-2 text-green-500" />
                  <span className="text-xs text-gray-500">€0.32/h</span>
                </div>
              </div>
            </button>

            {/* Average Temperature - Clickable */}
            <button 
              onClick={() => setShowTemperature(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className="p-1.5 bg-blue-100 rounded-md">
                <Thermometer className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Indoor Avg</div>
                <div className="text-xs text-blue-600 font-bold">21°C</div>
              </div>
            </button>

            {/* Activity Log */}
            <button 
              onClick={() => setShowActivity(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className="p-1.5 bg-purple-100 rounded-md">
                <Activity className="w-3 h-3 text-purple-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Activity</div>
                <div className="text-xs text-purple-600 font-bold">6 recent</div>
              </div>
            </button>

            {/* Actions Button */}
            <button 
              onClick={() => setShowActions(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className="p-1.5 bg-indigo-100 rounded-md">
                <Settings className="w-3 h-3 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Actions</div>
                <div className="text-xs text-indigo-600 font-bold">6 scenes</div>
              </div>
            </button>

            {/* NVR Button */}
            <button 
              onClick={() => setShowNVR(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className="p-1.5 bg-green-100 rounded-md">
                <Camera className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">NVR</div>
                <div className="text-xs text-green-600 font-bold">{realCameras.length} cameras</div>
              </div>
              {totalActiveDetections > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {totalActiveDetections} alerts
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Alarm Control Panel Modal */}
      {showAlarm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200">
            <div className={`bg-gradient-to-r ${getAlarmStatusColor(alarmStatus).bg} p-6`}>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">ALARM SYSTEM</h2>
                  <div className="text-3xl font-bold text-white">{getAlarmStatusColor(alarmStatus).text}</div>
                  {(exitDelay > 0 || entryDelay > 0) && (
                    <div className="mt-3 text-white">
                      <div className="text-sm opacity-90">
                        {exitDelay > 0 ? 'Exit Delay' : 'Entry Delay'}
                      </div>
                      <div className="text-4xl font-bold">
                        {exitDelay > 0 ? exitDelay : entryDelay}
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setShowAlarm(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Code Display */}
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="text-sm font-medium text-gray-600 mb-2">Enter Security Code</div>
                  <div className="flex justify-center space-x-2">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i}
                        className={`w-8 h-8 border-2 rounded-lg flex items-center justify-center ${
                          i < alarmCode.length ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        {i < alarmCode.length && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumpadClick(num.toString())}
                    className="h-12 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-lg transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handleNumpadClick('*')}
                  className="h-12 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-lg transition-colors"
                >
                  *
                </button>
                <button
                  onClick={() => handleNumpadClick('0')}
                  className="h-12 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-lg transition-colors"
                >
                  0
                </button>
                <button
                  onClick={() => handleNumpadClick('#')}
                  className="h-12 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-lg transition-colors"
                >
                  #
                </button>
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={handleBackspace}
                  className="h-12 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-colors flex items-center justify-center"
                >
                  <Delete className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (alarmCode.length > 0) {
                      // Simulate code entry
                      if (alarmStatus !== 'disarmed') {
                        handleAlarmAction('disarm');
                      }
                    }
                  }}
                  className="h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                >
                  ENTER
                </button>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAlarmAction('arm_home')}
                    className="h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                  >
                    ARM HOME
                  </button>
                  <button
                    onClick={() => handleAlarmAction('arm_away')}
                    className="h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                  >
                    ARM AWAY
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAlarmAction('disarm')}
                    className="h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                  >
                    DISARM
                  </button>
                  <button
                    onClick={() => handleAlarmAction('panic')}
                    className="h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
                  >
                    PANIC
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
              <div className="text-xs text-gray-500">
                Default code: 1234 • Last armed: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Panel Modal */}
      {showSecurity && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Security System</h2>
                  <p className="text-blue-100">
                    Status: <span className="font-bold">SECURE</span> • 
                    {securityZones.filter(zone => zone.status === 'secure').length}/{securityZones.length} zones secure
                  </p>
                </div>
                <button 
                  onClick={() => setShowSecurity(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
              <div className="p-6">
                {/* System Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                      <div>
                        <div className="text-2xl font-bold text-emerald-700">
                          {securityZones.filter(zone => zone.status === 'secure').length}
                        </div>
                        <div className="text-sm text-emerald-600 font-medium">Secure Zones</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <div>
                        <div className="text-2xl font-bold text-red-700">
                          {securityZones.filter(zone => zone.status === 'triggered').length}
                        </div>
                        <div className="text-sm text-red-600 font-medium">Triggered</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <Power className="w-6 h-6 text-yellow-600" />
                      <div>
                        <div className="text-2xl font-bold text-yellow-700">
                          {securityZones.filter(zone => zone.status === 'bypassed').length}
                        </div>
                        <div className="text-sm text-yellow-600 font-medium">Bypassed</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <WifiOff className="w-6 h-6 text-gray-600" />
                      <div>
                        <div className="text-2xl font-bold text-gray-700">
                          {securityZones.filter(zone => zone.status === 'offline').length}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Offline</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zone Details */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Zone Status</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {securityZones.map((zone) => {
                      const Icon = zone.icon;
                      return (
                        <div key={zone.id} className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Icon className="w-5 h-5 text-gray-700" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{zone.name}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getZoneTypeColor(zone.type)}`}>
                                    {zone.type}
                                  </span>
                                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getZoneStatusColor(zone.status)}`}>
                                    {zone.status.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                                Test
                              </button>
                              <button className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium">
                                Bypass
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>Last triggered: {zone.lastTriggered}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Wifi className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 font-medium">Online</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>All Systems Secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowSecurity(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Close Panel
                  </button>
                  <button className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors font-semibold">
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Energy Panel Modal */}
      {showEnergy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Energy Management</h2>
                  <p className="text-orange-100">Real-time consumption and cost monitoring</p>
                </div>
                <button 
                  onClick={() => setShowEnergy(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Current Consumption Overview */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Current Consumption</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Zap className="w-6 h-6 text-orange-600" />
                        <h4 className="font-bold text-gray-900">Live Usage</h4>
                      </div>
                      <div className="text-3xl font-bold text-orange-700 mb-1">2.4 kW</div>
                      <div className="text-sm text-orange-600">3.2 kWh today</div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        <h4 className="font-bold text-gray-900">Current Rate</h4>
                      </div>
                      <div className="text-3xl font-bold text-blue-700 mb-1">€0.13</div>
                      <div className="text-sm text-blue-600 flex items-center">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        per kWh
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <h4 className="font-bold text-gray-900">Cost Today</h4>
                      </div>
                      <div className="text-3xl font-bold text-green-700 mb-1">€0.42</div>
                      <div className="text-sm text-green-600">-12% vs yesterday</div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                        <h4 className="font-bold text-gray-900">Efficiency</h4>
                      </div>
                      <div className="text-3xl font-bold text-purple-700 mb-1">87%</div>
                      <div className="text-sm text-purple-600">vs avg home</div>
                    </div>
                  </div>
                </div>

                {/* Consumption Chart */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Consumption Chart</h3>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setEnergyTimeframe('24h')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          energyTimeframe === '24h' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        24h
                      </button>
                      <button
                        onClick={() => setEnergyTimeframe('7d')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          energyTimeframe === '7d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        7d
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-end space-x-2 h-48">
                      {(energyTimeframe === '24h' ? energyData24h : energyData7d).map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex flex-col space-y-1 mb-2">
                            <div 
                              className="bg-orange-500 rounded-t"
                              style={{ height: `${(data.consumption / (energyTimeframe === '24h' ? 5 : 50)) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-blue-500 rounded-b"
                              style={{ height: `${(data.cost / (energyTimeframe === '24h' ? 0.6 : 6)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600 font-medium">{data.time}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center space-x-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span className="text-sm text-gray-600">Consumption ({energyTimeframe === '24h' ? 'kW' : 'kWh'})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm text-gray-600">Cost (€)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* High-Use Devices */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">High-Use Devices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {highUseDevices.map((device, index) => (
                      <div key={index} className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900">{device.name}</h4>
                          <span className={`text-sm font-medium ${device.color}`}>{device.status}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{device.consumption} kW</div>
                        <div className="text-sm text-gray-600 mb-3">{device.percentage}% of total usage</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips & Notices */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Tips & Notices</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900">Peak Pricing Active</h4>
                          <p className="text-sm text-blue-700">Higher rates until 8 PM. Consider delaying high-energy tasks.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Zap className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-yellow-900">EV Charging Scheduled</h4>
                          <p className="text-sm text-yellow-700">Tesla Model 3 will start charging at 11 PM (off-peak rates).</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>All meters online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEnergy(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Temperature Panel Modal */}
      {showTemperature && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Indoor Climate Control</h2>
                  <p className="text-blue-100">Temperature and humidity monitoring across all zones</p>
                </div>
                <button 
                  onClick={() => setShowTemperature(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Climate Overview */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Climate Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Thermometer className="w-6 h-6 text-blue-600" />
                        <h4 className="font-bold text-gray-900">Avg Temperature</h4>
                      </div>
                      <div className="text-3xl font-bold text-blue-700 mb-1">21.3°C</div>
                      <div className="text-sm text-blue-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +0.3°C since 1h
                      </div>
                    </div>
                    
                    <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Droplets className="w-6 h-6 text-cyan-600" />
                        <h4 className="font-bold text-gray-900">Avg Humidity</h4>
                      </div>
                      <div className="text-3xl font-bold text-cyan-700 mb-1">51%</div>
                      <div className="text-sm text-cyan-600">Optimal range</div>
                    </div>
                    
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h4 className="font-bold text-gray-900">Comfort Score</h4>
                      </div>
                      <div className="text-3xl font-bold text-green-700 mb-1">85%</div>
                      <div className="text-sm text-green-600">Excellent</div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Wind className="w-6 h-6 text-purple-600" />
                        <h4 className="font-bold text-gray-900">Sensors</h4>
                      </div>
                      <div className="text-3xl font-bold text-purple-700 mb-1">8</div>
                      <div className="text-sm text-purple-600">All reporting</div>
                    </div>
                  </div>
                </div>

                {/* Historical Chart */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Temperature History</h3>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setTempTimeframe('24h')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          tempTimeframe === '24h' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        24h
                      </button>
                      <button
                        onClick={() => setTempTimeframe('7d')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          tempTimeframe === '7d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        7d
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-end space-x-2 h-48">
                      {(tempTimeframe === '24h' ? tempData24h : tempData7d).map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex flex-col space-y-1 mb-2">
                            <div 
                              className="bg-blue-500 rounded-t"
                              style={{ height: `${((data.indoor - 15) / 15) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-gray-400 rounded-b"
                              style={{ height: `${((data.outdoor - 5) / 20) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600 font-medium">{data.time}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center space-x-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm text-gray-600">Indoor Temperature</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded"></div>
                        <span className="text-sm text-gray-600">Outdoor Temperature</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Room Breakdown Table */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Room Breakdown</h3>
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left py-4 px-6 font-bold text-gray-900">Room</th>
                            <th className="text-left py-4 px-6 font-bold text-gray-900">Temp (°C)</th>
                            <th className="text-left py-4 px-6 font-bold text-gray-900">Humidity (%)</th>
                            <th className="text-left py-4 px-6 font-bold text-gray-900">Trend</th>
                            <th className="text-left py-4 px-6 font-bold text-gray-900">Status</th>
                            <th className="text-left py-4 px-6 font-bold text-gray-900">Last Updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roomTemperatures.map((room, index) => (
                            <tr 
                              key={index} 
                              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <td className="py-4 px-6">
                                <div className="font-semibold text-gray-900">{room.name}</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className={`font-bold ${
                                  room.temp < 20 ? 'text-blue-600' : 
                                  room.temp > 24 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {room.temp}°C
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-medium text-gray-700">{room.humidity}%</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center">
                                  {getTrendIcon(room.trend)}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getTempStatusColor(room.status)}`}>
                                  {room.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-sm text-gray-500">{room.lastUpdated}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>All sensors online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTemperature(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivity && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                  <p className="text-purple-100">Last 6 events in your home</p>
                </div>
                <button 
                  onClick={() => setShowActivity(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div 
                    key={activity.id} 
                    className={`flex items-center space-x-4 p-5 hover:bg-gray-50 transition-colors ${
                      index !== activities.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className={`p-3 bg-gray-100 rounded-xl ${activity.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-gray-900 truncate">
                          {activity.title}
                        </h3>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs font-medium">{activity.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <button 
                onClick={() => setShowActivity(false)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Close Activity Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions Modal */}
      {showActions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                  <p className="text-indigo-100">Control your home scenes</p>
                </div>
                <button 
                  onClick={() => setShowActions(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {actions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      className={`relative p-4 bg-gradient-to-br ${action.color} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 ${
                        action.active ? 'ring-2 ring-indigo-400 ring-offset-2' : ''
                      }`}
                    >
                      <div className="text-center">
                        <Icon className="w-6 h-6 text-white mx-auto mb-2" />
                        <span className="text-white text-sm font-bold">{action.name}</span>
                      </div>
                      {action.active && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <button 
                onClick={() => setShowActions(false)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Close Actions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NVR Camera System Modal */}
      {showNVR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">NVR Camera System</h2>
                  <p className="text-green-100">Live camera feeds from exterior locations</p>
                </div>
                <button 
                  onClick={() => setShowNVR(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {realCameras.map((camera) => (
                  <div key={camera.id} className="bg-gray-50/80 rounded-2xl overflow-hidden border border-gray-200/50 shadow-lg">
                    {/* Camera Feed Area */}
                    <div className="relative h-64 bg-gray-900">
                      <div 
                        className="absolute inset-0 bg-cover bg-center opacity-80"
                        style={{ backgroundImage: `url(${camera.backgroundImage})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
                      </div>
                      
                      {/* Camera Status Overlay */}
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${camera.recording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <span className="text-white text-sm font-medium">
                          {camera.recording ? 'RECORDING' : 'OFFLINE'}
                        </span>
                      </div>
                      
                      {/* Active detections indicator */}
                      {Object.values(camera.detections).some(Boolean) && (
                        <div className="absolute top-3 right-3 bg-red-500/90 rounded-full px-2 py-1">
                          <span className="text-white text-xs font-bold">
                            {Object.values(camera.detections).filter(Boolean).length} ALERTS
                          </span>
                        </div>
                      )}
                      
                      {/* Night Vision Indicator */}
                      {camera.nightVision && (
                        <div className="absolute top-4 right-4 bg-purple-500/80 px-2 py-1 rounded-lg">
                          <span className="text-white text-xs font-medium">NIGHT VISION</span>
                        </div>
                      )}
                      
                      {/* Camera Controls Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                            <Play className="w-4 h-4 text-white" />
                          </button>
                          <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                            <Pause className="w-4 h-4 text-white" />
                          </button>
                          <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                            <RotateCcw className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                          <Maximize className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Camera Info Panel */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{camera.name}</h3>
                          <p className="text-sm text-gray-600">{camera.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Camera className="w-5 h-5 text-green-600" />
                          <span className={`text-sm font-medium ${camera.recording ? 'text-green-600' : 'text-gray-500'}`}>
                            {camera.recording ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Temperature</span>
                          <span className="font-semibold text-gray-900">{camera.temperature}°C</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Humidity</span>
                          <span className="font-semibold text-gray-900">{camera.humidity}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Night Vision</span>
                          <span className={`font-semibold ${camera.nightVision ? 'text-purple-600' : 'text-gray-500'}`}>
                            {camera.nightVision ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Status</span>
                          <span className={`font-semibold ${camera.recording ? 'text-green-600' : 'text-red-600'}`}>
                            {camera.recording ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Detection Status */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3">AI Detection Status</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(camera.detections).map(([type, active]) => (
                            <div
                              key={type}
                              className={`flex items-center justify-between p-2 rounded-lg border ${
                                active 
                                  ? 'bg-red-50 border-red-200 text-red-700' 
                                  : 'bg-gray-50 border-gray-200 text-gray-600'
                              }`}
                            >
                              <span className="text-sm font-medium capitalize">
                                {type.replace('_', ' ')}
                              </span>
                              <div className={`w-2 h-2 rounded-full ${
                                active ? 'bg-red-500' : 'bg-gray-300'
                              }`}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">
                            View Full Screen
                          </button>
                          <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm">
                            Settings
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>All cameras online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowNVR(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Close NVR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoRow;