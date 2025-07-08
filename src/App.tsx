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
  const [activeFloor, setActiveFloor] = React.useState<'Upper Floor' | 'Lower Floor'>('Upper Floor');
  
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

  // Get current floor rooms based on active tab
  const getCurrentFloorRooms = () => {
    switch (activeFloor) {
      case 'Upper Floor':
        return upperFloorRooms;
      case 'Lower Floor':
        return lowerFloorRooms;
      default:
        return upperFloorRooms;
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />
      <InfoRow cameras={cameras} />
      
      <main className="py-4 pb-8">
        {/* Tab Navigation */}
        <div className="px-6 mb-6">
          <div className="flex items-end space-x-1">
            {/* Upper Floor Tab */}
            <button
              onClick={() => setActiveFloor('Upper Floor')}
              className={`relative px-6 py-3 rounded-t-2xl font-semibold text-sm transition-all duration-200 transform ${
                activeFloor === 'Upper Floor'
                  ? 'bg-white text-gray-900 shadow-lg border-t-2 border-l-2 border-r-2 border-gray-200 z-10 -mb-px'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200 border-b-0 z-0'
              }`}
              style={{
                clipPath: activeFloor === 'Upper Floor' 
                  ? 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 100%, 0% 100%)'
                  : 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 100%, 0% 100%)'
              }}
            >
              <span className="relative z-10">Upper Floor</span>
              {activeFloor === 'Upper Floor' && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white"></div>
              )}
            </button>

            {/* Lower Floor Tab */}
            <button
              onClick={() => setActiveFloor('Lower Floor')}
              className={`relative px-6 py-3 rounded-t-2xl font-semibold text-sm transition-all duration-200 transform ${
                activeFloor === 'Lower Floor'
                  ? 'bg-white text-gray-900 shadow-lg border-t-2 border-l-2 border-r-2 border-gray-200 z-10 -mb-px'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200 border-b-0 z-0'
              }`}
              style={{
                clipPath: activeFloor === 'Lower Floor' 
                  ? 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 100%, 0% 100%)'
                  : 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 100%, 0% 100%)'
              }}
            >
              <span className="relative z-10">Lower Floor</span>
              {activeFloor === 'Lower Floor' && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white"></div>
              )}
            </button>
          </div>
          
          {/* Tab Content Background */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl rounded-tl-none shadow-lg p-6 -mt-px relative z-0">
            {/* Current Floor Content */}
            <div className="space-y-6">
              {getCurrentFloorRooms().length > 0 ? (
                <FloorSection title={activeFloor} rooms={getCurrentFloorRooms()} />
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg font-medium">
                    No rooms configured for {activeFloor}
                  </div>
                  <div className="text-gray-500 text-sm mt-2">
                    Add rooms to this floor in your configuration
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Apartment Section (if exists) - Outside of tabs */}
        {apartmentRooms.length > 0 && (
          <div className="mt-8">
            <FloorSection title="Apartment" rooms={apartmentRooms} />
          </div>
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
