import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Booking {
    id: string;
    hotelId: string;
    hotelName: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: string;
}

interface BookingState {
    bookings: Booking[];
    currentBooking: Booking | null;
    loading: boolean;
    error: string | null;
}

const initialState: BookingState = {
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setBookings: (state, action: PayloadAction<Booking[]>) => {
            state.bookings = action.payload;
            state.loading = false;
            state.error = null;
        },
        addBooking: (state, action: PayloadAction<Booking>) => {
            state.bookings.unshift(action.payload);
            state.currentBooking = action.payload;
        },
        updateBooking: (state, action: PayloadAction<Booking>) => {
            const index = state.bookings.findIndex((b) => b.id === action.payload.id);
            if (index !== -1) {
                state.bookings[index] = action.payload;
            }
        },
        removeBooking: (state, action: PayloadAction<string>) => {
            state.bookings = state.bookings.filter((b) => b.id !== action.payload);
        },
        setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
            state.currentBooking = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearBookings: (state) => {
            state.bookings = [];
            state.currentBooking = null;
            state.error = null;
        },
    },
});

export const {
    setBookings,
    addBooking,
    updateBooking,
    removeBooking,
    setCurrentBooking,
    setLoading,
    setError,
    clearBookings,
} = bookingSlice.actions;

export default bookingSlice.reducer;
