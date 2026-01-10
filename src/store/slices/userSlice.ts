import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from 'firebase/auth';

interface UserState {
    currentUser: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    preferences: {
        currency: string;
        language: string;
        notifications: boolean;
    };
}

const initialState: UserState = {
    currentUser: null,
    isAuthenticated: false,
    loading: true,
    preferences: {
        currency: 'USD',
        language: 'en',
        notifications: true,
    },
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.currentUser = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        updatePreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        clearUser: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
    },
});

export const { setUser, setLoading, updatePreferences, clearUser } = userSlice.actions;
export default userSlice.reducer;
