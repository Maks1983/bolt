import React from 'react';
import { Activity, User, UserCheck, UserX } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

const ActivityCard: React.FC = () => {
  const { state } = useDevices();

  // Get motion sensors and device trackers
  const motionSensors = state.devices.filter(device => 
    device.device_type === 'binary_sensor' && (device as any).sensor_type === 'motion'
  );
  const deviceTrackers = state.devices.filter(device => device.device_type === 'device_tracker');

  // Calculate activity metrics
  const activeMotionSensors = motionSensors.filter(sensor => sensor.state === 'on').length;
  const totalMotionSensors = motionSensors.length;
  const peopleHome = deviceTrackers.filter(tracker => tracker.state === 'home').length;
  const totalPeople = deviceTrackers.length;

  // Determine activity level
  const getActivityLevel = () => {
    const motionPercentage = totalMotionSensors > 0 ? (activeMotionSensors / totalMotionSensors) * 100 : 0;
    
    if (peopleHome === 0) {
      return { level: 'Away', color: 'gray', icon: UserX };
    } else if (motionPercentage > 50) {
      return { level: 'High Activity', color: 'green', icon: Activity };
    } else if (motionPercentage > 20) {
      return { level: 'Moderate', color: 'blue', icon: User };
    } else {
      return { level: 'Low Activity', color: 'yellow', icon: UserCheck };
    }
  };

  const activity = getActivityLevel();
  const ActivityIcon = activity.icon;

  return (
    <div className={`bg-gradient-to-br from-${activity.color}-50 to-${activity.color}-100 rounded-2xl p-4 border border-${activity.color}-200/50 shadow-sm hover:shadow-md transition-all min-w-[200px]`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 bg-${activity.color}-600 rounded-lg`}>
            <ActivityIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Activity</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full`}></div>
          <span className={`text-xs text-${activity.color}-600 font-medium`}>{activity.level}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">People Home</span>
          <span className="font-medium text-gray-900">{peopleHome}/{totalPeople}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Motion Detected</span>
          <span className="font-medium text-gray-900">{activeMotionSensors}/{totalMotionSensors}</span>
        </div>
        {activeMotionSensors > 0 && (
          <div className="text-xs text-gray-500">
            Active in: {motionSensors
              .filter(s => s.state === 'on')
              .map(s => s.room)
              .join(', ')
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;