import React from 'react';
import { Zap } from 'lucide-react';

interface EnergyCardProps {
  onClick?: () => void;
}

const EnergyCard: React.FC<EnergyCardProps> = ({ onClick }) => {
  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer min-w-[120px]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 bg-yellow-500/20 rounded-full shadow-lg">
          <Zap className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Energy</div>
          <div className="text-xs text-gray-600 font-medium">0.8 kW</div>
        </div>
      </div>
    </div>
  );
};

export default EnergyCard;