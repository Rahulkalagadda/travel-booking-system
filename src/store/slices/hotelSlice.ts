import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Hotel {
    id: string;
    name: string;
    location: string;
    rating: number;
    price: number;
    image: string;
    amenities: string[];
    description?: string;
}

export interface SearchFilters {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
    priceRange: [number, number];
    rating: number;
    amenities: string[];
}

interface HotelState {
    hotels: Hotel[];
    selectedHotel: Hotel | null;
    searchFilters: SearchFilters;
    loading: boolean;
    error: string | null;
    favorites: string[];
}

const initialState: HotelState = {
    hotels: [],
    selectedHotel: null,
    searchFilters: {
        location: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        rooms: 1,
        priceRange: [0, 10000],
        rating: 0,
        amenities: [],
    },
    loading: false,
    error: null,
    favorites: [],
};

const hotelSlice = createSlice({
    name: 'hotel',
    initialState,
    reducers: {
        setHotels: (state, action: PayloadAction<Hotel[]>) => {
            state.hotels = action.payload;
            state.loading = false;
            state.error = null;
        },
        setSelectedHotel: (state, action: PayloadAction<Hotel | null>) => {
            state.selectedHotel = action.payload;
        },
        updateSearchFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
            state.searchFilters = { ...state.searchFilters, ...action.payload };
        },
        resetSearchFilters: (state) => {
            state.searchFilters = initialState.searchFilters;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        addToFavorites: (state, action: PayloadAction<string>) => {
            if (!state.favorites.includes(action.payload)) {
                state.favorites.push(action.payload);
            }
        },
        removeFromFavorites: (state, action: PayloadAction<string>) => {
            state.favorites = state.favorites.filter((id) => id !== action.payload);
        },
        clearHotels: (state) => {
            state.hotels = [];
            state.selectedHotel = null;
            state.error = null;
        },
    },
});

export const {
    setHotels,
    setSelectedHotel,
    updateSearchFilters,
    resetSearchFilters,
    setLoading,
    setError,
    addToFavorites,
    removeFromFavorites,
    clearHotels,
} = hotelSlice.actions;

export default hotelSlice.reducer;
