import { useState } from 'react';
import { BookingData } from '../utils/types';

export interface BookingRecord {
  id: string;
  roomType: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  createdAt: string;
  mealPlan: 'bed_only' | 'bb' | 'half_board' | 'full_board';
}

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: BookingData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get existing bookings
      const existingBookings = JSON.parse(localStorage.getItem('ack_bookings') || '[]');

      // Calculate total amount based on meal plan and nights
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));

      // Mock room prices based on meal plan
      const roomPrices = {
        '1': { bed_only: 1000, bb: 1200, half_board: 2500, full_board: 3500 },
        '2': { bed_only: 1200, bb: 1500, half_board: 2800, full_board: 4300 },
        '3': { bed_only: 2500, bb: 2900, half_board: 4300, full_board: 6300 }
      };

      const roomPrice = roomPrices[bookingData.roomType as keyof typeof roomPrices];
      const pricePerNight = roomPrice ? roomPrice[bookingData.mealPlan] : 3500;
      const totalAmount = nights * pricePerNight;

      // Create new booking
      const newBooking: BookingRecord = {
        id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        roomType: bookingData.roomType.toString(),
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        specialRequests: bookingData.specialRequests,
        status: 'pending',
        totalAmount,
        createdAt: new Date().toISOString(),
        mealPlan: bookingData.mealPlan
      };

      // Check room availability
      const hasOverlap = existingBookings.some((booking: BookingRecord) => {
        if (booking.roomType !== newBooking.roomType || booking.status === 'cancelled') return false;

        const existingCheckIn = new Date(booking.checkIn);
        const existingCheckOut = new Date(booking.checkOut);

        return (
          (checkInDate <= existingCheckIn && checkOutDate > existingCheckIn) ||
          (checkInDate < existingCheckOut && checkOutDate >= existingCheckOut) ||
          (checkInDate >= existingCheckIn && checkOutDate <= existingCheckOut)
        );
      });

      if (hasOverlap) {
        throw new Error('Room is not available for the selected dates.');
      }

      // Save booking
      existingBookings.push(newBooking);
      localStorage.setItem('ack_bookings', JSON.stringify(existingBookings));

      console.log('✅ Booking created successfully:', newBooking);
      return true;
    } catch (err) {
      console.error('❌ Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBookings = async (): Promise<BookingRecord[]> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const bookings = JSON.parse(localStorage.getItem('ack_bookings') || '[]');
      return bookings.sort((a: BookingRecord, b: BookingRecord) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingRecord['status']): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const bookings = JSON.parse(localStorage.getItem('ack_bookings') || '[]');
      const updatedBookings = bookings.map((booking: BookingRecord) =>
        booking.id === bookingId ? { ...booking, status } : booking
      );

      localStorage.setItem('ack_bookings', JSON.stringify(updatedBookings));
      return true;
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update booking status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    getBookings,
    updateBookingStatus,
    loading,
    error
  };
};