import React, { useState } from 'react';
import { 
  Camera, 
  Shield, 
  Thermometer, 
  Droplets, 
  Wifi, 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize,
  AlertCircle,
  Home,
  Lock,
  Unlock,
  User,
  Bell,
  Settings
} from 'lucide-react';
import NVRWebRTCSection from './NVRWebRTCSection';

interface Camera {
  id: number;
  name: string;
  location: string;
  recording: boolean;
  nightVision: boolean;
  temperature: number;
  humidity: number;
  backgroundImage: string;
}

interface InfoRowProps {
  cameras: Camera[];
}

const InfoRow: React.FC<InfoRowProps> = ({ cameras }) => {
  const [showNVRModal, setShowNVRModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showSystemModal, setShowSystemModal] = useState(false);

  return (
    <>
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* NVR Camera System Card */}
          <div 
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 sm:p-6 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            onClick={() => setShowNVRModal(true)}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">NVR System</h3>
                  <p className="text-xs sm:text-sm text-blue-100">Live Cameras</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold">{cameras.length}</div>
                <div className="text-xs sm:text-sm text-blue-100">Active</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium">All Systems Online</span>
              </div>
              <div className="text-xs sm:text-sm text-blue-100">
                {cameras.filter(c => c.recording).length} Recording
              </div>
            </div>
          </div>

          {/* Security Status Card */}
          <div 
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 sm:p-6 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            onClick={() => setShowSecurityModal(true)}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Security</h3>
                  <p className="text-xs sm:text-sm text-green-100">Home Status</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold">SAFE</div>
                <div className="text-xs sm:text-sm text-green-100">Armed</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">All Doors Locked</span>
              </div>
              <div className="text-xs sm:text-sm text-green-100">
                3 Sensors Active
              </div>
            </div>
          </div>

          {/* System Overview Card */}
          <div 
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 sm:p-6 text-white cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl sm:col-span-2 lg:col-span-1"
            onClick={() => setShowSystemModal(true)}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">System</h3>
                  <p className="text-xs sm:text-sm text-purple-100">Overview</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold">98%</div>
                <div className="text-xs sm:text-sm text-purple-100">Uptime</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">Network Stable</span>
              </div>
              <div className="text-xs sm:text-sm text-purple-100">
                24 Devices Online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NVR Modal - Fully Responsive */}
      {showNVRModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            {/* Modal Header - Responsive */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">NVR Camera System</h2>
                    <p className="text-sm sm:text-base text-gray-600">Live surveillance monitoring</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowNVRModal(false)}
                  className="p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Modal Content - Scrollable on mobile */}
            <div className="h-full sm:h-auto sm:max-h-[calc(90vh-120px)] overflow-y-auto">
              <NVRWebRTCSection />
            </div>
          </div>
        </div>
      )}

      {/* Security Modal - Fully Responsive */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Security System</h2>
                    <p className="text-sm sm:text-base text-gray-600">Home protection status</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSecurityModal(false)}
                  className="p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Modal Content - Responsive Grid */}
            <div className="p-4 sm:p-6 h-full sm:h-auto sm:max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Security Status */}
                <div className="bg-green-50 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
                      <Home className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">System Status</h3>
                      <p className="text-sm sm:text-base text-gray-600">Currently Armed - Home Mode</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        <span className="text-sm sm:text-base font-medium">Front Door</span>
                      </div>
                      <span className="text-xs sm:text-sm text-green-600 font-semibold">LOCKED</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        <span className="text-sm sm:text-base font-medium">Back Door</span>
                      </div>
                      <span className="text-xs sm:text-sm text-green-600 font-semibold">LOCKED</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-sm sm:text-base font-medium">Motion Sensors</span>
                      </div>
                      <span className="text-xs sm:text-sm text-blue-600 font-semibold">ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 bg-gray-100 rounded-xl">
                      <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recent Activity</h3>
                      <p className="text-sm sm:text-base text-gray-600">Last 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-3 sm:p-4 bg-white rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm sm:text-base font-medium">System Armed</span>
                        <span className="text-xs sm:text-sm text-gray-500">2 hours ago</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">Home mode activated</p>
                    </div>
                    
                    <div className="p-3 sm:p-4 bg-white rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm sm:text-base font-medium">Motion Detected</span>
                        <span className="text-xs sm:text-sm text-gray-500">4 hours ago</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">Living room sensor triggered</p>
                    </div>
                    
                    <div className="p-3 sm:p-4 bg-white rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm sm:text-base font-medium">Door Unlocked</span>
                        <span className="text-xs sm:text-sm text-gray-500">6 hours ago</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">Front door accessed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Modal - Fully Responsive */}
      {showSystemModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">System Overview</h2>
                    <p className="text-sm sm:text-base text-gray-600">Smart home status and metrics</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSystemModal(false)}
                  className="p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Modal Content - Responsive Grid */}
            <div className="p-4 sm:p-6 h-full sm:h-auto sm:max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Network Status */}
                <div className="bg-blue-50 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Wifi className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">Network</h3>
                      <p className="text-sm text-gray-600">Connection Status</p>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">98.5%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>

                {/* Temperature */}
                <div className="bg-orange-50 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <Thermometer className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">Temperature</h3>
                      <p className="text-sm text-gray-600">Average Indoor</p>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">22.5°C</div>
                  <div className="text-sm text-gray-600">Optimal Range</div>
                </div>

                {/* Humidity */}
                <div className="bg-cyan-50 rounded-2xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-cyan-100 rounded-xl">
                      <Droplets className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">Humidity</h3>
                      <p className="text-sm text-gray-600">Indoor Levels</p>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-600 mb-2">45%</div>
                  <div className="text-sm text-gray-600">Comfortable</div>
                </div>

                {/* Device Status - Full width on mobile, spans 2 columns on larger screens */}
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 sm:col-span-2 lg:col-span-3">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Connected Devices</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center p-3 bg-white rounded-xl">
                      <div className="text-lg sm:text-xl font-bold text-green-600">8</div>
                      <div className="text-xs sm:text-sm text-gray-600">Lights</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl">
                      <div className="text-lg sm:text-xl font-bold text-blue-600">6</div>
                      <div className="text-xs sm:text-sm text-gray-600">Sensors</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl">
                      <div className="text-lg sm:text-xl font-bold text-purple-600">4</div>
                      <div className="text-xs sm:text-sm text-gray-600">Cameras</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl">
                      <div className="text-lg sm:text-xl font-bold text-orange-600">6</div>
                      <div className="text-xs sm:text-sm text-gray-600">Others</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoRow;