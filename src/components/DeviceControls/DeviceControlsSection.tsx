import React, { useState, useMemo } from 'react';
import { Lightbulb, Columns2, Volume2, Fan, Lock, ChevronDown, ChevronUp, Power, PowerOff } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';
import { Device, LightDevice, BlindDevice, MediaPlayerDevice, FanDevice, LockDevice } from '../../types/devices';

interface DeviceControlsSectionProps {
  activeTab: 'whole-house' | 'upper-floor' | 'lower-floor' | 'apartment';
}

const DeviceControlsSection: React.FC<DeviceControlsSectionProps> = ({ activeTab }) => {
  const { state, controlLight, controlCover, controlMediaPlayer, controlFan, controlLock } = useDevices();
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Filter devices based on active tab
  const getFilteredDevices = useMemo(() => {
    let devices = state.devices;

    if (activeTab !== 'whole-house') {
      const floorName = activeTab === 'upper-floor' ? 'Upper Floor' : 
                       activeTab === 'lower-floor' ? 'Lower Floor' : 'Apartment';
      devices = devices.filter(device => device.floor === floorName);
    }

    // Group devices by type
    const lights = devices.filter(d => d.device_type === 'light') as LightDevice[];
    const covers = devices.filter(d => d.device_type === 'cover') as BlindDevice[];
    const mediaPlayers = devices.filter(d => d.device_type === 'media_player') as MediaPlayerDevice[];
    const fans = devices.filter(d => d.device_type === 'fan') as FanDevice[];
    const locks = devices.filter(d => d.device_type === 'lock') as LockDevice[];

    return { lights, covers, mediaPlayers, fans, locks };
  }, [state.devices, activeTab]);

  const { lights, covers, mediaPlayers, fans, locks } = getFilteredDevices;

  const toggleCardExpansion = (cardType: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardType]: !prev[cardType]
    }));
  };

  // Device type card component
  const DeviceTypeCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    devices: Device[];
    activeCount: number;
    totalCount: number;
    activeColor: string;
    inactiveColor: string;
    onToggleAll: () => void;
    cardType: string;
    children?: React.ReactNode;
  }> = ({ 
    title, 
    icon, 
    devices, 
    activeCount, 
    totalCount, 
    activeColor, 
    inactiveColor, 
    onToggleAll, 
    cardType,
    children 
  }) => {
    if (totalCount === 0) return null;

    const isExpanded = expandedCards[cardType];
    const hasActiveDevices = activeCount > 0;

    return (
      <div className={`rounded-3xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
        hasActiveDevices 
          ? `${activeColor} border-opacity-30` 
          : `bg-white border-gray-200`
      }`}>
        {/* Card Header */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl transition-all duration-300 ${
                hasActiveDevices 
                  ? 'bg-white/80 shadow-lg' 
                  : 'bg-gray-100'
              }`}>
                <div className={`transition-colors duration-300 ${
                  hasActiveDevices ? 'text-gray-700' : 'text-gray-500'
                }`}>
                  {icon}
                </div>
              </div>
              <div>
                <h3 className={`text-2xl font-bold transition-colors duration-300 ${
                  hasActiveDevices ? 'text-gray-800' : 'text-gray-700'
                }`}>
                  {title}
                </h3>
                <p className={`text-lg transition-colors duration-300 ${
                  hasActiveDevices ? 'text-gray-600' : 'text-gray-500'
                }`}>
                  {activeCount} of {totalCount} active
                </p>
              </div>
            </div>

            {/* Toggle All Button */}
            <button
              onClick={onToggleAll}
              className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                hasActiveDevices
                  ? 'bg-white text-gray-700 hover:bg-gray-50'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {hasActiveDevices ? (
                <>
                  <PowerOff className="w-5 h-5" />
                  <span>Turn All Off</span>
                </>
              ) : (
                <>
                  <Power className="w-5 h-5" />
                  <span>Turn All On</span>
                </>
              )}
            </button>
          </div>

          {/* Status Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${
                hasActiveDevices ? 'text-gray-600' : 'text-gray-500'
              }`}>
                Activity
              </span>
              <span className={`text-sm font-medium ${
                hasActiveDevices ? 'text-gray-600' : 'text-gray-500'
              }`}>
                {Math.round((activeCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  hasActiveDevices ? 'bg-white/90' : 'bg-blue-500'
                }`}
                style={{ width: `${(activeCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Expand/Collapse Button */}
          {totalCount > 1 && (
            <button
              onClick={() => toggleCardExpansion(cardType)}
              className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl transition-all duration-300 ${
                hasActiveDevices
                  ? 'bg-white/60 hover:bg-white/80 text-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <span className="font-medium">
                {isExpanded ? 'Hide Individual Controls' : 'Show Individual Controls'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Individual Device Controls */}
        {isExpanded && children && (
          <div className="px-8 pb-8">
            <div className="bg-white/50 rounded-2xl p-6 space-y-3">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Individual device control component
  const IndividualDeviceControl: React.FC<{
    device: Device;
    isActive: boolean;
    onToggle: () => void;
    icon: React.ReactNode;
  }> = ({ device, isActive, onToggle, icon }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <div className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
            {icon}
          </div>
        </div>
        <span className="font-medium text-gray-900">{device.friendly_name}</span>
      </div>
      
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isActive ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isActive ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );

  // Control handlers
  const handleLightsToggleAll = () => {
    const hasAnyOn = lights.some(light => light.state === 'on');
    lights.forEach(light => {
      controlLight(light.entity_id, !hasAnyOn, hasAnyOn ? undefined : 255);
    });
  };

  const handleCoversToggleAll = () => {
    const hasAnyOpen = covers.some(cover => cover.state === 'open');
    covers.forEach(cover => {
      controlCover(cover.entity_id, hasAnyOpen ? 'close' : 'open');
    });
  };

  const handleMediaToggleAll = () => {
    const hasAnyPlaying = mediaPlayers.some(player => player.state === 'playing');
    mediaPlayers.forEach(player => {
      controlMediaPlayer(player.entity_id, hasAnyPlaying ? 'pause' : 'play');
    });
  };

  const handleFansToggleAll = () => {
    const hasAnyOn = fans.some(fan => fan.state === 'on');
    fans.forEach(fan => {
      controlFan(fan.entity_id, !hasAnyOn);
    });
  };

  const handleLocksToggleAll = () => {
    const hasAnyUnlocked = locks.some(lock => lock.state === 'unlocked');
    locks.forEach(lock => {
      controlLock(lock.entity_id, hasAnyUnlocked ? 'lock' : 'unlock');
    });
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'whole-house': return 'Whole House';
      case 'upper-floor': return 'Upper Floor';
      case 'lower-floor': return 'Lower Floor';
      case 'apartment': return 'Apartment';
      default: return 'Device Controls';
    }
  };

  const totalDevices = lights.length + covers.length + mediaPlayers.length + fans.length + locks.length;

  if (totalDevices === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-xl font-medium mb-2">
          No controllable devices found
        </div>
        <div className="text-gray-500">
          {activeTab === 'whole-house' 
            ? 'Add devices to see controls here'
            : `No devices configured for ${getTabTitle()}`
          }
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Lights Card */}
      <DeviceTypeCard
        title="Lights"
        icon={<Lightbulb className="w-8 h-8" />}
        devices={lights}
        activeCount={lights.filter(l => l.state === 'on').length}
        totalCount={lights.length}
        activeColor="bg-gradient-to-br from-yellow-100 to-amber-100"
        inactiveColor="bg-white"
        onToggleAll={handleLightsToggleAll}
        cardType="lights"
      >
        {lights.map((light) => (
          <IndividualDeviceControl
            key={light.entity_id}
            device={light}
            isActive={light.state === 'on'}
            onToggle={() => controlLight(light.entity_id, light.state === 'off')}
            icon={<Lightbulb className="w-4 h-4" />}
          />
        ))}
      </DeviceTypeCard>

      {/* Blinds & Curtains Card */}
      <DeviceTypeCard
        title="Blinds & Curtains"
        icon={<Columns2 className="w-8 h-8" />}
        devices={covers}
        activeCount={covers.filter(c => c.state === 'open').length}
        totalCount={covers.length}
        activeColor="bg-gradient-to-br from-blue-100 to-cyan-100"
        inactiveColor="bg-white"
        onToggleAll={handleCoversToggleAll}
        cardType="covers"
      >
        {covers.map((cover) => (
          <IndividualDeviceControl
            key={cover.entity_id}
            device={cover}
            isActive={cover.state === 'open'}
            onToggle={() => controlCover(cover.entity_id, cover.state === 'open' ? 'close' : 'open')}
            icon={<Columns2 className="w-4 h-4" />}
          />
        ))}
      </DeviceTypeCard>

      {/* Speakers & Media Card */}
      <DeviceTypeCard
        title="Speakers & Media"
        icon={<Volume2 className="w-8 h-8" />}
        devices={mediaPlayers}
        activeCount={mediaPlayers.filter(m => m.state === 'playing').length}
        totalCount={mediaPlayers.length}
        activeColor="bg-gradient-to-br from-purple-100 to-pink-100"
        inactiveColor="bg-white"
        onToggleAll={handleMediaToggleAll}
        cardType="media"
      >
        {mediaPlayers.map((player) => (
          <IndividualDeviceControl
            key={player.entity_id}
            device={player}
            isActive={player.state === 'playing'}
            onToggle={() => controlMediaPlayer(player.entity_id, player.state === 'playing' ? 'pause' : 'play')}
            icon={<Volume2 className="w-4 h-4" />}
          />
        ))}
      </DeviceTypeCard>

      {/* Fans Card */}
      <DeviceTypeCard
        title="Fans"
        icon={<Fan className="w-8 h-8" />}
        devices={fans}
        activeCount={fans.filter(f => f.state === 'on').length}
        totalCount={fans.length}
        activeColor="bg-gradient-to-br from-cyan-100 to-teal-100"
        inactiveColor="bg-white"
        onToggleAll={handleFansToggleAll}
        cardType="fans"
      >
        {fans.map((fan) => (
          <IndividualDeviceControl
            key={fan.entity_id}
            device={fan}
            isActive={fan.state === 'on'}
            onToggle={() => controlFan(fan.entity_id, fan.state === 'off')}
            icon={<Fan className="w-4 h-4" />}
          />
        ))}
      </DeviceTypeCard>

      {/* Locks Card */}
      <DeviceTypeCard
        title="Locks"
        icon={<Lock className="w-8 h-8" />}
        devices={locks}
        activeCount={locks.filter(l => l.state === 'locked').length}
        totalCount={locks.length}
        activeColor="bg-gradient-to-br from-green-100 to-emerald-100"
        inactiveColor="bg-white"
        onToggleAll={handleLocksToggleAll}
        cardType="locks"
      >
        {locks.map((lock) => (
          <IndividualDeviceControl
            key={lock.entity_id}
            device={lock}
            isActive={lock.state === 'locked'}
            onToggle={() => controlLock(lock.entity_id, lock.state === 'locked' ? 'unlock' : 'lock')}
            icon={<Lock className="w-4 h-4" />}
          />
        ))}
      </DeviceTypeCard>
    </div>
  );
};

export default DeviceControlsSection;