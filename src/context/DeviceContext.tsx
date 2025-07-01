/**
 * Device Context for Global State Management
 * 
 * This context provides global state management for all devices and handles
 * real-time updates from the Home Assistant backend via WebSocket
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Device, Room, Floor, ConnectionState, EntityUpdateEvent } from '../types/devices';
import { deviceConfigs, roomConfigs, floorConfigs } from '../config/devices';
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

const initialState: DeviceState = {
  devices: deviceConfigs,
  rooms: roomConfigs,
  floors: floorConfigs,
  connectionState: 'disconnected'
};

function deviceReducer(state: DeviceState, action: DeviceAction): DeviceState {
  switch (action.type) {
    case 'SET_DEVICES':
      return {
        ...state,
        devices: action.payload,
        rooms: updateRoomsWithDevices(state.rooms, action.payload),
        floors: updateFloorsWithRooms(state.floors, updateRoomsWithDevices(state.rooms, action.payload))
      };

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
          const updates: Partial<Device> = {
            state: newState,
            last_updated
          };

          // Map Home Assistant attributes to device properties
          if (attributes) {
            // Light attributes
            if (device.device_type === 'light' && attributes.brightness !== undefined) {
              (updates as any).brightness = attributes.brightness;
            }
            if (device.device_type === 'light' && attributes.rgb_color) {
              (updates as any).rgb_color = attributes.rgb_color;
            }
            if (device.device_type === 'light' && attributes.color_temp) {
              (updates as any).color_temp = attributes.color_temp;
            }

            // Cover attributes
            if (device.device_type === 'cover' && attributes.current_position !== undefined) {
              (updates as any).position = attributes.current_position;
            }

            // Media player attributes
            if (device.device_type === 'media_player') {
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
            }

            // Sensor attributes
            if (device.device_type === 'sensor' && attributes.unit_of_measurement) {
              (updates as any).unit_of_measurement = attributes.unit_of_measurement;
            }

            // Fan attributes
            if (device.device_type === 'fan' && attributes.percentage !== undefined) {
              (updates as any).percentage = attributes.percentage;
            }
          }

          return { ...device, ...updates };
        }
        return device;
      });

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

// Helper functions to update nested structures
function updateRoomsWithDevices(rooms: Room[], devices: Device[]): Room[] {
  return rooms.map(room => ({
    ...room,
    devices: devices.filter(device => device.room === room.name)
  }));
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
    // Setup WebSocket event listeners
    socketService.onConnectionChange((connectionState, error) => {
      dispatch({ type: 'SET_CONNECTION_STATE', payload: { state: connectionState, error } });
    });

    socketService.onEntityUpdated((update) => {
      dispatch({ type: 'ENTITY_UPDATE', payload: update });
    });

    socketService.onDevicesUpdated((devices) => {
      dispatch({ type: 'SET_DEVICES', payload: devices });
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const updateDevice = (entityId: string, updates: Partial<Device>) => {
    dispatch({ type: 'UPDATE_DEVICE', payload: { entityId, updates } });
  };

  const getDevice = (entityId: string): Device | undefined => {
    return state.devices.find(device => device.entity_id === entityId);
  };

  const getDevicesByRoom = (roomName: string): Device[] => {
    return state.devices.filter(device => device.room === roomName);
  };

  const getDevicesByType = (deviceType: string): Device[] => {
    return state.devices.filter(device => device.device_type === deviceType);
  };

  const getRoomDevices = (roomName: string) => {
    const roomDevices = getDevicesByRoom(roomName);
    
    return {
      lights: roomDevices.filter(d => d.device_type === 'light'),
      covers: roomDevices.filter(d => d.device_type === 'cover'),
      mediaPlayers: roomDevices.filter(d => d.device_type === 'media_player'),
      sensors: roomDevices.filter(d => d.device_type === 'sensor'),
      binarySensors: roomDevices.filter(d => d.device_type === 'binary_sensor'),
      fans: roomDevices.filter(d => d.device_type === 'fan'),
      locks: roomDevices.filter(d => d.device_type === 'lock'),
      cameras: roomDevices.filter(d => d.device_type === 'camera')
    };
  };

  // Device control methods
  const controlLight = (entityId: string, on: boolean, brightness?: number, rgbColor?: [number, number, number]) => {
    if (on) {
      socketService.turnOnLight(entityId, brightness, rgbColor);
    } else {
      socketService.turnOffLight(entityId);
    }
    
    // Optimistic update
    updateDevice(entityId, { 
      state: on ? 'on' : 'off',
      ...(brightness !== undefined && { brightness }),
      ...(rgbColor && { rgb_color: rgbColor })
    });
  };

  const controlCover = (entityId: string, action: 'open' | 'close' | 'set_position', position?: number) => {
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
    if (action === 'lock') {
      socketService.lockDoor(entityId, code);
      updateDevice(entityId, { state: 'locking' });
    } else {
      socketService.unlockDoor(entityId, code);
      updateDevice(entityId, { state: 'unlocking' });
    }
  };

  const controlAlarm = (entityId: string, action: 'arm_home' | 'arm_away' | 'disarm', code?: string) => {
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