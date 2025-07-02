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
  device_type: 'light' | 'cover' | 'media_player' | 'sensor' | 'binary_sensor' | 'fan' | 'lock' | 'camera' | 'alarm_control_panel';
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
  // === LIGHTS ===
  {
    entity_id: 'light.lightswitch_laundry_switch',
    friendly_name: 'Laundry Light Switch',
    device_type: 'light',
    room: 'Laundry',
    floor: 'Lower Floor'
  },
  {
    entity_id: 'light.master_bedroom_main',
    friendly_name: 'Master Bedroom Light',
    device_type: 'light',
    room: 'Master Bedroom',
    floor: 'Upper Floor'
  },
  {
    entity_id: 'light.kitchen_main',
    friendly_name: 'Kitchen Light Switch',
    device_type: 'light',
    room: 'Kitchen',
    floor: 'Upper Floor'
  },
  {
    entity_id: 'light.living_room_main',
    friendly_name: 'Living Room Light Switch',
    device_type: 'light',
    room: 'Living Room',
    floor: 'Upper Floor'
  },

  // === SENSORS ===
  {
    entity_id: 'sensor.kitchen_temperature',
    friendly_name: 'Kitchen Temperature',
    device_type: 'sensor',
    room: 'Kitchen',
    floor: 'Upper Floor',
    sensor_type: 'temperature'
  },
  {
    entity_id: 'sensor.living_room_temperature',
    friendly_name: 'Living Room Temperature',
    device_type: 'sensor',
    room: 'Living Room',
    floor: 'Upper Floor',
    sensor_type: 'temperature'
  },
  {
    entity_id: 'sensor.master_bedroom_humidity',
    friendly_name: 'Master Bedroom Humidity',
    device_type: 'sensor',
    room: 'Master Bedroom',
    floor: 'Upper Floor',
    sensor_type: 'humidity'
  },

  // === BINARY SENSORS (DOORS/WINDOWS/MOTION) ===
  {
    entity_id: 'binary_sensor.lumi_lumi_sensor_magnet_aq2_opening',
    friendly_name: 'Door Sensor',
    device_type: 'binary_sensor',
    room: 'Entrance',
    floor: 'Lower Floor',
    sensor_type: 'door'
  },
  {
    entity_id: 'binary_sensor.living_room_motion',
    friendly_name: 'Living Room Motion',
    device_type: 'binary_sensor',
    room: 'Living Room',
    floor: 'Upper Floor',
    sensor_type: 'motion'
  },
  {
    entity_id: 'binary_sensor.kitchen_motion',
    friendly_name: 'Kitchen Motion',
    device_type: 'binary_sensor',
    room: 'Kitchen',
    floor: 'Upper Floor',
    sensor_type: 'motion'
  },

  // === COVERS (BLINDS/CURTAINS) ===
  {
    entity_id: 'cover.living_room_curtain',
    friendly_name: 'Living Room Smart Curtain',
    device_type: 'cover',
    room: 'Living Room',
    floor: 'Upper Floor'
  },

  // === MEDIA PLAYERS ===
  {
    entity_id: 'media_player.living_room_speaker',
    friendly_name: 'Living Room Speaker',
    device_type: 'media_player',
    room: 'Living Room',
    floor: 'Upper Floor'
  },

  // === LOCKS ===
  {
    entity_id: 'lock.entrance_door',
    friendly_name: 'Entrance Smart Lock',
    device_type: 'lock',
    room: 'Entrance',
    floor: 'Lower Floor'
  },

  // === ALARM SYSTEM ===
  {
    entity_id: 'alarm_control_panel.home_security',
    friendly_name: 'Home Security System',
    device_type: 'alarm_control_panel',
    room: 'Security',
    floor: 'System'
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