/**
 * Device Helper Utilities
 * 
 * Utility functions for device data processing and calculations
 */

import { Device, Room, LightDevice, SensorDevice, BinarySensorDevice } from '../types/devices';

/**
 * Format temperature value to always show one decimal place in Celsius
 */
export const formatTemperature = (value: number | string): string => {
  const temp = typeof value === 'string' ? parseFloat(value) : value;
  return `${temp.toFixed(1)}°C`;
};

/**
 * Format humidity value to show integer percentage
 */
export const formatHumidity = (value: number | string): string => {
  const humidity = typeof value === 'string' ? parseFloat(value) : value;
  return `${Math.round(humidity)}%`;
};

/**
 * Calculate room statistics from devices
 */
export const calculateRoomStats = (devices: Device[]) => {
  const lights = devices.filter(d => d.device_type === 'light') as LightDevice[];
  const tempSensors = devices.filter(d => 
    d.device_type === 'sensor' && (d as SensorDevice).sensor_type === 'temperature'
  ) as SensorDevice[];
  const humiditySensors = devices.filter(d => 
    d.device_type === 'sensor' && (d as SensorDevice).sensor_type === 'humidity'
  ) as SensorDevice[];
  const motionSensors = devices.filter(d => 
    d.device_type === 'binary_sensor' && (d as BinarySensorDevice).sensor_type === 'motion'
  ) as BinarySensorDevice[];
  const windowSensors = devices.filter(d => 
    d.device_type === 'binary_sensor' && (d as BinarySensorDevice).sensor_type === 'window'
  ) as BinarySensorDevice[];

  return {
    lights: {
      on: lights.filter(l => l.state === 'on').length,
      total: lights.length
    },
    temperature: tempSensors.length > 0 ? Number(tempSensors[0].state) : 20,
    humidity: humiditySensors.length > 0 ? Number(humiditySensors[0].state) : 50,
    presence: motionSensors.some(s => s.state === 'on'),
    windowOpen: windowSensors.some(s => s.state === 'on')
  };
};

/**
 * Get device status color based on state
 */
export const getDeviceStatusColor = (device: Device): string => {
  switch (device.device_type) {
    case 'light':
      return device.state === 'on' ? 'text-yellow-500' : 'text-gray-400';
    case 'cover':
      return device.state === 'open' ? 'text-blue-500' : 'text-gray-400';
    case 'lock':
      return device.state === 'locked' ? 'text-red-500' : 'text-green-500';
    case 'binary_sensor':
      const binarySensor = device as BinarySensorDevice;
      if (binarySensor.sensor_type === 'smoke' || binarySensor.sensor_type === 'flood') {
        return device.state === 'on' ? 'text-red-500' : 'text-green-500';
      }
      return device.state === 'on' ? 'text-blue-500' : 'text-gray-400';
    default:
      return 'text-gray-400';
  }
};

/**
 * Format device state for display
 */
export const formatDeviceState = (device: Device): string => {
  switch (device.device_type) {
    case 'sensor':
      const sensor = device as SensorDevice;
      if (sensor.sensor_type === 'temperature') {
        return formatTemperature(sensor.state);
      }
      if (sensor.sensor_type === 'humidity') {
        return formatHumidity(sensor.state);
      }
      return `${sensor.state}${sensor.unit_of_measurement || ''}`;
    case 'binary_sensor':
      return device.state === 'on' ? 'Active' : 'Inactive';
    case 'light':
      const light = device as LightDevice;
      if (light.state === 'on' && light.brightness) {
        return `On (${Math.round((light.brightness / 255) * 100)}%)`;
      }
      return light.state === 'on' ? 'On' : 'Off';
    case 'cover':
      const cover = device as any;
      if (cover.position !== undefined) {
        return `${cover.position}% open`;
      }
      return device.state;
    default:
      return device.state.toString();
  }
};

/**
 * Check if device is online/available
 */
export const isDeviceOnline = (device: Device): boolean => {
  return device.available && 
         new Date().getTime() - new Date(device.last_updated).getTime() < 300000; // 5 minutes
};

/**
 * Get device type icon name (for Lucide React)
 */
export const getDeviceIcon = (device: Device): string => {
  switch (device.device_type) {
    case 'light':
      return 'Lightbulb';
    case 'cover':
      return device.friendly_name.toLowerCase().includes('curtain') ? 'Columns' : 'Blinds';
    case 'media_player':
      return 'Play';
    case 'sensor':
      const sensor = device as SensorDevice;
      switch (sensor.sensor_type) {
        case 'temperature':
          return 'Thermometer';
        case 'humidity':
          return 'Droplets';
        default:
          return 'Gauge';
      }
    case 'binary_sensor':
      const binarySensor = device as BinarySensorDevice;
      switch (binarySensor.sensor_type) {
        case 'motion':
          return 'User';
        case 'window':
          return 'Square';
        case 'door':
          return 'DoorOpen';
        case 'smoke':
          return 'Flame';
        case 'flood':
          return 'Waves';
        default:
          return 'Circle';
      }
    case 'lock':
      return 'Lock';
    case 'camera':
      return 'Camera';
    case 'fan':
      return 'Fan';
    case 'alarm_control_panel':
      return 'Shield';
    default:
      return 'Settings';
  }
};

/**
 * Group devices by type for easier rendering
 */
export const groupDevicesByType = (devices: Device[]) => {
  return devices.reduce((groups, device) => {
    const type = device.device_type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(device);
    return groups;
  }, {} as Record<string, Device[]>);
};

/**
 * Calculate average temperature across rooms
 */
export const calculateAverageTemperature = (rooms: Room[]): number => {
  const tempSensors = rooms.flatMap(room => 
    room.devices.filter(d => 
      d.device_type === 'sensor' && (d as SensorDevice).sensor_type === 'temperature'
    )
  ) as SensorDevice[];

  if (tempSensors.length === 0) return 20;

  const total = tempSensors.reduce((sum, sensor) => sum + Number(sensor.state), 0);
  return Math.round((total / tempSensors.length) * 10) / 10;
};

/**
 * Get rooms with alerts (smoke, flood, etc.)
 */
export const getRoomsWithAlerts = (rooms: Room[]): Room[] => {
  return rooms.filter(room => {
    const alertSensors = room.devices.filter(device => {
      if (device.device_type !== 'binary_sensor') return false;
      const sensor = device as BinarySensorDevice;
      return (sensor.sensor_type === 'smoke' || sensor.sensor_type === 'flood') && 
             device.state === 'on';
    });
    return alertSensors.length > 0;
  });
};
