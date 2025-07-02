/**
 * Device Configuration
 * 
 * This file contains device configurations that define:
 * 1. Which devices to subscribe to from Home Assistant
 * 2. Room and floor assignments for each device
 * 3. Device-specific settings and overrides
 * 
 * To add a new device:
 * 1. Add its entity_id to the subscribedDevices array
 * 2. Add its configuration to deviceConfigs with room/floor assignment
 * 3. The system will automatically subscribe to updates for that device
 */

import { Device, Room, Floor } from '../types/devices';

/**
 * IMPORTANT: Only devices listed here will be subscribed to from Home Assistant
 * This prevents unnecessary WebSocket traffic and improves performance
 */
export const subscribedDevices = [
  // Lights
  'light.master_bedroom_main',
  'light.kitchen_main',
  'light.kitchen_counter',
  'light.kitchen_led_strip',
  'light.living_room_main',
  'light.living_room_led_strip',
  'light.living_room_balcony',
  'light.bathroom_main',
  'light.laundry_main',
  'light.lightswitch_laundry_switch',

  // Covers/Blinds
  'cover.master_bedroom_blind',
  'cover.bedroom_blind',
  'cover.kitchen_blind_1',
  'cover.kitchen_blind_2',
  'cover.kitchen_blind_3',
  'cover.kitchen_blind_4',
  'cover.living_room_curtain',

  // Media Players
  'media_player.master_bedroom_speaker',
  'media_player.bedroom_speaker',
  'media_player.bathroom_speaker',
  'media_player.living_room_speaker',
  'media_player.office_speaker',

  // Temperature Sensors
  'sensor.master_bedroom_temperature',
  'sensor.bedroom_temperature',
  'sensor.bathroom_temperature',
  'sensor.kitchen_temperature',
  'sensor.living_room_temperature',
  'sensor.entrance_temperature',
  'sensor.office_temperature',
  'sensor.laundry_temperature',

  // Humidity Sensors
  'sensor.master_bedroom_humidity',
  'sensor.bedroom_humidity',
  'sensor.bathroom_humidity',
  'sensor.kitchen_humidity',
  'sensor.living_room_humidity',
  'sensor.entrance_humidity',
  'sensor.office_humidity',
  'sensor.laundry_humidity',

  // Binary Sensors (Windows, Doors, Motion, etc.)
  'binary_sensor.master_bedroom_window',
  'binary_sensor.bedroom_window',
  'binary_sensor.kitchen_window_1',
  'binary_sensor.kitchen_window_2',
  'binary_sensor.kitchen_window_3',
  'binary_sensor.kitchen_window_4',
  'binary_sensor.living_room_window',
  'binary_sensor.entrance_door',
  'binary_sensor.office_window',
  'binary_sensor.lumi_lumi_sensor_magnet_aq2_opening', // Your actual door sensor

  // Motion Sensors
  'binary_sensor.master_bedroom_motion',
  'binary_sensor.bedroom_motion',
  'binary_sensor.bathroom_motion',
  'binary_sensor.kitchen_motion',
  'binary_sensor.living_room_motion',
  'binary_sensor.entrance_motion',
  'binary_sensor.office_motion',
  'binary_sensor.laundry_motion',

  // Safety Sensors
  'binary_sensor.bathroom_flood',
  'binary_sensor.kitchen_flood',
  'binary_sensor.laundry_flood_1',
  'binary_sensor.laundry_flood_2',
  'binary_sensor.kitchen_smoke',
  'binary_sensor.living_room_smoke',
  'binary_sensor.entrance_smoke',

  // Fans
  'fan.bathroom_exhaust',

  // Locks
  'lock.entrance_door',

  // Cameras
  'camera.front_yard',
  'camera.backyard',
  'camera.entrance_doorbell',

  // Alarm System
  'alarm_control_panel.home_security'
];

// Example device configurations - replace with your actual Home Assistant entities
export const deviceConfigs: Device[] = [
  // Lights
  {
    entity_id: 'light.master_bedroom_main',
    friendly_name: 'Master Bedroom Light',
    device_type: 'light',
    room: 'Master Bedroom',
    floor: 'Upper Floor',
    state: 'off',
    brightness: 255,
    color_mode: 'brightness',
    supported_color_modes: ['brightness'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'light.kitchen_main',
    friendly_name: 'Kitchen Light Switch',
    device_type: 'light',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'on',
    brightness: 255,
    color_mode: 'brightness',
    supported_color_modes: ['brightness'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'light.kitchen_counter',
    friendly_name: 'Kitchen Counter Switch',
    device_type: 'light',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'on',
    brightness: 255,
    color_mode: 'brightness',
    supported_color_modes: ['brightness'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'light.kitchen_led_strip',
    friendly_name: 'Kitchen LED Strip',
    device_type: 'light',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'off',
    brightness: 153,
    rgb_color: [255, 242, 204],
    color_mode: 'rgb',
    supported_color_modes: ['brightness', 'rgb'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'light.living_room_main',
    friendly_name: 'Living Room Light Switch',
    device_type: 'light',
    room: 'Living Room',
    floor: 'Upper Floor',
    state: 'on',
    brightness: 255,
    color_mode: 'brightness',
    supported_color_modes: ['brightness'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'light.living_room_led_strip',
    friendly_name: 'Living Room LED Strip',
    device_type: 'light',
    room: 'Living Room',
    floor: 'Upper Floor',
    state: 'on',
    brightness: 115,
    rgb_color: [204, 204, 255],
    color_mode: 'rgb',
    supported_color_modes: ['brightness', 'rgb'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'light.living_room_balcony',
    friendly_name: 'Balcony Switch',
    device_type: 'light',
    room: 'Living Room',
    floor: 'Upper Floor',
    state: 'off',
    brightness: 255,
    color_mode: 'brightness',
    supported_color_modes: ['brightness'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'light.bathroom_main',
    friendly_name: 'Bathroom Light Switch',
    device_type: 'light',
    room: 'Bathroom',
    floor: 'Upper Floor',
    state: 'on',
    brightness: 255,
    color_mode: 'brightness',
    supported_color_modes: ['brightness'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'light.laundry_main',
    friendly_name: 'Laundry Light Switch',
    device_type: 'light',
    room: 'Laundry',
    floor: 'Lower Floor',
    state: 'on',
    brightness: 255,
    color_mode: 'brightness',
    supported_color_modes: ['brightness'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'light.lightswitch_laundry_switch',
    friendly_name: 'Laundry Light Switch',
    device_type: 'light',
    room: 'Laundry',
    floor: 'Lower Floor',
    state: 'on',
    brightness: 255,
    color_mode: 'brightness',
    supported_color_modes: ['brightness'],
    last_updated: new Date().toISOString(),
    available: true
  },

  // Blinds/Covers
  {
    entity_id: 'cover.master_bedroom_blind',
    friendly_name: 'Master Bedroom Smart Blind',
    device_type: 'cover',
    room: 'Master Bedroom',
    floor: 'Upper Floor',
    state: 'open',
    position: 60,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'cover.bedroom_blind',
    friendly_name: 'Bedroom Smart Blind',
    device_type: 'cover',
    room: 'Bedroom',
    floor: 'Upper Floor',
    state: 'open',
    position: 85,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'cover.kitchen_blind_1',
    friendly_name: 'Kitchen Smart Blind 1',
    device_type: 'cover',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'open',
    position: 40,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'cover.kitchen_blind_2',
    friendly_name: 'Kitchen Smart Blind 2',
    device_type: 'cover',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'open',
    position: 40,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'cover.kitchen_blind_3',
    friendly_name: 'Kitchen Smart Blind 3',
    device_type: 'cover',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'open',
    position: 30,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'cover.kitchen_blind_4',
    friendly_name: 'Kitchen Smart Blind 4',
    device_type: 'cover',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'open',
    position: 30,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'cover.living_room_curtain',
    friendly_name: 'Living Room Smart Curtain',
    device_type: 'cover',
    room: 'Living Room',
    floor: 'Upper Floor',
    state: 'open',
    position: 70,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },

  // Media Players
  {
    entity_id: 'media_player.master_bedroom_speaker',
    friendly_name: 'Master Bedroom Speaker',
    device_type: 'media_player',
    room: 'Master Bedroom',
    floor: 'Upper Floor',
    state: 'paused',
    volume_level: 0.25,
    is_volume_muted: false,
    media_title: 'Sleep Sounds',
    source: 'Google Speaker',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'media_player.bedroom_speaker',
    friendly_name: 'Bedroom Speaker',
    device_type: 'media_player',
    room: 'Bedroom',
    floor: 'Upper Floor',
    state: 'playing',
    volume_level: 0.35,
    is_volume_muted: false,
    media_title: 'Study Music',
    source: 'Chromecast',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'media_player.bathroom_speaker',
    friendly_name: 'Bathroom Speaker',
    device_type: 'media_player',
    room: 'Bathroom',
    floor: 'Upper Floor',
    state: 'paused',
    volume_level: 0.40,
    is_volume_muted: false,
    media_title: 'Morning Playlist',
    source: 'Google Speaker',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'media_player.living_room_speaker',
    friendly_name: 'Living Room Speaker',
    device_type: 'media_player',
    room: 'Living Room',
    floor: 'Upper Floor',
    state: 'playing',
    volume_level: 0.55,
    is_volume_muted: false,
    media_title: 'Evening Jazz',
    source: 'Google Speaker',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'media_player.office_speaker',
    friendly_name: 'Office Speaker',
    device_type: 'media_player',
    room: 'Office',
    floor: 'Lower Floor',
    state: 'paused',
    volume_level: 0.30,
    is_volume_muted: false,
    media_title: 'Focus Sounds',
    source: 'Google Speaker',
    last_updated: new Date().toISOString(),
    available: true
  },

  // Temperature Sensors
  {
    entity_id: 'sensor.master_bedroom_temperature',
    friendly_name: 'Master Bedroom Temperature',
    device_type: 'sensor',
    room: 'Master Bedroom',
    floor: 'Upper Floor',
    state: 20,
    unit_of_measurement: '°C',
    device_class: 'temperature',
    sensor_type: 'temperature',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.bedroom_temperature',
    friendly_name: 'Bedroom Temperature',
    device_type: 'sensor',
    room: 'Bedroom',
    floor: 'Upper Floor',
    state: 21,
    unit_of_measurement: '°C',
    device_class: 'temperature',
    sensor_type: 'temperature',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.bathroom_temperature',
    friendly_name: 'Bathroom Temperature',
    device_type: 'sensor',
    room: 'Bathroom',
    floor: 'Upper Floor',
    state: 22,
    unit_of_measurement: '°C',
    device_class: 'temperature',
    sensor_type: 'temperature',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.kitchen_temperature',
    friendly_name: 'Kitchen Temperature',
    device_type: 'sensor',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 23,
    unit_of_measurement: '°C',
    device_class: 'temperature',
    sensor_type: 'temperature',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.living_room_temperature',
    friendly_name: 'Living Room Temperature',
    device_type: 'sensor',
    room: 'Living Room',
    floor: 'Upper Floor',
    state: 22,
    unit_of_measurement: '°C',
    device_class: 'temperature',
    sensor_type: 'temperature',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.entrance_temperature',
    friendly_name: 'Entrance Temperature',
    device_type: 'sensor',
    room: 'Entrance',
    floor: 'Lower Floor',
    state: 19,
    unit_of_measurement: '°C',
    device_class: 'temperature',
    sensor_type: 'temperature',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.office_temperature',
    friendly_name: 'Office Temperature',
    device_type: 'sensor',
    room: 'Office',
    floor: 'Lower Floor',
    state: 21,
    unit_of_measurement: '°C',
    device_class: 'temperature',
    sensor_type: 'temperature',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.laundry_temperature',
    friendly_name: 'Laundry Temperature',
    device_type: 'sensor',
    room: 'Laundry',
    floor: 'Lower Floor',
    state: 20,
    unit_of_measurement: '°C',
    device_class: 'temperature',
    sensor_type: 'temperature',
    last_updated: new Date().toISOString(),
    available: true
  },

  // Humidity Sensors
  {
    entity_id: 'sensor.master_bedroom_humidity',
    friendly_name: 'Master Bedroom Humidity',
    device_type: 'sensor',
    room: 'Master Bedroom',
    floor: 'Upper Floor',
    state: 45,
    unit_of_measurement: '%',
    device_class: 'humidity',
    sensor_type: 'humidity',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.bedroom_humidity',
    friendly_name: 'Bedroom Humidity',
    device_type: 'sensor',
    room: 'Bedroom',
    floor: 'Upper Floor',
    state: 50,
    unit_of_measurement: '%',
    device_class: 'humidity',
    sensor_type: 'humidity',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.bathroom_humidity',
    friendly_name: 'Bathroom Humidity',
    device_type: 'sensor',
    room: 'Bathroom',
    floor: 'Upper Floor',
    state: 65,
    unit_of_measurement: '%',
    device_class: 'humidity',
    sensor_type: 'humidity',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.kitchen_humidity',
    friendly_name: 'Kitchen Humidity',
    device_type: 'sensor',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 52,
    unit_of_measurement: '%',
    device_class: 'humidity',
    sensor_type: 'humidity',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.living_room_humidity',
    friendly_name: 'Living Room Humidity',
    device_type: 'sensor',
    room: 'Living Room',
    floor: 'Upper Floor',
    state: 48,
    unit_of_measurement: '%',
    device_class: 'humidity',
    sensor_type: 'humidity',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.entrance_humidity',
    friendly_name: 'Entrance Humidity',
    device_type: 'sensor',
    room: 'Entrance',
    floor: 'Lower Floor',
    state: 47,
    unit_of_measurement: '%',
    device_class: 'humidity',
    sensor_type: 'humidity',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.office_humidity',
    friendly_name: 'Office Humidity',
    device_type: 'sensor',
    room: 'Office',
    floor: 'Lower Floor',
    state: 44,
    unit_of_measurement: '%',
    device_class: 'humidity',
    sensor_type: 'humidity',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.laundry_humidity',
    friendly_name: 'Laundry Humidity',
    device_type: 'sensor',
    room: 'Laundry',
    floor: 'Lower Floor',
    state: 55,
    unit_of_measurement: '%',
    device_class: 'humidity',
    sensor_type: 'humidity',
    last_updated: new Date().toISOString(),
    available: true
  },

  // Binary Sensors (Windows, Doors, Motion, etc.)
  {
    entity_id: 'binary_sensor.master_bedroom_window',
    friendly_name: 'Master Bedroom Window',
    device_type: 'binary_sensor',
    room: 'Master Bedroom',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'window',
    sensor_type: 'window',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.bedroom_window',
    friendly_name: 'Bedroom Window',
    device_type: 'binary_sensor',
    room: 'Bedroom',
    floor: 'Upper Floor',
    state: 'on',
    device_class: 'window',
    sensor_type: 'window',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.kitchen_window_1',
    friendly_name: 'Kitchen Window 1',
    device_type: 'binary_sensor',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'window',
    sensor_type: 'window',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.kitchen_window_2',
    friendly_name: 'Kitchen Window 2',
    device_type: 'binary_sensor',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'window',
    sensor_type: 'window',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.kitchen_window_3',
    friendly_name: 'Kitchen Window 3',
    device_type: 'binary_sensor',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'window',
    sensor_type: 'window',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.kitchen_window_4',
    friendly_name: 'Kitchen Window 4',
    device_type: 'binary_sensor',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'window',
    sensor_type: 'window',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.living_room_window',
    friendly_name: 'Living Room Window',
    device_type: 'binary_sensor',
    room: 'Living Room',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'window',
    sensor_type: 'window',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.entrance_door',
    friendly_name: 'Entrance Door',
    device_type: 'binary_sensor',
    room: 'Entrance',
    floor: 'Lower Floor',
    state: 'off',
    device_class: 'door',
    sensor_type: 'door',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.office_window',
    friendly_name: 'Office Window',
    device_type: 'binary_sensor',
    room: 'Office',
    floor: 'Lower Floor',
    state: 'on',
    device_class: 'window',
    sensor_type: 'window',
    last_updated: new Date().toISOString(),
    available: true
  },

  // Example of your actual door sensor
  {
    entity_id: 'binary_sensor.lumi_lumi_sensor_magnet_aq2_opening',
    friendly_name: 'Door Sensor',
    device_type: 'binary_sensor',
    room: 'Entrance', // Adjust room as needed
    floor: 'Lower Floor',
    state: 'off',
    device_class: 'opening',
    sensor_type: 'door', // Will be auto-detected by the service
    last_updated: new Date().toISOString(),
    available: true
  },

  // Motion/Presence Sensors
  {
    entity_id: 'binary_sensor.master_bedroom_motion',
    friendly_name: 'Master Bedroom Motion',
    device_type: 'binary_sensor',
    room: 'Master Bedroom',
    floor: 'Upper Floor',
    state: 'on',
    device_class: 'motion',
    sensor_type: 'motion',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.bedroom_motion',
    friendly_name: 'Bedroom Motion',
    device_type: 'binary_sensor',
    room: 'Bedroom',
    floor: 'Upper Floor',
    state: 'on',
    device_class: 'motion',
    sensor_type: 'motion',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.bathroom_motion',
    friendly_name: 'Bathroom Motion',
    device_type: 'binary_sensor',
    room: 'Bathroom',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'motion',
    sensor_type: 'motion',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.kitchen_motion',
    friendly_name: 'Kitchen Motion',
    device_type: 'binary_sensor',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'motion',
    sensor_type: 'motion',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.living_room_motion',
    friendly_name: 'Living Room Motion',
    device_type: 'binary_sensor',
    room: 'Living Room',
    floor: 'Upper Floor',
    state: 'on',
    device_class: 'motion',
    sensor_type: 'motion',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.entrance_motion',
    friendly_name: 'Entrance Motion',
    device_type: 'binary_sensor',
    room: 'Entrance',
    floor: 'Lower Floor',
    state: 'off',
    device_class: 'motion',
    sensor_type: 'motion',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.office_motion',
    friendly_name: 'Office Motion',
    device_type: 'binary_sensor',
    room: 'Office',
    floor: 'Lower Floor',
    state: 'off',
    device_class: 'motion',
    sensor_type: 'motion',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.laundry_motion',
    friendly_name: 'Laundry Motion',
    device_type: 'binary_sensor',
    room: 'Laundry',
    floor: 'Lower Floor',
    state: 'off',
    device_class: 'motion',
    sensor_type: 'motion',
    last_updated: new Date().toISOString(),
    available: true
  },

  // Flood Sensors
  {
    entity_id: 'binary_sensor.bathroom_flood',
    friendly_name: 'Bathroom Flood Sensor',
    device_type: 'binary_sensor',
    room: 'Bathroom',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'moisture',
    sensor_type: 'flood',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.kitchen_flood',
    friendly_name: 'Kitchen Flood Sensor',
    device_type: 'binary_sensor',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'moisture',
    sensor_type: 'flood',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.laundry_flood_1',
    friendly_name: 'Laundry Flood Sensor 1',
    device_type: 'binary_sensor',
    room: 'Laundry',
    floor: 'Lower Floor',
    state: 'off',
    device_class: 'moisture',
    sensor_type: 'flood',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.laundry_flood_2',
    friendly_name: 'Laundry Flood Sensor 2',
    device_type: 'binary_sensor',
    room: 'Laundry',
    floor: 'Lower Floor',
    state: 'off',
    device_class: 'moisture',
    sensor_type: 'flood',
    last_updated: new Date().toISOString(),
    available: true
  },

  // Smoke Sensors
  {
    entity_id: 'binary_sensor.kitchen_smoke',
    friendly_name: 'Kitchen Smoke Detector',
    device_type: 'binary_sensor',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'smoke',
    sensor_type: 'smoke',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.living_room_smoke',
    friendly_name: 'Living Room Smoke Detector',
    device_type: 'binary_sensor',
    room: 'Living Room',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'smoke',
    sensor_type: 'smoke',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.entrance_smoke',
    friendly_name: 'Entrance Smoke Detector',
    device_type: 'binary_sensor',
    room: 'Entrance',
    floor: 'Lower Floor',
    state: 'off',
    device_class: 'smoke',
    sensor_type: 'smoke',
    last_updated: new Date().toISOString(),
    available: true
  },

  // Fans
  {
    entity_id: 'fan.bathroom_exhaust',
    friendly_name: 'Bathroom Exhaust Fan',
    device_type: 'fan',
    room: 'Bathroom',
    floor: 'Upper Floor',
    state: 'off',
    percentage: 0,
    preset_modes: ['low', 'medium', 'high'],
    last_updated: new Date().toISOString(),
    available: true
  },

  // Locks
  {
    entity_id: 'lock.entrance_door',
    friendly_name: 'Entrance Smart Lock',
    device_type: 'lock',
    room: 'Entrance',
    floor: 'Lower Floor',
    state: 'locked',
    code_format: '^\\d{4,6}$',
    last_updated: new Date().toISOString(),
    available: true
  },

  // Cameras
  {
    entity_id: 'camera.front_yard',
    friendly_name: 'Front Yard Camera',
    device_type: 'camera',
    room: 'Front Yard',
    floor: 'Exterior',
    state: 'recording',
    motion_detection: true,
    night_vision: true,
    entity_picture: '/api/camera_proxy/camera.front_yard',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'camera.backyard',
    friendly_name: 'Backyard Camera',
    device_type: 'camera',
    room: 'Backyard',
    floor: 'Exterior',
    state: 'recording',
    motion_detection: true,
    night_vision: false,
    entity_picture: '/api/camera_proxy/camera.backyard',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'camera.entrance_doorbell',
    friendly_name: 'Entrance Doorbell Camera',
    device_type: 'camera',
    room: 'Entrance',
    floor: 'Lower Floor',
    state: 'streaming',
    motion_detection: true,
    night_vision: true,
    entity_picture: '/api/camera_proxy/camera.entrance_doorbell',
    last_updated: new Date().toISOString(),
    available: true
  },

  // Alarm Control Panel
  {
    entity_id: 'alarm_control_panel.home_security',
    friendly_name: 'Home Security System',
    device_type: 'alarm_control_panel',
    room: 'Security',
    floor: 'System',
    state: 'disarmed',
    code_format: '^\\d{4}$',
    supported_features: ['arm_home', 'arm_away', 'arm_night', 'disarm'],
    last_updated: new Date().toISOString(),
    available: true
  }
];

// Room configurations with background images
export const roomConfigs: Room[] = [
  {
    id: 'master_bedroom',
    name: 'Master Bedroom',
    floor: 'Upper Floor',
    background_image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: deviceConfigs.filter(d => d.room === 'Master Bedroom')
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    floor: 'Upper Floor',
    background_image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: deviceConfigs.filter(d => d.room === 'Bedroom')
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    floor: 'Upper Floor',
    background_image: 'https://images.pexels.com/photos/342800/pexels-photo-342800.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: deviceConfigs.filter(d => d.room === 'Bathroom')
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    floor: 'Upper Floor',
    background_image: 'https://images.pexels.com/photos/279648/pexels-photo-279648.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: deviceConfigs.filter(d => d.room === 'Kitchen')
  },
  {
    id: 'living_room',
    name: 'Living Room',
    floor: 'Upper Floor',
    background_image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: deviceConfigs.filter(d => d.room === 'Living Room')
  },
  {
    id: 'entrance',
    name: 'Entrance',
    floor: 'Lower Floor',
    background_image: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: deviceConfigs.filter(d => d.room === 'Entrance')
  },
  {
    id: 'office',
    name: 'Office',
    floor: 'Lower Floor',
    background_image: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: deviceConfigs.filter(d => d.room === 'Office')
  },
  {
    id: 'laundry',
    name: 'Laundry',
    floor: 'Lower Floor',
    background_image: 'https://images.pexels.com/photos/4107123/pexels-photo-4107123.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: deviceConfigs.filter(d => d.room === 'Laundry')
  }
];

// Floor configurations
export const floorConfigs: Floor[] = [
  {
    id: 'upper_floor',
    name: 'Upper Floor',
    rooms: roomConfigs.filter(r => r.floor === 'Upper Floor')
  },
  {
    id: 'lower_floor',
    name: 'Lower Floor',
    rooms: roomConfigs.filter(r => r.floor === 'Lower Floor')
  }
];

// Camera configurations for exterior monitoring
export const cameraConfigs = [
  {
    id: 1,
    name: 'Front Yard Camera',
    location: 'Front Yard',
    entity_id: 'camera.front_yard',
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
    entity_id: 'camera.backyard',
    recording: true,
    nightVision: false,
    temperature: 16,
    humidity: 58,
    backgroundImage: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];