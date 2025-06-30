import React from 'react';
import Header from './components/Header';
import InfoRow from './components/InfoRow';
import FloorSection from './components/FloorSection';
import ConnectionStatus from './components/ConnectionStatus';
import { useDevices } from './context/DeviceContext';

function App() {
  const { state } = useDevices();
  const { floors } = state;

  // Camera data for NVR system
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />
      
      {/* Connection Status Bar */}
      <div className="px-6 py-2 bg-white/50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto flex justify-end">
          <ConnectionStatus />
        </div>
      </div>
      
      <InfoRow cameras={cameras} />
      
      <main className="py-4 space-y-6 pb-8">
        {floors.map((floor) => (
          <FloorSection 
            key={floor.id} 
            title={floor.name} 
            rooms={floor.rooms.map(room => ({
              name: room.name,
              floor: room.floor,
              lights: {
                on: room.devices.filter(d => d.device_type === 'light' && d.state === 'on').length,
                total: room.devices.filter(d => d.device_type === 'light').length
              },
              temperature: room.devices.find(d => d.device_type === 'sensor' && (d as any).sensor_type === 'temperature')?.state as number || 20,
              humidity: room.devices.find(d => d.device_type === 'sensor' && (d as any).sensor_type === 'humidity')?.state as number || 50,
              presence: room.devices.some(d => d.device_type === 'binary_sensor' && (d as any).sensor_type === 'motion' && d.state === 'on'),
              windowOpen: room.devices.some(d => d.device_type === 'binary_sensor' && (d as any).sensor_type === 'window' && d.state === 'on'),
              backgroundImage: room.background_image || 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800',
              devices: room.devices
            }))}
          />
        ))}
      </main>
    </div>
  );
}

export default App;