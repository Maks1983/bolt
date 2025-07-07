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
  Settings,
  Zap,
  Activity,
  Wrench
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
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [showIndoorAvgModal, setShowIndoorAvgModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showNVRModal, setShowNVRModal] = useState(false);

  return (
    <>
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          {/* Alarm Card */}
          <div 
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 sm:p-6 text-white cursor-pointer hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            onClick={() => setShowAlarmModal(true)}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Alarm</h3>
                  <p className="text-xs sm:text-sm text-red-100">System Status</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium">Armed</span>
              </div>
              <div className="text-xs sm:text-sm text-red-100">
                Home Mode
              </div>
            </div>
          </div>

          {/* Security Card */}
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
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">All Locked</span>
              </div>
              <div className="text-xs sm:text-sm text-green-100">
                3 Sensors
              </div>
            </div>
          </div>

          {/* Energy Card */}
          <div 
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-4 sm:p-6 text-white cursor-pointer hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            onClick={() => setShowEnergyModal(true)}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Energy</h3>
                  <p className="text-xs sm:text-sm text-yellow-100">Usage Today</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium">24.5 kWh</span>
              </div>
              <div className="text-xs sm:text-sm text-yellow-100">
                -12% vs yesterday
              </div>
            </div>
          </div>

          {/* Indoor Avg Card */}
          <div 
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 sm:p-6 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            onClick={() => setShowIndoorAvgModal(true)}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Thermometer className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Indoor Avg</h3>
                  <p className="text-xs sm:text-sm text-blue-100">Climate</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm font-medium">22.5°C</span>
              </div>
              <div className="text-xs sm:text-sm text-blue-100">
                45% humidity
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div 
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 sm:p-6 text-white cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            onClick={() => setShowActivityModal(true)}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Activity</h3>
                  <p className="text-xs sm:text-sm text-purple-100">Recent Events</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium">12 Events</span>
              </div>
              <div className="text-xs sm:text-sm text-purple-100">
                Last 24h
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div 
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 sm:p-6 text-white cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            onClick={() => setShowActionsModal(true)}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Actions</h3>
                  <p className="text-xs sm:text-sm text-orange-100">Quick Controls</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm font-medium">8 Available</span>
              </div>
              <div className="text-xs sm:text-sm text-orange-100">
                Shortcuts
              </div>
            </div>
          </div>

          {/* NVR Camera System Card */}
          <div 
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white cursor-pointer hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            onClick={() => setShowNVRModal(true)}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">NVR</h3>
                  <p className="text-xs sm:text-sm text-indigo-100">Live Cameras</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium">{cameras.length} Online</span>
              </div>
              <div className="text-xs sm:text-sm text-indigo-100">
                Recording
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alarm Modal */}
      {showAlarmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-pink-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-red-100 rounded-xl">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Alarm System</h2>
                    <p className="text-sm sm:text-base text-gray-600">Security monitoring and control</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAlarmModal(false)}
                  className="p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 h-full sm:h-auto sm:max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="text-center py-8 sm:py-12">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Alarm System Control</h3>
                <p className="text-sm sm:text-base text-gray-600">Manage your home security alarm system</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
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
            <div className="p-4 sm:p-6 h-full sm:h-auto sm:max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

      {/* Energy Modal */}
      {showEnergyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-amber-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-yellow-100 rounded-xl">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Energy Management</h2>
                    <p className="text-sm sm:text-base text-gray-600">Power consumption and efficiency</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEnergyModal(false)}
                  className="p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 h-full sm:h-auto sm:max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="text-center py-8 sm:py-12">
                <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Energy Dashboard</h3>
                <p className="text-sm sm:text-base text-gray-600">Monitor and optimize your home's energy usage</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indoor Avg Modal */}
      {showIndoorAvgModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                    <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Indoor Climate</h2>
                    <p className="text-sm sm:text-base text-gray-600">Temperature and humidity averages</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowIndoorAvgModal(false)}
                  className="p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 h-full sm:h-auto sm:max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="text-center py-8 sm:py-12">
                <Thermometer className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Climate Control</h3>
                <p className="text-sm sm:text-base text-gray-600">Monitor indoor temperature and humidity levels</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Activity Monitor</h2>
                    <p className="text-sm sm:text-base text-gray-600">Recent events and system activity</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowActivityModal(false)}
                  className="p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 h-full sm:h-auto sm:max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="text-center py-8 sm:py-12">
                <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">System Activity</h3>
                <p className="text-sm sm:text-base text-gray-600">Track all smart home events and activities</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions Modal */}
      {showActionsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-orange-100 rounded-xl">
                    <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Quick Actions</h2>
                    <p className="text-sm sm:text-base text-gray-600">Shortcuts and automation controls</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowActionsModal(false)}
                  className="p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 h-full sm:h-auto sm:max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="text-center py-8 sm:py-12">
                <Wrench className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Quick Controls</h3>
                <p className="text-sm sm:text-base text-gray-600">Access frequently used actions and automations</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NVR Modal - Fully Responsive */}
      {showNVRModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-indigo-100 rounded-xl">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
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
            
            <div className="h-full sm:h-auto sm:max-h-[calc(90vh-120px)] overflow-y-auto">
              <NVRWebRTCSection />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoRow;