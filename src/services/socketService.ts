/**
 * WebSocket Service for Home Assistant Integration
 * 
 * This service handles the native WebSocket connection to your Home Assistant backend.
 * Only subscribes to and processes updates for entities defined in entities.ts
 */

import { Device, EntityUpdateEvent, DeviceControlCommand, ConnectionState } from '../types/devices';
import { subscribedEntities, getSubscribedEntityIds } from '../config/entities';

// Configuration - Update these for your Home Assistant setup
const WEBSOCKET_URL = import.meta.env.VITE_HA_WEBSOCKET_URL || 'ws://localhost:8123/api/websocket';
const ACCESS_TOKEN = import.meta.env.VITE_HA_ACCESS_TOKEN || 'your-home-assistant-long-lived-access-token';
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

interface HAMessage {
  id?: number;
  type: string;
  [key: string]: any;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private connectionState: ConnectionState = 'disconnected';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 2000;
  private maxReconnectDelay = 10000;
  private isManuallyDisconnected = false;
  private messageId = 1;
  private pendingMessages = new Map<number, (response: any) => void>();
  private subscriptions = new Set<number>();
  
  // Track subscribed entity IDs for efficient filtering
  private subscribedEntityIds = new Set<string>();
  
  // Event callbacks
  private onConnectionStateChange: ((state: ConnectionState, error?: string) => void) | null = null;
  private onEntityUpdate: ((update: EntityUpdateEvent) => void) | null = null;
  private onDevicesUpdate: ((devices: Device[]) => void) | null = null;

  constructor() {
    // Initialize subscribed entity IDs for fast lookup
    this.subscribedEntityIds = new Set(getSubscribedEntityIds());
    
    console.log('📋 Configured entities:', subscribedEntities.length);
    console.log('🎯 Subscribed entity IDs:', Array.from(this.subscribedEntityIds));
    console.log('🏠 Entities by room:', this.getEntitiesByRoom());
    
    if (!DEV_MODE) {
      this.connect();
    } else {
      console.log('🔧 Development mode: WebSocket connection disabled');
      console.log('💡 To enable Home Assistant connection:');
      console.log('   1. Set VITE_DEV_MODE=false in .env');
      console.log('   2. Update VITE_HA_WEBSOCKET_URL with your Home Assistant WebSocket URL');
      console.log('   3. Add your Home Assistant access token to VITE_HA_ACCESS_TOKEN');
      this.setConnectionState('disconnected', 'Development mode - WebSocket connection disabled');
    }
  }

  /**
   * Get entities grouped by room for debugging
   */
  private getEntitiesByRoom() {
    return subscribedEntities.reduce((acc, entity) => {
      const room = entity.room || 'Unknown';
      if (!acc[room]) acc[room] = [];
      acc[room].push(entity.entity_id);
      return acc;
    }, {} as Record<string, string[]>);
  }

  /**
   * Check if entity is in our subscription list (fast lookup)
   */
  private isSubscribedEntity(entityId: string): boolean {
    return this.subscribedEntityIds.has(entityId);
  }

  /**
   * Establish connection to Home Assistant WebSocket API
   */
  public connect(): void {
    if (DEV_MODE) {
      console.log('🔧 Cannot connect in development mode. Set VITE_DEV_MODE=false to enable.');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    // Validate configuration
    if (!WEBSOCKET_URL || WEBSOCKET_URL === 'ws://localhost:8123/api/websocket') {
      this.setConnectionState('error', 'Home Assistant WebSocket URL not configured. Please update VITE_HA_WEBSOCKET_URL in .env');
      return;
    }

    if (!ACCESS_TOKEN || ACCESS_TOKEN === 'your-home-assistant-long-lived-access-token') {
      this.setConnectionState('error', 'Home Assistant access token not configured. Please update VITE_HA_ACCESS_TOKEN in .env');
      return;
    }

    this.isManuallyDisconnected = false;
    this.setConnectionState('connecting');

    try {
      console.log(`🔌 Attempting to connect to Home Assistant at: ${WEBSOCKET_URL}`);
      
      this.ws = new WebSocket(WEBSOCKET_URL);
      this.setupEventListeners();
    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      this.setConnectionState('error', error instanceof Error ? error.message : 'Connection failed');
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from Home Assistant
   */
  public disconnect(): void {
    this.isManuallyDisconnected = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setConnectionState('disconnected');
    this.reconnectAttempts = 0;
    this.pendingMessages.clear();
    this.subscriptions.clear();
  }

  /**
   * Setup WebSocket event listeners
   */
  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('✅ WebSocket connection opened');
      // Home Assistant will send auth_required message first
    };

    this.ws.onmessage = (event) => {
      try {
        const message: HAMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('❌ Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('🔌 WebSocket connection closed:', event.code, event.reason);
      this.setConnectionState('disconnected');
      
      // Clear pending messages and subscriptions
      this.pendingMessages.clear();
      this.subscriptions.clear();
      
      // Auto-reconnect unless manually disconnected
      if (!this.isManuallyDisconnected) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      this.setConnectionState('error', 'WebSocket connection error');
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(message: HAMessage): void {
    // Only log messages for subscribed entities or system messages
    if (message.type === 'event' && message.event?.data?.entity_id) {
      if (this.isSubscribedEntity(message.event.data.entity_id)) {
        console.log('📡 Received subscribed entity update:', message.event.data.entity_id);
      } else {
        // Silently ignore unsubscribed entities
        return;
      }
    } else if (message.type !== 'event') {
      console.log('📡 Received message:', message.type);
    }

    switch (message.type) {
      case 'auth_required':
        this.authenticate();
        break;

      case 'auth_ok':
        console.log('✅ Authentication successful');
        this.setConnectionState('connected');
        this.reconnectAttempts = 0;
        this.reconnectDelay = 2000;
        this.subscribeToUpdates();
        break;

      case 'auth_invalid':
        console.error('❌ Authentication failed:', message);
        this.setConnectionState('error', 'Authentication failed - please check your access token');
        break;

      case 'result':
        // Handle command responses
        if (message.id && this.pendingMessages.has(message.id)) {
          const callback = this.pendingMessages.get(message.id);
          if (callback) {
            callback(message);
            this.pendingMessages.delete(message.id);
          }
        }
        break;

      case 'event':
        // Handle state change events - ONLY for subscribed entities
        if (message.event?.event_type === 'state_changed') {
          const eventData = message.event.data;
          if (eventData?.new_state && this.isSubscribedEntity(eventData.entity_id)) {
            console.log('🔄 Processing subscribed entity update:', eventData.entity_id, 'New state:', eventData.new_state.state);
            
            const update: EntityUpdateEvent = {
              entity_id: eventData.entity_id,
              state: eventData.new_state.state,
              attributes: eventData.new_state.attributes,
              last_updated: eventData.new_state.last_updated || new Date().toISOString()
            };
            
            if (this.onEntityUpdate) {
              this.onEntityUpdate(update);
            }
          }
        }
        break;

      default:
        console.log('📡 Unhandled message type:', message.type);
    }
  }

  /**
   * Authenticate with Home Assistant
   */
  private authenticate(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const authMessage: HAMessage = {
      type: 'auth',
      access_token: ACCESS_TOKEN
    };

    this.ws.send(JSON.stringify(authMessage));
  }

  /**
   * Subscribe to entity updates
   */
  private subscribeToUpdates(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    // Subscribe to state_changed events (we'll filter them in handleMessage)
    const subscribeMessage: HAMessage = {
      id: this.messageId++,
      type: 'subscribe_events',
      event_type: 'state_changed'
    };

    console.log('🔔 Subscribing to state_changed events (will filter to subscribed entities only)');
    this.ws.send(JSON.stringify(subscribeMessage));
    this.subscriptions.add(subscribeMessage.id!);

    // Get initial states for our subscribed entities
    this.getStates();
  }

  /**
   * Get current states for subscribed entities only
   */
  private getStates(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const getStatesMessage: HAMessage = {
      id: this.messageId++,
      type: 'get_states'
    };

    this.pendingMessages.set(getStatesMessage.id!, (response) => {
      if (response.success && response.result) {
        // Filter to only our subscribed entities
        const filteredStates = response.result.filter((state: any) => 
          this.isSubscribedEntity(state.entity_id)
        );
        
        console.log(`📊 Received ${response.result.length} total states, ${filteredStates.length} are subscribed entities`);
        console.log('🎯 Subscribed entities found:', filteredStates.map((s: any) => s.entity_id));
        
        // Convert HA states to our device format
        const devices = this.convertHAStatesToDevices(filteredStates);
        if (this.onDevicesUpdate) {
          this.onDevicesUpdate(devices);
        }
      }
    });

    this.ws.send(JSON.stringify(getStatesMessage));
  }

  /**
   * Convert Home Assistant states to our device format
   */
  private convertHAStatesToDevices(states: any[]): Device[] {
    return states.map(state => {
      // Find the entity configuration
      const entityConfig = subscribedEntities.find(e => e.entity_id === state.entity_id);
      
      if (!entityConfig) {
        console.warn('⚠️ No configuration found for entity:', state.entity_id);
        return null;
      }

      const device: Device = {
        entity_id: state.entity_id,
        friendly_name: entityConfig.friendly_name || state.attributes?.friendly_name || state.entity_id,
        device_type: entityConfig.device_type,
        room: entityConfig.room || 'Unknown',
        floor: entityConfig.floor || 'Unknown',
        state: state.state,
        last_updated: state.last_updated,
        available: state.state !== 'unavailable',
        ...state.attributes,
        // Add sensor type if specified in config
        ...(entityConfig.sensor_type && { sensor_type: entityConfig.sensor_type })
      };

      console.log('✅ Converted device:', device.friendly_name, 'State:', device.state, 'Room:', device.room);
      return device;
    }).filter(Boolean) as Device[];
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.isManuallyDisconnected || DEV_MODE) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      this.setConnectionState('error', 'Cannot connect to Home Assistant. Please check your configuration and try refreshing the page.');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * this.reconnectAttempts, this.maxReconnectDelay);
    
    console.log(`🔄 Scheduling reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.connectionState !== 'connected' && !this.isManuallyDisconnected) {
        this.connect();
      }
    }, delay);
  }

  /**
   * Update connection state and notify listeners
   */
  private setConnectionState(state: ConnectionState, error?: string): void {
    this.connectionState = state;
    if (this.onConnectionStateChange) {
      this.onConnectionStateChange(state, error);
    }
  }

  /**
   * Send a service call to Home Assistant
   */
  private callService(domain: string, service: string, entityId: string, serviceData?: any): void {
    if (DEV_MODE) {
      console.log('🔧 Development mode: Service call simulated -', { domain, service, entityId, serviceData });
      return;
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('❌ Cannot send service call: WebSocket not connected');
      return;
    }

    const message: HAMessage = {
      id: this.messageId++,
      type: 'call_service',
      domain,
      service,
      target: {
        entity_id: entityId
      },
      service_data: serviceData || {}
    };

    console.log('📤 Sending service call:', message);
    this.ws.send(JSON.stringify(message));
  }

  /**
   * Control a device (send command to Home Assistant)
   */
  public controlDevice(command: DeviceControlCommand): void {
    const [domain, service] = command.service.split('.');
    this.callService(domain, service, command.entity_id, command.service_data);
  }

  /**
   * Turn on a light
   */
  public turnOnLight(entityId: string, brightness?: number, rgbColor?: [number, number, number]): void {
    const serviceData: any = {};
    
    if (brightness !== undefined) {
      serviceData.brightness = brightness;
    }
    
    if (rgbColor) {
      serviceData.rgb_color = rgbColor;
    }

    this.callService('light', 'turn_on', entityId, serviceData);
  }

  /**
   * Turn off a light
   */
  public turnOffLight(entityId: string): void {
    this.callService('light', 'turn_off', entityId);
  }

  /**
   * Set cover position (blinds/curtains)
   */
  public setCoverPosition(entityId: string, position: number): void {
    this.callService('cover', 'set_cover_position', entityId, { position });
  }

  /**
   * Open cover
   */
  public openCover(entityId: string): void {
    this.callService('cover', 'open_cover', entityId);
  }

  /**
   * Close cover
   */
  public closeCover(entityId: string): void {
    this.callService('cover', 'close_cover', entityId);
  }

  /**
   * Control media player
   */
  public playMedia(entityId: string): void {
    this.callService('media_player', 'media_play', entityId);
  }

  public pauseMedia(entityId: string): void {
    this.callService('media_player', 'media_pause', entityId);
  }

  public setMediaVolume(entityId: string, volumeLevel: number): void {
    this.callService('media_player', 'volume_set', entityId, { volume_level: volumeLevel });
  }

  /**
   * Control locks
   */
  public lockDoor(entityId: string, code?: string): void {
    const serviceData = code ? { code } : {};
    this.callService('lock', 'lock', entityId, serviceData);
  }

  public unlockDoor(entityId: string, code?: string): void {
    const serviceData = code ? { code } : {};
    this.callService('lock', 'unlock', entityId, serviceData);
  }

  /**
   * Control fans
   */
  public turnOnFan(entityId: string, percentage?: number): void {
    const serviceData = percentage !== undefined ? { percentage } : {};
    this.callService('fan', 'turn_on', entityId, serviceData);
  }

  public turnOffFan(entityId: string): void {
    this.callService('fan', 'turn_off', entityId);
  }

  /**
   * Control alarm
   */
  public armAlarmHome(entityId: string, code?: string): void {
    const serviceData = code ? { code } : {};
    this.callService('alarm_control_panel', 'alarm_arm_home', entityId, serviceData);
  }

  public armAlarmAway(entityId: string, code?: string): void {
    const serviceData = code ? { code } : {};
    this.callService('alarm_control_panel', 'alarm_arm_away', entityId, serviceData);
  }

  public disarmAlarm(entityId: string, code?: string): void {
    const serviceData = code ? { code } : {};
    this.callService('alarm_control_panel', 'alarm_disarm', entityId, serviceData);
  }

  /**
   * Manual connection control
   */
  public manualConnect(): void {
    if (DEV_MODE) {
      console.log('🔧 Cannot connect in development mode. Set VITE_DEV_MODE=false in .env to enable.');
      return;
    }
    this.reconnectAttempts = 0;
    this.connect();
  }

  public manualDisconnect(): void {
    this.disconnect();
  }

  /**
   * Event listener setters
   */
  public onConnectionChange(callback: (state: ConnectionState, error?: string) => void): void {
    this.onConnectionStateChange = callback;
  }

  public onEntityUpdated(callback: (update: EntityUpdateEvent) => void): void {
    this.onEntityUpdate = callback;
  }

  public onDevicesUpdated(callback: (devices: Device[]) => void): void {
    this.onDevicesUpdate = callback;
  }

  /**
   * Get current connection state
   */
  public getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN || false;
  }

  /**
   * Check if in development mode
   */
  public isDevMode(): boolean {
    return DEV_MODE;
  }

  /**
   * Get subscribed entity count for debugging
   */
  public getSubscribedEntityCount(): number {
    return this.subscribedEntityIds.size;
  }

  /**
   * Check if specific entity is subscribed
   */
  public isEntitySubscribed(entityId: string): boolean {
    return this.isSubscribedEntity(entityId);
  }
}

// Export singleton instance
export const socketService = new WebSocketService();