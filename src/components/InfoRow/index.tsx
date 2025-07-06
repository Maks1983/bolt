import React from 'react';
import CompactStatsRow from './CompactStatsRow';
import QuickActionsBar from './QuickActionsBar';

const InfoRow: React.FC = () => {
  return (
    <div className="px-6 py-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Compact Stats Row */}
        <CompactStatsRow />
        
        {/* Quick Actions Bar */}
        <QuickActionsBar />
      </div>
    </div>
  );
};

export default InfoRow;