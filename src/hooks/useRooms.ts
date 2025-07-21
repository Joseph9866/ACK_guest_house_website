import { useState, useEffect, useCallback } from 'react';

// Base room type for frontend-only implementation
export interface RoomWithAvailability {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  image_url: string;
  created_at: string;
  updated_at: string;
  available: boolean;
  bed_only: number;
  bb: number;
  half_board: number;
  full_board: number;
}

const mockRooms: RoomWithAvailability[] = (() => {
  const now = new Date().toISOString();
  return [
    {
      id: '1',
      name: 'Single Room',
      description: 'Simple single bed room with private bathroom and Wi-Fi.',
      price: 1000,
      bed_only: 1000,
      bb: 1200,
      half_board: 2500,
      full_board: 3500,
      capacity: 1,
      amenities: ['TV', 'Desk', 'Free Wi-Fi', 'Private Bathroom', 'Wardrobe'],
      image_url: 'Images/ACKbed.jpeg',
      created_at: now,
      updated_at: now,
      available: true
    },
    {
      id: '2',
      name: 'Double Room',
      description: 'Double bed room ideal for couples. Comes with private bath and fridge.',
      price: 1200,
      bed_only: 1200,
      bb: 1500,
      half_board: 2800,
      full_board: 4300,
      capacity: 2,
      amenities: ['Desk', 'Wardrobe', 'Private Bathroom', 'Free Wi-Fi', 'TV', 'Mini Fridge'],
      image_url: 'Images/ACKbedmain.jpeg',
      created_at: now,
      updated_at: now,
      available: true
    },
    {
      id: '3',
      name: 'Double Room + Extra Bed',
      description: 'Spacious room with extra bed for kids or third guest.',
      price: 2500,
      bed_only: 2500,
      bb: 2900,
      half_board: 4300,
      full_board: 6300,
      capacity: 3,
      amenities: ['Desk', 'Wardrobe', 'Private Bathroom', 'Free Wi-Fi', 'TV', 'Mini Fridge', 'Seating Area'],
      image_url: 'Images/ACKbedview.jpeg',
      created_at: now,
      updated_at: now,
      available: true
    }
  ];
})();

// Check room availability against local storage bookings
const checkRoomAvailability = (roomId: string, checkIn?: string, checkOut?: string): boolean => {
  if (!checkIn || !checkOut) return true;

  const bookings = JSON.parse(localStorage.getItem('ack_bookings') || '[]');
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Check for overlapping bookings
  const hasOverlap = bookings.some((booking: any) => {
    if (booking.roomType !== roomId || booking.status === 'cancelled') return false;

    const bookingCheckIn = new Date(booking.checkIn);
    const bookingCheckOut = new Date(booking.checkOut);

    return (
      (checkInDate <= bookingCheckIn && checkOutDate > bookingCheckIn) ||
      (checkInDate < bookingCheckOut && checkOutDate >= bookingCheckOut) ||
      (checkInDate >= bookingCheckIn && checkOutDate <= bookingCheckOut)
    );
  });

  return !hasOverlap;
};

export const useRooms = (checkIn?: string, checkOut?: string) => {
  const [rooms, setRooms] = useState<RoomWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update room availability based on bookings
      const roomsWithAvailability = mockRooms.map(room => ({
        ...room,
        available: checkRoomAvailability(room.id, checkIn, checkOut)
      }));

      setRooms(roomsWithAvailability);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Room fetch failed:', message);
      setError(message);
      setRooms(mockRooms);
    } finally {
      setLoading(false);
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, error, refetch: fetchRooms };
};