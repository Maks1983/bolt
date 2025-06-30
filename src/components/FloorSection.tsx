import React from 'react';
import RoomCard from './RoomCard';

interface FloorSectionProps {
  title: string;
  rooms: Array<{
    name: string;
    floor: string;
    lights: { on: number; total: number };
    temperature: number;
    humidity: number;
    presence: boolean;
    windowOpen: boolean;
    backgroundImage: string;
  }>;
}

const FloorSection: React.FC<FloorSectionProps> = ({ title, rooms }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 px-6">{title}</h2>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 px-6 pb-2">
          {rooms.map((room, index) => (
            <RoomCard key={index} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloorSection;