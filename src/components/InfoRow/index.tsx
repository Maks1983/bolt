import React from 'react';
import SystemOverviewCard from './SystemOverviewCard';
import QuickStatsGrid from './QuickStatsGrid';
import AlertsAndNotifications from './AlertsAndNotifications';
import QuickActionsPanel from './QuickActionsPanel';

const InfoRow: React.FC = () => {
  return (
    <div className="px-6 py-6 bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Main Dashboard Overview */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Row - System Overview */}
        <SystemOverviewCard />
        
        {/* Middle Row - Quick Stats Grid */}
        <QuickStatsGrid />
        
        {/* Bottom Row - Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AlertsAndNotifications />
          </div>
          <div>
            <QuickActionsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoRow;