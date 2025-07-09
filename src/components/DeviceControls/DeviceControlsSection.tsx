import React, { useState, useMemo } from 'react';
import { Lightbulb, Columns2, Volume2, Fan, Lock, ChevronDown, ChevronUp, Power, PowerOff, Zap } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';
import { Device, LightDevice, BlindDevice, MediaPlayerDevice, FanDevice, LockDevice } from '../../types/devices';

interface DeviceControlsSectionProps {
  activeTab: 'whole-house' | 'upper-floor' | 'lower-floor' | 'apartment';
}

const DeviceControlsSection: React.FC<DeviceControlsSectionProps> = ({ activeTab }) => {
  const { state, controlLight, controlCover, controlMediaPlayer, controlFan, controlLock } = useDevices();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  // Individual device control component
  const IndividualDeviceControl: React.FC<{
    device: Device;
    isActive: boolean;
    onToggle: () => void;
    icon: React.ReactNode;
    activeColor: string;
  }> = ({ device, isActive, onToggle, icon, activeColor }) => (
    <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-white/50 backdrop-blur-sm hover:bg-white/90 transition-all duration-200">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg transition-colors ${isActive ? activeColor : 'bg-gray-100'}`}>
          <div className={`transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}>
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

  // Device type summary card component
  const DeviceTypeSummaryCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    devices: Device[];
    activeCount: number;
    totalCount: number;
    statusText: string;
    gradientFrom: string;
    gradientTo: string;
    iconBg: string;
    cardType: string;
    onQuickAction: () => void;
    quickActionText: string;
    children?: React.ReactNode;
  }> = ({ 
    title, 
    icon, 
    devices, 
    activeCount, 
    totalCount, 
    statusText,
    gradientFrom,
    gradientTo,
    iconBg,
    cardType,
    onQuickAction,
    quickActionText,
    children 
  }) => {
    if (totalCount === 0) return null;

    const isExpanded = expandedCard === cardType;
    const hasActiveDevices = activeCount > 0;
    const activityPercentage = (activeCount / totalCount) * 100;

    return (
      <div 
        className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-500 cursor-pointer group ${
          hasActiveDevices 
            ? `bg-gradient-to-br ${gradientFrom} ${gradientTo} border-white/30 shadow-2xl` 
            : 'bg-white border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
        }`}
        onClick={() => toggleCardExpansion(cardType)}
      >
        {/* Glow effect for active cards */}
        {hasActiveDevices && (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-20 blur-xl`} />
        )}
        
        {/* Card Content */}
        <div className="relative p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              {/* Large Icon */}
              <div className={`p-6 rounded-3xl transition-all duration-300 ${
                hasActiveDevices 
                  ? 'bg-white/90 shadow-xl scale-110' 
                  : 'bg-gray-100 group-hover:bg-gray-200'
              }`}>
                <div className={`transition-all duration-300 ${
                  hasActiveDevices ? iconBg : 'text-gray-500'
                }`}>
                  {React.cloneElement(icon as React.ReactElement, { className: 'w-12 h-12' })}
                </div>
              </div>
              
              {/* Title and Status */}
              <div>
                <h3 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                  hasActiveDevices ? 'text-white' : 'text-gray-800'
                }`}>
                  {title}
                </h3>
                <p className={`text-xl font-medium transition-colors duration-300 ${
                  hasActiveDevices ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {statusText}
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction();
              }}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl ${
                hasActiveDevices
                  ? 'bg-white/90 text-gray-800 hover:bg-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Zap className="w-6 h-6" />
              <span>{quickActionText}</span>
            </button>
          </div>

          {/* Activity Visualization */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-lg font-semibold ${
                hasActiveDevices ? 'text-white/90' : 'text-gray-600'
              }`}>
                Activity Level
              </span>
              <span className={`text-2xl font-bold ${
                hasActiveDevices ? 'text-white' : 'text-gray-800'
              }`}>
                {Math.round(activityPercentage)}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className={`w-full h-4 rounded-full overflow-hidden ${
              hasActiveDevices ? 'bg-white/30' : 'bg-gray-200'
            }`}>
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  hasActiveDevices ? 'bg-white/90' : 'bg-blue-500'
                }`}
                style={{ width: `${activityPercentage}%` }}
              />
            </div>
          </div>

          {/* Expand Indicator */}
          <div className="flex items-center justify-center">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              hasActiveDevices 
                ? 'bg-white/20 text-white/90' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
            }`}>
              <span className="font-medium">
                {isExpanded ? 'Hide Details' : 'Show Individual Controls'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>

        {/* Expanded Individual Controls */}
        {isExpanded && children && (
          <div className="border-t border-white/20 bg-black/10 backdrop-blur-sm">
            <div className="p-8 space-y-4">
              <h4 className={`text-xl font-bold mb-4 ${
                hasActiveDevices ? 'text-white' : 'text-gray-800'
              }`}>
                Individual Device Controls
              </h4>
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

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
      <div className="text-center py-20">
        <div className="text-gray-400 text-2xl font-medium mb-4">
          No controllable devices found
        </div>
        <div className="text-gray-500 text-lg">
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
      <DeviceTypeSummaryCard
        title="Lights"
        icon={<Lightbulb />}
        devices={lights}
        activeCount={lights.filter(l => l.state === 'on').length}
        totalCount={lights.length}
        statusText={`${lights.filter(l => l.state === 'on').length} of ${lights.length} lights on`}
        gradientFrom="from-yellow-400"
        gradientTo="to-amber-500"
        iconBg="text-yellow-600"
        cardType="lights"
        onQuickAction={handleLightsToggleAll}
        quickActionText={lights.some(l => l.state === 'on') ? 'Turn All Off' : 'Turn All On'}
      >
        {lights.map((light) => (
          <IndividualDeviceControl
            key={light.entity_id}
            device={light}
            isActive={light.state === 'on'}
            onToggle={() => controlLight(light.entity_id, light.state === 'off')}
            icon={<Lightbulb className="w-4 h-4" />}
            activeColor="bg-yellow-500"
          />
        ))}
      </DeviceTypeSummaryCard>

      {/* Blinds & Curtains Card */}
      <DeviceTypeSummaryCard
        title="Blinds & Curtains"
        icon={<Columns2 />}
        devices={covers}
        activeCount={covers.filter(c => c.state === 'open').length}
        totalCount={covers.length}
        statusText={`${covers.filter(c => c.state === 'open').length} of ${covers.length} covers open`}
        gradientFrom="from-blue-400"
        gradientTo="to-cyan-500"
        iconBg="text-blue-600"
        cardType="covers"
        onQuickAction={handleCoversToggleAll}
        quickActionText={covers.some(c => c.state === 'open') ? 'Close All' : 'Open All'}
      >
        {covers.map((cover) => (
          <IndividualDeviceControl
            key={cover.entity_id}
            device={cover}
            isActive={cover.state === 'open'}
            onToggle={() => controlCover(cover.entity_id, cover.state === 'open' ? 'close' : 'open')}
            icon={<Columns2 className="w-4 h-4" />}
            activeColor="bg-blue-500"
          />
        ))}
      </DeviceTypeSummaryCard>

      {/* Speakers & Media Card */}
      <DeviceTypeSummaryCard
        title="Speakers & Media"
        icon={<Volume2 />}
        devices={mediaPlayers}
        activeCount={mediaPlayers.filter(m => m.state === 'playing').length}
        totalCount={mediaPlayers.length}
        statusText={`${mediaPlayers.filter(m => m.state === 'playing').length} of ${mediaPlayers.length} playing`}
        gradientFrom="from-purple-400"
        gradientTo="to-pink-500"
        iconBg="text-purple-600"
        cardType="media"
        onQuickAction={handleMediaToggleAll}
        quickActionText={mediaPlayers.some(m => m.state === 'playing') ? 'Pause All' : 'Play All'}
      >
        {mediaPlayers.map((player) => (
          <IndividualDeviceControl
            key={player.entity_id}
            device={player}
            isActive={player.state === 'playing'}
            onToggle={() => controlMediaPlayer(player.entity_id, player.state === 'playing' ? 'pause' : 'play')}
            icon={<Volume2 className="w-4 h-4" />}
            activeColor="bg-purple-500"
          />
        ))}
      </DeviceTypeSummaryCard>

      {/* Fans Card */}
      {fans.length > 0 && (
        <DeviceTypeSummaryCard
          title="Fans"
          icon={<Fan />}
          devices={fans}
          activeCount={fans.filter(f => f.state === 'on').length}
          totalCount={fans.length}
          statusText={`${fans.filter(f => f.state === 'on').length} of ${fans.length} fans running`}
          gradientFrom="from-cyan-400"
          gradientTo="to-teal-500"
          iconBg="text-cyan-600"
          cardType="fans"
          onQuickAction={handleFansToggleAll}
          quickActionText={fans.some(f => f.state === 'on') ? 'Turn All Off' : 'Turn All On'}
        >
          {fans.map((fan) => (
            <IndividualDeviceControl
              key={fan.entity_id}
              device={fan}
              isActive={fan.state === 'on'}
              onToggle={() => controlFan(fan.entity_id, fan.state === 'off')}
              icon={<Fan className="w-4 h-4" />}
              activeColor="bg-cyan-500"
            />
          ))}
        </DeviceTypeSummaryCard>
      )}

      {/* Locks Card */}
      {locks.length > 0 && (
        <DeviceTypeSummaryCard
          title="Locks"
          icon={<Lock />}
          devices={locks}
          activeCount={locks.filter(l => l.state === 'locked').length}
          totalCount={locks.length}
          statusText={`${locks.filter(l => l.state === 'locked').length} of ${locks.length} locks secured`}
          gradientFrom="from-green-400"
          gradientTo="to-emerald-500"
          iconBg="text-green-600"
          cardType="locks"
          onQuickAction={handleLocksToggleAll}
          quickActionText={locks.some(l => l.state === 'unlocked') ? 'Lock All' : 'Unlock All'}
        >
          {locks.map((lock) => (
            <IndividualDeviceControl
              key={lock.entity_id}
              device={lock}
              isActive={lock.state === 'locked'}
              onToggle={() => controlLock(lock.entity_id, lock.state === 'locked' ? 'unlock' : 'lock')}
              icon={<Lock className="w-4 h-4" />}
              activeColor="bg-green-500"
            />
          ))}
        </DeviceTypeSummaryCard>
      )}
    </div>
  );
};

export default DeviceControlsSection;