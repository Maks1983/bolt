/**
 * Socket.io Service for Home Assistant Integration
 * 
 * This service handles the WebSocket connection to your Home Assistant backend.
 * 
 * To configure for your setup:
 * 1. Update SOCKET_URL to your Home Assistant WebSocket endpoint
 * 2. Replace the bearer token with your actual Home Assistant long-lived access token
 * 3. Adjust event names if your backend uses different conventions
 */

import { io, Socket } from 'socket.io-client';
import { Device, EntityUpdateEvent, DeviceControlCommand, ConnectionState } from '../types/devices';

// Configuration - Update these for your Home Assistant setup
const SOCKET_URL = import.meta.env.VITE_REACT_APP_HA_WEBSOCKET_URL || 'ws://localhost:8123';
const ACCESS_TOKEN = import.meta.env.VITE_REACT_APP_HA_ACCESS_TOKEN || 'your-home-assistant-long-lived-access-token';

export class SocketService {
  private socket: Socket | null = null;
  private connectionState: ConnectionState = 'disconnected';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private maxReconnectDelay = 30000; // Max 30 seconds
  
  // Event callbacks
  private onConnectionStateChange: ((state: ConnectionState, error?: string) => void) | null = null;
  private onEntityUpdate: ((update: EntityUpdateEvent) => void) | null = null;
  private onDevicesUpdate: ((devices: Device[]) => void) | null = null;

  constructor() {
    this.connect();
  }

  /**
   * Establish connection to Home Assistant WebSocket API
   */
  public connect(): void {
    if (this.socket?.connected) {
      return;
    }

    this.setConnectionState('connecting');

    try {
      this.socket = io(SOCKET_URL, {
        auth: {
          token: ACCESS_TOKEN
        },
        transports: ['websocket'],
        timeout: 10000,
        forceNew: true
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to create socket connection:', error);
      this.setConnectionState('error', error instanceof Error ? error.message : 'Connection failed');
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from Home Assistant
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.setConnectionState('disconnected');
    this.reconnectAttempts = 0;
  }

  /**
   * Setup socket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to Home Assistant');
      this.setConnectionState('connected');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      
      // Subscribe to entity updates
      this.subscribeToUpdates();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from Home Assistant:', reason);
      this.setConnectionState('disconnected');
      
      // Auto-reconnect unless manually disconnected
      if (reason !== 'io client disconnect') {
        this.scheduleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.setConnectionState('error', error.message);
      this.scheduleReconnect();
    });

    // Home Assistant specific events
    this.socket.on('entity_update', (data: EntityUpdateEvent) => {
      console.log('Entity update received:', data);
      if (this.onEntityUpdate) {
        this.onEntityUpdate(data);
      }
    });

    this.socket.on('state_changed', (data: any) => {
      // Handle Home Assistant state_changed events
      const update: EntityUpdateEvent = {
        entity_id: data.entity_id,
        state: data.new_state?.state,
        attributes: data.new_state?.attributes,
        last_updated: data.new_state?.last_updated || new Date().toISOString()
      };
      
      if (this.onEntityUpdate) {
        this.onEntityUpdate(update);
      }
    });

    this.socket.on('devices_update', (devices: Device[]) => {
      console.log('Devices update received:', devices);
      if (this.onDevicesUpdate) {
        this.onDevicesUpdate(devices);
      }
    });

    // Authentication events
    this.socket.on('auth_required', () => {
      console.log('Authentication required');
      this.authenticate();
    });

    this.socket.on('auth_ok', () => {
      console.log('Authentication successful');
    });

    this.socket.on('auth_invalid', (error: any) => {
      console.error('Authentication failed:', error);
      this.setConnectionState('error', 'Authentication failed');
    });
  }

  /**
   * Authenticate with Home Assistant
   */
  private authenticate(): void {
    if (!this.socket) return;

    this.socket.emit('auth', {
      access_token: ACCESS_TOKEN
    });
  }

  /**
   * Subscribe to entity updates
   */
  private subscribeToUpdates(): void {
    if (!this.socket) return;

    // Subscribe to all entity updates
    this.socket.emit('subscribe_events', {
      event_type: 'state_changed'
    });

    // Request initial state
    this.socket.emit('get_states');
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.setConnectionState('error', 'Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectDelay);
    
    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.connectionState !== 'connected') {
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
   * Control a device (send command to Home Assistant)
   */
  public controlDevice(command: DeviceControlCommand): void {
    if (!this.socket?.connected) {
      console.error('Cannot send command: not connected to Home Assistant');
      return;
    }

    console.log('Sending device control command:', command);
    this.socket.emit('call_service', {
      domain: command.service.split('.')[0],
      service: command.service.split('.')[1],
      target: {
        entity_id: command.entity_id
      },
      service_data: command.service_data || {}
    });
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

    this.controlDevice({
      entity_id: entityId,
      service: 'light.turn_on',
      service_data: serviceData
    });
  }

  /**
   * Turn off a light
   */
  public turnOffLight(entityId: string): void {
    this.controlDevice({
      entity_id: entityId,
      service: 'light.turn_off'
    });
  }

  /**
   * Set cover position (blinds/curtains)
   */
  public setCoverPosition(entityId: string, position: number): void {
    this.controlDevice({
      entity_id: entityId,
      service: 'cover.set_cover_position',
      service_data: { position }
    });
  }

  /**
   * Open cover
   */
  public openCover(entityId: string): void {
    this.controlDevice({
      entity_id: entityId,
      service: 'cover.open_cover'
    });
  }

  /**
   * Close cover
   */
  public closeCover(entityId: string): void {
    this.controlDevice({
      entity_id: entityId,
      service: 'cover.close_cover'
    });
  }

  /**
   * Control media player
   */
  public playMedia(entityId: string): void {
    this.controlDevice({
      entity_id: entityId,
      service: 'media_player.media_play'
    });
  }

  public pauseMedia(entityId: string): void {
    this.controlDevice({
      entity_id: entityId,
      service: 'media_player.media_pause'
    });
  }

  public setMediaVolume(entityId: string, volumeLevel: number): void {
    this.controlDevice({
      entity_id: entityId,
      service: 'media_player.volume_set',
      service_data: { volume_level: volumeLevel }
    });
  }

  /**
   * Control locks
   */
  public lockDoor(entityId: string, code?: string): void {
    const serviceData = code ? { code } : {};
    this.controlDevice({
      entity_id: entityId,
      service: 'lock.lock',
      service_data: serviceData
    });
  }

  public unlockDoor(entityId: string, code?: string): void {
    const serviceData = code ? { code } : {};
    this.controlDevice({
      entity_id: entityId,
      service: 'lock.unlock',
      service_data: serviceData
    });
  }

  /**
   * Control fans
   */
  public turnOnFan(entityId: string, percentage?: number): void {
    const serviceData = percentage !== undefined ? { percentage } : {};
    this.controlDevice({
      entity_id: entityId,
      service: 'fan.turn_on',
      service_data: serviceData
    });
  }

  public turnOffFan(entityId: string): void {
    this.controlDevice({
      entity_id: entityId,
      service: 'fan.turn_off'
    });
  }

  /**
   * Control alarm
   */
  public armAlarmHome(entityId: string, code?: string): void {
    const serviceData = code ? { code } : {};
    this.controlDevice({
      entity_id: entityId,
      service: 'alarm_control_panel.alarm_arm_home',
      service_data: serviceData
    });
  }

  public armAlarmAway(entityId: string, code?: string): void {
    const serviceData = code ? { code } : {};
    this.controlDevice({
      entity_id: entityId,
      service: 'alarm_control_panel.alarm_arm_away',
      service_data: serviceData
    });
  }

  public disarmAlarm(entityId: string, code?: string): void {
    const serviceData = code ? { code } : {};
    this.controlDevice({
      entity_id: entityId,
      service: 'alarm_control_panel.alarm_disarm',
      service_data: serviceData
    });
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
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const socketService = new SocketService();