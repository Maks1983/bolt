import React from 'react';
import { DeviceProvider } from './context/DeviceContext';
import Header from './components/Header';
import InfoRow from './components/InfoRow';
import FloorSection from './components/FloorSection';
import { useDevices } from './context/DeviceContext';

// Camera data for NVR system (fallback for display)
const cameras = [
  {
    id: 1,
    name: 'Front Yard Camera',
    location: 'Front Yard',
    recording: true,
    nightVision: true,
    temperature: 15,
    humidity: 60,
    backgroundImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 2,
    name: 'Backyard Camera',
    location: 'Backyard',
    recording: true,
    nightVision: false,
    temperature: 16,
    humidity: 58,
    backgroundImage: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

const AppContent: React.FC = () => {
  const { state, getDevicesByRoom, getRoomDevices } = useDevices();

  // Generate room data dynamically from device state
  const generateRoomData = (roomName: string, floor: string, backgroundImage: string) => {
    const roomStats = getRoomDevices(roomName);
    const temperatureSensor = roomStats.sensors.find(s => (s as any).sensor_type === 'temperature');
    const humiditySensor = roomStats.sensors.find(s => (s as any).sensor_type === 'humidity');
    const motionSensor = roomStats.binarySensors.find(s => (s as any).sensor_type === 'motion');
    const windowSensors = roomStats.binarySensors.filter(s => (s as any).sensor_type === 'window');
    const doorSensors = roomStats.binarySensors.filter(s => (s as any).sensor_type === 'door');

    // Determine if any windows/doors are open
    const windowOpen = windowSensors.some(s => s.state === 'on') || doorSensors.some(s => s.state === 'on');

    return {
      name: roomName,
      floor,
      lights: {
        on: roomStats.lights.filter(l => l.state === 'on').length,
        total: roomStats.lights.length
      },
      temperature: temperatureSensor ? Number(temperatureSensor.state) : 20,
      humidity: humiditySensor ? Number(humiditySensor.state) : 50,
      presence: motionSensor ? motionSensor.state === 'on' : false,
      windowOpen,
      backgroundImage,
      devices: getDevicesByRoom(roomName)
    };
  };

  // Upper Floor rooms with dynamic data
  const upperFloorRooms = [
    generateRoomData('Master Bedroom', 'Upper Floor', 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'),
    generateRoomData('Bedroom', 'Upper Floor', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'),
    generateRoomData('Bathroom', 'Upper Floor', 'https://images.pexels.com/photos/342800/pexels-photo-342800.jpeg?auto=compress&cs=tinysrgb&w=800'),
    generateRoomData('Kitchen', 'Upper Floor', 'https://images.pexels.com/photos/279648/pexels-photo-279648.jpeg?auto=compress&cs=tinysrgb&w=800'),
    generateRoomData('Living Room', 'Upper Floor', 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800')
  ];

  const lowerFloorRooms = [
    generateRoomData('Entrance', 'Lower Floor', 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800'),
    generateRoomData('Office', 'Lower Floor', 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800'),
    generateRoomData('Laundry', 'Lower Floor', 'https://images.pexels.com/photos/4107123/pexels-photo-4107123.jpeg?auto=compress&cs=tinysrgb&w=800')
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />
      <InfoRow cameras={cameras} />
      
      <main className="py-4 space-y-6 pb-8">
        <FloorSection title="Upper Floor" rooms={upperFloorRooms} />
        <FloorSection title="Lower Floor" rooms={lowerFloorRooms} />
      </main>
    </div>
  );
};

function App() {
  return (
    <DeviceProvider>
      <AppContent />
    </DeviceProvider>
  );
}

export default App;