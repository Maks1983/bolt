import React, { useState, useMemo, useEffect } from 'react';
import { Lightbulb, Columns2, Volume2, Fan, Lock, X, Zap } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';
import { Device, LightDevice, BlindDevice, MediaPlayerDevice, FanDevice, LockDevice } from '../../types/devices';
import LightControl from './LightControl';
import CoverControl from './CoverControl';
import MediaPlayerControl from './MediaPlayerControl';
import FanControl from './FanControl';
import LockControl from './LockControl';

interface DeviceControlsSectionProps {
  activeTab: 'whole-house' | 'upper-floor' | 'lower-floor' | 'apartment';
}

const DeviceControlsSection: React.FC<DeviceControlsSectionProps> = ({ activeTab }) => {
  const { state, controlLight, controlCover, controlMediaPlayer, controlFan, controlLock } = useDevices();
  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(null);
  
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedDeviceType) {
      document.body.classList.add('modal-open');
      // Prevent scroll on the main container
      const mainContainer = document.querySelector('.main-scroll-container');
      if (mainContainer) {
        (mainContainer as HTMLElement).style.overflow = 'hidden';
      }
    } else {
      document.body.classList.remove('modal-open');
      // Restore scroll on the main container
      const mainContainer = document.querySelector('.main-scroll-container');
      if (mainContainer) {
        (mainContainer as HTMLElement).style.overflow = 'auto';
      }
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
      const mainContainer = document.querySelector('.main-scroll-container');
      if (mainContainer) {
        (mainContainer as HTMLElement).style.overflow = 'auto';
      }
    };
  }, [selectedDeviceType]);

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
    backgroundImage: string;
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
    backgroundImage
  }) => {
    if (totalCount === 0) return null;

    const hasActiveDevices = activeCount > 0;
    const activityPercentage = (activeCount / totalCount) * 100;

    return (
      <div 
        className="relative seamless-card rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer w-full max-w-sm mx-auto"
        onClick={() => setSelectedDeviceType(cardType)}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/20"></div>
        </div>
        
        {/* Content */}
        <div className="relative p-6 h-44 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
              <p className="text-white/90 text-sm">{statusText}</p>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction();
              }}
              className="unified-button flex items-center space-x-2 text-white px-3 py-2 rounded-lg text-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              <span>{quickActionText}</span>
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>
          
          {/* Bottom Info */}
          <div className="space-y-3">
            {/* Device Icon and Activity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  hasActiveDevices 
                    ? 'bg-gray-800/60 subtle-glow-blue' 
                    : 'bg-gray-800/30'
                }`}>
                  <div className={`transition-all duration-300 ${
                    hasActiveDevices ? iconBg : 'text-white/80'
                  }`}>
                    {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
                  </div>
                </div>
                
                <div>
                  <div className="text-white text-lg font-bold">
                    {activeCount}/{totalCount}
                  </div>
                  <div className="text-white/80 text-sm">
                    {hasActiveDevices ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Activity Bar */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90 text-sm font-medium">Activity</span>
                <span className="text-white text-sm font-bold">{Math.round(activityPercentage)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
                <div 
                  className="seamless-progress-fill h-full transition-all duration-1000 ease-out"
                  style={{ width: `${activityPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
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

  // Get current device type data for modal
  const getCurrentDeviceTypeData = () => {
    switch (selectedDeviceType) {
      case 'lights':
        return {
          title: 'Lights',
          devices: lights,
          icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
          backgroundImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
          activeCount: lights.filter(l => l.state === 'on').length,
          totalCount: lights.length,
          onToggleAll: handleLightsToggleAll,
          toggleAllText: lights.some(l => l.state === 'on') ? 'Turn All Off' : 'Turn All On'
        };
      case 'covers':
        return {
          title: 'Blinds & Curtains',
          devices: covers,
          icon: <Columns2 className="w-6 h-6 text-blue-600" />,
          backgroundImage: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
          activeCount: covers.filter(c => c.state === 'closed').length,
          totalCount: covers.length,
          onToggleAll: handleCoversToggleAll,
          toggleAllText: covers.some(c => c.state === 'closed') ? 'Open All' : 'Close All'
        };
      case 'media':
        return {
          title: 'Speakers & Media',
          devices: mediaPlayers,
          icon: <Volume2 className="w-6 h-6 text-purple-600" />,
          backgroundImage: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
          activeCount: mediaPlayers.filter(m => m.state === 'playing').length,
          totalCount: mediaPlayers.length,
          onToggleAll: handleMediaToggleAll,
          toggleAllText: mediaPlayers.some(m => m.state === 'playing') ? 'Pause All' : 'Play All'
        };
      case 'fans':
        return {
          title: 'Fans',
          devices: fans,
          icon: <Fan className="w-6 h-6 text-cyan-600" />,
          backgroundImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
          activeCount: fans.filter(f => f.state === 'on').length,
          totalCount: fans.length,
          onToggleAll: handleFansToggleAll,
          toggleAllText: fans.some(f => f.state === 'on') ? 'Turn All Off' : 'Turn All On'
        };
      case 'locks':
        return {
          title: 'Locks',
          devices: locks,
          icon: <Lock className="w-6 h-6 text-green-600" />,
          backgroundImage: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800',
          activeCount: locks.filter(l => l.state === 'unlocked').length,
          totalCount: locks.length,
          onToggleAll: handleLocksToggleAll,
          toggleAllText: locks.some(l => l.state === 'unlocked') ? 'Lock All' : 'Unlock All'
        };
      default:
        return null;
    }
  };

  const currentDeviceTypeData = getCurrentDeviceTypeData();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {/* Lights Card */}
        <DeviceTypeSummaryCard
          title="Lights"
          icon={<Lightbulb />}
          devices={lights}
          activeCount={lights.filter(l => l.state === 'on').length}
          totalCount={lights.length}
          statusText={`${lights.filter(l => l.state === 'on').length} of ${lights.length} lights on`}
          gradientFrom="from-yellow-400/80"
          gradientTo="to-amber-500/80"
          iconBg="text-yellow-600"
          cardType="lights"
          onQuickAction={handleLightsToggleAll}
          quickActionText={lights.some(l => l.state === 'on') ? 'All Off' : 'All On'}
          backgroundImage="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800"
        />

        {/* Blinds & Curtains Card */}
        <DeviceTypeSummaryCard
          title="Blinds & Curtains"
          icon={<Columns2 />}
          devices={covers}
          activeCount={covers.filter(c => c.state === 'closed').length}
          totalCount={covers.length}
          statusText={`${covers.filter(c => c.state === 'closed').length} of ${covers.length} covers closed`}
          gradientFrom="from-blue-400/80"
          gradientTo="to-cyan-500/80"
          iconBg="text-blue-600"
          cardType="covers"
          onQuickAction={handleCoversToggleAll}
          quickActionText={covers.some(c => c.state === 'closed') ? 'Open All' : 'Close All'}
          backgroundImage="https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800"
        />

        {/* Speakers & Media Card */}
        <DeviceTypeSummaryCard
          title="Speakers & Media"
          icon={<Volume2 />}
          devices={mediaPlayers}
          activeCount={mediaPlayers.filter(m => m.state === 'playing').length}
          totalCount={mediaPlayers.length}
          statusText={`${mediaPlayers.filter(m => m.state === 'playing').length} of ${mediaPlayers.length} playing`}
          gradientFrom="from-purple-400/80"
          gradientTo="to-pink-500/80"
          iconBg="text-purple-600"
          cardType="media"
          onQuickAction={handleMediaToggleAll}
          quickActionText={mediaPlayers.some(m => m.state === 'playing') ? 'Pause All' : 'Play All'}
          backgroundImage="https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800"
        />

        {/* Fans Card */}
        {fans.length > 0 && (
          <DeviceTypeSummaryCard
            title="Fans"
            icon={<Fan />}
            devices={fans}
            activeCount={fans.filter(f => f.state === 'on').length}
            totalCount={fans.length}
            statusText={`${fans.filter(f => f.state === 'on').length} of ${fans.length} fans running`}
            gradientFrom="from-cyan-400/80"
            gradientTo="to-teal-500/80"
            iconBg="text-cyan-600"
            cardType="fans"
            onQuickAction={handleFansToggleAll}
            quickActionText={fans.some(f => f.state === 'on') ? 'All Off' : 'All On'}
            backgroundImage="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800"
          />
        )}

        {/* Locks Card */}
        {locks.length > 0 && (
          <DeviceTypeSummaryCard
            title="Locks"
            icon={<Lock />}
            devices={locks}
            activeCount={locks.filter(l => l.state === 'unlocked').length}
            totalCount={locks.length}
            statusText={`${locks.filter(l => l.state === 'unlocked').length} of ${locks.length} locks unlocked`}
            gradientFrom="from-green-400/80"
            gradientTo="to-emerald-500/80"
            iconBg="text-green-600"
            cardType="locks"
            onQuickAction={handleLocksToggleAll}
            quickActionText={locks.some(l => l.state === 'unlocked') ? 'Lock All' : 'Unlock All'}
            backgroundImage="https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800"
          />
        )}
      </div>

      {/* Device Type Modal */}
      {selectedDeviceType && currentDeviceTypeData && (
        <div className="modal-backdrop bg-black/60 backdrop-blur-xl">
          <div className="modal-content-wrapper">
            <div className="modal-content-container seamless-modal animate-in fade-in-0 zoom-in-95 duration-300">
              {/* Header */}
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <div 
                  className="absolute inset-0 bg-cover bg-center scale-110"
                  style={{ backgroundImage: `url(${currentDeviceTypeData.backgroundImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/60 to-gray-900/30"></div>
                </div>
                <div className="relative p-6 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="unified-button p-3 rounded-xl">
                        {currentDeviceTypeData.icon}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-1">{currentDeviceTypeData.title}</h2>
                        <p className="text-white/90 text-lg">
                          {currentDeviceTypeData.activeCount} of {currentDeviceTypeData.totalCount} active
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedDeviceType(null)}
                      className="unified-button p-3 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {Math.round((currentDeviceTypeData.activeCount / currentDeviceTypeData.totalCount) * 100)}%
                      </div>
                      <div className="text-white/80 text-sm font-medium">Activity Level</div>
                    </div>
                    
                    <button
                      onClick={currentDeviceTypeData.onToggleAll}
                      className="unified-button flex items-center space-x-2 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                      <Zap className="w-5 h-5" />
                      <span>{currentDeviceTypeData.toggleAllText}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="modal-scrollable-content p-6">
                <h3 className="text-xl font-bold text-primary mb-6">Individual Device Controls</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {selectedDeviceType === 'lights' && lights.map((light) => (
                    <LightControl key={light.entity_id} device={light} />
                  ))}
                  
                  {selectedDeviceType === 'covers' && covers.map((cover) => (
                    <CoverControl 
                      key={cover.entity_id} 
                      device={cover}
                      type={cover.friendly_name.toLowerCase().includes('curtain') ? 'curtain' : 'blind'}
                    />
                  ))}
                  
                  {selectedDeviceType === 'media' && mediaPlayers.map((player) => (
                    <MediaPlayerControl key={player.entity_id} device={player} />
                  ))}
                  
                  {selectedDeviceType === 'fans' && fans.map((fan) => (
                    <FanControl key={fan.entity_id} device={fan} />
                  ))}
                  
                  {selectedDeviceType === 'locks' && locks.map((lock) => (
                    <LockControl key={lock.entity_id} device={lock} variant="card" />
                  ))}
                </div>
                
                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-gray-700/20">
                  <div className="flex items-center justify-between">
                    <div className="text-secondary">
                      <span className="text-sm">
                        {currentDeviceTypeData.devices.length} device{currentDeviceTypeData.devices.length !== 1 ? 's' : ''} total
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={currentDeviceTypeData.onToggleAll}
                        className="unified-button-primary px-6 py-3 text-white rounded-2xl font-semibold"
                      >
                        {currentDeviceTypeData.toggleAllText}
                      </button>
                      <button 
                        onClick={() => setSelectedDeviceType(null)}
                        className="unified-button px-6 py-3 text-secondary rounded-2xl hover:text-accent font-semibold"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceControlsSection;