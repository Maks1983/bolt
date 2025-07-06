import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle, Clock, Bell, Flame, Waves, 
  Shield, Camera, User, Car, Baby, Volume2, X, Eye
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';
import { useRealtimeDevice } from '../../hooks/useDeviceUpdates';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  icon: React.ComponentType<any>;
  entityId?: string;
  dismissible?: boolean;
}

const AlertsAndNotifications: React.FC = () => {
  const { state } = useDevices();
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  
  // Generate alerts based on current system state
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];
    
    // Safety alerts (highest priority)
    const floodSensors = state.devices.filter(d => 
      d.device_type === 'binary_sensor' && (d as any).sensor_type === 'flood' && d.state === 'on'
    );
    
    const smokeSensors = state.devices.filter(d => 
      d.device_type === 'binary_sensor' && (d as any).sensor_type === 'smoke' && d.state === 'on'
    );
    
    floodSensors.forEach(sensor => {
      alerts.push({
        id: `flood_${sensor.entity_id}`,
        type: 'critical',
        title: 'FLOOD DETECTED',
        message: `Water detected in ${sensor.room}`,
        timestamp: new Date(sensor.last_updated),
        icon: Waves,
        entityId: sensor.entity_id
      });
    });
    
    smokeSensors.forEach(sensor => {
      alerts.push({
        id: `smoke_${sensor.entity_id}`,
        type: 'critical',
        title: 'SMOKE DETECTED',
        message: `Smoke alarm triggered in ${sensor.room}`,
        timestamp: new Date(sensor.last_updated),
        icon: Flame,
        entityId: sensor.entity_id
      });
    });
    
    // Security alerts
    const unlockedDoors = state.devices.filter(d => 
      d.device_type === 'lock' && d.state === 'unlocked'
    );
    
    if (unlockedDoors.length > 0) {
      alerts.push({
        id: 'unlocked_doors',
        type: 'warning',
        title: 'Doors Unlocked',
        message: `${unlockedDoors.length} door(s) are currently unlocked`,
        timestamp: new Date(),
        icon: Shield,
        dismissible: true
      });
    }
    
    // Camera AI detections
    const personDetections = state.devices.filter(d => 
      d.device_type === 'binary_sensor' && 
      (d as any).detection_type === 'person' && 
      d.state === 'on'
    );
    
    const vehicleDetections = state.devices.filter(d => 
      d.device_type === 'binary_sensor' && 
      (d as any).detection_type === 'vehicle' && 
      d.state === 'on'
    );
    
    personDetections.forEach(sensor => {
      alerts.push({
        id: `person_${sensor.entity_id}`,
        type: 'info',
        title: 'Person Detected',
        message: `Person detected by ${sensor.friendly_name}`,
        timestamp: new Date(sensor.last_updated),
        icon: User,
        entityId: sensor.entity_id,
        dismissible: true
      });
    });
    
    vehicleDetections.forEach(sensor => {
      alerts.push({
        id: `vehicle_${sensor.entity_id}`,
        type: 'info',
        title: 'Vehicle Detected',
        message: `Vehicle detected by ${sensor.friendly_name}`,
        timestamp: new Date(sensor.last_updated),
        icon: Car,
        entityId: sensor.entity_id,
        dismissible: true
      });
    });
    
    // Audio detections
    const babyDetections = state.devices.filter(d => 
      d.device_type === 'binary_sensor' && 
      (d as any).detection_type === 'baby_cry' && 
      d.state === 'on'
    );
    
    const speakingDetections = state.devices.filter(d => 
      d.device_type === 'binary_sensor' && 
      (d as any).detection_type === 'speaking' && 
      d.state === 'on'
    );
    
    babyDetections.forEach(sensor => {
      alerts.push({
        id: `baby_${sensor.entity_id}`,
        type: 'warning',
        title: 'Baby Cry Detected',
        message: `Baby crying detected by ${sensor.friendly_name}`,
        timestamp: new Date(sensor.last_updated),
        icon: Baby,
        entityId: sensor.entity_id,
        dismissible: true
      });
    });
    
    speakingDetections.forEach(sensor => {
      alerts.push({
        id: `speaking_${sensor.entity_id}`,
        type: 'info',
        title: 'Speaking Detected',
        message: `Voice activity detected by ${sensor.friendly_name}`,
        timestamp: new Date(sensor.last_updated),
        icon: Volume2,
        entityId: sensor.entity_id,
        dismissible: true
      });
    });
    
    // Connection status
    if (state.connectionState !== 'connected') {
      alerts.push({
        id: 'connection_status',
        type: 'warning',
        title: 'Connection Issue',
        message: `Home Assistant is ${state.connectionState}`,
        timestamp: new Date(),
        icon: AlertTriangle,
        dismissible: true
      });
    }
    
    // System health
    const offlineDevices = state.devices.filter(d => !d.available);
    if (offlineDevices.length > 0) {
      alerts.push({
        id: 'offline_devices',
        type: 'warning',
        title: 'Devices Offline',
        message: `${offlineDevices.length} device(s) are currently offline`,
        timestamp: new Date(),
        icon: AlertTriangle,
        dismissible: true
      });
    }
    
    // Success message if everything is good
    if (alerts.length === 0) {
      alerts.push({
        id: 'all_good',
        type: 'success',
        title: 'All Systems Normal',
        message: 'Your smart home is running smoothly',
        timestamp: new Date(),
        icon: CheckCircle,
        dismissible: false
      });
    }
    
    return alerts.filter(alert => !dismissedAlerts.has(alert.id));
  };
  
  const alerts = generateAlerts();
  
  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };
  
  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'bg-red-500',
          text: 'text-red-800',
          title: 'text-red-900'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: 'bg-yellow-500',
          text: 'text-yellow-800',
          title: 'text-yellow-900'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'bg-blue-500',
          text: 'text-blue-800',
          title: 'text-blue-900'
        };
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'bg-green-500',
          text: 'text-green-800',
          title: 'text-green-900'
        };
    }
  };
  
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Alerts & Notifications</h3>
              <p className="text-gray-600">Real-time system status and events</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">
              {alerts.length} active
            </div>
            {alerts.some(a => a.type === 'critical') && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {alerts.map((alert) => {
            const styles = getAlertStyles(alert.type);
            const IconComponent = alert.icon;
            
            return (
              <div
                key={alert.id}
                className={`${styles.bg} border rounded-2xl p-4 transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`${styles.icon} p-2 rounded-xl flex-shrink-0`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-semibold ${styles.title}`}>{alert.title}</h4>
                        <p className={`text-sm ${styles.text} mt-1`}>{alert.message}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className={`w-3 h-3 ${styles.text}`} />
                          <span className={`text-xs ${styles.text}`}>
                            {formatTimestamp(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      {alert.dismissible && (
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className={`${styles.text} hover:bg-black/10 rounded-lg p-1 transition-colors`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {alerts.length > 5 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsAndNotifications;