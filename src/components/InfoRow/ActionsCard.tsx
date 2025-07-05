import React, { useState } from 'react';
import { Zap, Lightbulb, Fan, Volume2, Shield } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

const ActionsCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { controlLight, controlFan, controlMediaPlayer, state } = useDevices();
  
  // Quick action functions
  const turnOffAllLights = () => {
    const lights = state.devices.filter(d => d.device_type === 'light' && d.state === 'on');
    lights.forEach(light => {
      controlLight(light.entity_id, false);
    });
  };

  const turnOnAllLights = () => {
    const lights = state.devices.filter(d => d.device_type === 'light');
    lights.forEach(light => {
      controlLight(light.entity_id, true);
    });
  };

  const turnOffAllFans = () => {
    const fans = state.devices.filter(d => d.device_type === 'fan' && d.state === 'on');
    fans.forEach(fan => {
      controlFan(fan.entity_id, false);
    });
  };

  const pauseAllMedia = () => {
    const mediaPlayers = state.devices.filter(d => d.device_type === 'media_player' && d.state === 'playing');
    mediaPlayers.forEach(player => {
      controlMediaPlayer(player.entity_id, 'pause');
    });
  };

  const quickActions = [
    {
      name: 'All Lights Off',
      icon: Lightbulb,
      action: turnOffAllLights,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-600',
      description: 'Turn off all lights in the house'
    },
    {
      name: 'All Lights On',
      icon: Lightbulb,
      action: turnOnAllLights,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-600',
      description: 'Turn on all lights in the house'
    },
    {
      name: 'All Fans Off',
      icon: Fan,
      action: turnOffAllFans,
      color: 'bg-cyan-50 border-cyan-200 text-cyan-600',
      description: 'Turn off all fans'
    },
    {
      name: 'Pause All Media',
      icon: Volume2,
      action: pauseAllMedia,
      color: 'bg-purple-50 border-purple-200 text-purple-600',
      description: 'Pause all playing media'
    }
  ];

  // Count devices that can be controlled
  const lightsOn = state.devices.filter(d => d.device_type === 'light' && d.state === 'on').length;
  const fansOn = state.devices.filter(d => d.device_type === 'fan' && d.state === 'on').length;
  const mediaPlaying = state.devices.filter(d => d.device_type === 'media_player' && d.state === 'playing').length;

  const activeDevices = lightsOn + fansOn + mediaPlaying;

  return (
    <>
      <div 
        className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 bg-orange-50 border-orange-200 cursor-pointer hover:scale-105 transition-all"
        onClick={() => setShowModal(true)}
      >
        <Zap className="w-5 h-5 text-orange-600" />
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Actions</div>
          <div className="text-xs text-gray-600">{activeDevices} active</div>
        </div>
      </div>

      {/* Quick Actions Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Device Status Overview */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <Lightbulb className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-yellow-600">{lightsOn}</div>
                  <div className="text-xs text-gray-600">Lights On</div>
                </div>
                <div className="text-center p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                  <Fan className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-cyan-600">{fansOn}</div>
                  <div className="text-xs text-gray-600">Fans On</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <Volume2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-purple-600">{mediaPlaying}</div>
                  <div className="text-xs text-gray-600">Media Playing</div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        // Optional: Close modal after action
                        // setShowModal(false);
                      }}
                      className={`p-4 rounded-xl border-2 hover:scale-105 transition-all text-left ${action.color}`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <action.icon className="w-5 h-5" />
                        <span className="font-semibold">{action.name}</span>
                      </div>
                      <p className="text-sm opacity-80">{action.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Connection Status */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Shield className={`w-4 h-4 ${
                    state.connectionState === 'connected' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className="text-sm font-medium">
                    Home Assistant: {state.connectionState === 'connected' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {state.connectionState !== 'connected' && (
                  <p className="text-xs text-gray-600 mt-1">
                    Actions will be queued until connection is restored
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionsCard;