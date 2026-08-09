"use client";

import React, { createContext, useContext, useState } from "react";

export interface BookingState {
  movieId?: string;
  movieTitle?: string;
  moviePoster?: string;
  cinemaId?: string;
  cinemaName?: string;
  showtimeId?: string;
  showtimeDate?: string;
  showtimeTime?: string;
  showtimeFormat?: string;
  hallName?: string;
  selectedSeats: { id: string; label: string; price: number; type: string }[];
  foodItems: { foodItemId: string; name: string; price: number; quantity: number }[];
}

interface BookingContextType {
  booking: BookingState;
  setMovie: (movie: { id: string; title: string; poster: string }) => void;
  setShowtime: (showtime: { id: string; cinemaId: string; cinemaName: string; date: string; time: string; format: string; hallName: string }) => void;
  toggleSeat: (seat: { id: string; label: string; price: number; type: string }) => void;
  updateFoodQuantity: (item: { foodItemId: string; name: string; price: number }, delta: number) => void;
  resetBooking: () => void;
  calculateTotal: () => { seatsTotal: number; foodTotal: number; bookingFee: number; grandTotal: number };
}

const defaultState: BookingState = {
  selectedSeats: [],
  foodItems: [],
};

const BookingContext = createContext<BookingContextType>({
  booking: defaultState,
  setMovie: () => {},
  setShowtime: () => {},
  toggleSeat: () => {},
  updateFoodQuantity: () => {},
  resetBooking: () => {},
  calculateTotal: () => ({ seatsTotal: 0, foodTotal: 0, bookingFee: 0, grandTotal: 0 }),
});

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(defaultState);

  const setMovie = (movie: { id: string; title: string; poster: string }) => {
    setBooking((prev) => ({
      ...prev,
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.poster,
    }));
  };

  const setShowtime = (st: {
    id: string;
    cinemaId: string;
    cinemaName: string;
    date: string;
    time: string;
    format: string;
    hallName: string;
  }) => {
    setBooking((prev) => ({
      ...prev,
      showtimeId: st.id,
      cinemaId: st.cinemaId,
      cinemaName: st.cinemaName,
      showtimeDate: st.date,
      showtimeTime: st.time,
      showtimeFormat: st.format,
      hallName: st.hallName,
    }));
  };

  const toggleSeat = (seat: { id: string; label: string; price: number; type: string }) => {
    setBooking((prev) => {
      const exists = prev.selectedSeats.some((s) => s.id === seat.id);
      if (exists) {
        return {
          ...prev,
          selectedSeats: prev.selectedSeats.filter((s) => s.id !== seat.id),
        };
      } else {
        return {
          ...prev,
          selectedSeats: [...prev.selectedSeats, seat],
        };
      }
    });
  };

  const updateFoodQuantity = (item: { foodItemId: string; name: string; price: number }, delta: number) => {
    setBooking((prev) => {
      const existingIndex = prev.foodItems.findIndex((f) => f.foodItemId === item.foodItemId);
      const updated = [...prev.foodItems];

      if (existingIndex > -1) {
        const newQty = updated[existingIndex].quantity + delta;
        if (newQty <= 0) {
          updated.splice(existingIndex, 1);
        } else {
          updated[existingIndex].quantity = newQty;
        }
      } else if (delta > 0) {
        updated.push({
          foodItemId: item.foodItemId,
          name: item.name,
          price: item.price,
          quantity: delta,
        });
      }

      return { ...prev, foodItems: updated };
    });
  };

  const resetBooking = () => {
    setBooking(defaultState);
  };

  const calculateTotal = () => {
    const seatsTotal = booking.selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const foodTotal = booking.foodItems.reduce((sum, f) => sum + f.price * f.quantity, 0);
    const bookingFee = booking.selectedSeats.length > 0 ? 2.50 : 0;
    const grandTotal = seatsTotal + foodTotal + bookingFee;
    return { seatsTotal, foodTotal, bookingFee, grandTotal };
  };

  return (
    <BookingContext.Provider
      value={{
        booking,
        setMovie,
        setShowtime,
        toggleSeat,
        updateFoodQuantity,
        resetBooking,
        calculateTotal,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
