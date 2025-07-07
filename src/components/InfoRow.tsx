import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Zap, 
  TrendingDown, 
  Thermometer, 
  Activity, 
  Clock, 
  DoorOpen, 
  Lightbulb, 
  User, 
  Bell, 
  X, 
  Settings, 
  Moon, 
  Plane, 
  Users, 
  Sun, 
  Coffee, 
  Camera, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize, 
  Home, 
  AlertTriangle, 
  CheckCircle, 
  Power, 
  Wifi, 
  WifiOff, 
  Delete, 
  Hash, 
  BarChart3, 
  TrendingUp, 
  Droplets, 
  Wind,
  HardDrive
} from 'lucide-react';
import { useDevices } from '../context/DeviceContext';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';
import { formatTemperature, formatHumidity } from '../utils/deviceHelpers';

// Import individual card components for expanded views
import AlarmCard from './InfoCards/AlarmCard';
import SecurityCard from './InfoCards/SecurityCard';
import EnergyCard from './InfoCards/EnergyCard';
import IndoorAverageCard from './InfoCards/IndoorAverageCard';
import ActivityCard from './InfoCards/ActivityCard';
import ActionsCard from './InfoCards/ActionsCard';
import NVRCard from './InfoCards/NVRCard';

interface InfoRowProps {
  cameras?: any[];
}

const InfoRow: React.FC<InfoRowProps> = ({ cameras = [] }) => {
  const { state } = useDevices();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Get specific device data for the icons
  const alarmSystems = state.devices.filter(device => device.device_type === 'alarm_control_panel');
  const locks = state.devices.filter(device => device.device_type === 'lock');
  const lights = state.devices.filter(device => device.device_type === 'light');
  const tempSensors = state.devices.filter(device => 
    device.device_type === 'sensor' && (device as any).sensor_type === 'temperature'
  );
  const motionSensors = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && (device as any).sensor_type === 'motion'
  );
  const deviceTrackers = state.devices.filter(device => device.device_type === 'device_tracker');

  // Calculate statistics
  const mainAlarm = alarmSystems[0];
  const lockedCount = locks.filter(lock => lock.state === 'locked').length;
  const lightsOn = lights.filter(light => light.state === 'on').length;
  const avgTemp = tempSensors.length > 0 
    ? tempSensors.reduce((sum, sensor) => sum + Number(sensor.state), 0) / tempSensors.length
    : 20;
  const activeMotion = motionSensors.filter(sensor => sensor.state === 'on').length;
  const peopleHome = deviceTrackers.filter(tracker => tracker.state === 'home').length;
  const currentUsage = lightsOn * 0.01; // Mock energy calculation

  const getAlarmColor = () => {
    if (!mainAlarm) return 'text-gray-400';
    switch (mainAlarm.state) {
      case 'disarmed': return 'text-green-500';
      case 'armed_home': return 'text-blue-500';
      case 'armed_away': return 'text-orange-500';
      case 'triggered': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getAlarmText = () => {
    if (!mainAlarm) return 'No Alarm';
    switch (mainAlarm.state) {
      case 'disarmed': return 'Disarmed';
      case 'armed_home': return 'Home';
      case 'armed_away': return 'Away';
      case 'triggered': return 'ALARM';
      default: return 'Unknown';
    }
  };

  const getSecurityColor = () => {
    if (locks.length === 0) return 'text-gray-400';
    if (lockedCount === locks.length) return 'text-green-500';
    return 'text-red-500';
  };

  const getEnergyColor = () => {
    if (currentUsage < 0.5) return 'text-green-500';
    if (currentUsage < 1.0) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getComfortColor = () => {
    if (avgTemp >= 20 && avgTemp <= 24) return 'text-green-500';
    if (avgTemp >= 18 && avgTemp <= 26) return 'text-blue-500';
    return 'text-yellow-500';
  };

  const getActivityColor = () => {
    if (peopleHome === 0) return 'text-gray-400';
    if (activeMotion > 0) return 'text-green-500';
    return 'text-blue-500';
  };

  const handleIconClick = (cardType: string) => {
    setExpandedCard(cardType);
  };

  const closeExpandedCard = () => {
    setExpandedCard(null);
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-8 min-w-max">
            
            {/* Alarm System */}
            <div 
              className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer group"
              onClick={() => handleIconClick('alarm')}
            >
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                <Shield className={`w-6 h-6 ${getAlarmColor()}`} />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{getAlarmText()}</div>
                <div className="text-xs text-gray-500">Alarm</div>
              </div>
            </div>

            {/* Security */}
            <div 
              className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer group"
              onClick={() => handleIconClick('security')}
            >
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                <Lock className={`w-6 h-6 ${getSecurityColor()}`} />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{lockedCount}/{locks.length}</div>
                <div className="text-xs text-gray-500">Locked</div>
              </div>
            </div>

            {/* Energy */}
            <div 
              className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer group"
              onClick={() => handleIconClick('energy')}
            >
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                <Zap className={`w-6 h-6 ${getEnergyColor()}`} />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{currentUsage.toFixed(2)}kW</div>
                <div className="text-xs text-gray-500">Energy</div>
              </div>
            </div>

            {/* Indoor Average */}
            <div 
              className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer group"
              onClick={() => handleIconClick('indoor')}
            >
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                <Thermometer className={`w-6 h-6 ${getComfortColor()}`} />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{formatTemperature(avgTemp)}</div>
                <div className="text-xs text-gray-500">Indoor</div>
              </div>
            </div>

            {/* Activity */}
            <div 
              className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer group"
              onClick={() => handleIconClick('activity')}
            >
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                <Activity className={`w-6 h-6 ${getActivityColor()}`} />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{peopleHome}</div>
                <div className="text-xs text-gray-500">Home</div>
              </div>
            </div>

            {/* Actions */}
            <div 
              className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer group"
              onClick={() => handleIconClick('actions')}
            >
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                <Power className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">Quick</div>
                <div className="text-xs text-gray-500">Actions</div>
              </div>
            </div>

            {/* NVR System */}
            <div 
              className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer group"
              onClick={() => handleIconClick('nvr')}
            >
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                <HardDrive className="w-6 h-6 text-slate-600" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{cameras.length}</div>
                <div className="text-xs text-gray-500">Cameras</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Expanded Card Modals */}
      {expandedCard === 'alarm' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Alarm System</h2>
              <button 
                onClick={closeExpandedCard}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <AlarmCard />
            </div>
          </div>
        </div>
      )}

      {expandedCard === 'security' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Security Status</h2>
              <button 
                onClick={closeExpandedCard}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <SecurityCard />
            </div>
          </div>
        </div>
      )}

      {expandedCard === 'energy' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Energy Usage</h2>
              <button 
                onClick={closeExpandedCard}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <EnergyCard />
            </div>
          </div>
        </div>
      )}

      {expandedCard === 'indoor' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Indoor Climate</h2>
              <button 
                onClick={closeExpandedCard}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <IndoorAverageCard />
            </div>
          </div>
        </div>
      )}

      {expandedCard === 'activity' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Home Activity</h2>
              <button 
                onClick={closeExpandedCard}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <ActivityCard />
            </div>
          </div>
        </div>
      )}

      {expandedCard === 'actions' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <button 
                onClick={closeExpandedCard}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <ActionsCard />
            </div>
          </div>
        </div>
      )}

      {expandedCard === 'nvr' && (
        <NVRCard onClick={closeExpandedCard} />
      )}
    </>
  );
};

export default InfoRow;