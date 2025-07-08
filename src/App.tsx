import React, { useState } from 'react';
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
  
  // Tab state for floor navigation
  const [activeFloor, setActiveFloor] = useState<'upper' | 'lower'>('upper');
  
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

  // Get current floor rooms based on active tab
  const getCurrentFloorRooms = () => {
    switch (activeFloor) {
      case 'upper':
        return upperFloorRooms;
      case 'lower':
        return lowerFloorRooms;
      default:
        return upperFloorRooms;
    }
  };

  const getCurrentFloorTitle = () => {
    switch (activeFloor) {
      case 'upper':
        return 'Upper Floor';
      case 'lower':
        return 'Lower Floor';
      default:
        return 'Upper Floor';
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />
      <InfoRow cameras={cameras} />
      
      <main className="py-4 pb-8">
        {/* Floor Tab Navigation */}
        <div className="px-6 mb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 border border-gray-200/50 shadow-sm">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveFloor('upper')}
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      activeFloor === 'upper'
                        ? 'bg-blue-500 text-white shadow-md transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Upper Floor
                    {upperFloorRooms.length > 0 && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        activeFloor === 'upper'
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {upperFloorRooms.length}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveFloor('lower')}
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      activeFloor === 'lower'
                        ? 'bg-blue-500 text-white shadow-md transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Lower Floor
                    {lowerFloorRooms.length > 0 && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        activeFloor === 'lower'
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 text-gray-600'
                        }`}>
                        {lowerFloorRooms.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Floor Content */}
        <div className="transition-all duration-300 ease-in-out">
          {getCurrentFloorRooms().length > 0 && (
            <FloorSection 
              title={getCurrentFloorTitle()} 
              rooms={getCurrentFloorRooms()} 
            />
          )}
          
          {getCurrentFloorRooms().length === 0 && (
            <div className="px-6">
              <div className="max-w-7xl mx-auto">
                <div className="text-center py-12">
                  <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-sm">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Rooms Found</h3>
                    <p className="text-gray-500">
                      No rooms are configured for the {getCurrentFloorTitle().toLowerCase()}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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
