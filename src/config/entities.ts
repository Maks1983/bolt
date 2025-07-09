/**
 * Entity Subscription Configuration
 * 
 * Define exactly which Home Assistant entities you want to monitor.
 * Only these entities will be subscribed to for real-time updates.
 * 
 * This approach is much more efficient than subscribing to all entities.
 */

export interface EntityConfig {
  entity_id: string;
  friendly_name: string;
  device_type: 'light' | 'cover' | 'media_player' | 'sensor' | 'binary_sensor' | 'fan' | 'lock' | 'camera' | 'alarm_control_panel' | 'device_tracker';
  room: string;
  floor: string;
  sensor_type?: 'temperature' | 'humidity' | 'motion' | 'door' | 'window' | 'flood' | 'smoke';
  // Optional: Override any specific attributes
  [key: string]: any;
}

/**
 * CONFIGURE YOUR ENTITIES HERE
 * 
 * Add your actual Home Assistant entity IDs below.
 * Only these entities will be monitored for real-time updates.
 */
export const subscribedEntities: EntityConfig[] = [
  // === DEVICE TRACKERS ===
  {
    entity_id: 'device_tracker.lima',
    friendly_name: 'Nelson',
    device_type: 'device_tracker',
    room: 'System',
    floor: 'System',
    state: 'home',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'device_tracker.kitty_phone',
    friendly_name: 'Claudia',
    device_type: 'device_tracker',
    room: 'System',
    floor: 'System',
    state: 'away',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'device_tracker.emaphone',
    friendly_name: 'Ema',
    device_type: 'device_tracker',
    room: 'System',
    floor: 'System',
    state: 'home',
    last_updated: new Date().toISOString(),
    available: true
  },

  // === BALCONY WEATHER SENSORS ===
  {
    entity_id: 'sensor.balcony_temperature_sensor_temperature',
    friendly_name: 'Balcony Temperature',
    device_type: 'sensor',
    room: 'Balcony',
    floor: 'System',
    state: 18,
    unit_of_measurement: '°C',
    device_class: 'temperature',
    sensor_type: 'temperature',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sensor.balcony_temperature_sensor_humidity',
    friendly_name: 'Balcony Humidity',
    device_type: 'sensor',
    room: 'Balcony',
    floor: 'System',
    state: 65,
    unit_of_measurement: '%',
    device_class: 'humidity',
    sensor_type: 'humidity',
    last_updated: new Date().toISOString(),
    available: true
  },

  // === WEATHER AND SUN ENTITIES ===
  {
    entity_id: 'weather.forecast_home',
    friendly_name: 'Weather Forecast',
    device_type: 'weather',
    room: 'System',
    floor: 'System',
    state: 'partlycloudy', // Try: sunny, partlycloudy, cloudy, rainy, snowy, windy, fog, thunderstorm
    temperature: 18,
    humidity: 65,
    condition: 'partlycloudy',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'sun.sun',
    friendly_name: 'Sun',
    device_type: 'sun',
    room: 'System',
    floor: 'System',
    state: 'above_horizon', // Try: above_horizon, below_horizon
    elevation: 45,
    azimuth: 180,
    last_updated: new Date().toISOString(),
    available: true
  },
  
  // === LIGHTS ===
  {
    entity_id: 'light.bathroom_light_switch_switch',
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
    entity_id: 'light.kitchen_light_switch_switch_2',
    friendly_name: 'Kitchen Balcony Light',
    device_type: 'light',
    room: 'Kitchen',
    floor: 'Upper Floor',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'light.kitchen_light_switch_switch',
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
    entity_id: 'light.kitchen_led_ceiling_light',
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
    entity_id: 'light.living_room_light_switch_switch_2',
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
    entity_id: 'light.living_room_led_ceiling_light',
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
    entity_id: 'light.living_room_light_switch_switch',
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
    entity_id: 'light.entrance_light_switch_switch',
    friendly_name: 'Entrance Light Switch',
    device_type: 'light',
    room: 'Entrance',
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

  // === SENSORS ===
  {
    entity_id: 'sensor.master_bedroom_temperature_sensor_temperature',
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
    entity_id: 'sensor.bathroom_temperature_sensor_temperature',
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
    entity_id: 'sensor.bedroom_temperature_sensor_temperature',
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
    entity_id: 'sensor.kitchen_temperature_sensor_temperature',
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
    entity_id: 'sensor.living_room_temperature_sensor_temperature',
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
    entity_id: 'sensor.entrance_temperature_sensor_temperature',
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
    entity_id: 'sensor.office_temperature_sensor_temperature',
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
    entity_id: 'sensor.laundry_temperature_sensor_temperature',
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
  {
    entity_id: 'sensor.master_bedroom_temperature_sensor_humidity',
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
    entity_id: 'sensor.bathroom_temperature_sensor_humidity',
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
    entity_id: 'sensor.bedroom_temperature_sensor_humidity',
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
    entity_id: 'sensor.kitchen_temperature_sensor_humidity',
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
    entity_id: 'sensor.living_room_temperature_sensor_humidity',
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
    entity_id: 'sensor.entrance_temperature_sensor_humidity',
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
    entity_id: 'sensor.office_temperature_sensor_humidity',
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
    entity_id: 'sensor.laundry_temperature_sensor_humidity',
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

  // === BINARY SENSORS (DOORS/WINDOWS/MOTION) ===
  {
    entity_id: 'binary_sensor.master_bedroom_window_sensor_opening',
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
    entity_id: 'binary_sensor.bathroom_window_sensor_opening',
    friendly_name: 'Bathroom Window',
    device_type: 'binary_sensor',
    room: 'Bathroom',
    floor: 'Upper Floor',
    state: 'off',
    device_class: 'window',
    sensor_type: 'window',
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'binary_sensor.bedroom_window_sensor_opening',
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
    entity_id: 'binary_sensor.kitchen_window_sensor_1_opening',
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
    entity_id: 'binary_sensor.kitchen_window_sensor_2_opening',
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
    entity_id: 'binary_sensor.kitchen_window_3_sensor_opening',
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
    entity_id: 'binary_sensor.kitchen_window_4_sensor_opening',
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
    entity_id: 'binary_sensor.living_room_door_sensor_opening',
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
    entity_id: 'binary_sensor.entrance_door_sensor_opening',
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

  // === COVERS (BLINDS/CURTAINS) ===
  {
    entity_id: 'cover.master_bedroom_blind_cover',
    friendly_name: 'Master Bedroom Smart Blind',
    device_type: 'cover',
    room: 'Master Bedroom',
    floor: 'Upper Floor',
    state: 'open',
    position: 50,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'cover.bedroom_blind_cover',
    friendly_name: 'Bedroom Smart Blind',
    device_type: 'cover',
    room: 'Bedroom',
    floor: 'Upper Floor',
    state: 'open',
    position: 50,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'cover.kitchen_blind_1_cover',
    friendly_name: 'Kitchen Cover 1',
    device_type: 'cover',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'open',
    position: 50,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'cover.kitchen_blind_2_cover',
    friendly_name: 'Kitchen Cover 2',
    device_type: 'cover',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'open',
    position: 50,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'cover.dining_room_blind_1_cover',
    friendly_name: 'Kitchen Cover 3',
    device_type: 'cover',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'open',
    position: 50,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'cover.dining_room_blind_2_cover',
    friendly_name: 'Kitchen Cover 4',
    device_type: 'cover',
    room: 'Kitchen',
    floor: 'Upper Floor',
    state: 'open',
    position: 50,
    supported_features: ['open', 'close', 'set_position'],
    last_updated: new Date().toISOString(),
    available: true
  },
  {
    entity_id: 'cover.curtain_living_room_room',
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

  // === MEDIA PLAYERS ===
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

  // Flood Sensors
  {
    entity_id: 'binary_sensor.bathroom_water_leak_moisture',
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
    entity_id: 'binary_sensor.kitchen_water_leak_sensor_moisture',
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
    entity_id: 'binary_sensor.laundry_water_leak_moisture',
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
    entity_id: 'binary_sensor.lumi_lumi_sensor_wleak_aq1_moisture',
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
    entity_id: 'binary_sensor.kitchen_smoke_detector_smoke',
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
    entity_id: 'binary_sensor.living_room_smoke_detector_smoke',
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
    entity_id: 'binary_sensor.entrance_smoke_detector_smoke',
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

    // === FANS ===
  {
    entity_id: 'fan.bathroom_light_switch_switch',
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

  // === LOCKS ===
  {
    entity_id: 'lock.lock_ultra_910e',
    friendly_name: 'Entrance Smart Lock',
    device_type: 'lock',
    room: 'Entrance',
    floor: 'Lower Floor',
    state: 'locked',
    code_format: '^\\d{4,6}$',
    last_updated: new Date().toISOString(),
    available: true
  },

  // === CAMERAS ===
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
    entity_id: 'camera.g5_turret_ultra_high_resolution_channel',
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

  // === ALARM SYSTEM ===
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

  // ADD MORE ENTITIES HERE AS NEEDED
  // Copy the pattern above for each entity you want to monitor
];

/**
 * Get entity IDs for subscription
 */
export const getSubscribedEntityIds = (): string[] => {
  return subscribedEntities.map(entity => entity.entity_id);
};

/**
 * Get entity configuration by ID
 */
export const getEntityConfig = (entityId: string): EntityConfig | undefined => {
  return subscribedEntities.find(entity => entity.entity_id === entityId);
};

/**
 * Get entities by room
 */
export const getEntitiesByRoom = (roomName: string): EntityConfig[] => {
  return subscribedEntities.filter(entity => entity.room === roomName);
};

/**
 * Get entities by type
 */
export const getEntitiesByType = (deviceType: string): EntityConfig[] => {
  return subscribedEntities.filter(entity => entity.device_type === deviceType);
};

/**
 * Validate entity configuration
 */
export const validateEntityConfig = (): { valid: EntityConfig[], invalid: any[] } => {
  const valid: EntityConfig[] = [];
  const invalid: any[] = [];

  subscribedEntities.forEach(entity => {
    if (!entity.entity_id || !entity.device_type || !entity.room || !entity.floor) {
      invalid.push({
        entity,
        reason: 'Missing required fields: entity_id, device_type, room, floor'
      });
    } else {
      valid.push(entity);
    }
  });

  return { valid, invalid };
};