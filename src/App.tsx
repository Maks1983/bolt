import React from 'react';
import { DeviceProvider, useDevices } from './context/DeviceContext';
import { Home, BarChart3, Settings } from 'lucide-react';
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

type TabType = 'whole-house' | 'upper-floor' | 'lower-floor';
type ContentType = 'status' | 'controls';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>('whole-house');
  const [activeContent, setActiveContent] = React.useState<ContentType>('status');
  
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

  // Get all rooms for whole house view
  const allRooms = [...upperFloorRooms, ...lowerFloorRooms, ...apartmentRooms];

  // Get current content based on active tab
  const getCurrentRooms = () => {
    switch (activeTab) {
      case 'whole-house':
        return allRooms;
      case 'upper-floor':
        return upperFloorRooms;
      case 'lower-floor':
        return lowerFloorRooms;
      default:
        return allRooms;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'whole-house':
        return 'Whole House';
      case 'upper-floor':
        return 'Upper Floor';
      case 'lower-floor':
        return 'Lower Floor';
      default:
        return 'Whole House';
    }
  };

  const renderStatusContent = () => {
    const currentRooms = getCurrentRooms();
    
    if (currentRooms.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg font-medium">
            No rooms configured for {getTabTitle()}
          </div>
          <div className="text-gray-500 text-sm mt-2">
            Add rooms to this area in your configuration
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{getTabTitle()} Status</h2>
          <div className="text-sm text-gray-500">
            {currentRooms.length} room{currentRooms.length !== 1 ? 's' : ''} configured
          </div>
        </div>
        <FloorSection title="" rooms={currentRooms} />
      </div>
    );
  };

  const renderControlsContent = () => {
    const currentRooms = getCurrentRooms();
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{getTabTitle()} Controls</h2>
          <div className="text-sm text-gray-500">
            Device control interface
          </div>
        </div>
        
        {currentRooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg font-medium">
              No rooms configured for {getTabTitle()}
            </div>
            <div className="text-gray-500 text-sm mt-2">
              Add rooms to this area in your configuration
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Device Controls</h3>
            </div>
            <p className="text-blue-700 mb-4">
              Click on any room card to access detailed device controls for that room.
            </p>
            <FloorSection title="" rooms={currentRooms} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />
      <InfoRow cameras={cameras} />
      
      <main className="py-4 pb-8">
        {/* Top-level Tab Navigation */}
        <div className="px-6 mb-6">
          <div className="flex items-end space-x-1">
            {/* Whole House Tab */}
            <button
              onClick={() => setActiveTab('whole-house')}
              className={`relative px-6 py-3 rounded-t-2xl font-semibold text-sm transition-all duration-200 transform ${
                activeTab === 'whole-house'
                  ? 'bg-white text-gray-900 shadow-lg border-t-2 border-l-2 border-r-2 border-gray-200 -mb-px z-10'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200 border-b-0'
              }`}
              style={{
                clipPath: activeTab === 'whole-house' 
                  ? 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 100%, 0% 100%)'
                  : 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 100%, 0% 100%)'
              }}
            >
              <span className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Whole House</span>
              </span>
              {activeTab === 'whole-house' && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white"></div>
              )}
            </button>

            {/* Upper Floor Tab */}
            <button
              onClick={() => setActiveTab('upper-floor')}
              className={`relative px-6 py-3 rounded-t-2xl font-semibold text-sm transition-all duration-200 transform ${
                activeTab === 'upper-floor'
                  ? 'bg-white text-gray-900 shadow-lg border-t-2 border-l-2 border-r-2 border-gray-200 -mb-px z-10'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200 border-b-0'
              }`}
              style={{
                clipPath: activeTab === 'upper-floor' 
                  ? 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 100%, 0% 100%)'
                  : 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 100%, 0% 100%)'
              }}
            >
              <span>Upper Floor</span>
              {activeTab === 'upper-floor' && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white"></div>
              )}
            </button>

            {/* Lower Floor Tab */}
            <button
              onClick={() => setActiveTab('lower-floor')}
              className={`relative px-6 py-3 rounded-t-2xl font-semibold text-sm transition-all duration-200 transform ${
                activeTab === 'lower-floor'
                  ? 'bg-white text-gray-900 shadow-lg border-t-2 border-l-2 border-r-2 border-gray-200 -mb-px z-10'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200 border-b-0'
              }`}
              style={{
                clipPath: activeTab === 'lower-floor' 
                  ? 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 100%, 0% 100%)'
                  : 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 100%, 0% 100%)'
              }}
            >
              <span>Lower Floor</span>
              {activeTab === 'lower-floor' && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white"></div>
              )}
            </button>
          </div>
          
          {/* Tab Content Area with Side Navigation */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl rounded-tl-none shadow-lg -mt-px relative">
            <div className="flex min-h-[500px]">
              {/* Left Side Navigation */}
              <div className="w-48 border-r border-gray-200 p-4 bg-gray-50/50 rounded-l-2xl">
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveContent('status')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeContent === 'status'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-medium">Status</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveContent('controls')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeContent === 'controls'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Controls</span>
                  </button>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flex-1 p-6">
                {activeContent === 'status' ? renderStatusContent() : renderControlsContent()}
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