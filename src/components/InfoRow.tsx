import React from 'react';
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
  const handleCardClick = (cardName: string) => {
    console.log(`${cardName} card clicked`);
  };

  return (
    <div className="px-6 py-4">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 min-w-max">
          <div className="min-w-[280px]">
            <AlarmCard onClick={() => handleCardClick('Alarm')} />
          </div>
          
          <div className="min-w-[280px]">
            <SecurityCard onClick={() => handleCardClick('Security')} />
          </div>
          
          <div className="min-w-[280px]">
            <EnergyCard onClick={() => handleCardClick('Energy')} />
          </div>
          
          <div className="min-w-[280px]">
            <IndoorAverageCard onClick={() => handleCardClick('Indoor Average')} />
          </div>
          
          <div className="min-w-[280px]">
            <ActivityCard onClick={() => handleCardClick('Activity')} />
          </div>
          
          <div className="min-w-[280px]">
            <ActionsCard onClick={() => handleCardClick('Actions')} />
          </div>
          
          <div className="min-w-[280px]">
            <NVRCard onClick={() => handleCardClick('NVR')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoRow;