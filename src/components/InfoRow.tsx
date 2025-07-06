import React, { useState } from 'react';
import NVRCard from './InfoCards/NVRCard';
import NetworkCard from './InfoCards/NetworkCard';
import SecurityCard from './InfoCards/SecurityCard';
import EnvironmentCard from './InfoCards/EnvironmentCard';
import NVRModal from './InfoCards/NVRModal';

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
  const [showNVR, setShowNVR] = useState(false);

  return (
    <>
      <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* NVR System */}
          <NVRCard onClick={() => setShowNVR(true)} />

          {/* Network Status */}
          <NetworkCard />

          {/* Security Status */}
          <SecurityCard />

          {/* Environmental */}
          <EnvironmentCard />
        </div>
      </div>

      {/* NVR Modal */}
      <NVRModal isOpen={showNVR} onClose={() => setShowNVR(false)} />
    </>
  );
};

export default InfoRow;