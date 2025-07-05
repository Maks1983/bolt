import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import { formatTemperature } from '../../utils/deviceHelpers';

const AverageCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Get outdoor temperature from balcony sensor
  const balconyTemp = useRealtimeDevice('sensor.balcony_temperature_sensor_temperature');
  
  // Get indoor temperatures for comparison
  const livingRoomTemp = useRealtimeDevice('sensor.living_room_temperature_sensor_temperature');
  const kitchenTemp = useRealtimeDevice('sensor.kitchen_temperature_sensor_temperature');
  const bedroomTemp = useRealtimeDevice('sensor.bedroom_temperature_sensor_temperature');
  const masterBedroomTemp = useRealtimeDevice('sensor.master_bedroom_temperature_sensor_temperature');
  const bathroomTemp = useRealtimeDevice('sensor.bathroom_temperature_sensor_temperature');

  // Calculate indoor average
  const indoorTemps = [
    livingRoomTemp?.state,
    kitchenTemp?.state,
    bedroomTemp?.state,
    masterBedroomTemp?.state,
    bathroomTemp?.state
  ].filter(temp => temp !== undefined).map(temp => Number(temp));

  const avgIndoorTemp = indoorTemps.length > 0 
    ? indoorTemps.reduce((sum, temp) => sum + temp, 0) / indoorTemps.length 
    : 21;

  const outdoorTemp = balconyTemp ? Number(balconyTemp.state) : 18;
  const tempDifference = avgIndoorTemp - outdoorTemp;

  const getTrendIcon = () => {
    if (tempDifference > 2) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (tempDifference < -2) return <TrendingDown className="w-4 h-4 text-blue-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendText = () => {
    if (tempDifference > 2) return `${tempDifference.toFixed(1)}°C warmer inside`;
    if (tempDifference < -2) return `${Math.abs(tempDifference).toFixed(1)}°C cooler inside`;
    return 'Similar indoor/outdoor';
  };

  return (
    <>
      <div 
        className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 bg-purple-50 border-purple-200 cursor-pointer hover:scale-105 transition-all"
        onClick={() => setShowModal(true)}
      >
        <BarChart3 className="w-5 h-5 text-purple-600" />
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Average</div>
          <div className="text-xs text-gray-600">{formatTemperature(avgIndoorTemp)}</div>
        </div>
      </div>

      {/* Temperature Comparison Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Temperature Analysis</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Indoor Average</h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{formatTemperature(avgIndoorTemp)}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Across {indoorTemps.length} sensors
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Outdoor</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{formatTemperature(outdoorTemp)}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Balcony sensor
                  </div>
                </div>
              </div>

              {/* Temperature Difference */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Temperature Difference</h3>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon()}
                      <span className="text-sm text-gray-600">{getTrendText()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {tempDifference > 0 ? '+' : ''}{tempDifference.toFixed(1)}°C
                    </div>
                    <div className="text-sm text-gray-600">Difference</div>
                  </div>
                </div>
              </div>

              {/* Individual Room Temperatures */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Temperatures</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Living Room', temp: livingRoomTemp },
                    { name: 'Kitchen', temp: kitchenTemp },
                    { name: 'Bedroom', temp: bedroomTemp },
                    { name: 'Master Bedroom', temp: masterBedroomTemp },
                    { name: 'Bathroom', temp: bathroomTemp }
                  ].filter(room => room.temp).map((room, index) => {
                    const roomTemp = Number(room.temp!.state);
                    const diffFromAvg = roomTemp - avgIndoorTemp;
                    
                    return (
                      <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">{room.name}</h4>
                        <div className="text-lg font-bold text-purple-600 mb-1">
                          {formatTemperature(roomTemp)}
                        </div>
                        <div className={`text-xs ${
                          diffFromAvg > 0.5 ? 'text-red-600' : 
                          diffFromAvg < -0.5 ? 'text-blue-600' : 
                          'text-gray-500'
                        }`}>
                          {diffFromAvg > 0 ? '+' : ''}{diffFromAvg.toFixed(1)}°C from avg
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {indoorTemps.length === 0 && (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No temperature sensors configured</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Add temperature sensors to see detailed analysis
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

export default AverageCard;