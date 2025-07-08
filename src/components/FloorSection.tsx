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
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-2">
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