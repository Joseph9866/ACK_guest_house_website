import React, { useState } from 'react';
import { useRooms } from '../hooks/useRooms';
import { useBookings } from '../hooks/useBookings';
import type { BookingData } from '../utils/types';

interface BookingFormProps {
  selectedRoom?: string;
  onSubmit: (data: BookingData) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedRoom, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<BookingData, 'mealPlan'>>({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: selectedRoom ? parseInt(selectedRoom) : 0,
    specialRequests: '',
  });

  const [mealPlan, setMealPlan] = useState<BookingData['mealPlan']>('bed_only');
  const [errors, setErrors] = useState<Partial<BookingData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { rooms, loading: roomsLoading } = useRooms(formData.checkIn, formData.checkOut);
  const { createBooking } = useBookings();

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    if (!formData.roomType) newErrors.roomType = 'Please select a room type';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[+]?\d{7,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        newErrors.checkIn = 'Check-in date cannot be in the past';
      }

      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = 'Check-out date must be after check-in date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const bookingData = { ...formData, mealPlan };
      
      // Create booking in local storage
      const success = await createBooking(bookingData);
      
      if (success) {
        // Call parent onSubmit for UI updates
        onSubmit(bookingData);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('An error occurred while creating your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'mealPlan') {
      setMealPlan(value as BookingData['mealPlan']);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]:
          name === 'roomType' || name === 'guests'
            ? Number(value)
            : value,
      }));

      if (errors[name as keyof BookingData]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (roomsLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Make a Reservation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Full Name"
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Email Address"
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Phone Number"
            disabled={isSubmitting}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
          <input
            type="date"
            name="checkIn"
            value={formData.checkIn}
            min={getMinDate()}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            disabled={isSubmitting}
          />
          {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
          <input
            type="date"
            name="checkOut"
            value={formData.checkOut}
            min={formData.checkIn || getMinDate()}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            disabled={isSubmitting}
          />
          {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            min={1}
            max={4}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            disabled={isSubmitting}
          >
            <option value={0}>Select a Room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id} disabled={!room.available}>
                {room.name} {!room.available && '(Not Available)'}
              </option>
            ))}
          </select>
          {errors.roomType && <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan</label>
          <select
            name="mealPlan"
            value={mealPlan}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            disabled={isSubmitting}
          >
            <option value="bed_only">Bed Only</option>
            <option value="bb">Bed & Breakfast</option>
            <option value="half_board">Half Board</option>
            <option value="full_board">Full Board</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            rows={3}
            placeholder="Any special requests or requirements..."
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed font-semibold transition-colors"
        >
          {isSubmitting ? 'Creating Booking...' : 'Submit & Continue on WhatsApp'}
        </button>
      </form>
    </section>
  );
};

export default BookingForm;