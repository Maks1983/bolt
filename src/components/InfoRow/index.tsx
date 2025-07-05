import React from 'react';
import AlarmCard from './AlarmCard';
import SecurityCard from './SecurityCard';
import EnergyCard from './EnergyCard';
import IndoorCard from './IndoorCard';
import ActivityCard from './ActivityCard';
import ActionsCard from './ActionsCard';
import NVRCard from './NVRCard';

const InfoRow: React.FC = () => {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-center">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          <AlarmCard />
          <SecurityCard />
          <EnergyCard />
          <IndoorCard />
          <ActivityCard />
          <ActionsCard />
          <NVRCard />
        </div>
      </div>
    </div>
  );
};

export default InfoRow;