import React, { useState } from 'react';
import { Lock, Unlock, Shield } from 'lucide-react';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import LockControl from '../DeviceControls/LockControl';

const SecurityCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Get lock devices
  const entranceLock = useRealtimeDevice('lock.lock_ultra_910e');

  const isLocked = entranceLock?.state === 'locked';

  return (
    <>
      <div 
        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer hover:scale-105 transition-all ${
          isLocked ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}
        onClick={() => setShowModal(true)}
      >
        {isLocked ? (
          <Lock className="w-5 h-5 text-green-600" />
        ) : (
          <Unlock className="w-5 h-5 text-red-600" />
        )}
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Security</div>
          <div className="text-xs text-gray-600">{isLocked ? 'Locked' : 'Unlocked'}</div>
        </div>
      </div>

      {/* Security Control Modal */}
      {showModal && entranceLock && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Door Locks</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <LockControl device={entranceLock as any} variant="card" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecurityCard;