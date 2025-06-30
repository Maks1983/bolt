import React from 'react';
import { Home, Shield, User, Moon, Plane, Sun } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';

const Header: React.FC = () => {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const users = [
    { name: 'Sarah', status: 'home', avatar: '👩‍💻' },
    { name: 'Mike', status: 'away', avatar: '👨‍💼' },
    { name: 'Emma', status: 'sleep', avatar: '👧' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'home': return <Home className="w-2 h-2" />;
      case 'away': return <Plane className="w-2 h-2" />;
      case 'sleep': return <Moon className="w-2 h-2" />;
      default: return <User className="w-2 h-2" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'home': return 'bg-emerald-500';
      case 'away': return 'bg-blue-500';
      case 'sleep': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'home': return 'Home';
      case 'away': return 'Away';
      case 'sleep': return 'Sleep';
      default: return 'Unknown';
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-6 py-2 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* User Presence - Left */}
        <div className="flex items-center space-x-2">
          {users.map((user, index) => (
            <div key={index} className="flex flex-col items-center space-y-1 bg-gray-50/80 rounded-lg px-2 py-1.5 border border-gray-200/40 shadow-sm">
              <div className="relative">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm">
                  {user.avatar}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${getStatusColor(user.status)} rounded-full flex items-center justify-center text-white border border-white shadow-sm`}>
                  {getStatusIcon(user.status)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 font-medium">{getStatusLabel(user.status)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Connection Status and System Status - Center */}
        <div className="flex items-center space-x-3">
          <ConnectionStatus />
          <div className="flex items-center space-x-2 bg-emerald-50/80 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200/50 shadow-sm">
            <Shield className="w-3 h-3" />
            <div className="text-xs font-bold">All Systems Normal</div>
          </div>
        </div>

        {/* Weather, Date and Time - Right */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-blue-50/80 rounded-lg px-3 py-1.5 border border-blue-200/50 shadow-sm">
            <Sun className="w-4 h-4 text-amber-500" />
            <div>
              <div className="text-sm font-bold text-gray-900">18°C</div>
              <div className="text-xs text-gray-500 font-medium">65%</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-bold text-gray-900">{currentTime}</div>
            <div className="text-xs text-gray-500 font-medium">{currentDate}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;