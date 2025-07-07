import React, { useState, useEffect } from 'react';
import { Shield, Lock, Zap, TrendingDown, Thermometer, Activity, Clock, DoorOpen, Lightbulb, User, Bell, X, Settings, Moon, Plane, Users, Sun, Coffee, Camera, Play, Pause, RotateCcw, Maximize, Home, AlertTriangle, CheckCircle, Power, Wifi, WifiOff, Delete, Hash, BarChart3, TrendingUp, Droplets, Wind } from 'lucide-react';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';
import NVRWebRTCSection from './NVRWebRTCSection';

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

      {/* NVR Camera System Modal - Updated with WebRTC */}
      {showNVR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl lg:rounded-3xl w-full max-w-sm sm:max-w-2xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">NVR Camera System</h2>
                  <p className="text-green-100 text-sm lg:text-base">Live camera feeds from exterior locations</p>
                </div>
                <button 
                  onClick={() => setShowNVR(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="max-h-[calc(95vh-8rem)] sm:max-h-[calc(90vh-8rem)] overflow-y-auto">
              <NVRWebRTCSection />
            </div>
            
            <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="hidden sm:inline">All cameras online</span>
                    <span className="sm:hidden">Online</span>
                  </div>
                  <div className="flex items-center space-x-2 hidden sm:flex">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowNVR(false)}
                  className="px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 bg-gray-200 text-gray-700 rounded-xl lg:rounded-2xl hover:bg-gray-300 transition-colors font-semibold text-sm lg:text-base"
                >
                  <span className="hidden sm:inline">Close NVR</span>
                  
                  <span className="sm:hidden">Close</span>
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