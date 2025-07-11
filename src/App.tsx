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

  // Function to get the title for the current active tab
  const getTabTitle = () => {
    switch (activeTab) {
      case 'whole-house':
        return 'Whole House';
      case 'upper-floor':
        return 'Upper Floor';
      case 'lower-floor':
        return 'Lower Floor';
      case 'apartment':
        return 'Apartment';
      default:
        return 'Whole House';
    }
  };

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
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Upper Floor</h2>
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
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Lower Floor</h2>
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
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Apartment</h2>
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
                  <div className="text-secondary text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>
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
          <div className="text-secondary text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Poppins, sans-serif' }}>
            Add rooms to this area in your configuration
          </div>
        </div>
      );
    } else if (activeTab !== 'whole-house') {
      // Controls view - show device controls interface
      return <DeviceControlsSection activeTab={activeTab} />;
    }
    
    return null; // This should never be reached due to whole-house handling above
  };

  return (
    <div className="h-screen no-scroll" style={{ backgroundColor: '#010d14' }}>
      <Header 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <InfoRow cameras={cameras} />
      
      <main className="h-full no-scroll">
        {/* Top-level Tab Navigation */}
        <div className="px-6 h-full main-content-container">
          {/* Dynamic Tab Navigation */}
          <div className="flex items-end">
            {availableTabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`seamless-tab relative px-6 py-3 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'active'
                    : ''
                }`}
                style={{
                  borderRadius: '12px 12px 0 0',
                  // Equal width distribution across full container
                  width: `${100 / availableTabs.length}%`,
                  marginRight: index < availableTabs.length - 1 ? '2px' : '0'
                }}
              >
                <span className="relative whitespace-nowrap">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #028ee5, transparent)' }}></div>
                )}
              </button>
            ))}
          </div>
          
          {/* Tab Content Background with Sidebar */}
          <div className="seamless-modal rounded-2xl -mt-px relative min-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Main Content Area */}
            <div className="p-6 pb-8">
              {getCurrentContent()}
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
