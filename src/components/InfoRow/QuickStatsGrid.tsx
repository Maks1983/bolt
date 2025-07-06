import React from 'react';
import { 
  Thermometer, Droplets, User, Eye, Zap, Volume2, 
  Wind, Waves, Flame, Lock, Unlock, Activity,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import { formatTemperature, formatHumidity } from '../../utils/deviceHelpers';

const QuickStatsGrid: React.FC = () => {
  const { state } = useDevices();
  
  // Get specific sensors for calculations
  const livingRoomTemp = useRealtimeDevice('sensor.living_room_temperature_sensor_temperature');
  const kitchenTemp = useRealtimeDevice('sensor.kitchen_temperature_sensor_temperature');
  const bedroomTemp = useRealtimeDevice('sensor.bedroom_temperature_sensor_temperature');
  const masterBedroomTemp = useRealtimeDevice('sensor.master_bedroom_temperature_sensor_temperature');
  const bathroomTemp = useRealtimeDevice('sensor.bathroom_temperature_sensor_temperature');
  
  const livingRoomHumidity = useRealtimeDevice('sensor.living_room_temperature_sensor_humidity');
  const kitchenHumidity = useRealtimeDevice('sensor.kitchen_temperature_sensor_humidity');
  
  // Calculate averages
  const temperatures = [
    livingRoomTemp?.state,
    kitchenTemp?.state,
    bedroomTemp?.state,
    masterBedroomTemp?.state,
    bathroomTemp?.state
  ].filter(temp => temp !== undefined).map(temp => Number(temp));

  const humidities = [
    livingRoomHumidity?.state,
    kitchenHumidity?.state
  ].filter(humidity => humidity !== undefined).map(humidity => Number(humidity));

  const avgTemp = temperatures.length > 0 
    ? temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length 
    : 21;

  const avgHumidity = humidities.length > 0 
    ? humidities.reduce((sum, humidity) => sum + humidity, 0) / humidities.length 
    : 50;

  // Calculate device stats
  const lightsOn = state.devices.filter(d => d.device_type === 'light' && d.state === 'on').length;
  const totalLights = state.devices.filter(d => d.device_type === 'light').length;
  const fansOn = state.devices.filter(d => d.device_type === 'fan' && d.state === 'on').length;
  const mediaPlaying = state.devices.filter(d => d.device_type === 'media_player' && d.state === 'playing').length;
  
  // Motion detection
  const motionSensors = state.devices.filter(d => 
    d.device_type === 'binary_sensor' && (d as any).sensor_type === 'motion'
  );
  const activeMotion = motionSensors.filter(s => s.state === 'on').length;
  
  // Camera detection
  const cameraDetections = state.devices.filter(d => 
    d.device_type === 'binary_sensor' && 
    ((d as any).detection_type === 'person' || (d as any).detection_type === 'motion') &&
    d.state === 'on'
  ).length;
  
  // Security status
  const locks = state.devices.filter(d => d.device_type === 'lock');
  const lockedCount = locks.filter(l => l.state === 'locked').length;
  
  // Alerts
  const floodAlerts = state.devices.filter(d => 
    d.device_type === 'binary_sensor' && (d as any).sensor_type === 'flood' && d.state === 'on'
  ).length;
  const smokeAlerts = state.devices.filter(d => 
    d.device_type === 'binary_sensor' && (d as any).sensor_type === 'smoke' && d.state === 'on'
  ).length;
  
  // Energy simulation (mock data)
  const currentPower = 2.4; // kW
  const dailyUsage = 18.7; // kWh

  const stats = [
    {
      id: 'indoor_temp',
      title: 'Indoor Temperature',
      value: formatTemperature(avgTemp),
      subtitle: `${temperatures.length} sensors`,
      icon: Thermometer,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      trend: avgTemp > 22 ? 'up' : avgTemp < 20 ? 'down' : 'stable'
    },
    {
      id: 'humidity',
      title: 'Humidity',
      value: formatHumidity(avgHumidity),
      subtitle: `${humidities.length} sensors`,
      icon: Droplets,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-50 to-blue-50',
      borderColor: 'border-cyan-200',
      trend: avgHumidity > 60 ? 'up' : avgHumidity < 40 ? 'down' : 'stable'
    },
    {
      id: 'lighting',
      title: 'Lighting',
      value: `${lightsOn}/${totalLights}`,
      subtitle: 'lights on',
      icon: Zap,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-200',
      trend: lightsOn > totalLights * 0.5 ? 'up' : 'down'
    },
    {
      id: 'activity',
      title: 'Motion Activity',
      value: `${activeMotion}`,
      subtitle: `${motionSensors.length} sensors`,
      icon: User,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      trend: activeMotion > 0 ? 'up' : 'stable'
    },
    {
      id: 'security',
      title: 'Security',
      value: `${lockedCount}/${locks.length}`,
      subtitle: 'locks secured',
      icon: lockedCount === locks.length ? Lock : Unlock,
      color: lockedCount === locks.length ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500',
      bgColor: lockedCount === locks.length ? 'from-green-50 to-emerald-50' : 'from-red-50 to-rose-50',
      borderColor: lockedCount === locks.length ? 'border-green-200' : 'border-red-200',
      trend: 'stable'
    },
    {
      id: 'cameras',
      title: 'AI Detection',
      value: `${cameraDetections}`,
      subtitle: 'active detections',
      icon: Eye,
      color: cameraDetections > 0 ? 'from-red-500 to-rose-500' : 'from-gray-500 to-slate-500',
      bgColor: cameraDetections > 0 ? 'from-red-50 to-rose-50' : 'from-gray-50 to-slate-50',
      borderColor: cameraDetections > 0 ? 'border-red-200' : 'border-gray-200',
      trend: cameraDetections > 0 ? 'up' : 'stable'
    },
    {
      id: 'media',
      title: 'Media',
      value: `${mediaPlaying}`,
      subtitle: 'playing',
      icon: Volume2,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200',
      trend: mediaPlaying > 0 ? 'up' : 'stable'
    },
    {
      id: 'climate',
      title: 'Climate Control',
      value: `${fansOn}`,
      subtitle: 'fans running',
      icon: Wind,
      color: 'from-cyan-500 to-teal-500',
      bgColor: 'from-cyan-50 to-teal-50',
      borderColor: 'border-cyan-200',
      trend: fansOn > 0 ? 'up' : 'stable'
    },
    {
      id: 'energy',
      title: 'Energy Usage',
      value: `${currentPower} kW`,
      subtitle: `${dailyUsage} kWh today`,
      icon: Activity,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      trend: currentPower > 3 ? 'up' : currentPower < 2 ? 'down' : 'stable'
    }
  ];

  // Add alert stats if there are any
  if (floodAlerts > 0 || smokeAlerts > 0) {
    stats.push({
      id: 'alerts',
      title: 'Safety Alerts',
      value: `${floodAlerts + smokeAlerts}`,
      subtitle: 'active alerts',
      icon: floodAlerts > 0 ? Waves : Flame,
      color: 'from-red-600 to-red-700',
      bgColor: 'from-red-100 to-red-200',
      borderColor: 'border-red-300',
      trend: 'up'
    });
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        const TrendIcon = getTrendIcon(stat.trend);
        
        return (
          <div
            key={stat.id}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-4 border ${stat.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-xl shadow-sm`}>
                <IconComponent className="w-4 h-4 text-white" />
              </div>
              <TrendIcon className={`w-3 h-3 ${getTrendColor(stat.trend)}`} />
            </div>
            
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs font-medium text-gray-700">{stat.title}</div>
              <div className="text-xs text-gray-500">{stat.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStatsGrid;