import React, { useState } from 'react';
import { 
  Zap, Home, Moon, Shield, Lightbulb, Fan, Volume2, 
  Camera, Lock, Unlock, Play, Pause, Sun, Power
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

const QuickActionsPanel: React.FC = () => {
  const { 
    state, 
    controlLight, 
    controlFan, 
    controlMediaPlayer, 
    controlLock, 
    controlAlarm 
  } = useDevices();
  
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  
  // Calculate current states
  const lightsOn = state.devices.filter(d => d.device_type === 'light' && d.state === 'on').length;
  const totalLights = state.devices.filter(d => d.device_type === 'light').length;
  const fansOn = state.devices.filter(d => d.device_type === 'fan' && d.state === 'on').length;
  const mediaPlaying = state.devices.filter(d => d.device_type === 'media_player' && d.state === 'playing').length;
  const locks = state.devices.filter(d => d.device_type === 'lock');
  const allLocked = locks.length > 0 && locks.every(l => l.state === 'locked');
  
  const executeAction = async (actionId: string, action: () => void) => {
    setIsExecuting(actionId);
    try {
      action();
      // Simulate action delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsExecuting(null);
    }
  };
  
  const quickActions = [
    {
      id: 'lights_off',
      title: 'All Lights Off',
      subtitle: `Turn off ${lightsOn} lights`,
      icon: Lightbulb,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-200',
      enabled: lightsOn > 0,
      action: () => {
        const lights = state.devices.filter(d => d.device_type === 'light' && d.state === 'on');
        lights.forEach(light => controlLight(light.entity_id, false));
      }
    },
    {
      id: 'lights_on',
      title: 'All Lights On',
      subtitle: `Turn on ${totalLights - lightsOn} lights`,
      icon: Sun,
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200',
      enabled: lightsOn < totalLights,
      action: () => {
        const lights = state.devices.filter(d => d.device_type === 'light' && d.state === 'off');
        lights.forEach(light => controlLight(light.entity_id, true));
      }
    },
    {
      id: 'fans_off',
      title: 'All Fans Off',
      subtitle: `Turn off ${fansOn} fans`,
      icon: Fan,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-50 to-blue-50',
      borderColor: 'border-cyan-200',
      enabled: fansOn > 0,
      action: () => {
        const fans = state.devices.filter(d => d.device_type === 'fan' && d.state === 'on');
        fans.forEach(fan => controlFan(fan.entity_id, false));
      }
    },
    {
      id: 'media_pause',
      title: 'Pause All Media',
      subtitle: `Pause ${mediaPlaying} players`,
      icon: Pause,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200',
      enabled: mediaPlaying > 0,
      action: () => {
        const players = state.devices.filter(d => d.device_type === 'media_player' && d.state === 'playing');
        players.forEach(player => controlMediaPlayer(player.entity_id, 'pause'));
      }
    },
    {
      id: 'lock_all',
      title: allLocked ? 'All Locked' : 'Lock All',
      subtitle: `${locks.length} door locks`,
      icon: allLocked ? Lock : Unlock,
      color: allLocked ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500',
      bgColor: allLocked ? 'from-green-50 to-emerald-50' : 'from-red-50 to-rose-50',
      borderColor: allLocked ? 'border-green-200' : 'border-red-200',
      enabled: !allLocked,
      action: () => {
        const unlockedLocks = locks.filter(l => l.state === 'unlocked');
        unlockedLocks.forEach(lock => controlLock(lock.entity_id, 'lock'));
      }
    },
    {
      id: 'good_night',
      title: 'Good Night',
      subtitle: 'Lights off, lock doors',
      icon: Moon,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-200',
      enabled: true,
      action: () => {
        // Turn off all lights
        const lights = state.devices.filter(d => d.device_type === 'light' && d.state === 'on');
        lights.forEach(light => controlLight(light.entity_id, false));
        
        // Lock all doors
        const unlockedLocks = locks.filter(l => l.state === 'unlocked');
        unlockedLocks.forEach(lock => controlLock(lock.entity_id, 'lock'));
        
        // Pause all media
        const players = state.devices.filter(d => d.device_type === 'media_player' && d.state === 'playing');
        players.forEach(player => controlMediaPlayer(player.entity_id, 'pause'));
      }
    },
    {
      id: 'welcome_home',
      title: 'Welcome Home',
      subtitle: 'Lights on, unlock door',
      icon: Home,
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-50 to-teal-50',
      borderColor: 'border-green-200',
      enabled: true,
      action: () => {
        // Turn on main lights
        const mainLights = state.devices.filter(d => 
          d.device_type === 'light' && 
          (d.room === 'Living Room' || d.room === 'Kitchen' || d.room === 'Entrance')
        );
        mainLights.forEach(light => controlLight(light.entity_id, true));
        
        // Unlock entrance door
        const entranceLocks = locks.filter(l => l.room === 'Entrance');
        entranceLocks.forEach(lock => controlLock(lock.entity_id, 'unlock'));
      }
    },
    {
      id: 'security_mode',
      title: 'Security Mode',
      subtitle: 'Arm system, lock all',
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      bgColor: 'from-red-50 to-orange-50',
      borderColor: 'border-red-200',
      enabled: true,
      action: () => {
        // Lock all doors
        locks.forEach(lock => controlLock(lock.entity_id, 'lock'));
        
        // Arm alarm system
        const alarmSystems = state.devices.filter(d => d.device_type === 'alarm_control_panel');
        alarmSystems.forEach(alarm => controlAlarm(alarm.entity_id, 'arm_away'));
        
        // Turn off all lights except security lights
        const lights = state.devices.filter(d => 
          d.device_type === 'light' && 
          d.state === 'on' && 
          !d.friendly_name.toLowerCase().includes('security')
        );
        lights.forEach(light => controlLight(light.entity_id, false));
      }
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            <p className="text-gray-600">One-tap automation</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            const isExecutingThis = isExecuting === action.id;
            
            return (
              <button
                key={action.id}
                onClick={() => executeAction(action.id, action.action)}
                disabled={!action.enabled || isExecutingThis}
                className={`
                  w-full p-4 rounded-2xl border transition-all duration-300
                  ${action.enabled 
                    ? `bg-gradient-to-br ${action.bgColor} ${action.borderColor} hover:shadow-md hover:scale-[1.02]` 
                    : 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                  }
                  ${isExecutingThis ? 'animate-pulse' : ''}
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className={`
                    p-3 rounded-xl flex-shrink-0
                    ${action.enabled 
                      ? `bg-gradient-to-br ${action.color} shadow-sm` 
                      : 'bg-gray-400'
                    }
                  `}>
                    {isExecutingThis ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <IconComponent className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">{action.title}</div>
                    <div className="text-sm text-gray-600">{action.subtitle}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Connection Status</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                state.connectionState === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`font-medium ${
                state.connectionState === 'connected' ? 'text-green-600' : 'text-red-600'
              }`}>
                {state.connectionState === 'connected' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;