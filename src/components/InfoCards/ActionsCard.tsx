import React from 'react';
import { 
  Lightbulb, 
  LightbulbOff, 
  Home, 
  Moon, 
  Sun, 
  Shield,
  Power
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface ActionsCardProps {
  onClick?: () => void;
}

const ActionsCard: React.FC<ActionsCardProps> = ({ onClick }) => {
  const { state, controlLight, controlAlarm } = useDevices();

  // Get all lights and alarm systems
  const lights = state.devices.filter(device => device.device_type === 'light');
  const alarmSystems = state.devices.filter(device => device.device_type === 'alarm_control_panel');
  
  const lightsOn = lights.filter(light => light.state === 'on').length;
  const totalLights = lights.length;
  const allLightsOn = lightsOn === totalLights && totalLights > 0;
  const mainAlarm = alarmSystems[0];

  // Quick action handlers
  const handleAllLightsToggle = () => {
    lights.forEach(light => {
      controlLight(light.entity_id, !allLightsOn);
    });
  };

  const handleGoodNight = () => {
    // Turn off all lights and arm alarm home
    lights.forEach(light => {
      if (light.state === 'on') {
        controlLight(light.entity_id, false);
      }
    });
    
    if (mainAlarm && mainAlarm.state === 'disarmed') {
      controlAlarm(mainAlarm.entity_id, 'arm_home');
    }
  };

  const handleGoodMorning = () => {
    // Turn on main lights and disarm alarm
    const mainLights = lights.filter(light => 
      light.room === 'Living Room' || 
      light.room === 'Kitchen' || 
      light.room === 'Bedroom'
    );
    
    mainLights.forEach(light => {
      if (light.state === 'off') {
        controlLight(light.entity_id, true, 200);
      }
    });
    
    if (mainAlarm && mainAlarm.state !== 'disarmed') {
      controlAlarm(mainAlarm.entity_id, 'disarm');
    }
  };

  const handleAwayMode = () => {
    // Turn off all lights and arm alarm away
    lights.forEach(light => {
      if (light.state === 'on') {
        controlLight(light.entity_id, false);
      }
    });
    
    if (mainAlarm && mainAlarm.state === 'disarmed') {
      controlAlarm(mainAlarm.entity_id, 'arm_away');
    }
  };

  return (
    <div 
      className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Power className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Quick Actions</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-xs text-purple-600 font-medium">Ready</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAllLightsToggle();
          }}
          className="flex flex-col items-center space-y-1 p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
        >
          {allLightsOn ? (
            <LightbulbOff className="w-4 h-4 text-gray-600" />
          ) : (
            <Lightbulb className="w-4 h-4 text-yellow-600" />
          )}
          <span className="text-xs font-medium text-gray-700">
            {allLightsOn ? 'All Off' : 'All On'}
          </span>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleGoodNight();
          }}
          className="flex flex-col items-center space-y-1 p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
        >
          <Moon className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-medium text-gray-700">Good Night</span>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleGoodMorning();
          }}
          className="flex flex-col items-center space-y-1 p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
        >
          <Sun className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-medium text-gray-700">Good Morning</span>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAwayMode();
          }}
          className="flex flex-col items-center space-y-1 p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
        >
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-medium text-gray-700">Away Mode</span>
        </button>
      </div>
    </div>
  );
};

export default ActionsCard;