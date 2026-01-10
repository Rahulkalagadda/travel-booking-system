import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import bookingReducer from './slices/bookingSlice';
import hotelReducer from './slices/hotelSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        booking: bookingReducer,
        hotel: hotelReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for Firebase timestamps
                ignoredActions: ['user/setUser', 'booking/addBooking'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.timestamp', 'payload.createdAt'],
                // Ignore these paths in the state
                ignoredPaths: ['user.createdAt', 'booking.items.createdAt'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
