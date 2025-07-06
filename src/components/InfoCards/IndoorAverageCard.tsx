import React from 'react';
import { Thermometer } from 'lucide-react';

interface IndoorAverageCardProps {
  onClick?: () => void;
}

const IndoorAverageCard: React.FC<IndoorAverageCardProps> = ({ onClick }) => {
  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer min-w-[120px]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 bg-blue-500/20 rounded-full shadow-lg">
          <Thermometer className="w-6 h-6 text-blue-600" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Indoor Avg</div>
          <div className="text-xs text-gray-600 font-medium">22.1°C</div>
        </div>
      </div>
    </div>
  );
};

export default IndoorAverageCard;