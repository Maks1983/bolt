import React from 'react';
import { DeviceProvider, useDevices } from './context/DeviceContext';
import Header from './components/Header';
import InfoRow from './components/InfoRow';
import FloorSection from './components/FloorSection';

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
  // Use dynamic room data from DeviceContext instead of hardcoded arrays
  const { state } = useDevices();
  
  // Get floors and their rooms from the context
  const upperFloor = state.floors.find(floor => floor.name === 'Upper Floor');
  const lowerFloor = state.floors.find(floor => floor.name === 'Lower Floor');
  const apartment = state.floors.find(floor => floor.name === 'Apartment');
  
  // Convert rooms to the format expected by FloorSection
  const upperFloorRooms = upperFloor ? upperFloor.rooms.map(room => ({
    name: room.name,
    floor: room.floor,
    backgroundImage: room.background_image || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'
  })) : [];
  
  const lowerFloorRooms = lowerFloor ? lowerFloor.rooms.map(room => ({
    name: room.name,
    floor: room.floor,
    backgroundImage: room.background_image || 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800'
  })) : [];

  const apartmentRooms = apartment ? apartment.rooms.map(room => ({
    name: room.name,
    floor: room.floor,
    backgroundImage: room.background_image || 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800'
  })) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />
      <InfoRow cameras={cameras} />
      
      <main className="py-4 space-y-6 pb-8">
        {upperFloorRooms.length > 0 && (
          <FloorSection title="Upper Floor" rooms={upperFloorRooms} />
        )}
        {lowerFloorRooms.length > 0 && (
          <FloorSection title="Lower Floor" rooms={lowerFloorRooms} />
        )}
        {apartmentRooms.length > 0 && (
          <FloorSection title="Apartment" rooms={apartmentRooms} />
        )}
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
