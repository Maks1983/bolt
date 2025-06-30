/**
 * Device Type Definitions for Home Assistant Integration
 * 
 * These types define the structure for all device entities that will be
 * received from and sent to the Home Assistant backend via socket.io
 */

export interface BaseDevice {
  entity_id: string;
  friendly_name: string;
  device_type: string;
  area_id?: string;
  room?: string;
  floor?: string;
  last_updated: string;
  available: boolean;
}

export interface LightDevice extends BaseDevice {
  device_type: 'light';
  state: 'on' | 'off';
  brightness?: number; // 0-255
  color_temp?: number; // Kelvin
  rgb_color?: [number, number, number]; // RGB values 0-255
  xy_color?: [number, number]; // CIE xy color space
  color_mode?: 'brightness' | 'color_temp' | 'rgb' | 'xy';
  supported_color_modes?: string[];
  effect?: string;
  effect_list?: string[];
}

export interface BlindDevice extends BaseDevice {
  device_type: 'cover';
  state: 'open' | 'closed' | 'opening' | 'closing';
  position?: number; // 0-100 (0 = closed, 100 = open)
  tilt_position?: number; // 0-100
  supported_features?: string[];
}

export interface MediaPlayerDevice extends BaseDevice {
  device_type: 'media_player';
  state: 'playing' | 'paused' | 'idle' | 'off';
  volume_level?: number; // 0.0-1.0
  is_volume_muted?: boolean;
  media_title?: string;
  media_artist?: string;
  media_album_name?: string;
  media_duration?: number;
  media_position?: number;
  source?: string;
  source_list?: string[];
  sound_mode?: string;
  sound_mode_list?: string[];
}

export interface SensorDevice extends BaseDevice {
  device_type: 'sensor';
  state: string | number;
  unit_of_measurement?: string;
  device_class?: 'temperature' | 'humidity' | 'battery' | 'illuminance' | 'pressure';
  sensor_type?: 'temperature' | 'humidity' | 'window' | 'door' | 'flood' | 'smoke' | 'motion';
}

export interface BinarySensorDevice extends BaseDevice {
  device_type: 'binary_sensor';
  state: 'on' | 'off';
  device_class?: 'door' | 'window' | 'motion' | 'smoke' | 'moisture' | 'occupancy';
  sensor_type?: 'window' | 'door' | 'flood' | 'smoke' | 'motion' | 'presence';
}

export interface LockDevice extends BaseDevice {
  device_type: 'lock';
  state: 'locked' | 'unlocked' | 'locking' | 'unlocking';
  code_format?: string;
  changed_by?: string;
}

export interface CameraDevice extends BaseDevice {
  device_type: 'camera';
  state: 'recording' | 'streaming' | 'idle';
  entity_picture?: string;
  brand?: string;
  model?: string;
  motion_detection?: boolean;
  night_vision?: boolean;
}

export interface FanDevice extends BaseDevice {
  device_type: 'fan';
  state: 'on' | 'off';
  speed?: string;
  speed_list?: string[];
  percentage?: number; // 0-100
  preset_mode?: string;
  preset_modes?: string[];
  oscillating?: boolean;
  direction?: 'forward' | 'reverse';
}

export interface ClimateDevice extends BaseDevice {
  device_type: 'climate';
  state: 'heat' | 'cool' | 'auto' | 'off' | 'heat_cool' | 'fan_only' | 'dry';
  current_temperature?: number;
  target_temperature?: number;
  target_temp_high?: number;
  target_temp_low?: number;
  current_humidity?: number;
  target_humidity?: number;
  hvac_modes?: string[];
  fan_mode?: string;
  fan_modes?: string[];
  swing_mode?: string;
  swing_modes?: string[];
  preset_mode?: string;
  preset_modes?: string[];
}

export interface AlarmControlPanelDevice extends BaseDevice {
  device_type: 'alarm_control_panel';
  state: 'disarmed' | 'armed_home' | 'armed_away' | 'armed_night' | 'armed_vacation' | 'pending' | 'triggered';
  code_format?: string;
  changed_by?: string;
  supported_features?: string[];
}

export type Device = 
  | LightDevice 
  | BlindDevice 
  | MediaPlayerDevice 
  | SensorDevice 
  | BinarySensorDevice 
  | LockDevice 
  | CameraDevice 
  | FanDevice 
  | ClimateDevice
  | AlarmControlPanelDevice;

export interface Room {
  id: string;
  name: string;
  floor: string;
  area_id?: string;
  background_image?: string;
  devices: Device[];
}

export interface Floor {
  id: string;
  name: string;
  rooms: Room[];
}

// Socket.io event types
export interface EntityUpdateEvent {
  entity_id: string;
  state: any;
  attributes?: Record<string, any>;
  last_updated: string;
}

export interface DeviceControlCommand {
  entity_id: string;
  service: string;
  service_data?: Record<string, any>;
}

// Connection states
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface ConnectionStatus {
  state: ConnectionState;
  error?: string;
  lastConnected?: Date;
  reconnectAttempts?: number;
}