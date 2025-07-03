/**
 * Room and Floor Configuration
 * 
 * This file defines the structure of rooms and floors in your smart home.
 * These are used for organizing devices and creating the UI layout.
 */

import { Room, Floor } from '../types/devices';

// Room configurations
export const roomConfigs: Room[] = [
  {
    id: 'master_bedroom',
    name: 'Master Bedroom',
    floor: 'Upper Floor',
    background_image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: []
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    floor: 'Upper Floor',
    background_image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: []
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    floor: 'Upper Floor',
    background_image: 'https://images.pexels.com/photos/6301176/pexels-photo-6301176.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: []
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    floor: 'Upper Floor',
    background_image: 'https://images.pexels.com/photos/279648/pexels-photo-279648.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: []
  },
  {
    id: 'living_room',
    name: 'Living Room',
    floor: 'Upper Floor',
    background_image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: []
  },
  {
    id: 'entrance',
    name: 'Entrance',
    floor: 'Lower Floor',
    background_image: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: []
  },
  {
    id: 'office',
    name: 'Office',
    floor: 'Lower Floor',
    background_image: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: []
  },
  {
    id: 'laundry',
    name: 'Laundry',
    floor: 'Lower Floor',
    background_image: 'https://images.pexels.com/photos/4993073/pexels-photo-4993073.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: []
  },
  /*{
    id: 'ap_living_room',
    name: 'Ap Living Room',
    floor: 'Apartment',
    background_image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
    devices: []
  }*/
];

// Floor configurations
export const floorConfigs: Floor[] = [
  {
    id: 'upper_floor',
    name: 'Upper Floor',
    rooms: roomConfigs.filter(r => r.floor === 'Upper Floor')
  },
  {
    id: 'lower_floor',
    name: 'Lower Floor',
    rooms: roomConfigs.filter(r => r.floor === 'Lower Floor')
  },
  {
    id: 'apartment',
    name: 'Apartment',
    rooms: roomConfigs.filter(r => r.floor === 'Apartment')
  }
];
