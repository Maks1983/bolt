/**
 * Device Context for Global State Management
 * 
 * This context provides global state management for devices defined in entities.ts
 * and handles real-time updates from Home Assistant via WebSocket
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Device, Room, Floor, ConnectionState, EntityUpdateEvent } from '../types/devices';
import { subscribedEntities, getEntityConfig } from '../config/entities';
import { roomConfigs, floorConfigs } from '../config/devices';
import { socketService } from '../services/socketService';

interface DeviceState {
  devices: Device[];
  rooms: Room[];
  floors: Floor[];
  connectionState: ConnectionState;
  connectionError?: string;
  lastUpdate?: Date;
}

type DeviceAction =
  | { type: 'SET_DEVICES'; payload: Device[] }
  | { type: 'UPDATE_DEVICE'; payload: { entityId: string; updates: Partial<Device> } }
  | { type: 'SET_CONNECTION_STATE'; payload: { state: ConnectionState; error?: string } }
  | { type: 'ENTITY_UPDATE'; payload: EntityUpdateEvent }
  | { type: 'SET_LAST_UPDATE'; payload: Date };

// Initialize with devices from entities.ts configuration
const initialDevices: Device[] = subscribedEntities.map(entity => ({
  entity_id: entity.entity_id,
  friendly_name: entity.friendly_name,
  device_type: entity.device_type,
  room: entity.room,
  floor: entity.floor,
  state: 'unknown',
  last_updated: new Date().toISOString(),
  available: false, // Will be updated when HA responds
  ...(entity.sensor_type && { sensor_type: entity.sensor_type })
})) as Device[];

const initialState: DeviceState = {
  devices: initialDevices,
  rooms: updateRoomsWithDevices(roomConfigs, initialDevices),
  floors: updateFloorsWithRooms(floorConfigs, updateRoomsWithDevices(roomConfigs, initialDevices)),
  connectionState: 'disconnected'
};

// Helper function to map Home Assistant attributes to device properties
function mapAttributesToDevice(deviceType: string, attributes: any): Partial<Device> {
  const updates: Partial<Device> = {};

  if (!attributes) return updates;

  // Light attributes
  if (deviceType === 'light') {
    if (attributes.brightness !== undefined) {
      (updates as any).brightness = attributes.brightness;
    }
    if (attributes.rgb_color) {
      (updates as any).rgb_color = attributes.rgb_color;
    }
    if (attributes.color_temp) {
      (updates as any).color_temp = attributes.color_temp;
    }
    if (attributes.color_mode) {
      (updates as any).color_mode = attributes.color_mode;
    }
    if (attributes.supported_color_modes) {
      (updates as any).supported_color_modes = attributes.supported_color_modes;
    }
  }

  // Cover attributes
  if (deviceType === 'cover') {
    if (attributes.current_position !== undefined) {
      (updates as any).position = attributes.current_position;
    }
    if (attributes.tilt_position !== undefined) {
      (updates as any).tilt_position = attributes.tilt_position;
    }
  }

  // Media player attributes
  if (deviceType === 'media_player') {
    if (attributes.volume_level !== undefined) {
      (updates as any).volume_level = attributes.volume_level;
    }
    if (attributes.media_title) {
      (updates as any).media_title = attributes.media_title;
    }
    if (attributes.media_artist) {
      (updates as any).media_artist = attributes.media_artist;
    }
    if (attributes.source) {
      (updates as any).source = attributes.source;
    }
    if (attributes.is_volume_muted !== undefined) {
      (updates as any).is_volume_muted = attributes.is_volume_muted;
    }
  }

  // Sensor attributes
  if (deviceType === 'sensor') {
    if (attributes.unit_of_measurement) {
      (updates as any).unit_of_measurement = attributes.unit_of_measurement;
    }
    if (attributes.device_class) {
      (updates as any).device_class = attributes.device_class;
    }
  }

  // Binary sensor attributes
  if (deviceType === 'binary_sensor') {
    if (attributes.device_class) {
      (updates as any).device_class = attributes.device_class;
    }
  }

  // Fan attributes
  if (deviceType === 'fan') {
    if (attributes.percentage !== undefined) {
      (updates as any).percentage = attributes.percentage;
    }
    if (attributes.preset_mode) {
      (updates as any).preset_mode = attributes.preset_mode;
    }
    if (attributes.oscillating !== undefined) {
      (updates as any).oscillating = attributes.oscillating;
    }
  }

  // Lock attributes
  if (deviceType === 'lock') {
    if (attributes.changed_by) {
      (updates as any).changed_by = attributes.changed_by;
    }
  }

  // Alarm control panel attributes
  if (deviceType === 'alarm_control_panel') {
    if (attributes.changed_by) {
      (updates as any).changed_by = attributes.changed_by;
    }
  }

  return updates;
}

function deviceReducer(state: DeviceState, action: DeviceAction): DeviceState {
  switch (action.type) {
    case 'SET_DEVICES': {
      console.log('🔄 Setting devices from Home Assistant:', action.payload.length, 'devices');
      
      // Merge HA data with our entity configuration
      const mergedDevices = mergeHADataWithConfig(action.payload, state.devices);
      
      console.log('✅ Merged devices:', mergedDevices.length);
      
      return {
        ...state,
        devices: mergedDevices,
        rooms: updateRoomsWithDevices(state.rooms, mergedDevices),
        floors: updateFloorsWithRooms(state.floors, updateRoomsWithDevices(state.rooms, mergedDevices))
      };
    }

    case 'UPDATE_DEVICE': {
      const updatedDevices = state.devices.map(device =>
        device.entity_id === action.payload.entityId
          ? { ...device, ...action.payload.updates, last_updated: new Date().toISOString() }
          : device
      );
      
      return {
        ...state,
        devices: updatedDevices,
        rooms: updateRoomsWithDevices(state.rooms, updatedDevices),
        floors: updateFloorsWithRooms(state.floors, updateRoomsWithDevices(state.rooms, updatedDevices)),
        lastUpdate: new Date()
      };
    }

    case 'ENTITY_UPDATE': {
      const { entity_id, state: newState, attributes, last_updated } = action.payload;
      
      const updatedDevices = state.devices.map(device => {
        if (device.entity_id === entity_id) {
          // Map attributes to device properties
          const attributeUpdates = mapAttributesToDevice(device.device_type, attributes);
          
          const updatedDevice = {
            ...device,
            state: newState,
            ...attributeUpdates,
            available: true, // If we're getting updates, it's available
            last_updated: last_updated || new Date().toISOString()
          };
          
          return updatedDevice;
        }
        return device;
      });

      const hasChanges = updatedDevices.some((device, index) => 
        device !== state.devices[index]
      );

      if (!hasChanges) {
        return state;
      }

      return {
        ...state,
        devices: updatedDevices,
        rooms: updateRoomsWithDevices(state.rooms, updatedDevices),
        floors: updateFloorsWithRooms(state.floors, updateRoomsWithDevices(state.rooms, updatedDevices)),
        lastUpdate: new Date()
      };
    }

    case 'SET_CONNECTION_STATE':
      return {
        ...state,
        connectionState: action.payload.state,
        connectionError: action.payload.error
      };

    case 'SET_LAST_UPDATE':
      return {
        ...state,
        lastUpdate: action.payload
      };

    default:
      return state;
  }
}

// Helper function to merge HA data with our entity configuration
function mergeHADataWithConfig(haDevices: Device[], configDevices: Device[]): Device[] {
  const mergedDevices: Device[] = [];
  
  // Create a map of config devices for quick lookup
  const configMap = new Map(configDevices.map(device => [device.entity_id, device]));
  
  // Process HA devices and merge with config
  for (const haDevice of haDevices) {
    const configDevice = configMap.get(haDevice.entity_id);
    
    if (configDevice) {
      // Merge HA data with config, prioritizing HA state and attributes
      const mergedDevice = {
        ...configDevice, // Start with config (room, floor, friendly_name, etc.)
        ...haDevice, // Override with HA data (state, attributes, etc.)
        room: configDevice.room, // Always use config room
        floor: configDevice.floor, // Always use config floor
        friendly_name: configDevice.friendly_name, // Use config friendly name
        sensor_type: configDevice.sensor_type || (haDevice as any).sensor_type, // Prefer config sensor type
        available: haDevice.available
      };
      mergedDevices.push(mergedDevice);
    }
  }
  
  // Add any config devices that weren't found in HA (might be offline)
  for (const configDevice of configDevices) {
    const foundInHA = haDevices.some(haDevice => haDevice.entity_id === configDevice.entity_id);
    if (!foundInHA) {
      console.log('⚠️ Config device not found in HA (might be offline):', configDevice.entity_id);
      mergedDevices.push({
        ...configDevice,
        available: false,
        state: 'unavailable'
      });
    }
  }
  
  return mergedDevices;
}

// Helper functions to update nested structures
function updateRoomsWithDevices(rooms: Room[], devices: Device[]): Room[] {
  return rooms.map(room => {
    const roomDevices = devices.filter(device => device.room === room.name);
    
    return {
      ...room,
      devices: roomDevices
    };
  });
}

function updateFloorsWithRooms(floors: Floor[], rooms: Room[]): Floor[] {
  return floors.map(floor => ({
    ...floor,
    rooms: rooms.filter(room => room.floor === floor.name)
  }));
}

interface DeviceContextType {
  state: DeviceState;
  updateDevice: (entityId: string, updates: Partial<Device>) => void;
  getDevice: (entityId: string) => Device | undefined;
  getDevicesByRoom: (roomName: string) => Device[];
  getDevicesByType: (deviceType: string) => Device[];
  getRoomDevices: (roomName: string) => {
    lights: Device[];
    covers: Device[];
    mediaPlayers: Device[];
    sensors: Device[];
    binarySensors: Device[];
    fans: Device[];
    locks: Device[];
    cameras: Device[];
  };
  // Device control methods
  controlLight: (entityId: string, on: boolean, brightness?: number, rgbColor?: [number, number, number]) => void;
  controlCover: (entityId: string, action: 'open' | 'close' | 'set_position', position?: number) => void;
  controlMediaPlayer: (entityId: string, action: 'play' | 'pause' | 'volume', volume?: number) => void;
  controlFan: (entityId: string, on: boolean, percentage?: number) => void;
  controlLock: (entityId: string, action: 'lock' | 'unlock', code?: string) => void;
  controlAlarm: (entityId: string, action: 'arm_home' | 'arm_away' | 'disarm', code?: string) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(deviceReducer, initialState);

  useEffect(() => {
    console.log('🔧 Setting up WebSocket event listeners...');
    
    // Setup WebSocket event listeners
    socketService.onConnectionChange((connectionState, error) => {
      console.log('🔌 Connection state changed:', connectionState, error);
      dispatch({ type: 'SET_CONNECTION_STATE', payload: { state: connectionState, error } });
    });

    socketService.onEntityUpdated((update) => {
      dispatch({ type: 'ENTITY_UPDATE', payload: update });
    });

    socketService.onDevicesUpdated((devices) => {
      console.log('🔄 Devices updated from WebSocket:', devices.length, 'devices');
      dispatch({ type: 'SET_DEVICES', payload: devices });
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const updateDevice = (entityId: string, updates: Partial<Device>) => {
    console.log('🔄 Manual device update:', { entityId, updates });
    dispatch({ type: 'UPDATE_DEVICE', payload: { entityId, updates } });
  };

  const getDevice = (entityId: string): Device | undefined => {
    return state.devices.find(device => device.entity_id === entityId);
  };

  const getDevicesByRoom = (roomName: string): Device[] => {
    const devices = state.devices.filter(device => device.room === roomName);
    return devices;
  };

  const getDevicesByType = (deviceType: string): Device[] => {
    return state.devices.filter(device => device.device_type === deviceType);
  };

  const getRoomDevices = (roomName: string) => {
    const roomDevices = getDevicesByRoom(roomName);
    
    const result = {
      lights: roomDevices.filter(d => d.device_type === 'light'),
      covers: roomDevices.filter(d => d.device_type === 'cover'),
      mediaPlayers: roomDevices.filter(d => d.device_type === 'media_player'),
      sensors: roomDevices.filter(d => d.device_type === 'sensor'),
      binarySensors: roomDevices.filter(d => d.device_type === 'binary_sensor'),
      fans: roomDevices.filter(d => d.device_type === 'fan'),
      locks: roomDevices.filter(d => d.device_type === 'lock'),
      cameras: roomDevices.filter(d => d.device_type === 'camera')
    };
    
    return result;
  };

  // Device control methods
  const controlLight = (entityId: string, on: boolean, brightness?: number, rgbColor?: [number, number, number]) => {
    console.log('💡 Controlling light:', { entityId, on, brightness, rgbColor });
    
    if (on) {
      socketService.turnOnLight(entityId, brightness, rgbColor);
    } else {
      socketService.turnOffLight(entityId);
    }
    
    // Optimistic update
    const optimisticUpdates: Partial<Device> = { 
      state: on ? 'on' : 'off',
      ...(brightness !== undefined && { brightness }),
      ...(rgbColor && { rgb_color: rgbColor })
    };
    
    updateDevice(entityId, optimisticUpdates);
  };

  const controlCover = (entityId: string, action: 'open' | 'close' | 'set_position', position?: number) => {
    console.log('🪟 Controlling cover:', { entityId, action, position });
    
    switch (action) {
      case 'open':
        socketService.openCover(entityId);
        updateDevice(entityId, { state: 'opening' });
        break;
      case 'close':
        socketService.closeCover(entityId);
        updateDevice(entityId, { state: 'closing' });
        break;
      case 'set_position':
        if (position !== undefined) {
          socketService.setCoverPosition(entityId, position);
          updateDevice(entityId, { position });
        }
        break;
    }
  };

  const controlMediaPlayer = (entityId: string, action: 'play' | 'pause' | 'volume', volume?: number) => {
    console.log('🎵 Controlling media player:', { entityId, action, volume });
    
    switch (action) {
      case 'play':
        socketService.playMedia(entityId);
        updateDevice(entityId, { state: 'playing' });
        break;
      case 'pause':
        socketService.pauseMedia(entityId);
        updateDevice(entityId, { state: 'paused' });
        break;
      case 'volume':
        if (volume !== undefined) {
          socketService.setMediaVolume(entityId, volume);
          updateDevice(entityId, { volume_level: volume });
        }
        break;
    }
  };

  const controlFan = (entityId: string, on: boolean, percentage?: number) => {
    console.log('🌀 Controlling fan:', { entityId, on, percentage });
    
    if (on) {
      socketService.turnOnFan(entityId, percentage);
      updateDevice(entityId, { 
        state: 'on',
        ...(percentage !== undefined && { percentage })
      });
    } else {
      socketService.turnOffFan(entityId);
      updateDevice(entityId, { state: 'off' });
    }
  };

  const controlLock = (entityId: string, action: 'lock' | 'unlock', code?: string) => {
    console.log('🔒 Controlling lock:', { entityId, action });
    
    if (action === 'lock') {
      socketService.lockDoor(entityId, code);
      updateDevice(entityId, { state: 'locking' });
    } else {
      socketService.unlockDoor(entityId, code);
      updateDevice(entityId, { state: 'unlocking' });
    }
  };

  const controlAlarm = (entityId: string, action: 'arm_home' | 'arm_away' | 'disarm', code?: string) => {
    console.log('🚨 Controlling alarm:', { entityId, action });
    
    switch (action) {
      case 'arm_home':
        socketService.armAlarmHome(entityId, code);
        updateDevice(entityId, { state: 'pending' });
        break;
      case 'arm_away':
        socketService.armAlarmAway(entityId, code);
        updateDevice(entityId, { state: 'pending' });
        break;
      case 'disarm':
        socketService.disarmAlarm(entityId, code);
        updateDevice(entityId, { state: 'pending' });
        break;
    }
  };

  const contextValue: DeviceContextType = {
    state,
    updateDevice,
    getDevice,
    getDevicesByRoom,
    getDevicesByType,
    getRoomDevices,
    controlLight,
    controlCover,
    controlMediaPlayer,
    controlFan,
    controlLock,
    controlAlarm
  };

  return (
    <DeviceContext.Provider value={contextValue}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
};