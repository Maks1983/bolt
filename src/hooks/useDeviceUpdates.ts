/**
 * Custom Hook for Device Updates
 * 
 * Provides real-time device state updates and control methods
 */

import { useEffect, useCallback, useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { Device, EntityUpdateEvent } from '../types/devices';
import { socketService } from '../services/socketService';

export const useDeviceUpdates = (entityId?: string) => {
  const { state, getDevice, updateDevice } = useDevices();

  const device = entityId ? getDevice(entityId) : undefined;

  // Subscribe to specific device updates
  useEffect(() => {
    if (!entityId) return;

    // This would be handled by the WebSocket service in a real implementation
    // For now, we'll just ensure the device exists in our state
    const currentDevice = getDevice(entityId);
    if (!currentDevice) {
      console.warn(`Device ${entityId} not found in state`);
    }
  }, [entityId, getDevice]);

  // Optimistic update helper
  const optimisticUpdate = useCallback((updates: Partial<Device>) => {
    if (entityId) {
      updateDevice(entityId, updates);
    }
  }, [entityId, updateDevice]);

  return {
    device,
    devices: state.devices,
    connectionState: state.connectionState,
    lastUpdate: state.lastUpdate,
    optimisticUpdate
  };
};

/**
 * Hook for real-time device state updates
 * This hook directly listens to WebSocket events for a specific device
 */
export const useRealtimeDevice = (entityId: string) => {
  const { getDevice, state } = useDevices();
  const [deviceState, setDeviceState] = useState(() => getDevice(entityId));

  useEffect(() => {
    // Update local state when context changes
    const currentDevice = getDevice(entityId);
    setDeviceState(currentDevice);
  }, [entityId, getDevice, state.lastUpdate]); // Added state.lastUpdate as dependency

  useEffect(() => {
    if (!entityId) return;

    const handleEntityUpdate = (update: EntityUpdateEvent) => {
      if (update.entity_id === entityId) {
        console.log(`🔄 Real-time update for ${entityId}:`, update);
        
        // Update local state immediately
        setDeviceState(prevDevice => {
          if (!prevDevice) return prevDevice;
          
          // Map attributes to device properties based on device type
          const attributeUpdates = mapAttributesToDevice(prevDevice.device_type, update.attributes);
          
          return {
            ...prevDevice,
            state: update.state,
            ...attributeUpdates,
            last_updated: update.last_updated || new Date().toISOString()
          };
        });
      }
    };

    // Listen directly to WebSocket events
    socketService.onEntityUpdated(handleEntityUpdate);

    return () => {
      // Note: In a real implementation, we'd need a way to remove specific listeners
      // For now, this is handled by the service's internal cleanup
    };
  }, [entityId]);

  return deviceState;
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

/**
 * Hook for room-specific device management with real-time updates
 */
export const useRoomDevices = (roomName: string) => {
  const { getRoomDevices, state } = useDevices();
  const [roomDevices, setRoomDevices] = useState(() => getRoomDevices(roomName));

  // Update room devices when context changes
  useEffect(() => {
    const currentRoomDevices = getRoomDevices(roomName);
    setRoomDevices(currentRoomDevices);
  }, [roomName, getRoomDevices, state.lastUpdate, state.devices]); // Added state.devices as dependency

  // Listen for real-time updates to any device in this room
  useEffect(() => {
    const handleEntityUpdate = (update: EntityUpdateEvent) => {
      // Check if this update affects any device in this room
      const currentRoomDevices = getRoomDevices(roomName);
      const affectedDevice = Object.values(currentRoomDevices)
        .flat()
        .find(device => device.entity_id === update.entity_id);

      if (affectedDevice) {
        console.log(`🏠 Room ${roomName} device update:`, update);
        // Trigger re-calculation of room devices
        setRoomDevices(getRoomDevices(roomName));
      }
    };

    socketService.onEntityUpdated(handleEntityUpdate);

    return () => {
      // Cleanup handled by service
    };
  }, [roomName, getRoomDevices]);

  // Calculate room statistics
  const roomStats = {
    totalDevices: Object.values(roomDevices).flat().length,
    onlineDevices: Object.values(roomDevices).flat().filter(d => d.available).length,
    lightsOn: roomDevices.lights.filter(l => l.state === 'on').length,
    totalLights: roomDevices.lights.length,
    hasAlerts: roomDevices.binarySensors.some(s => 
      ((s as any).sensor_type === 'smoke' || (s as any).sensor_type === 'flood') && 
      s.state === 'on'
    )
  };

  return {
    ...roomDevices,
    roomStats,
    connectionState: state.connectionState
  };
};

/**
 * Hook for device control with error handling
 */
export const useDeviceControl = () => {
  const { 
    controlLight, 
    controlCover, 
    controlMediaPlayer, 
    controlFan, 
    controlLock, 
    controlAlarm,
    state 
  } = useDevices();

  const safeControlLight = useCallback(async (
    entityId: string, 
    on: boolean, 
    brightness?: number, 
    rgbColor?: [number, number, number]
  ) => {
    try {
      controlLight(entityId, on, brightness, rgbColor);
    } catch (error) {
      console.error('Failed to control light:', error);
      // Could show toast notification here
    }
  }, [controlLight]);

  const safeControlCover = useCallback(async (
    entityId: string, 
    action: 'open' | 'close' | 'set_position', 
    position?: number
  ) => {
    try {
      controlCover(entityId, action, position);
    } catch (error) {
      console.error('Failed to control cover:', error);
    }
  }, [controlCover]);

  const safeControlMediaPlayer = useCallback(async (
    entityId: string, 
    action: 'play' | 'pause' | 'volume', 
    volume?: number
  ) => {
    try {
      controlMediaPlayer(entityId, action, volume);
    } catch (error) {
      console.error('Failed to control media player:', error);
    }
  }, [controlMediaPlayer]);

  const safeControlFan = useCallback(async (
    entityId: string, 
    on: boolean, 
    percentage?: number
  ) => {
    try {
      controlFan(entityId, on, percentage);
    } catch (error) {
      console.error('Failed to control fan:', error);
    }
  }, [controlFan]);

  const safeControlLock = useCallback(async (
    entityId: string, 
    action: 'lock' | 'unlock', 
    code?: string
  ) => {
    try {
      controlLock(entityId, action, code);
    } catch (error) {
      console.error('Failed to control lock:', error);
    }
  }, [controlLock]);

  const safeControlAlarm = useCallback(async (
    entityId: string, 
    action: 'arm_home' | 'arm_away' | 'disarm', 
    code?: string
  ) => {
    try {
      controlAlarm(entityId, action, code);
    } catch (error) {
      console.error('Failed to control alarm:', error);
    }
  }, [controlAlarm]);

  return {
    controlLight: safeControlLight,
    controlCover: safeControlCover,
    controlMediaPlayer: safeControlMediaPlayer,
    controlFan: safeControlFan,
    controlLock: safeControlLock,
    controlAlarm: safeControlAlarm,
    isConnected: state.connectionState === 'connected'
  };
};