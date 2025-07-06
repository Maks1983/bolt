import React from 'react';
import { Lock } from 'lucide-react';

interface SecurityCardProps {
  onClick?: () => void;
}

const SecurityCard: React.FC<SecurityCardProps> = ({ onClick }) => {
  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer min-w-[120px]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 bg-green-500/20 rounded-full shadow-lg">
          <Lock className="w-6 h-6 text-green-600" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Security</div>
          <div className="text-xs text-green-600 font-medium">Secure</div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCard;