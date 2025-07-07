import React, { useState, useEffect } from 'react';
import { Shield, Lock, Zap, TrendingDown, Thermometer, Activity, Clock, DoorOpen, Lightbulb, User, Bell, X, Settings, Moon, Plane, Users, Sun, Coffee, Camera, Play, Pause, RotateCcw, Maximize, Home, AlertTriangle, CheckCircle, Power, Wifi, WifiOff, Delete, Hash, BarChart3, TrendingUp, Droplets, Wind } from 'lucide-react';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';
import AlarmCard from './InfoCards/AlarmCard';
import SecurityCard from './InfoCards/SecurityCard';
import EnergyCard from './InfoCards/EnergyCard';
import IndoorAverageCard from './InfoCards/IndoorAverageCard';
import ActivityCard from './InfoCards/ActivityCard';
import ActionsCard from './InfoCards/ActionsCard';
import NVRCard from './InfoCards/NVRCard';

interface InfoRowProps {
  cameras?: any[]; // Keep for backward compatibility but won't use
}

const InfoRow: React.FC<InfoRowProps> = () => {
  return (
    <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 shadow-sm">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 min-w-max">
          <AlarmCard />
          <SecurityCard />
          <EnergyCard />
          <IndoorAverageCard />
          <ActivityCard />
          <ActionsCard />
          <NVRCard />
        </div>
      </div>
    </div>
  );
};

export default InfoRow;