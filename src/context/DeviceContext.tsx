/**
 * Device Context for Global State Management
 * 
 * This context provides global state management for all devices and handles
 * real-time updates from the Home Assistant backend via WebSocket
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Device, Room, Floor, ConnectionState, EntityUpdateEvent } from '../types/devices';
import { subscribedEntities } from '../config/entities';
import { roomConfigs, floorConfigs } from '../config/devices';
import { socketService } from '../services/socketService';

// Convert subscribed entities to initial devices
const initialDevices: Device[] = subscribedEntities.map(entity => ({
  ...entity,
  state: 'unknown',
  last_updated: new Date().toISOString(),
  available: false
}));

interface DeviceState {
  devices: Device[];
  rooms: Room[];
  floors: Floor[];
  connectionState: ConnectionState;
  connectionError?: string;
  lastUpdate?: Date;
  // Add a counter to force re-renders - CRITICAL FOR REACT UPDATES
  updateCounter: number;
}

type DeviceAction =
  | { type: 'SET_DEVICES'; payload: Device[] }
  | { type: 'UPDATE_DEVICE'; payload: { entityId: string; updates: Partial<Device> } }
  | { type: 'SET_CONNECTION_STATE'; payload: { state: ConnectionState; error?: string } }
  | { type: 'ENTITY_UPDATE'; payload: EntityUpdateEvent }
  | { type: 'SET_LAST_UPDATE'; payload: Date }
  | { type: 'SIMULATE_STATE_CHANGE'; payload: { entityId: string; newState: any; attributes?: any } }
  | { type: 'FORCE_UPDATE' };

const initialState: DeviceState = {
  devices: initialDevices,
  rooms: updateRoomsWithDevices(roomConfigs, initialDevices),
  floors: updateFloorsWithRooms(floorConfigs, updateRoomsWithDevices(roomConfigs, initialDevices)),
  connectionState: 'disconnected',
  updateCounter: 0
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
    case 'SET_DEVICES':
      console.log('🔄 Setting devices from Home Assistant:', action.payload.length);
      const newState = {
        ...state,
        devices: action.payload,
        rooms: updateRoomsWithDevices(state.rooms, action.payload),
        floors: updateFloorsWithRooms(state.floors, updateRoomsWithDevices(state.rooms, action.payload)),
        updateCounter: state.updateCounter + 1,
        lastUpdate: new Date()
      };
      console.log('✅ State updated with new devices, updateCounter:', newState.updateCounter);
      return newState;

    case 'UPDATE_DEVICE': {
      const updatedDevices = state.devices.map(device =>
        device.entity_id === action.payload.entityId
          ? { ...device, ...action.payload.updates, last_updated: new Date().toISOString() }
          : device
      );
      
      const newState = {
        ...state,
        devices: updatedDevices,
        rooms: updateRoomsWithDevices(state.rooms, updatedDevices),
        floors: updateFloorsWithRooms(state.floors, updateRoomsWithDevices(state.rooms, updatedDevices)),
        lastUpdate: new Date(),
        updateCounter: state.updateCounter + 1
      };
      
      console.log('✅ Device updated, updateCounter:', newState.updateCounter);
      return newState;
    }

    case 'ENTITY_UPDATE': {
      const { entity_id, state: newState, attributes, last_updated } = action.payload;
      
      console.log('🔄 Processing entity update:', { entity_id, newState, attributes });
      
      const updatedDevices = state.devices.map(device => {
        if (device.entity_id === entity_id) {
          console.log('✅ Found matching device:', device.friendly_name);
          
          // Map attributes to device properties
          const attributeUpdates = mapAttributesToDevice(device.device_type, attributes);
          
          const updatedDevice = {
            ...device,
            state: newState,
            available: true,
            ...attributeUpdates,
            last_updated: last_updated || new Date().toISOString()
          };
          
          console.log('🔄 Updated device:', updatedDevice);
          return updatedDevice;
        }
        return device;
      });

      const hasChanges = updatedDevices.some((device, index) => 
        device !== state.devices[index]
      );

      if (!hasChanges) {
        console.log('⚠️ No device found for entity_id:', entity_id);
        return state;
      }

      const newStateObj = {
        ...state,
        devices: updatedDevices,
        rooms: updateRoomsWithDevices(state.rooms, updatedDevices),
        floors: updateFloorsWithRooms(state.floors, updateRoomsWithDevices(state.rooms, updatedDevices)),
        lastUpdate: new Date(),
        updateCounter: state.updateCounter + 1
      };

      console.log('✅ Entity update processed, updateCounter:', newStateObj.updateCounter);
      return newStateObj;
    }

    case 'SIMULATE_STATE_CHANGE': {
      // For development - simulate a Home Assistant state_changed event
      const { entityId, newState, attributes } = action.payload;
      return deviceReducer(state, {
        type: 'ENTITY_UPDATE',
        payload: {
          entity_id: entityId,
          state: newState,
          attributes: attributes || {},
          last_updated: new Date().toISOString()
        }
      });
    }

    case 'SET_CONNECTION_STATE':
      return {
        ...state,
        connectionState: action.payload.state,
        connectionError: action.payload.error,
        updateCounter: state.updateCounter + 1
      };

    case 'SET_LAST_UPDATE':
      return {
        ...state,
        lastUpdate: action.payload,
        updateCounter: state.updateCounter + 1
      };

    case 'FORCE_UPDATE':
      return {
        ...state,
        updateCounter: state.updateCounter + 1
      };

    default:
      return state;
  }
}

// Helper functions to update nested structures
function updateRoomsWithDevices(rooms: Room[], devices: Device[]): Room[] {
  return rooms.map(room => {
    const roomDevices = devices.filter(device => device.room === room.name);
    console.log(`🏠 Room ${room.name}: ${roomDevices.length} devices`);
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
  // Development simulation method
  simulateStateChange: (entityId: string, newState: any, attributes?: any) => void;
  // Force update method for debugging
  forceUpdate: () => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(deviceReducer, initialState);

  useEffect(() => {
    console.log('🏠 DeviceProvider initialized with', subscribedEntities.length, 'subscribed entities');
    
    // Setup WebSocket event listeners
    socketService.onConnectionChange((connectionState, error) => {
      console.log('🔌 Connection state changed:', connectionState, error);
      dispatch({ type: 'SET_CONNECTION_STATE', payload: { state: connectionState, error } });
    });

    socketService.onEntityUpdated((update) => {
      console.log('🔄 Entity updated from WebSocket:', update);
      dispatch({ type: 'ENTITY_UPDATE', payload: update });
    });

    socketService.onDevicesUpdated((devices) => {
      console.log('🔄 Devices updated from WebSocket:', devices.length, 'devices');
      dispatch({ type: 'SET_DEVICES', payload: devices });
    });

    // Development simulation - only run if in dev mode
    if (socketService.isDevMode()) {
      console.log('🔧 Starting development simulation...');
      
      const simulateUpdates = () => {
        // Only simulate updates for entities that are actually configured
        const configuredEntityIds = subscribedEntities.map(e => e.entity_id);
        
        // Simulate motion sensor changes
        setTimeout(() => {
          const motionEntity = configuredEntityIds.find(id => id.includes('motion'));
          if (motionEntity) {
            console.log('🎭 Simulating motion sensor change');
            dispatch({ 
              type: 'SIMULATE_STATE_CHANGE', 
              payload: { 
                entityId: motionEntity, 
                newState: 'off' 
              } 
            });
          }
        }, 5000);

        // Simulate temperature changes
        setTimeout(() => {
          const tempEntity = configuredEntityIds.find(id => id.includes('temperature'));
          if (tempEntity) {
            console.log('🎭 Simulating temperature change');
            dispatch({ 
              type: 'SIMULATE_STATE_CHANGE', 
              payload: { 
                entityId: tempEntity, 
                newState: 24 
              } 
            });
          }
        }, 8000);

        // Simulate light state change
        setTimeout(() => {
          const lightEntity = configuredEntityIds.find(id => id.includes('light'));
          if (lightEntity) {
            console.log('🎭 Simulating light state change');
            dispatch({ 
              type: 'SIMULATE_STATE_CHANGE', 
              payload: { 
                entityId: lightEntity, 
                newState: 'on',
                attributes: { brightness: 200, rgb_color: [255, 100, 100] }
              } 
            });
          }
        }, 12000);
      };

      // Start simulation
      simulateUpdates();
    }

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
    const device = state.devices.find(device => device.entity_id === entityId);
    // Log for debugging - but only when device state actually changes
    if (device) {
      console.log(`🔍 getDevice(${entityId}): Found device with state:`, device.state);
    }
    return device;
  };

  const getDevicesByRoom = (roomName: string): Device[] => {
    return state.devices.filter(device => device.room === roomName);
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
    
    console.log(`🏠 Room ${roomName} devices:`, {
      lights: result.lights.length,
      sensors: result.sensors.length,
      binarySensors: result.binarySensors.length,
      total: roomDevices.length
    });
    
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

  const simulateStateChange = (entityId: string, newState: any, attributes?: any) => {
    console.log('🎭 Manual simulation:', { entityId, newState, attributes });
    dispatch({ 
      type: 'SIMULATE_STATE_CHANGE', 
      payload: { entityId, newState, attributes } 
    });
  };

  const forceUpdate = () => {
    console.log('🔄 Force updating UI...');
    dispatch({ type: 'FORCE_UPDATE' });
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
    controlAlarm,
    simulateStateChange,
    forceUpdate
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