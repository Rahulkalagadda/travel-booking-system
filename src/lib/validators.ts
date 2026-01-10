import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
    role: z.enum(['user', 'owner', 'admin']).default('user'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Hotel validation schemas
export const hotelSchema = z.object({
    name: z.string().min(3, 'Hotel name must be at least 3 characters'),
    location: z.string().min(3, 'Location is required'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    address: z.string().min(5, 'Address is required'),
    phone: z.string().min(10, 'Valid phone number required'),
    email: z.string().email('Invalid email'),
    website: z.string().url().optional().or(z.literal('')),
    facilities: z.array(z.string()).min(1, 'At least one facility required'),
    checkInTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    checkOutTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    cancellationPolicy: z.string().min(10, 'Cancellation policy required'),
    isPetFriendly: z.boolean().default(false),
});

// Room validation schemas
export const roomSchema = z.object({
    title: z.string().min(3, 'Room title must be at least 3 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.number().min(1, 'Price must be greater than 0'),
    capacity: z.number().min(1, 'Capacity must be at least 1'),
    images: z.array(z.string().url()).min(1, 'At least one image required'),
    hotelId: z.string().min(1, 'Hotel ID required'),
});

// Booking validation schemas
export const bookingSchema = z.object({
    roomId: z.string().min(1, 'Room ID required'),
    hotelId: z.string().min(1, 'Hotel ID required'),
    fromDate: z.date(),
    toDate: z.date(),
    userId: z.string().min(1, 'User ID required'),
}).refine((data) => data.toDate > data.fromDate, {
    message: 'Check-out date must be after check-in date',
    path: ['toDate'],
});

// Review validation schemas
export const reviewSchema = z.object({
    rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().min(10, 'Review must be at least 10 characters'),
    hotelId: z.string().min(1, 'Hotel ID required'),
    userId: z.string().min(1, 'User ID required'),
    userName: z.string().min(1, 'User name required'),
    userAvatar: z.string().url(),
    userCountry: z.string().min(2, 'Country required'),
});

// Search validation schemas
export const searchSchema = z.object({
    destination: z.string().optional(),
    dateRange: z.object({
        from: z.date(),
        to: z.date(),
    }).optional(),
    guests: z.number().min(1).optional(),
    facilities: z.array(z.string()).optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
}).refine((data) => {
    if (data.minPrice && data.maxPrice) {
        return data.maxPrice >= data.minPrice;
    }
    return true;
}, {
    message: 'Max price must be greater than min price',
    path: ['maxPrice'],
});

// Type exports for use in components
export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type HotelInput = z.infer<typeof hotelSchema>;
export type RoomInput = z.infer<typeof roomSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
