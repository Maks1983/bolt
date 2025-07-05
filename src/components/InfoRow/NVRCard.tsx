import React, { useState } from 'react';
import { Camera, Eye, EyeOff, AlertTriangle, User, Car, Baby, Flame, Volume2, Moon, Sun, Bell } from 'lucide-react';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';

const NVRCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  
  // Camera entities
  const frontDoorCamera = useRealtimeDevice('camera.g4_doorbell_pro_poe_high_resolution_channel');
  const backyardCamera = useRealtimeDevice('camera.g4_bullet_backyard_high_resolution_channel');

  // Front door detection sensors
  const frontDoorMotion = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_motion');
  const frontDoorPerson = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_person_detected');
  const frontDoorAnimal = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_animal_detected');
  const frontDoorVehicle = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_vehicle_detected');
  const frontDoorDoorbell = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_doorbell');
  const frontDoorNightMode = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_is_dark');
  const frontDoorSpeaking = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_speaking_detected');
  const frontDoorBabyCry = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_baby_cry_detected');
  const frontDoorSmokeAlarm = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_smoke_alarm_detected');
  const frontDoorCOAlarm = useRealtimeDevice('binary_sensor.g4_doorbell_pro_poe_co_alarm_detected');

  // Backyard detection sensors
  const backyardMotion = useRealtimeDevice('binary_sensor.g4_bullet_backyard_motion');
  const backyardPerson = useRealtimeDevice('binary_sensor.g4_bullet_backyard_person_detected');
  const backyardAnimal = useRealtimeDevice('binary_sensor.g4_bullet_backyard_animal_detected');
  const backyardVehicle = useRealtimeDevice('binary_sensor.g4_bullet_backyard_vehicle_detected');
  const backyardNightMode = useRealtimeDevice('binary_sensor.g4_bullet_backyard_is_dark');
  const backyardSpeaking = useRealtimeDevice('binary_sensor.g4_bullet_backyard_speaking_detected');
  const backyardBabyCry = useRealtimeDevice('binary_sensor.g4_bullet_backyard_baby_cry_detected');
  const backyardSmokeAlarm = useRealtimeDevice('binary_sensor.g4_bullet_backyard_smoke_alarm_detected');
  const backyardCOAlarm = useRealtimeDevice('binary_sensor.g4_bullet_backyard_co_alarm_detected');

  const cameras = [
    {
      id: 'front_door',
      name: 'Front Door Camera',
      location: 'Entrance',
      entity: frontDoorCamera,
      recording: frontDoorCamera?.state === 'recording',
      nightVision: frontDoorNightMode?.state === 'on',
      rtspUrl: 'rtsps://10.150.1.1:7441/0mpROo3cEGsCXhXg?enableSrtp',
      backgroundImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      detections: {
        motion: frontDoorMotion,
        person: frontDoorPerson,
        animal: frontDoorAnimal,
        vehicle: frontDoorVehicle,
        doorbell: frontDoorDoorbell,
        speaking: frontDoorSpeaking,
        baby_cry: frontDoorBabyCry,
        smoke_alarm: frontDoorSmokeAlarm,
        co_alarm: frontDoorCOAlarm,
        night_mode: frontDoorNightMode
      }
    },
    {
      id: 'backyard',
      name: 'Backyard Camera',
      location: 'Backyard',
      entity: backyardCamera,
      recording: backyardCamera?.state === 'recording',
      nightVision: backyardNightMode?.state === 'on',
      rtspUrl: 'rtsp://your-backyard-camera-url', // Replace with actual RTSP URL
      backgroundImage: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800',
      detections: {
        motion: backyardMotion,
        person: backyardPerson,
        animal: backyardAnimal,
        vehicle: backyardVehicle,
        speaking: backyardSpeaking,
        baby_cry: backyardBabyCry,
        smoke_alarm: backyardSmokeAlarm,
        co_alarm: backyardCOAlarm,
        night_mode: backyardNightMode
      }
    }
  ];

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case 'person': return User;
      case 'animal': return '🐾';
      case 'vehicle': return Car;
      case 'motion': return '👋';
      case 'doorbell': return Bell;
      case 'baby_cry': return Baby;
      case 'speaking': return Volume2;
      case 'smoke_alarm': return Flame;
      case 'co_alarm': return AlertTriangle;
      case 'night_mode': return Moon;
      default: return AlertTriangle;
    }
  };

  const getDetectionLabel = (type: string) => {
    switch (type) {
      case 'person': return 'Person';
      case 'animal': return 'Animal';
      case 'vehicle': return 'Vehicle';
      case 'motion': return 'Motion';
      case 'doorbell': return 'Doorbell';
      case 'baby_cry': return 'Baby Cry';
      case 'speaking': return 'Speaking';
      case 'smoke_alarm': return 'Smoke';
      case 'co_alarm': return 'CO Alarm';
      case 'night_mode': return 'Night Mode';
      default: return type.replace('_', ' ');
    }
  };

  // Count active detections across all cameras
  const totalActiveDetections = cameras.reduce((count, camera) => {
    return count + Object.values(camera.detections).filter(detection => 
      detection && detection.state === 'on'
    ).length;
  }, 0);

  const recordingCameras = cameras.filter(camera => camera.recording).length;

  return (
    <>
      <div 
        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer hover:scale-105 transition-all ${
          totalActiveDetections > 0 ? 'bg-red-50 border-red-200' : 'bg-indigo-50 border-indigo-200'
        }`}
        onClick={() => setShowModal(true)}
      >
        <Camera className={`w-5 h-5 ${totalActiveDetections > 0 ? 'text-red-600' : 'text-indigo-600'}`} />
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">NVR</div>
          <div className="text-xs text-gray-600">{recordingCameras} recording</div>
        </div>
      </div>

      {/* NVR Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Network Video Recorder</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Camera Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {cameras.map((camera) => (
                  <div key={camera.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    {/* Camera Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${camera.recording ? 'bg-red-100' : 'bg-gray-100'}`}>
                          <Camera className={`w-5 h-5 ${camera.recording ? 'text-red-600' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{camera.name}</h3>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${camera.recording ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                            <span className="text-sm text-gray-600">{camera.recording ? 'Recording' : 'Idle'}</span>
                            {camera.nightVision && <Moon className="w-4 h-4 text-purple-500" />}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setSelectedCamera(selectedCamera === camera.id ? null : camera.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          selectedCamera === camera.id 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {selectedCamera === camera.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="text-sm font-medium">{selectedCamera === camera.id ? 'Hide' : 'View'}</span>
                      </button>
                    </div>

                    {/* Camera Feed */}
                    {selectedCamera === camera.id && (
                      <div className="mb-4">
                        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                          {/* RTSP Stream - Browser Compatible */}
                          <video
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            playsInline
                            onError={(e) => {
                              console.error('Video stream error:', e);
                              // Fallback to static image on error
                              e.currentTarget.style.display = 'none';
                              const fallbackImg = e.currentTarget.nextElementSibling as HTMLImageElement;
                              if (fallbackImg) fallbackImg.style.display = 'block';
                            }}
                          >
                            <source src={camera.rtspUrl} type="application/x-rtsp" />
                            <source src={`/api/camera_proxy/${camera.entity?.entity_id}`} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          
                          {/* Fallback Image */}
                          <img
                            src={camera.backgroundImage}
                            alt={`${camera.name} fallback`}
                            className="w-full h-full object-cover"
                            style={{ display: 'none' }}
                          />
                          
                          {/* Stream Error Message */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-center p-4" style={{ display: 'none' }} id={`error-${camera.id}`}>
                            <div>
                              <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm">Camera feed unavailable</p>
                              <p className="text-xs text-gray-400 mt-1">Using fallback image</p>
                            </div>
                          </div>
                          
                          {/* RTSP URL Overlay */}
                          <div className="absolute top-3 left-3 bg-black/70 rounded-full px-3 py-1">
                            <span className="text-white text-xs font-mono">
                              {camera.rtspUrl.length > 30 ? `${camera.rtspUrl.substring(0, 30)}...` : camera.rtspUrl}
                            </span>
                          </div>
                          
                          {/* Live indicator */}
                          <div className="absolute top-3 right-3 flex items-center space-x-2 bg-black/70 rounded-full px-3 py-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-white text-xs font-medium">LIVE</span>
                          </div>
                          
                          {/* Night mode indicator */}
                          {camera.nightVision && (
                            <div className="absolute bottom-3 right-3 bg-purple-500/80 rounded-full p-2">
                              <Moon className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* AI Detection Status */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">AI Detection Status</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(camera.detections).map(([type, sensor]) => {
                          if (!sensor) return null;
                          
                          const IconComponent = getDetectionIcon(type);
                          const isActive = sensor.state === 'on';
                          
                          return (
                            <div
                              key={type}
                              className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${
                                isActive 
                                  ? 'bg-red-50 border-red-200 text-red-700' 
                                  : 'bg-gray-50 border-gray-200 text-gray-600'
                              }`}
                            >
                              {typeof IconComponent === 'string' ? (
                                <span className="text-sm">{IconComponent}</span>
                              ) : (
                                <IconComponent className="w-4 h-4" />
                              )}
                              <div className="flex-1">
                                <div className="text-xs font-medium">{getDetectionLabel(type)}</div>
                                <div className="text-xs opacity-75">
                                  {isActive ? 'Detected' : 'Clear'}
                                </div>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Status */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">System Status</h3>
                    <p className="text-sm text-gray-600">
                      {recordingCameras} of {cameras.length} cameras recording • {totalActiveDetections} active detections
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Storage</div>
                    <div className="text-lg font-semibold text-gray-900">2.4TB / 4TB</div>
                  </div>
                </div>
              </div>

              {/* Implementation Note */}
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Camera Feed Setup:</strong> To see live feeds, you need one of these solutions:
                </p>
                <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
                  <li><strong>Option 1:</strong> Use Home Assistant camera proxy: <code>/api/camera_proxy/camera.entity_id</code></li>
                  <li><strong>Option 2:</strong> Set up WebRTC gateway (go2rtc, frigate, etc.)</li>
                  <li><strong>Option 3:</strong> Use HLS/DASH streaming from your NVR</li>
                  <li><strong>Current:</strong> RTSP URLs configured but may not work in browsers</li>
                </ul>
              </div>
              
              {/* Setup Instructions */}
              <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Prerequisites for Live Feeds:</strong>
                </p>
                <ol className="text-sm text-amber-700 mt-2 list-decimal list-inside space-y-1">
                  <li>Ensure your camera entities are properly configured in Home Assistant</li>
                  <li>Verify camera streams are accessible via <code>/api/camera_proxy/camera.g4_doorbell_pro_poe_high_resolution_channel</code></li>
                  <li>For RTSP: Install a WebRTC gateway like go2rtc or use Frigate integration</li>
                  <li>Update the <code>rtspUrl</code> in the camera configuration with your actual stream URLs</li>
                  <li>Test camera access in Home Assistant first before expecting it to work here</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NVRCard;