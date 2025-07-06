import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface AlarmCardProps {
  onClick?: () => void;
}

const AlarmCard: React.FC<AlarmCardProps> = ({ onClick }) => {
  const { state } = useDevices();

  // Get alarm control panel devices
  const alarmSystems = state.devices.filter(device => device.device_type === 'alarm_control_panel');
  const mainAlarm = alarmSystems[0]; // Assume first one is main system

  const isArmed = mainAlarm?.state === 'armed_home' || mainAlarm?.state === 'armed_away';

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer min-w-[120px]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className={`p-3 rounded-full ${isArmed ? 'bg-red-500/20' : 'bg-green-500/20'} shadow-lg`}>
          <Shield className={`w-6 h-6 ${isArmed ? 'text-red-600' : 'text-green-600'}`} />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Alarm</div>
          <div className={`text-xs font-medium ${isArmed ? 'text-red-600' : 'text-green-600'}`}>
            {mainAlarm?.state === 'armed_home' ? 'Armed Home' : 
             mainAlarm?.state === 'armed_away' ? 'Armed Away' : 
             mainAlarm?.state === 'triggered' ? 'TRIGGERED' : 'Disarmed'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmCard;