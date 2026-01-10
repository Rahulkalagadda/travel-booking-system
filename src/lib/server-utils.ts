import 'server-only';

/**
 * Server-only utilities for data fetching and processing
 * This file should only be imported in Server Components or API routes
 */

import { getCachedData } from './cache';
import { getApprovedHotels, searchHotels, getHotelById } from './data';
import type { Hotel, HotelSearchCriteria } from './types';

/**
 * Get hotels with caching (5 minutes)
 */
export async function getCachedHotels(): Promise<Hotel[]> {
    return getCachedData(
        async () => getApprovedHotels(),
        ['hotels', 'approved'],
        300 // 5 minutes
    );
}

/**
 * Search hotels with caching (2 minutes)
 */
export async function getCachedHotelSearch(criteria: HotelSearchCriteria): Promise<Hotel[]> {
    const cacheKey = ['hotels', 'search', JSON.stringify(criteria)];
    return getCachedData(
        async () => searchHotels(criteria),
        cacheKey,
        120 // 2 minutes
    );
}

/**
 * Get hotel by ID with caching (10 minutes)
 */
export async function getCachedHotel(id: string): Promise<Hotel | undefined> {
    return getCachedData(
        async () => getHotelById(id),
        ['hotel', id],
        600 // 10 minutes
    );
}

/**
 * Generate metadata for hotel pages
 */
export async function generateHotelMetadata(id: string) {
    const hotel = await getCachedHotel(id);

    if (!hotel) {
        return {
            title: 'Hotel Not Found',
            description: 'The requested hotel could not be found.',
        };
    }

    return {
        title: `${hotel.name} - ${hotel.location} | Lodgify Lite`,
        description: hotel.description.slice(0, 160),
        openGraph: {
            title: hotel.name,
            description: hotel.description,
            images: [hotel.coverImage],
            type: 'website',
        },
    };
}
