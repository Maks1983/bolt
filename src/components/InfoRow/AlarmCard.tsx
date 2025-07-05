import React, { useState } from 'react';
import { Shield, Home, Plane, AlertTriangle } from 'lucide-react';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import AlarmControl from '../DeviceControls/AlarmControl';

const AlarmCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Get alarm system state
  const alarmSystem = useRealtimeDevice('alarm_control_panel.home_security');

  const getStatusIcon = () => {
    switch (alarmSystem?.state) {
      case 'disarmed':
        return <Shield className="w-5 h-5 text-green-600" />;
      case 'armed_home':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'armed_away':
        return <Plane className="w-5 h-5 text-orange-600" />;
      case 'triggered':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (alarmSystem?.state) {
      case 'disarmed':
        return 'bg-green-50 border-green-200';
      case 'armed_home':
        return 'bg-blue-50 border-blue-200';
      case 'armed_away':
        return 'bg-orange-50 border-orange-200';
      case 'triggered':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (alarmSystem?.state) {
      case 'disarmed':
        return 'Disarmed';
      case 'armed_home':
        return 'Armed Home';
      case 'armed_away':
        return 'Armed Away';
      case 'triggered':
        return 'TRIGGERED';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      <div 
        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer hover:scale-105 transition-all ${getStatusColor()}`}
        onClick={() => setShowModal(true)}
      >
        {getStatusIcon()}
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Alarm</div>
          <div className="text-xs text-gray-600">{getStatusText()}</div>
        </div>
      </div>

      {/* Alarm Control Modal */}
      {showModal && alarmSystem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Security System</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <AlarmControl device={alarmSystem as any} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlarmCard;