import React, { useState } from 'react';
import { Activity, User, Eye, EyeOff } from 'lucide-react';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';

const ActivityCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Get motion sensors from different rooms
  const motionSensors = [
    { name: 'Master Bedroom', entity: useRealtimeDevice('binary_sensor.master_bedroom_motion_sensor') },
    { name: 'Bathroom', entity: useRealtimeDevice('binary_sensor.bathroom_motion_sensor') },
    { name: 'Bedroom', entity: useRealtimeDevice('binary_sensor.bedroom_motion_sensor') },
    { name: 'Kitchen', entity: useRealtimeDevice('binary_sensor.kitchen_motion_sensor') },
    { name: 'Living Room', entity: useRealtimeDevice('binary_sensor.living_room_motion_sensor') },
    { name: 'Entrance', entity: useRealtimeDevice('binary_sensor.entrance_motion_sensor') },
    { name: 'Office', entity: useRealtimeDevice('binary_sensor.office_motion_sensor') },
    { name: 'Laundry', entity: useRealtimeDevice('binary_sensor.laundry_motion_sensor') }
  ].filter(sensor => sensor.entity); // Only include sensors that exist

  // Count active motion sensors
  const activeMotionSensors = motionSensors.filter(sensor => sensor.entity?.state === 'on').length;
  const totalMotionSensors = motionSensors.length;

  // Get camera motion detection
  const frontDoorMotion = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_motion');
  const backyardMotion = useRealtimeDevice('binary_sensor.g4_bullet_backyard_motion');
  const frontDoorPerson = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_person_detected');
  const backyardPerson = useRealtimeDevice('binary_sensor.g4_bullet_backyard_person_detected');

  const cameraDetections = [
    { name: 'Front Door Motion', entity: frontDoorMotion, type: 'motion' },
    { name: 'Front Door Person', entity: frontDoorPerson, type: 'person' },
    { name: 'Backyard Motion', entity: backyardMotion, type: 'motion' },
    { name: 'Backyard Person', entity: backyardPerson, type: 'person' }
  ].filter(detection => detection.entity);

  const activeCameraDetections = cameraDetections.filter(detection => detection.entity?.state === 'on').length;

  const hasActivity = activeMotionSensors > 0 || activeCameraDetections > 0;

  return (
    <>
      <div 
        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer hover:scale-105 transition-all ${
          hasActivity ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        }`}
        onClick={() => setShowModal(true)}
      >
        <Activity className={`w-5 h-5 ${hasActivity ? 'text-green-600' : 'text-gray-600'}`} />
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Activity</div>
          <div className="text-xs text-gray-600">
            {activeMotionSensors + activeCameraDetections} active
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Activity Monitor</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className={`rounded-2xl p-6 border-2 ${
                  activeMotionSensors > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <User className={`w-6 h-6 ${activeMotionSensors > 0 ? 'text-green-600' : 'text-gray-600'}`} />
                    <h3 className="text-lg font-semibold text-gray-900">Motion Sensors</h3>
                  </div>
                  <div className={`text-3xl font-bold ${activeMotionSensors > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                    {activeMotionSensors}/{totalMotionSensors}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {activeMotionSensors > 0 ? 'Motion detected' : 'No motion detected'}
                  </div>
                </div>

                <div className={`rounded-2xl p-6 border-2 ${
                  activeCameraDetections > 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <Eye className={`w-6 h-6 ${activeCameraDetections > 0 ? 'text-blue-600' : 'text-gray-600'}`} />
                    <h3 className="text-lg font-semibold text-gray-900">Camera AI</h3>
                  </div>
                  <div className={`text-3xl font-bold ${activeCameraDetections > 0 ? 'text-blue-600' : 'text-gray-600'}`}>
                    {activeCameraDetections}/{cameraDetections.length}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {activeCameraDetections > 0 ? 'AI detection active' : 'No detections'}
                  </div>
                </div>
              </div>

              {/* Motion Sensors Detail */}
              {motionSensors.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Motion Sensors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {motionSensors.map((sensor, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-xl border-2 transition-all ${
                          sensor.entity?.state === 'on' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <User className={`w-4 h-4 ${
                            sensor.entity?.state === 'on' ? 'text-green-600' : 'text-gray-400'
                          }`} />
                          <span className="text-sm font-semibold text-gray-900">{sensor.name}</span>
                        </div>
                        <div className={`text-xs ${
                          sensor.entity?.state === 'on' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {sensor.entity?.state === 'on' ? 'Motion detected' : 'No motion'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Camera AI Detection Detail */}
              {cameraDetections.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Camera AI Detection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cameraDetections.map((detection, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-xl border-2 transition-all ${
                          detection.entity?.state === 'on' 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Eye className={`w-4 h-4 ${
                            detection.entity?.state === 'on' ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <span className="text-sm font-semibold text-gray-900">{detection.name}</span>
                        </div>
                        <div className={`text-xs ${
                          detection.entity?.state === 'on' ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {detection.entity?.state === 'on' ? 
                            `${detection.type === 'person' ? 'Person' : 'Motion'} detected` : 
                            'No detection'
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Sensors Message */}
              {motionSensors.length === 0 && cameraDetections.length === 0 && (
                <div className="text-center py-8">
                  <EyeOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No activity sensors configured</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Add motion sensors and camera AI detection to monitor activity
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityCard;