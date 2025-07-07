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

  const getAlarmStatus = () => {
    if (!mainAlarm) return { status: 'Unknown', color: 'gray', icon: Shield };
    
    switch (mainAlarm.state) {
      case 'disarmed':
        return { status: 'Disarmed', color: 'green', icon: Shield };
      case 'armed_home':
        return { status: 'Armed Home', color: 'blue', icon: Shield };
      case 'armed_away':
        return { status: 'Armed Away', color: 'orange', icon: Shield };
      case 'pending':
        return { status: 'Pending', color: 'yellow', icon: Shield };
      case 'triggered':
        return { status: 'TRIGGERED', color: 'red', icon: AlertTriangle };
      default:
        return { status: 'Unknown', color: 'gray', icon: Shield };
    }
  };

  const alarmStatus = getAlarmStatus();
  const StatusIcon = alarmStatus.icon;

  return (
    <div 
      className={`bg-gradient-to-br from-${alarmStatus.color}-50 to-${alarmStatus.color}-100 rounded-2xl p-4 border border-${alarmStatus.color}-200/50 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 bg-${alarmStatus.color}-600 rounded-lg`}>
            <StatusIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Alarm System</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 bg-${alarmStatus.color}-500 rounded-full`}></div>
          <span className={`text-xs text-${alarmStatus.color}-600 font-medium`}>{alarmStatus.status}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status</span>
          <span className={`font-medium text-${alarmStatus.color}-700`}>{alarmStatus.status}</span>
        </div>
        {mainAlarm?.changed_by && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Changed by</span>
            <span className="font-medium text-gray-900">{mainAlarm.changed_by}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlarmCard;