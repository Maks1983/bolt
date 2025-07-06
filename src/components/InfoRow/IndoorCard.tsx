import React, { useState } from 'react';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';
import { formatTemperature, formatHumidity } from '../../utils/deviceHelpers';

const IndoorCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Get indoor sensors from different rooms
  const livingRoomTemp = useRealtimeDevice('sensor.living_room_temperature_sensor_temperature');
  const livingRoomHumidity = useRealtimeDevice('sensor.living_room_temperature_sensor_humidity');
  const kitchenTemp = useRealtimeDevice('sensor.kitchen_temperature_sensor_temperature');
  const kitchenHumidity = useRealtimeDevice('sensor.kitchen_temperature_sensor_humidity');
  const bedroomTemp = useRealtimeDevice('sensor.bedroom_temperature_sensor_temperature');
  const bedroomHumidity = useRealtimeDevice('sensor.bedroom_temperature_sensor_humidity');
  const masterBedroomTemp = useRealtimeDevice('sensor.master_bedroom_temperature_sensor_temperature');
  const masterBedroomHumidity = useRealtimeDevice('sensor.master_bedroom_temperature_sensor_humidity');
  const bathroomTemp = useRealtimeDevice('sensor.bathroom_temperature_sensor_temperature');
  const bathroomHumidity = useRealtimeDevice('sensor.bathroom_temperature_sensor_humidity');

  // Calculate average temperature
  const temperatures = [
    livingRoomTemp?.state,
    kitchenTemp?.state,
    bedroomTemp?.state,
    masterBedroomTemp?.state,
    bathroomTemp?.state
  ].filter(temp => temp !== undefined).map(temp => Number(temp));

  const avgTemp = temperatures.length > 0 
    ? temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length 
    : 21;

  // Calculate average humidity
  const humidities = [
    livingRoomHumidity?.state,
    kitchenHumidity?.state,
    bedroomHumidity?.state,
    masterBedroomHumidity?.state,
    bathroomHumidity?.state
  ].filter(humidity => humidity !== undefined).map(humidity => Number(humidity));

  const avgHumidity = humidities.length > 0 
    ? humidities.reduce((sum, humidity) => sum + humidity, 0) / humidities.length 
    : 50;

  const roomSensors = [
    { name: 'Living Room', temp: livingRoomTemp, humidity: livingRoomHumidity },
    { name: 'Kitchen', temp: kitchenTemp, humidity: kitchenHumidity },
    { name: 'Bedroom', temp: bedroomTemp, humidity: bedroomHumidity },
    { name: 'Master Bedroom', temp: masterBedroomTemp, humidity: masterBedroomHumidity },
    { name: 'Bathroom', temp: bathroomTemp, humidity: bathroomHumidity }
  ].filter(room => room.temp || room.humidity);

  return (
    <>
      <div 
        className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 bg-blue-50 border-blue-200 cursor-pointer hover:scale-105 transition-all"
        onClick={() => setShowModal(true)}
      >
        <Thermometer className="w-5 h-5 text-blue-600" />
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Indoor</div>
          <div className="text-xs text-gray-600">{formatTemperature(avgTemp)}</div>
        </div>
      </div>

      {/* Indoor Climate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Indoor Climate</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Thermometer className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Average Temperature</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{formatTemperature(avgTemp)}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Across {temperatures.length} sensors
                  </div>
                </div>

                <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Droplets className="w-6 h-6 text-cyan-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Average Humidity</h3>
                  </div>
                  <div className="text-3xl font-bold text-cyan-600">{formatHumidity(avgHumidity)}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Across {humidities.length} sensors
                  </div>
                </div>
              </div>

              {/* Room-by-Room Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Room-by-Room Climate</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roomSensors.map((room, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">{room.name}</h4>
                      <div className="space-y-2">
                        {room.temp && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Thermometer className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-gray-600">Temperature</span>
                            </div>
                            <span className="text-sm font-semibold text-blue-600">
                              {formatTemperature(room.temp.state)}
                            </span>
                          </div>
                        )}
                        {room.humidity && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Droplets className="w-4 h-4 text-cyan-600" />
                              <span className="text-sm text-gray-600">Humidity</span>
                            </div>
                            <span className="text-sm font-semibold text-cyan-600">
                              {formatHumidity(room.humidity.state)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {roomSensors.length === 0 && (
                <div className="text-center py-8">
                  <Wind className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No climate sensors configured</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Add temperature and humidity sensors to your Home Assistant configuration
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

export default IndoorCard;