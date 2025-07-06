import React from 'react';
import { Shield } from 'lucide-react';

interface AlarmCardProps {
  onClick?: () => void;
}

const AlarmCard: React.FC<AlarmCardProps> = ({ onClick }) => {
  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer min-w-[120px]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 bg-red-500/20 rounded-full shadow-lg">
          <Shield className="w-6 h-6 text-red-600" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Alarm</div>
          <div className="text-xs text-red-600 font-medium">Armed</div>
        </div>
      </div>
    </div>
  );
};

export default AlarmCard;