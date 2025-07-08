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
      
      <main className="py-4 pb-8 px-6">
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          
          {/* Upper Floor Column */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
              <h2 className="text-xl font-bold">Upper Floor</h2>
              <p className="text-blue-100 text-sm">{upperFloorRooms.length} rooms</p>
            </div>
            <div className="p-4 h-full overflow-y-auto">
              {upperFloorRooms.length > 0 ? (
                <div className="space-y-4">
                  {upperFloorRooms.map((room, index) => (
                    <div key={index} className="transform scale-90 origin-top">
                      <RoomCard 
                        roomName={room.name}
                        floor={room.floor}
                        backgroundImage={room.backgroundImage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <div className="text-gray-400 text-lg font-medium mb-2">No rooms configured</div>
                    <div className="text-gray-500 text-sm">Add rooms to Upper Floor</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lower Floor Column */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
              <h2 className="text-xl font-bold">Lower Floor</h2>
              <p className="text-green-100 text-sm">{lowerFloorRooms.length} rooms</p>
            </div>
            <div className="p-4 h-full overflow-y-auto">
              {lowerFloorRooms.length > 0 ? (
                <div className="space-y-4">
                  {lowerFloorRooms.map((room, index) => (
                    <div key={index} className="transform scale-90 origin-top">
                      <RoomCard 
                        roomName={room.name}
                        floor={room.floor}
                        backgroundImage={room.backgroundImage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <div className="text-gray-400 text-lg font-medium mb-2">No rooms configured</div>
                    <div className="text-gray-500 text-sm">Add rooms to Lower Floor</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Apartment Column */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
              <h2 className="text-xl font-bold">Apartment</h2>
              <p className="text-purple-100 text-sm">{apartmentRooms.length} rooms</p>
            </div>
            <div className="p-4 h-full overflow-y-auto">
              {apartmentRooms.length > 0 ? (
                <div className="space-y-4">
                  {apartmentRooms.map((room, index) => (
                    <div key={index} className="transform scale-90 origin-top">
                      <RoomCard 
                        roomName={room.name}
                        floor={room.floor}
                        backgroundImage={room.backgroundImage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <div className="text-gray-400 text-lg font-medium mb-2">No rooms configured</div>
                    <div className="text-gray-500 text-sm">Add rooms to Apartment</div>
                  </div>
                </div>
              )}
            </div>
          </div>

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