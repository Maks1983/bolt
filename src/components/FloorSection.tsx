import React from 'react';
import RoomCard from './RoomCard';

interface FloorSectionProps {
  title: string;
  rooms: Array<{
    name: string;
    floor: string;
    backgroundImage: string;
  }>;
}

const FloorSection: React.FC<FloorSectionProps> = ({ title, rooms }) => {
  return (
    <div>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {rooms.map((room, index) => (
            <RoomCard 
              key={index} 
              roomName={room.name}
              floor={room.floor}
              backgroundImage={room.backgroundImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloorSection;