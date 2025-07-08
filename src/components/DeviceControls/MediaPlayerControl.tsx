import React from 'react';
import { DeviceProvider, useDevices } from './context/DeviceContext';
import Header from './components/Header';
import InfoRow from './components/InfoRow';
import FloorSection from './components/FloorSection';
import RoomCard from './components/RoomCard';
import DeviceControlsSection from './components/DeviceControls/DeviceControlsSection';

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
  const [activeTab, setActiveTab] = React.useState<'whole-house' | 'upper-floor' | 'lower-floor' | 'apartment'>('whole-house');
  const [activeSection, setActiveSection] = React.useState<'status' | 'controls'>('status');
  
  // Use dynamic room data from DeviceContext instead of hardcoded arrays
  const { state } = useDevices();
  
  // Get floors and their rooms from the context
  const upperFloor = state.floors.find(floor => floor.name === 'Upper Floor');
  const lowerFloor = state.floors.find(floor => floor.name === 'Lower Floor');
  const apartment = state.floors.find(floor => floor.name === 'Apartment');
  
  // Dynamic tab configuration - automatically includes floors that have rooms
  const availableTabs = React.useMemo(() => {
    const tabs = [
      { id: 'whole-house' as const, label: 'Whole House', hasContent: true }
    ];
    
    if (upperFloor && upperFloor.rooms.length > 0) {
      tabs.push({ id: 'upper-floor' as const, label: 'Upper Floor', hasContent: true });
    }
    
    if (lowerFloor && lowerFloor.rooms.length > 0) {
      tabs.push({ id: 'lower-floor' as const, label: 'Lower Floor', hasContent: true });
    }
    
    if (apartment && apartment.rooms.length > 0) {
      tabs.push({ id: 'apartment' as const, label: 'Apartment', hasContent: true });
    }
    
    return tabs;
  }, [upperFloor, lowerFloor, apartment]);
  
  // Ensure active tab is valid
  React.useEffect(() => {
    const validTabIds = availableTabs.map(tab => tab.id);
    if (!validTabIds.includes(activeTab)) {
      setActiveTab('whole-house');
    }
  }, [availableTabs, activeTab]);

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

  // Get all rooms for whole house view
  const allRooms = [...upperFloorRooms, ...lowerFloorRooms, ...apartmentRooms];

  // Get current content based on active tab and section
  const getCurrentContent = () => {
    let rooms: typeof allRooms = [];
    let title = '';

    switch (activeTab) {
      case 'whole-house':
        // Special handling for whole house view
        if (activeSection === 'status') {
          return (
            <div className="space-y-8">
              {/* Upper Floor Section */}
              {upperFloorRooms.length > 0 && (
                <div>
                  <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Upper Floor</h2>
                    <div className="flex-1 ml-4 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {upperFloorRooms.map((room, index) => (
                      <RoomCard 
                        key={`upper-${index}`} 
                        roomName={room.name}
                        floor={room.floor}
                        backgroundImage={room.backgroundImage}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Lower Floor Section */}
              {lowerFloorRooms.length > 0 && (
                <div>
                  <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Lower Floor</h2>
                    <div className="flex-1 ml-4 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {lowerFloorRooms.map((room, index) => (
                      <RoomCard 
                        key={`lower-${index}`} 
                        roomName={room.name}
                        floor={room.floor}
                        backgroundImage={room.backgroundImage}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Apartment Section (if exists) */}
              {apartmentRooms.length > 0 && (
                <div>
                  <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Apartment</h2>
                    <div className="flex-1 ml-4 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {apartmentRooms.map((room, index) => (
                      <RoomCard 
                        key={`apartment-${index}`} 
                        roomName={room.name}
                        floor={room.floor}
                        backgroundImage={room.backgroundImage}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* No rooms message */}
              {allRooms.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg font-medium">
                    No rooms configured
                  </div>
                  <div className="text-gray-500 text-sm mt-2">
                    Add rooms to your configuration to see them here
                  </div>
                </div>
              )}
            </div>
          );
        } else {
          // Controls view for whole house - use DeviceControlsSection
          return <DeviceControlsSection activeTab="whole-house" />;
        }
      case 'upper-floor':
        rooms = upperFloorRooms;
        title = 'Upper Floor';
        break;
      case 'lower-floor':
        rooms = lowerFloorRooms;
        title = 'Lower Floor';
        break;
      case 'apartment':
        rooms = apartmentRooms;
        title = 'Apartment';
        break;
    }

    if (activeSection === 'status' && activeTab !== 'whole-house') {
      // Status view - show room cards
      return rooms.length > 0 ? (
        <FloorSection title={title} rooms={rooms} />
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg font-medium">
            No rooms configured for {title}
          </div>
          <div className="text-gray-500 text-sm mt-2">
            Add rooms to this area in your configuration
          </div>
        </div>
      );
    }
  };

  const handleToggle = () => {
    if (currentDevice.state === 'playing') {
      controlMediaPlayer(currentDevice.entity_id, 'pause');
    } else {
      controlMediaPlayer(currentDevice.entity_id, 'play');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />
      <InfoRow cameras={cameras} />
      
      <main className="py-4 pb-8">
        {/* Top-level Tab Navigation */}
        <div className="px-6 mb-6">
          {/* Dynamic Tab Navigation */}
          <div className="flex items-end w-full">
            {availableTabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-3 px-6 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-lg border-t-2 border-l-2 border-r-2 border-gray-200 -mb-px'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200 border-b-0'
                }`}
                style={{
                  clipPath: activeTab === tab.id 
                    ? 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 100%, 0% 100%)'
                    : 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 100%, 0% 100%)',
                  width: `${100 / availableTabs.length}%`,
                  marginRight: index < availableTabs.length - 1 ? '2px' : '0'
                }}
              >
                <span className="relative whitespace-nowrap">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* Tab Content Background with Sidebar */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl rounded-tl-none shadow-lg -mt-px relative min-h-[600px]">
            {/* Unified Content Area with Sidebar and Content */}
            <div className="flex h-full max-h-[calc(100vh-200px)] overflow-hidden">
              {/* Vertical Sidebar Navigation */}
              <div className="flex flex-col w-16 border-r border-gray-200 flex-shrink-0 h-full">
                {/* Status Tab */}
                <button
                  onClick={() => setActiveSection('status')}
                  className={`relative flex items-center justify-center py-8 h-32 flex-shrink-0 transition-all duration-200 ${
                    activeSection === 'status'
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div 
                    className="font-semibold text-sm tracking-wider"
                    style={{ 
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)'
                    }}
                  >
                    STATUS
                  </div>
                  {activeSection === 'status' && (
                    <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-500"></div>
                  )}
                </button>

                {/* Controls Tab */}
                <button
                  onClick={() => setActiveSection('controls')}
                  className={`relative flex items-center justify-center py-8 h-32 flex-shrink-0 transition-all duration-200 ${
                    activeSection === 'controls'
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div 
                    className="font-semibold text-sm tracking-wider"
                    style={{ 
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)'
                    }}
                  >
                    CONTROLS
                  </div>
                </button>
              </div>
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