import React, { useState } from 'react';
import { 
  Zap, Lightbulb, Fan, Volume2, Moon, Home, Shield, Sun,
  Power, Pause, Lock, Unlock
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

const QuickActionsBar: React.FC = () => {
  const { 
    state, 
    controlLight, 
    controlFan, 
    controlMediaPlayer, 
    controlLock 
  } = useDevices();
  
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  
  // Calculate current states
  const lightsOn = state.devices.filter(d => d.device_type === 'light' && d.state === 'on').length;
  const totalLights = state.devices.filter(d => d.device_type === 'light').length;
  const fansOn = state.devices.filter(d => d.device_type === 'fan' && d.state === 'on').length;
  const mediaPlaying = state.devices.filter(d => d.device_type === 'media_player' && d.state === 'playing').length;
  const locks = state.devices.filter(d => d.device_type === 'lock');
  const allLocked = locks.length > 0 && locks.every(l => l.state === 'locked');
  
  const executeAction = async (actionId: string, action: () => void) => {
    setExecutingAction(actionId);
    try {
      action();
      await new Promise(resolve => setTimeout(resolve, 800));
    } finally {
      setExecutingAction(null);
    }
  };
  
  const quickActions = [
    {
      id: 'lights_toggle',
      icon: lightsOn > totalLights / 2 ? Lightbulb : Sun,
      label: lightsOn > totalLights / 2 ? 'Lights Off' : 'Lights On',
      count: lightsOn > totalLights / 2 ? lightsOn : totalLights - lightsOn,
      color: 'from-yellow-500 to-amber-500',
      enabled: totalLights > 0,
      action: () => {
        if (lightsOn > totalLights / 2) {
          // Turn off all lights
          const lights = state.devices.filter(d => d.device_type === 'light' && d.state === 'on');
          lights.forEach(light => controlLight(light.entity_id, false));
        } else {
          // Turn on all lights
          const lights = state.devices.filter(d => d.device_type === 'light' && d.state === 'off');
          lights.forEach(light => controlLight(light.entity_id, true));
        }
      }
    },
    {
      id: 'fans_off',
      icon: Fan,
      label: 'Fans Off',
      count: fansOn,
      color: 'from-cyan-500 to-blue-500',
      enabled: fansOn > 0,
      action: () => {
        const fans = state.devices.filter(d => d.device_type === 'fan' && d.state === 'on');
        fans.forEach(fan => controlFan(fan.entity_id, false));
      }
    },
    {
      id: 'media_pause',
      icon: Pause,
      label: 'Pause All',
      count: mediaPlaying,
      color: 'from-purple-500 to-indigo-500',
      enabled: mediaPlaying > 0,
      action: () => {
        const players = state.devices.filter(d => d.device_type === 'media_player' && d.state === 'playing');
        players.forEach(player => controlMediaPlayer(player.entity_id, 'pause'));
      }
    },
    {
      id: 'lock_toggle',
      icon: allLocked ? Lock : Unlock,
      label: allLocked ? 'All Locked' : 'Lock All',
      count: allLocked ? locks.length : locks.filter(l => l.state === 'unlocked').length,
      color: allLocked ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500',
      enabled: locks.length > 0 && !allLocked,
      action: () => {
        const unlockedLocks = locks.filter(l => l.state === 'unlocked');
        unlockedLocks.forEach(lock => controlLock(lock.entity_id, 'lock'));
      }
    },
    {
      id: 'good_night',
      icon: Moon,
      label: 'Good Night',
      count: lightsOn + locks.filter(l => l.state === 'unlocked').length,
      color: 'from-indigo-500 to-purple-500',
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
      icon: Home,
      label: 'Welcome Home',
      count: 0,
      color: 'from-green-500 to-teal-500',
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
    }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Quick Actions */}
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              const isExecuting = executingAction === action.id;
              
              return (
                <button
                  key={action.id}
                  onClick={() => executeAction(action.id, action.action)}
                  disabled={!action.enabled || isExecuting}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 min-w-0 flex-shrink-0
                    ${action.enabled 
                      ? `bg-gradient-to-r ${action.color} text-white hover:shadow-md hover:scale-105 active:scale-95` 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                    ${isExecuting ? 'animate-pulse' : ''}
                  `}
                >
                  {isExecuting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <IconComponent className="w-4 h-4 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{action.label}</div>
                    {action.count > 0 && (
                      <div className="text-xs opacity-90 truncate">{action.count} items</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">
                {state.connectionState === 'connected' ? 'Ready' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsBar;