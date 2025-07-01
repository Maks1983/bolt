import React from 'react';
import { DeviceProvider } from './context/DeviceContext';
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
  // Static room configuration with background images
  const upperFloorRooms = [
    {
      name: 'Master Bedroom',
      floor: 'Upper Floor',
      backgroundImage: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Bedroom',
      floor: 'Upper Floor',
      backgroundImage: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Bathroom',
      floor: 'Upper Floor',
      backgroundImage: 'https://images.pexels.com/photos/342800/pexels-photo-342800.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Kitchen',
      floor: 'Upper Floor',
      backgroundImage: 'https://images.pexels.com/photos/279648/pexels-photo-279648.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Living Room',
      floor: 'Upper Floor',
      backgroundImage: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const lowerFloorRooms = [
    {
      name: 'Entrance',
      floor: 'Lower Floor',
      backgroundImage: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Office',
      floor: 'Lower Floor',
      backgroundImage: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Laundry',
      floor: 'Lower Floor',
      backgroundImage: 'https://images.pexels.com/photos/4107123/pexels-photo-4107123.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
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