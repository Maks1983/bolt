import React, { useState, useEffect } from 'react';
import { Shield, Lock, Zap, TrendingDown, Thermometer, Activity, Clock, DoorOpen, Lightbulb, User, Bell, X, Settings, Moon, Plane, Users, Sun, Coffee, Camera, Play, Pause, RotateCcw, Maximize, Home, AlertTriangle, CheckCircle, Power, Wifi, WifiOff, Delete, Hash, BarChart3, TrendingUp, Droplets, Wind } from 'lucide-react';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';
import AlarmCard from './InfoCards/AlarmCard';
import SecurityCard from './InfoCards/SecurityCard';
import EnergyCard from './InfoCards/EnergyCard';
import IndoorAverageCard from './InfoCards/IndoorAverageCard';
import ActivityCard from './InfoCards/ActivityCard';
import ActionsCard from './InfoCards/ActionsCard';
import NVRCard from './InfoCards/NVRCard';
interface InfoRowProps {
  cameras?: any[]; // Keep for backward compatibility but won't use
}

const InfoRow: React.FC<InfoRowProps> = () => {
      color: 'text-green-500'
    <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 shadow-sm">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 min-w-max">
          <AlarmCard />
          <SecurityCard />
          <EnergyCard />
          <IndoorAverageCard />
          <ActivityCard />
          <ActionsCard />
          <NVRCard />
            if (alarmCode !== '1234') {
              setAlarmStatus('triggered');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [entryDelay, alarmCode]);

  return (
    <>
      <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/60 px-6 py-2 border-b border-gray-200/40">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide">
            {/* Alarm Status - Clickable */}
            <button 
              onClick={() => setShowAlarm(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className={`p-1.5 ${alarmStatus === 'disarmed' ? 'bg-gray-100' : alarmStatus === 'triggered' ? 'bg-red-100' : 'bg-emerald-100'} rounded-md`}>
                <Shield className={`w-3 h-3 ${alarmStatus === 'disarmed' ? 'text-gray-600' : alarmStatus === 'triggered' ? 'text-red-600' : 'text-emerald-600'}`} />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Alarm</div>
                <div className={`text-xs font-bold ${alarmStatus === 'disarmed' ? 'text-gray-600' : alarmStatus === 'triggered' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {getAlarmStatusColor(alarmStatus).text}
                </div>
              </div>
            </button>

            {/* Security Status - Clickable */}
            <button 
              onClick={() => setShowSecurity(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className="p-1.5 bg-blue-100 rounded-md">
                <Lock className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Security</div>
                <div className="text-xs text-blue-600 font-bold">Secured</div>
              </div>
            </button>

            {/* Energy Usage - Clickable */}
            <button 
              onClick={() => setShowEnergy(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className="p-1.5 bg-orange-100 rounded-md">
                <Zap className="w-3 h-3 text-orange-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Energy</div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-orange-600 font-bold">2.4kW</span>
                  <TrendingDown className="w-2 h-2 text-green-500" />
                  <span className="text-xs text-gray-500">€0.32/h</span>
                </div>
              </div>
            </button>

            {/* Average Temperature - Clickable */}
            <button 
              onClick={() => setShowTemperature(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className="p-1.5 bg-blue-100 rounded-md">
                <Thermometer className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Indoor Avg</div>
                <div className="text-xs text-blue-600 font-bold">21°C</div>
              </div>
            </button>

            {/* Activity Log */}
            <button 
              onClick={() => setShowActivity(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className="p-1.5 bg-purple-100 rounded-md">
                <Activity className="w-3 h-3 text-purple-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Activity</div>
                <div className="text-xs text-purple-600 font-bold">6 recent</div>
              </div>
            </button>

            {/* Actions Button */}
            <button 
              onClick={() => setShowActions(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className="p-1.5 bg-indigo-100 rounded-md">
                <Settings className="w-3 h-3 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Actions</div>
                <div className="text-xs text-indigo-600 font-bold">6 scenes</div>
              </div>
            </button>

            {/* NVR Button */}
            <button 
              onClick={() => setShowNVR(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-200/40 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] min-w-fit"
            >
              <div className="p-1.5 bg-green-100 rounded-md">
                <Camera className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">NVR</div>
                <div className="text-xs text-green-600 font-bold">{realCameras.length} cameras</div>
              </div>
              {totalActiveDetections > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {totalActiveDetections} alerts
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                      <div>
                        <div className="text-2xl font-bold text-emerald-700">
                          {securityZones.filter(zone => zone.status === 'secure').length}
                        </div>
                        <div className="text-sm text-emerald-600 font-medium">Secure Zones</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <div>
                        <div className="text-2xl font-bold text-red-700">
                          {securityZones.filter(zone => zone.status === 'triggered').length}
                        </div>
                        <div className="text-sm text-red-600 font-medium">Triggered</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <Power className="w-6 h-6 text-yellow-600" />
                      <div>
                        <div className="text-2xl font-bold text-yellow-700">
                          {securityZones.filter(zone => zone.status === 'bypassed').length}
                        </div>
                        <div className="text-sm text-yellow-600 font-medium">Bypassed</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <WifiOff className="w-6 h-6 text-gray-600" />
                      <div>
                        <div className="text-2xl font-bold text-gray-700">
                          {securityZones.filter(zone => zone.status === 'offline').length}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Offline</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zone Details */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Zone Status</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {securityZones.map((zone) => {
                      const Icon = zone.icon;
                      return (
                        <div key={zone.id} className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Icon className="w-5 h-5 text-gray-700" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{zone.name}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getZoneTypeColor(zone.type)}`}>
                                    {zone.type}
                                  </span>
                                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getZoneStatusColor(zone.status)}`}>
                                    {zone.status.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                                Test
                              </button>
                              <button className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium">
                                Bypass
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>Last triggered: {zone.lastTriggered}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Wifi className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 font-medium">Online</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>All Systems Secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowSecurity(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Close Panel
                  </button>
                  <button className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors font-semibold">
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Energy Panel Modal */}
      {showEnergy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Energy Management</h2>
                  <p className="text-orange-100">Real-time consumption and cost monitoring</p>
                </div>
                <button 
                  onClick={() => setShowEnergy(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Current Consumption Overview */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Current Consumption</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Zap className="w-6 h-6 text-orange-600" />
                        <h4 className="font-bold text-gray-900">Live Usage</h4>
                      </div>
                      <div className="text-3xl font-bold text-orange-700 mb-1">2.4 kW</div>
                      <div className="text-sm text-orange-600">3.2 kWh today</div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        <h4 className="font-bold text-gray-900">Current Rate</h4>
                      </div>
                      <div className="text-3xl font-bold text-blue-700 mb-1">€0.13</div>
                      <div className="text-sm text-blue-600 flex items-center">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        per kWh
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <h4 className="font-bold text-gray-900">Cost Today</h4>
                      </div>
                      <div className="text-3xl font-bold text-green-700 mb-1">€0.42</div>
                      <div className="text-sm text-green-600">-12% vs yesterday</div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                        <h4 className="font-bold text-gray-900">Efficiency</h4>
                      </div>
                      <div className="text-3xl font-bold text-purple-700 mb-1">87%</div>
                      <div className="text-sm text-purple-600">vs avg home</div>
                    </div>
                  </div>
                </div>

                {/* Consumption Chart */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Consumption Chart</h3>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setEnergyTimeframe('24h')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          energyTimeframe === '24h' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        24h
                      </button>
                      <button
                        onClick={() => setEnergyTimeframe('7d')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          energyTimeframe === '7d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        7d
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-end space-x-2 h-48">
                      {(energyTimeframe === '24h' ? energyData24h : energyData7d).map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex flex-col space-y-1 mb-2">
                            <div 
                              className="bg-orange-500 rounded-t"
                              style={{ height: `${(data.consumption / (energyTimeframe === '24h' ? 5 : 50)) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-blue-500 rounded-b"
                              style={{ height: `${(data.cost / (energyTimeframe === '24h' ? 0.6 : 6)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600 font-medium">{data.time}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center space-x-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span className="text-sm text-gray-600">Consumption ({energyTimeframe === '24h' ? 'kW' : 'kWh'})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm text-gray-600">Cost (€)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* High-Use Devices */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">High-Use Devices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {highUseDevices.map((device, index) => (
                      <div key={index} className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900">{device.name}</h4>
                          <span className={`text-sm font-medium ${device.color}`}>{device.status}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{device.consumption} kW</div>
                        <div className="text-sm text-gray-600 mb-3">{device.percentage}% of total usage</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips & Notices */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Tips & Notices</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900">Peak Pricing Active</h4>
                          <p className="text-sm text-blue-700">Higher rates until 8 PM. Consider delaying high-energy tasks.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Zap className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-yellow-900">EV Charging Scheduled</h4>
                          <p className="text-sm text-yellow-700">Tesla Model 3 will start charging at 11 PM (off-peak rates).</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>All meters online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEnergy(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Temperature Panel Modal */}
      {showTemperature && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Indoor Climate Control</h2>
                  <p className="text-blue-100">Temperature and humidity monitoring across all zones</p>
                </div>
                <button 
                  onClick={() => setShowTemperature(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Climate Overview */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Climate Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Thermometer className="w-6 h-6 text-blue-600" />
                        <h4 className="font-bold text-gray-900">Avg Temperature</h4>
                      </div>
                      <div className="text-3xl font-bold text-blue-700 mb-1">21.3°C</div>
                      <div className="text-sm text-blue-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +0.3°C since 1h
                      </div>
                    </div>
                    
                    <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Droplets className="w-6 h-6 text-cyan-600" />
                        <h4 className="font-bold text-gray-900">Avg Humidity</h4>
                      </div>
                      <div className="text-3xl font-bold text-cyan-700 mb-1">51%</div>
                      <div className="text-sm text-cyan-600">Optimal range</div>
                    </div>
                    
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h4 className="font-bold text-gray-900">Comfort Score</h4>
                      </div>
                      <div className="text-3xl font-bold text-green-700 mb-1">85%</div>
                      <div className="text-sm text-green-600">Excellent</div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Wind className="w-6 h-6 text-purple-600" />
                        <h4 className="font-bold text-gray-900">Sensors</h4>
                      </div>
                      <div className="text-3xl font-bold text-purple-700 mb-1">8</div>
                      <div className="text-sm text-purple-600">All reporting</div>
                    </div>
                  </div>
                </div>

                {/* Historical Chart */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Temperature History</h3>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setTempTimeframe('24h')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          tempTimeframe === '24h' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        24h
                      </button>
                      <button
                        onClick={() => setTempTimeframe('7d')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          tempTimeframe === '7d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        7d
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-end space-x-2 h-48">
                      {(tempTimeframe === '24h' ? tempData24h : tempData7d).map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex flex-col space-y-1 mb-2">
                            <div 
                              className="bg-blue-500 rounded-t"
                              style={{ height: `${((data.indoor - 15) / 15) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-gray-400 rounded-b"
                              style={{ height: `${((data.outdoor - 5) / 20) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600 font-medium">{data.time}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center space-x-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm text-gray-600">Indoor Temperature</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded"></div>
                        <span className="text-sm text-gray-600">Outdoor Temperature</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Room Breakdown Table */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Room Breakdown</h3>
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left py-4 px-6 font-bold text-gray-900">Room</th>
                            <th className="text-left py-4 px-6 font-bold text-gray-900">Temp (°C)</th>
                            <th className="text-left py-4 px-6 font-bold text-gray-900">Humidity (%)</th>
                            <th className="text-left py-4 px-6 font-bold text-gray-900">Trend</th>
                            <th className="text-left py-4 px-6 font-bold text-gray-900">Status</th>
                            <th className="text-left py-4 px-6 font-bold text-gray-900">Last Updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roomTemperatures.map((room, index) => (
                            <tr 
                              key={index} 
                              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <td className="py-4 px-6">
                                <div className="font-semibold text-gray-900">{room.name}</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className={`font-bold ${
                                  room.temp < 20 ? 'text-blue-600' : 
                                  room.temp > 24 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {room.temp}°C
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-medium text-gray-700">{room.humidity}%</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center">
                                  {getTrendIcon(room.trend)}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getTempStatusColor(room.status)}`}>
                                  {room.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-sm text-gray-500">{room.lastUpdated}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>All sensors online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTemperature(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivity && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                  <p className="text-purple-100">Last 6 events in your home</p>
                </div>
                <button 
                  onClick={() => setShowActivity(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div 
                    key={activity.id} 
                    className={`flex items-center space-x-4 p-5 hover:bg-gray-50 transition-colors ${
                      index !== activities.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className={`p-3 bg-gray-100 rounded-xl ${activity.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-gray-900 truncate">
                          {activity.title}
                        </h3>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs font-medium">{activity.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <button 
                onClick={() => setShowActivity(false)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Close Activity Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions Modal */}
      {showActions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                  <p className="text-indigo-100">Control your home scenes</p>
                </div>
                <button 
                  onClick={() => setShowActions(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {actions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      className={`relative p-4 bg-gradient-to-br ${action.color} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 ${
                        action.active ? 'ring-2 ring-indigo-400 ring-offset-2' : ''
                      }`}
                    >
                      <div className="text-center">
                        <Icon className="w-6 h-6 text-white mx-auto mb-2" />
                        <span className="text-white text-sm font-bold">{action.name}</span>
                      </div>
                      {action.active && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <button 
                onClick={() => setShowActions(false)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Close Actions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NVR Camera System Modal */}
      {showNVR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">NVR Camera System</h2>
                  <p className="text-green-100">Live camera feeds from exterior locations</p>
                </div>
                <button 
                  onClick={() => setShowNVR(false)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {realCameras.map((camera) => (
                  <div key={camera.id} className="bg-gray-50/80 rounded-2xl overflow-hidden border border-gray-200/50 shadow-lg">
                    {/* Camera Feed Area */}
                    <div className="relative h-64 bg-gray-900">
                      <div 
                        className="absolute inset-0 bg-cover bg-center opacity-80"
                        style={{ backgroundImage: `url(${camera.backgroundImage})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
                      </div>
                      
                      {/* Camera Status Overlay */}
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${camera.recording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <span className="text-white text-sm font-medium">
                          {camera.recording ? 'RECORDING' : 'OFFLINE'}
                        </span>
                      </div>
                      
                      {/* Active detections indicator */}
                      {Object.values(camera.detections).some(Boolean) && (
                        <div className="absolute top-3 right-3 bg-red-500/90 rounded-full px-2 py-1">
                          <span className="text-white text-xs font-bold">
                            {Object.values(camera.detections).filter(Boolean).length} ALERTS
                          </span>
                        </div>
                      )}
                      
                      {/* Night Vision Indicator */}
                      {camera.nightVision && (
                        <div className="absolute top-4 right-4 bg-purple-500/80 px-2 py-1 rounded-lg">
                          <span className="text-white text-xs font-medium">NIGHT VISION</span>
                        </div>
                      )}
                      
                      {/* Camera Controls Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                            <Play className="w-4 h-4 text-white" />
                          </button>
                          <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                            <Pause className="w-4 h-4 text-white" />
                          </button>
                          <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                            <RotateCcw className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                          <Maximize className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Camera Info Panel */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{camera.name}</h3>
                          <p className="text-sm text-gray-600">{camera.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Camera className="w-5 h-5 text-green-600" />
                          <span className={`text-sm font-medium ${camera.recording ? 'text-green-600' : 'text-gray-500'}`}>
                            {camera.recording ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Temperature</span>
                          <span className="font-semibold text-gray-900">{camera.temperature}°C</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Humidity</span>
                          <span className="font-semibold text-gray-900">{camera.humidity}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Night Vision</span>
                          <span className={`font-semibold ${camera.nightVision ? 'text-purple-600' : 'text-gray-500'}`}>
                            {camera.nightVision ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Status</span>
                          <span className={`font-semibold ${camera.recording ? 'text-green-600' : 'text-red-600'}`}>
                            {camera.recording ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Detection Status */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3">AI Detection Status</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(camera.detections).map(([type, active]) => (
                            <div
                              key={type}
                              className={`flex items-center justify-between p-2 rounded-lg border ${
                                active 
                                  ? 'bg-red-50 border-red-200 text-red-700' 
                                  : 'bg-gray-50 border-gray-200 text-gray-600'
                              }`}
                            >
                              <span className="text-sm font-medium capitalize">
                                {type.replace('_', ' ')}
                              </span>
                              <div className={`w-2 h-2 rounded-full ${
                                active ? 'bg-red-500' : 'bg-gray-300'
                              }`}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">
                            View Full Screen
                          </button>
                          <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm">
                            Settings
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
import AlarmCard from './InfoCards/AlarmCard';
                <div className="flex items-center space-x-4 text-sm text-gray-600">
import SecurityCard from './InfoCards/SecurityCard';
              </div>
import EnergyCard from './InfoCards/EnergyCard';
            </div>
import IndoorAverageCard from './InfoCards/IndoorAverageCard';

export default InfoRow;