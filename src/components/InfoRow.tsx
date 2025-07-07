import React, { useState } from 'react';
import AlarmCard from './InfoCards/AlarmCard';
import SecurityCard from './InfoCards/SecurityCard';
import EnergyCard from './InfoCards/EnergyCard';
import IndoorAverageCard from './InfoCards/IndoorAverageCard';
import ActivityCard from './InfoCards/ActivityCard';
import ActionsCard from './InfoCards/ActionsCard';
import NVRCard from './InfoCards/NVRCard';

interface Camera {
  id: number;
  name: string;
  location: string;
  recording: boolean;
  nightVision: boolean;
  temperature: number;
  humidity: number;
  backgroundImage: string;
}

interface InfoRowProps {
  cameras: Camera[];
}

const InfoRow: React.FC<InfoRowProps> = ({ cameras }) => {
  const [showNVRModal, setShowNVRModal] = useState(false);

  const handleNVRClick = () => {
    setShowNVRModal(true);
  };

  const handleCloseNVRModal = () => {
    setShowNVRModal(false);
  };

  return (
    <div className="px-6 py-4">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 min-w-max">
          <AlarmCard />
          <SecurityCard />
          <EnergyCard />
          <IndoorAverageCard />
          <ActivityCard />
          <ActionsCard />
          <NVRCard onClick={handleNVRClick} />
        </div>
      </div>
    </div>
  );
};

export default InfoRow;