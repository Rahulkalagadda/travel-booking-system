/**
 * Hotel Search API Route
 * GET /api/hotels/search - Search hotels with criteria
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { cacheUtils, cacheKeys, cacheDurations } from '@/lib/redis';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const destination = searchParams.get('destination');
        const facilities = searchParams.get('facilities')?.split(',');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');

        // Generate cache key based on search parameters
        const cacheKey = cacheKeys.hotelSearch(
            JSON.stringify({ destination, facilities, minPrice, maxPrice })
        );

        // Try to get from cache first
        try {
            const cachedResults = await cacheUtils.get(cacheKey);
            if (cachedResults) {
                console.log('✅ Cache HIT - Returning cached hotel search results');
                return NextResponse.json(cachedResults);
            }
            console.log('❌ Cache MISS - Fetching from database');
        } catch (cacheError) {
            console.error('Redis cache error:', cacheError);
            // Continue to database query if cache fails
        }

        // Start with approved hotels
        let hotelsSnapshot = await adminDb
            .collection('hotels')
            .where('status', '==', 'approved')
            .get();

        let hotels = hotelsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        }));

        // Filter by destination
        if (destination) {
            const searchLower = destination.toLowerCase();
            hotels = hotels.filter(hotel =>
                hotel.name.toLowerCase().includes(searchLower) ||
                hotel.location.toLowerCase().includes(searchLower)
            );
        }

        // Filter by facilities
        if (facilities && facilities.length > 0) {
            hotels = hotels.filter(hotel =>
                facilities.every(facility => hotel.facilities?.includes(facility))
            );
        }

        // Note: Price filtering would require fetching rooms
        // This is a simplified version

        const result = { hotels };

        // Cache the results for 30 minutes (hotel data doesn't change frequently)
        await cacheUtils.set(cacheKey, result, cacheDurations.MEDIUM);

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error searching hotels:', error);
        return NextResponse.json(
            { error: 'Failed to search hotels' },
            { status: 500 }
        );
    }
}
