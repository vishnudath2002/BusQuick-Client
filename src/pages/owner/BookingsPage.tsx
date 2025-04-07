import React, { useState, useEffect } from 'react';
import {  fetchAllBookings } from '../../api/ownerApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Booking } from '../../types/Booking';
import { BookingsList } from '../../components/owner/BookingsList';


export const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
 
  const ownerId = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    const loadBookings = async () => {
      if (ownerId) {
        try {
          const bookingData = await fetchAllBookings(ownerId);
          setBookings(Array.isArray(bookingData) ? bookingData : bookingData.bookings ?? []);
        } catch (error) {
          console.error('Failed to fetch buses:', error);
        }
      }
    };

    loadBookings();
  }, [ownerId]);


  return (
    <BookingsList
      booking={bookings ?? []}
    />
  );
  
};