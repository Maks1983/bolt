import React from 'react';
import { NVRCard } from './InfoCards/NVRCard';
import { ActionsCard } from './InfoCards/ActionsCard';
import { ActivityCard } from './InfoCards/ActivityCard';
import { IndoorAverageCard } from './InfoCards/IndoorAverageCard';
import { EnergyCard } from './InfoCards/EnergyCard';
import { SecurityCard } from './InfoCards/SecurityCard';
import { AlarmCard } from './InfoCards/AlarmCard';

const InfoRow: React.FC = () => {
  return (
    <>
      <NVRCard onClick={() => console.log('NVR clicked')} />
      <ActionsCard />
      <ActivityCard />
      <IndoorAverageCard />
      <EnergyCard />
      <SecurityCard />
      <AlarmCard />
    </>
  );
};

export default InfoRow;