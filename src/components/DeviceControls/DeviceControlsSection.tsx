import React, { useState, useMemo } from 'react';
import { Lightbulb, Columns2, Volume2, Power, PowerOff, ChevronUp, ChevronDown } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';
import { Device, LightDevice, BlindDevice, MediaPlayerDevice } from '../../types/devices';
import MinimalLightControl from './MinimalControls/MinimalLightControl';
import MinimalCoverControl from './MinimalControls/MinimalCoverControl';
import MinimalMediaPlayerControl from './MinimalControls/MinimalMediaPlayerControl';
import MinimalFanControl from './MinimalControls/MinimalFanControl';
import MinimalLockControl from './MinimalControls/MinimalLockControl';

interface DeviceControlsSectionProps {
  activeTab: 'whole-house' | 'upper-floor' | 'lower-floor' | 'apartment';
}

const DeviceControlsSection: React.FC<DeviceControlsSectionProps> = ({ activeTab }) => {
  const { state, controlLight, controlCover, controlMediaPlayer } = useDevices();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    lights: true,
    covers: true,
    media: true
  });

  // Filter devices based on active tab
  const getFilteredDevices = useMemo(() => {
    let devices = state.devices;

    if (activeTab !== 'whole-house') {
      const floorName = activeTab === 'upper-floor' ? 'Upper Floor' : 
                       activeTab === 'lower-floor' ? 'Lower Floor' : 'Apartment';
      devices = devices.filter(device => device.floor === floorName);
    }

    // Group devices by type (excluding sensors, locks, fans, cameras)
    const lights = devices.filter(d => d.device_type === 'light') as LightDevice[];
    const covers = devices.filter(d => d.device_type === 'cover') as BlindDevice[];
    const mediaPlayers = devices.filter(d => d.device_type === 'media_player') as MediaPlayerDevice[];

    return { lights, covers, mediaPlayers };
  }, [state.devices, activeTab]);

  const { lights, covers, mediaPlayers } = getFilteredDevices;

  // Quick action handlers
  const handleLightsAllOn = () => {
    lights.forEach(light => {
      if (light.state === 'off') {
        controlLight(light.entity_id, true, 255);
      }
    });
  };

  const handleLightsAllOff = () => {
    lights.forEach(light => {
      if (light.state === 'on') {
        controlLight(light.entity_id, false);
      }
    });
  };

  const handleCoversOpenAll = () => {
    covers.forEach(cover => {
      if (cover.state !== 'open') {
        controlCover(cover.entity_id, 'open');
      }
    });
  };

  const handleCoversCloseAll = () => {
    covers.forEach(cover => {
      if (cover.state !== 'closed') {
        controlCover(cover.entity_id, 'close');
      }
    });
  };

  const handleMediaPauseAll = () => {
    mediaPlayers.forEach(player => {
      if (player.state === 'playing') {
        controlMediaPlayer(player.entity_id, 'pause');
      }
    });
  };

  const handleMediaPlayAll = () => {
    mediaPlayers.forEach(player => {
      if (player.state === 'paused') {
        controlMediaPlayer(player.entity_id, 'play');
      }
    });
  };

  const toggleGroupExpansion = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Device group component
  const DeviceGroup: React.FC<{
    title: string;
    icon: React.ReactNode;
    devices: Device[];
    quickActions: Array<{ label: string; action: () => void; variant: 'primary' | 'secondary' }>;
    groupKey: string;
    children: React.ReactNode;
  }> = ({ title, icon, devices, quickActions, groupKey, children }) => {
    const isExpanded = expandedGroups[groupKey];
    const deviceCount = devices.length;

    if (deviceCount === 0) return null;

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  {icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500">{deviceCount} device{deviceCount !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Quick Actions */}
                <div className="flex space-x-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                        action.variant === 'primary'
                          ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => toggleGroupExpansion(groupKey)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="p-6 pt-0">
            {children}
          </div>
        </div>
      </div>
    );
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

  const totalDevices = lights.length + covers.length + mediaPlayers.length;

  if (totalDevices === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg font-medium">
          No controllable devices found
        </div>
        <div className="text-gray-500 text-sm mt-2">
          {activeTab === 'whole-house' 
            ? 'Add lights, covers, or media players to see controls here'
            : `No devices configured for ${getTabTitle()}`
          }
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Device Controls - {getTabTitle()}
        </h2>
        <p className="text-gray-600">
          Control {totalDevices} device{totalDevices !== 1 ? 's' : ''} across {
            [lights.length > 0 && 'lights', covers.length > 0 && 'covers', mediaPlayers.length > 0 && 'media players']
              .filter(Boolean).join(', ')
          }
        </p>
      </div>

      {/* Lights Group */}
      <DeviceGroup
        title="Lights"
        icon={<Lightbulb className="w-6 h-6 text-blue-600" />}
        devices={lights}
        groupKey="lights"
        quickActions={[
          { label: 'All On', action: handleLightsAllOn, variant: 'primary' },
          { label: 'All Off', action: handleLightsAllOff, variant: 'secondary' }
        ]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {lights.map((light) => (
            <div key={light.entity_id} className="transform transition-all duration-200 hover:scale-[1.02]">
              <MinimalLightControl device={light} />
            </div>
          ))}
        </div>
      </DeviceGroup>

      {/* Blinds & Curtains Group */}
      <DeviceGroup
        title="Blinds & Curtains"
        icon={<Columns2 className="w-6 h-6 text-blue-600" />}
        devices={covers}
        groupKey="covers"
        quickActions={[
          { label: 'Open All', action: handleCoversOpenAll, variant: 'primary' },
          { label: 'Close All', action: handleCoversCloseAll, variant: 'secondary' }
        ]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {covers.map((cover) => (
            <div key={cover.entity_id} className="transform transition-all duration-200 hover:scale-[1.02]">
              <MinimalCoverControl device={cover} />
            </div>
          ))}
        </div>
      </DeviceGroup>

      {/* Speakers & Media Group */}
      <DeviceGroup
        title="Speakers & Media"
        icon={<Volume2 className="w-6 h-6 text-blue-600" />}
        devices={mediaPlayers}
        groupKey="media"
        quickActions={[
          { label: 'Play All', action: handleMediaPlayAll, variant: 'primary' },
          { label: 'Pause All', action: handleMediaPauseAll, variant: 'secondary' }
        ]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mediaPlayers.map((player) => (
            <div key={player.entity_id} className="transform transition-all duration-200 hover:scale-[1.02]">
              <MinimalMediaPlayerControl device={player} />
            </div>
          ))}
        </div>
      </DeviceGroup>
    </div>
  );
};

export default DeviceControlsSection;