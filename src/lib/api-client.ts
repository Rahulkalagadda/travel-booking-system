/**
 * Type-safe API Client for Frontend
 * Replaces direct Firebase calls with secure API requests
 */

import type {
    User,
    Hotel,
    Room,
    Booking,
    Review,
    Bus,
    Flight,
    NewHotel,
    NewRoom,
    NewBooking,
    NewReview,
    HotelSearchCriteria
} from './types';

/**
 * Get authentication token from Firebase Auth
 * This should be called from components that have access to Firebase Auth
 */
async function getAuthToken(): Promise<string | null> {
    try {
        const { auth } = await import('./firebase');
        const user = auth.currentUser;

        if (!user) {
            return null;
        }

        return await user.getIdToken();
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = await getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

// ============================================================================
// BOOKINGS API
// ============================================================================

export const bookingsApi = {
    /**
     * Get all bookings for current user
     */
    getMyBookings: async (): Promise<Booking[]> => {
        const data = await apiRequest<{ bookings: Booking[] }>('/bookings');
        return data.bookings;
    },

    /**
     * Get bookings by owner ID (for hotel owners)
     */
    getOwnerBookings: async (): Promise<Booking[]> => {
        const data = await apiRequest<{ bookings: Booking[] }>('/bookings/owner');
        return data.bookings;
    },

    /**
     * Create a new booking
     */
    createBooking: async (bookingData: NewBooking): Promise<Booking> => {
        const data = await apiRequest<{ booking: Booking }>('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
        return data.booking;
    },

    /**
     * Cancel a booking
     */
    cancelBooking: async (bookingId: string): Promise<void> => {
        await apiRequest(`/bookings/${bookingId}`, {
            method: 'DELETE',
        });
    },

    /**
     * Get booking by ID
     */
    getBooking: async (bookingId: string): Promise<Booking> => {
        const data = await apiRequest<{ booking: Booking }>(`/bookings/${bookingId}`);
        return data.booking;
    },
};

// ============================================================================
// HOTELS API
// ============================================================================

export const hotelsApi = {
    /**
     * Get all approved hotels
     */
    getHotels: async (): Promise<Hotel[]> => {
        const data = await apiRequest<{ hotels: Hotel[] }>('/hotels');
        return data.hotels;
    },

    /**
     * Search hotels with criteria
     */
    searchHotels: async (criteria: HotelSearchCriteria): Promise<Hotel[]> => {
        const params = new URLSearchParams();
        if (criteria.destination) params.append('destination', criteria.destination);
        if (criteria.facilities) params.append('facilities', criteria.facilities.join(','));
        if (criteria.minPrice) params.append('minPrice', criteria.minPrice.toString());
        if (criteria.maxPrice) params.append('maxPrice', criteria.maxPrice.toString());

        const data = await apiRequest<{ hotels: Hotel[] }>(`/hotels/search?${params}`);
        return data.hotels;
    },

    /**
     * Get hotel by ID
     */
    getHotel: async (hotelId: string): Promise<Hotel> => {
        const data = await apiRequest<{ hotel: Hotel }>(`/hotels/${hotelId}`);
        return data.hotel;
    },

    /**
     * Get hotels owned by current user
     */
    getMyHotels: async (): Promise<Hotel[]> => {
        const data = await apiRequest<{ hotels: Hotel[] }>('/hotels/my-hotels');
        return data.hotels;
    },

    /**
     * Create a new hotel
     */
    createHotel: async (hotelData: NewHotel): Promise<Hotel> => {
        const data = await apiRequest<{ hotel: Hotel }>('/hotels', {
            method: 'POST',
            body: JSON.stringify(hotelData),
        });
        return data.hotel;
    },

    /**
     * Update hotel status (admin only)
     */
    updateHotelStatus: async (hotelId: string, status: 'approved' | 'rejected'): Promise<void> => {
        await apiRequest(`/hotels/${hotelId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },

    /**
     * Delete hotel (admin only)
     */
    deleteHotel: async (hotelId: string): Promise<void> => {
        await apiRequest(`/hotels/${hotelId}`, {
            method: 'DELETE',
        });
    },
};

// ============================================================================
// ROOMS API
// ============================================================================

export const roomsApi = {
    /**
     * Get rooms for a hotel
     */
    getHotelRooms: async (hotelId: string): Promise<Room[]> => {
        const data = await apiRequest<{ rooms: Room[] }>(`/rooms?hotelId=${hotelId}`);
        return data.rooms;
    },

    /**
     * Get room by ID
     */
    getRoom: async (roomId: string): Promise<Room> => {
        const data = await apiRequest<{ room: Room }>(`/rooms/${roomId}`);
        return data.room;
    },

    /**
     * Get rooms owned by current user
     */
    getMyRooms: async (): Promise<Room[]> => {
        const data = await apiRequest<{ rooms: Room[] }>('/rooms/my-rooms');
        return data.rooms;
    },

    /**
     * Create a new room
     */
    createRoom: async (roomData: NewRoom): Promise<Room> => {
        const data = await apiRequest<{ room: Room }>('/rooms', {
            method: 'POST',
            body: JSON.stringify(roomData),
        });
        return data.room;
    },

    /**
     * Update room status (admin only)
     */
    updateRoomStatus: async (roomId: string, status: 'approved' | 'rejected'): Promise<void> => {
        await apiRequest(`/rooms/${roomId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },
};

// ============================================================================
// REVIEWS API
// ============================================================================

export const reviewsApi = {
    /**
     * Get reviews for a hotel
     */
    getHotelReviews: async (hotelId: string): Promise<Review[]> => {
        const data = await apiRequest<{ reviews: Review[] }>(`/reviews?hotelId=${hotelId}`);
        return data.reviews;
    },

    /**
     * Create a review
     */
    createReview: async (reviewData: NewReview): Promise<Review> => {
        const data = await apiRequest<{ review: Review }>('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
        return data.review;
    },

    /**
     * Delete a review (admin only)
     */
    deleteReview: async (hotelId: string, reviewId: string): Promise<void> => {
        await apiRequest(`/reviews/${reviewId}?hotelId=${hotelId}`, {
            method: 'DELETE',
        });
    },
};

// ============================================================================
// USERS API
// ============================================================================

export const usersApi = {
    /**
     * Get current user profile
     */
    getProfile: async (): Promise<User> => {
        const data = await apiRequest<{ user: User }>('/users/profile');
        return data.user;
    },

    /**
     * Update user profile
     */
    updateProfile: async (userData: Partial<User>): Promise<User> => {
        const data = await apiRequest<{ user: User }>('/users/profile', {
            method: 'PATCH',
            body: JSON.stringify(userData),
        });
        return data.user;
    },

    /**
     * Get all users (admin only)
     */
    getAllUsers: async (): Promise<User[]> => {
        const data = await apiRequest<{ users: User[] }>('/users');
        return data.users;
    },

    /**
     * Promote user to admin (admin only)
     */
    promoteToAdmin: async (userId: string): Promise<void> => {
        await apiRequest(`/users/${userId}/promote`, {
            method: 'POST',
        });
    },
};

// ============================================================================
// BUSES API
// ============================================================================

export const busesApi = {
    /**
     * Get all buses
     */
    getBuses: async (): Promise<Bus[]> => {
        const data = await apiRequest<{ buses: Bus[] }>('/buses');
        return data.buses;
    },

    /**
     * Search buses
     */
    searchBuses: async (from: string, to: string, date: string): Promise<Bus[]> => {
        const params = new URLSearchParams({ from, to, date });
        const data = await apiRequest<{ buses: Bus[] }>(`/buses/search?${params}`);
        return data.buses;
    },

    /**
     * Create bus (admin only)
     */
    createBus: async (busData: any): Promise<Bus> => {
        const data = await apiRequest<{ bus: Bus }>('/buses', {
            method: 'POST',
            body: JSON.stringify(busData),
        });
        return data.bus;
    },

    /**
     * Delete bus (admin only)
     */
    deleteBus: async (busId: string): Promise<void> => {
        await apiRequest(`/buses/${busId}`, {
            method: 'DELETE',
        });
    },
};

// ============================================================================
// FLIGHTS API
// ============================================================================

export const flightsApi = {
    /**
     * Get all flights
     */
    getFlights: async (): Promise<Flight[]> => {
        const data = await apiRequest<{ flights: Flight[] }>('/flights');
        return data.flights;
    },

    /**
     * Search flights
     */
    searchFlights: async (from: string, to: string, date?: string): Promise<Flight[]> => {
        const params = new URLSearchParams({ from, to });
        if (date) params.append('date', date);

        const data = await apiRequest<{ flights: Flight[] }>(`/flights/search?${params}`);
        return data.flights;
    },
};

// ============================================================================
// ADMIN API
// ============================================================================

export const adminApi = {
    /**
     * Get all pending hotels
     */
    getPendingHotels: async (): Promise<Hotel[]> => {
        const data = await apiRequest<{ hotels: Hotel[] }>('/admin/hotels/pending');
        return data.hotels;
    },

    /**
     * Get all pending rooms
     */
    getPendingRooms: async (): Promise<Room[]> => {
        const data = await apiRequest<{ rooms: Room[] }>('/admin/rooms/pending');
        return data.rooms;
    },

    /**
     * Get all bookings (admin only)
     */
    getAllBookings: async (): Promise<Booking[]> => {
        const data = await apiRequest<{ bookings: Booking[] }>('/admin/bookings');
        return data.bookings;
    },
};

// Export all APIs
export const api = {
    bookings: bookingsApi,
    hotels: hotelsApi,
    rooms: roomsApi,
    reviews: reviewsApi,
    users: usersApi,
    buses: busesApi,
    flights: flightsApi,
    admin: adminApi,
};
