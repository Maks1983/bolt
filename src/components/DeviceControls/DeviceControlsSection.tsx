import React from 'react';
import { useDevices } from '../../context/DeviceContext';
import LightControl from './LightControl';
import FanControl from './FanControl';
import CoverControl from './CoverControl';
import LockControl from './LockControl';
import AlarmControl from './AlarmControl';
import CameraControl from './CameraControl';
import MediaPlayerControl from './MediaPlayerControl';

interface DeviceControlsSectionProps {
  activeTab: 'whole-house' | 'upper-floor' | 'lower-floor' | 'apartment';
}

const DeviceControlsSection: React.FC<DeviceControlsSectionProps> = ({ activeTab }) => {
  const { state } = useDevices();
  
  // Get devices based on active tab
  const getDevicesForTab = () => {
    if (activeTab === 'whole-house') {
      return state.devices;
    }
    
    // Get devices for specific floor
    const floor = state.floors.find(f => {
      switch (activeTab) {
        case 'upper-floor':
          return f.name === 'Upper Floor';
        case 'lower-floor':
          return f.name === 'Lower Floor';
        case 'apartment':
          return f.name === 'Apartment';
        default:
          return false;
      }
    });
    
    if (!floor) return [];
    
    // Get all devices from rooms in this floor
    const roomIds = floor.rooms.map(room => room.id);
    return state.devices.filter(device => 
      roomIds.includes(device.room_id)
    );
  };
  
  const devices = getDevicesForTab();
  
  // Group devices by type
  const devicesByType = devices.reduce((acc, device) => {
    if (!acc[device.device_type]) {
      acc[device.device_type] = [];
    }
    acc[device.device_type].push(device);
    return acc;
  }, {} as Record<string, typeof devices>);
  
  const renderDeviceControl = (device: any) => {
    const key = `${device.device_type}-${device.id}`;
    
    switch (device.device_type) {
      case 'light':
        return <LightControl key={key} device={device} />;
      case 'fan':
        return <FanControl key={key} device={device} />;
      case 'cover':
        return <CoverControl key={key} device={device} />;
      case 'lock':
        return <LockControl key={key} device={device} />;
      case 'alarm_control_panel':
        return <AlarmControl key={key} device={device} />;
      case 'camera':
        return <CameraControl key={key} device={device} />;
      case 'media_player':
        return <MediaPlayerControl key={key} device={device} />;
      default:
        return null;
    }
  };
  
  if (devices.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg font-medium">
          No devices found
        </div>
        <div className="text-gray-500 text-sm mt-2">
          {activeTab === 'whole-house' 
            ? 'No devices configured in your system'
            : `No devices found for ${activeTab.replace('-', ' ')}`
          }
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {Object.entries(devicesByType).map(([deviceType, typeDevices]) => (
        <div key={deviceType}>
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {deviceType.replace('_', ' ')}s
            </h3>
            <div className="flex-1 ml-4 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            <span className="text-sm text-gray-500 ml-4">
              {typeDevices.length} device{typeDevices.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeDevices.map(device => renderDeviceControl(device))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeviceControlsSection;