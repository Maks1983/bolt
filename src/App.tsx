import React from 'react';
import { DeviceProvider } from './context/DeviceContext';
import Header from './components/Header';
import InfoRow from './components/InfoRow';
import FloorSection from './components/FloorSection';

function App() {
  // Upper Floor rooms with ONLY explicitly assigned devices
  const upperFloorRooms = [
    {
      name: 'Master Bedroom',
      floor: 'Upper Floor',
      lights: { on: 0, total: 0 }, // NO LIGHTS assigned to Master Bedroom
      temperature: 20,
      humidity: 45,
      presence: true,
      windowOpen: false,
      backgroundImage: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
      devices: {
        blinds: [
          { id: 1, name: 'Smart Blind', position: 60 }
        ],
        media: {
          playing: false,
          title: 'Sleep Sounds',
          volume: 25,
          source: 'Google Speaker'
        },
        sensors: {
          temperature: 20,
          humidity: 45,
          window: false
        }
      }
    },
    {
      name: 'Bedroom',
      floor: 'Upper Floor',
      lights: { on: 0, total: 0 }, // NO LIGHTS assigned to Bedroom
      temperature: 21,
      humidity: 50,
      presence: true,
      windowOpen: true,
      backgroundImage: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      devices: {
        blinds: [
          { id: 1, name: 'Smart Blind', position: 85 }
        ],
        media: {
          playing: true,
          title: 'Study Music',
          volume: 35,
          source: 'Chromecast'
        },
        sensors: {
          temperature: 21,
          humidity: 50,
          window: true
        }
      }
    },
    {
      name: 'Bathroom',
      floor: 'Upper Floor',
      lights: { on: 1, total: 1 }, // Only 1 light switch assigned
      temperature: 22,
      humidity: 65,
      presence: false,
      windowOpen: false,
      backgroundImage: 'https://images.pexels.com/photos/342800/pexels-photo-342800.jpeg?auto=compress&cs=tinysrgb&w=800',
      devices: {
        lights: [
          { id: 1, name: 'Light Switch', on: true, brightness: 100, color: '#ffffff', hasColor: false }
        ],
        fans: [
          { id: 1, name: 'Exhaust Fan', on: false }
        ],
        media: {
          playing: false,
          title: 'Morning Playlist',
          volume: 40,
          source: 'Google Speaker'
        },
        sensors: {
          temperature: 22,
          humidity: 65,
          flood: false
        }
      }
    },
    {
      name: 'Kitchen',
      floor: 'Upper Floor',
      lights: { on: 2, total: 3 }, // Light Switch + Counter Switch + LED Strip
      temperature: 23,
      humidity: 52,
      presence: false,
      windowOpen: false,
      backgroundImage: 'https://images.pexels.com/photos/279648/pexels-photo-279648.jpeg?auto=compress&cs=tinysrgb&w=800',
      devices: {
        lights: [
          { id: 1, name: 'Light Switch', on: true, brightness: 100, color: '#ffffff', hasColor: false },
          { id: 2, name: 'Counter Switch', on: true, brightness: 100, color: '#ffffff', hasColor: false },
          { id: 3, name: 'Ceiling LED Strip', on: false, brightness: 60, color: '#fff2cc', hasColor: true }
        ],
        blinds: [
          { id: 1, name: 'Smart Blind 1', position: 40 },
          { id: 2, name: 'Smart Blind 2', position: 40 },
          { id: 3, name: 'Smart Blind 3', position: 30 },
          { id: 4, name: 'Smart Blind 4', position: 30 }
        ],
        sensors: {
          temperature: 23,
          humidity: 52,
          windows: [false, false, false, false],
          flood: false,
          smoke: false
        }
      }
    },
    {
      name: 'Living Room',
      floor: 'Upper Floor',
      lights: { on: 2, total: 3 }, // Light Switch + LED Strip + Balcony Switch
      temperature: 22,
      humidity: 48,
      presence: true,
      windowOpen: false,
      backgroundImage: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800',
      devices: {
        lights: [
          { id: 1, name: 'Light Switch', on: true, brightness: 100, color: '#ffffff', hasColor: false },
          { id: 2, name: 'Ceiling LED Strip', on: true, brightness: 45, color: '#ccccff', hasColor: true },
          { id: 3, name: 'Balcony Switch', on: false, brightness: 100, color: '#ffffff', hasColor: false }
        ],
        curtains: [
          { id: 1, name: 'Smart Curtain', position: 70 }
        ],
        media: {
          playing: true,
          title: 'Evening Jazz',
          volume: 55,
          source: 'Google Speaker'
        },
        sensors: {
          temperature: 22,
          humidity: 48,
          window: false,
          smoke: false
        }
      }
    }
  ];

  const lowerFloorRooms = [
    {
      name: 'Entrance',
      floor: 'Lower Floor',
      lights: { on: 0, total: 0 }, // NO LIGHTS assigned to Entrance
      temperature: 19,
      humidity: 47,
      presence: false,
      windowOpen: false,
      backgroundImage: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800',
      devices: {
        security: {
          doorbell: {
            cameras: ['Camera Feed 1', 'Camera Feed 2'],
            lastRing: '2 hours ago'
          },
          lock: {
            locked: true,
            autoLock: true
          }
        },
        sensors: {
          temperature: 19,
          humidity: 47,
          door: false,
          smoke: false
        }
      }
    },
    {
      name: 'Office',
      floor: 'Lower Floor',
      lights: { on: 0, total: 0 }, // NO LIGHTS assigned to Office
      temperature: 21,
      humidity: 44,
      presence: false,
      windowOpen: true,
      backgroundImage: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800',
      devices: {
        media: {
          playing: false,
          title: 'Focus Sounds',
          volume: 30,
          source: 'Google Speaker'
        },
        sensors: {
          temperature: 21,
          humidity: 44,
          window: true
        }
      }
    },
    {
      name: 'Laundry',
      floor: 'Lower Floor',
      lights: { on: 1, total: 1 }, // Only 1 light switch assigned
      temperature: 20,
      humidity: 55,
      presence: false,
      windowOpen: false,
      backgroundImage: 'https://images.pexels.com/photos/4107123/pexels-photo-4107123.jpeg?auto=compress&cs=tinysrgb&w=800',
      devices: {
        lights: [
          { id: 1, name: 'Light Switch', on: true, brightness: 100, color: '#ffffff', hasColor: false }
        ],
        sensors: {
          temperature: 20,
          humidity: 55,
          flood: [false, false]
        }
      }
    }
  ];

  // Camera data for NVR system (moved from exterior rooms)
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
    <DeviceProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <Header />
        <InfoRow cameras={cameras} />
        
        <main className="py-4 space-y-6 pb-8">
          <FloorSection title="Upper Floor" rooms={upperFloorRooms} />
          <FloorSection title="Lower Floor" rooms={lowerFloorRooms} />
        </main>
      </div>
    </DeviceProvider>
  );
}

export default App;