/**
 * Custom Hook for Device Updates
 * 
 * Provides real-time device state updates and control methods
 */

import { useEffect, useCallback, useMemo, useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { Device } from '../types/devices';

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
 * CRITICAL FIX: Use useMemo to ensure React detects changes properly
 */
export const useRealtimeDevice = (entityId: string) => {
  const { state } = useDevices();

  // Use useMemo with updateCounter as dependency to force re-renders
  const deviceState = useMemo(() => {
    const device = state.devices.find(d => d.entity_id === entityId);
    if (device) {
      console.log(`🔄 useRealtimeDevice: ${entityId} state=${device.state} counter=${state.updateCounter}`);
    }
    return device;
  }, [entityId, state.devices, state.updateCounter]);

  return deviceState;
};

/**
 * Hook for room-specific device management with real-time updates
 * CRITICAL FIX: Use useMemo to ensure React detects changes properly
 */
export const useRoomDevices = (roomName: string) => {
  const { state } = useDevices();

  // Use useMemo with updateCounter as dependency to force re-renders
  const roomDevices = useMemo(() => {
    const roomDevices = state.devices.filter(device => device.room === roomName);
    
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
    
    console.log(`🏠 useRoomDevices: ${roomName} lights=${result.lights.length} counter=${state.updateCounter}`);
    
    return result;
  }, [roomName, state.devices, state.updateCounter]);

  // Calculate room statistics
  const roomStats = useMemo(() => ({
    totalDevices: Object.values(roomDevices).flat().length,
    onlineDevices: Object.values(roomDevices).flat().filter(d => d.available).length,
    lightsOn: roomDevices.lights.filter(l => l.state === 'on').length,
    totalLights: roomDevices.lights.length,
    hasAlerts: roomDevices.binarySensors.some(s => 
      ((s as any).sensor_type === 'smoke' || (s as any).sensor_type === 'flood') && 
      s.state === 'on'
    )
  }), [roomDevices]);

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

/**
 * Hook for live timer functionality
 * Calculates how long a device has been in its current state
 */
export const useLiveTimer = (device: Device) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate time since last update
  const timeSinceUpdate = useMemo(() => {
    if (!device.last_updated) return null;
    
    const lastUpdate = new Date(device.last_updated);
    const diffMs = currentTime.getTime() - lastUpdate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours % 24}h ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes % 60}m ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ${diffSeconds % 60}s ago`;
    } else {
      return `${diffSeconds}s ago`;
    }
  }, [device.last_updated, currentTime]);

  // Calculate time in current state
  const timeInCurrentState = useMemo(() => {
    if (!device.last_updated) return null;
    
    const lastUpdate = new Date(device.last_updated);
    const diffMs = currentTime.getTime() - lastUpdate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours % 24}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes % 60}m`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ${diffSeconds % 60}s`;
    } else {
      return `${diffSeconds}s`;
    }
  }, [device.last_updated, currentTime]);

  // Format last updated timestamp
  const lastUpdatedFormatted = useMemo(() => {
    if (!device.last_updated) return 'Never';
    
    const lastUpdate = new Date(device.last_updated);
    return lastUpdate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }, [device.last_updated]);

  return {
    timeSinceUpdate,
    timeInCurrentState,
    lastUpdatedFormatted,
    isRecent: timeSinceUpdate ? timeSinceUpdate.includes('s ago') : false
  };
};