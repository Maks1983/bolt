import React, { useState } from 'react';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';

const EnergyCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Mock energy data - replace with real Home Assistant energy sensors
  const currentUsage = 2.4; // kW
  const dailyUsage = 18.7; // kWh
  const monthlyUsage = 456; // kWh
  const trend = 'down'; // 'up' or 'down'

  return (
    <>
      <div 
        className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 bg-yellow-50 border-yellow-200 cursor-pointer hover:scale-105 transition-all"
        onClick={() => setShowModal(true)}
      >
        <Zap className="w-5 h-5 text-yellow-600" />
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Energy</div>
          <div className="text-xs text-gray-600">{currentUsage} kW</div>
        </div>
      </div>

      {/* Energy Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Energy Usage</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Current Usage</h3>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">{currentUsage} kW</div>
                  <div className="flex items-center space-x-1 mt-2">
                    {trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm ${trend === 'down' ? 'text-green-600' : 'text-red-600'}`}>
                      {trend === 'down' ? '12% lower' : '8% higher'} than yesterday
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Today</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{dailyUsage} kWh</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Estimated cost: $4.20
                  </div>
                </div>

                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{monthlyUsage} kWh</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Estimated cost: $102.60
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> To enable real energy monitoring, configure your Home Assistant energy sensors 
                  and update the entity IDs in this component.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnergyCard;