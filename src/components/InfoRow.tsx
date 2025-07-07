import React from 'react';

interface InfoRowProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon }) => {
  return (
    <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        {icon && <div className="text-gray-600">{icon}</div>}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-sm text-gray-900 font-semibold">{value}</span>
    </div>
  );
};

export default InfoRow;