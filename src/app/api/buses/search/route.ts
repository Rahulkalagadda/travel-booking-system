/**
 * Bus Search API Route
 * GET /api/buses/search - Search buses by route and date
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { cacheUtils, cacheKeys, cacheDurations } from '@/lib/redis';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const date = searchParams.get('date');

        if (!from || !to) {
            return NextResponse.json(
                { error: 'from and to parameters are required' },
                { status: 400 }
            );
        }

        // Generate cache key
        const cacheKey = `bus:search:${from}-${to}-${date || 'any'}`;

        // Try to get from cache first
        try {
            const cachedResults = await cacheUtils.get(cacheKey);
            if (cachedResults) {
                console.log('✅ Cache HIT - Returning cached bus search results');
                return NextResponse.json(cachedResults);
            }
            console.log('❌ Cache MISS - Fetching from database');
        } catch (cacheError) {
            console.error('Redis cache error:', cacheError);
        }

        const busesSnapshot = await adminDb.collection('buses').get();

        const buses = busesSnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
            }))
            .filter(bus => {
                return bus.depart.toLowerCase().includes(from.toLowerCase()) &&
                    bus.arrive.toLowerCase().includes(to.toLowerCase());
            });

        const result = { buses };

        // Cache for 30 minutes
        await cacheUtils.set(cacheKey, result, cacheDurations.MEDIUM);

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error searching buses:', error);
        return NextResponse.json(
            { error: 'Failed to search buses' },
            { status: 500 }
        );
    }
}
