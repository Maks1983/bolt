import React from 'react';
import { Activity } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface ActivityCardProps {
  onClick?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ onClick }) => {
  const { state } = useDevices();

  // Get motion sensors and device trackers
  const motionSensors = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && (device as any).sensor_type === 'motion'
  );
  const deviceTrackers = state.devices.filter(device => device.device_type === 'device_tracker');

  // Calculate activity metrics
  const activeMotionSensors = motionSensors.filter(sensor => sensor.state === 'on').length;
  const peopleHome = deviceTrackers.filter(tracker => tracker.state === 'home').length;

  const hasActivity = activeMotionSensors > 0 || peopleHome > 0;

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer min-w-[120px]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className={`p-3 rounded-full ${hasActivity ? 'bg-green-500/20' : 'bg-gray-500/20'} shadow-lg`}>
          <Activity className={`w-6 h-6 ${hasActivity ? 'text-green-600' : 'text-gray-600'}`} />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Activity</div>
          <div className={`text-xs font-medium ${hasActivity ? 'text-green-600' : 'text-gray-600'}`}>
            {peopleHome > 0 ? `${peopleHome} home` : 'No activity'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;