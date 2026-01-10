// Collection names
export const COLLECTIONS = {
    USERS: 'users',
    HOTELS: 'hotels',
    ROOMS: 'rooms',
    BOOKINGS: 'bookings',
    BUSES: 'buses',
    FLIGHTS: 'flights',
    TRAINS: 'trains',
} as const;


// Status constants
export const BOOKING_STATUS = {
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
} as const;

export const APPROVAL_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
} as const;

// User roles
export const USER_ROLES = {
    USER: 'user',
    OWNER: 'owner',
    ADMIN: 'admin',
} as const;

// Hotel categories
export const HOTEL_CATEGORIES = [
    'Premium',
    'Eco-Friendly',
    'Ski Resort',
    'Historic',
    'Boutique',
    'Resort',
    'Cabin',
] as const;

// Common facilities
export const FACILITIES = [
    'wifi',
    'pool',
    'spa',
    'gym',
    'restaurant',
    'bar',
    'parking',
    'beach access',
    'heating',
    'bonfire',
    'rooftop bar',
    'rooftop cafe',
    'cultural shows',
    'fine dining',
    'courtyard',
] as const;

// Placeholder images
export const PLACEHOLDER_IMAGES = {
    HOTEL: 'https://placehold.co/1200x800.png',
    ROOM: 'https://placehold.co/600x400.png',
} as const;

// Date formats
export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    ISO: 'yyyy-MM-dd',
    TIME: 'HH:mm',
} as const;
