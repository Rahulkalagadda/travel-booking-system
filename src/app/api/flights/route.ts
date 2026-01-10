import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';
import { cacheUtils, cacheKeys, cacheDurations } from '@/lib/redis';

// Hardcoding keys to bypass environment variable loading issues
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

// Mock data generator for fallback
const getMockFlights = (origin: string, destination: string, date: string) => {
    return [
        {
            id: 'mock-1',
            itineraries: [{
                duration: 'PT2H30M',
                segments: [{
                    carrierCode: '6E',
                    number: '554',
                    departure: { at: `${date}T10:00:00` },
                    arrival: { at: `${date}T12:30:00` },
                }]
            }],
            price: { total: '5420' }
        },
        {
            id: 'mock-2',
            itineraries: [{
                duration: 'PT2H15M',
                segments: [{
                    carrierCode: 'UK',
                    number: '887',
                    departure: { at: `${date}T14:00:00` },
                    arrival: { at: `${date}T16:15:00` },
                }]
            }],
            price: { total: '6800' }
        },
        {
            id: 'mock-3',
            itineraries: [{
                duration: 'PT2H45M',
                segments: [{
                    carrierCode: 'AI',
                    number: '442',
                    departure: { at: `${date}T18:30:00` },
                    arrival: { at: `${date}T21:15:00` },
                }]
            }],
            price: { total: '5100' }
        },
        {
            id: 'mock-4',
            itineraries: [{
                duration: 'PT2H20M',
                segments: [{
                    carrierCode: 'QP',
                    number: '112',
                    departure: { at: `${date}T06:00:00` },
                    arrival: { at: `${date}T08:20:00` },
                }]
            }],
            price: { total: '4900' }
        }
    ];
};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');



    if (!origin || !destination || !date) {
        return NextResponse.json(
            { error: 'Missing required parameters: origin, destination, date' },
            { status: 400 }
        );
    }

    // Generate cache key for this search
    const cacheKey = cacheKeys.amadeus('flights', `${origin}-${destination}-${date}`);

    // Try to get from cache first
    try {
        const cachedFlights = await cacheUtils.get(cacheKey);
        if (cachedFlights) {
            console.log('✅ Cache HIT - Returning cached flight results');
            return NextResponse.json(cachedFlights);
        }
        console.log('❌ Cache MISS - Fetching from Amadeus API');
    } catch (cacheError) {
        console.error('Redis cache error:', cacheError);
        // Continue to API call if cache fails
    }

    // Checking for Explicit Mock Mode
    if (process.env.USE_MOCK_DATA === 'true') {
        const mockData = getMockFlights(origin, destination, date);
        // Cache mock data too
        await cacheUtils.set(cacheKey, mockData, cacheDurations.SHORT);
        return NextResponse.json(mockData);
    }

    try {
        if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET) {
            console.error("Amadeus credentials missing");
            // In production, this should probably error out, but for now we fallback 
            // to mock only if explicitly allowed or in dev.
            if (process.env.NODE_ENV === 'development') {
                console.log("Credentials missing, falling back to MOCK in dev.");
                const mockData = getMockFlights(origin, destination, date);
                await cacheUtils.set(cacheKey, mockData, cacheDurations.SHORT);
                return NextResponse.json(mockData);
            }
            throw new Error("Server configuration error: Missing Credentials");
        }

        const amadeus = new Amadeus({
            clientId: AMADEUS_CLIENT_ID,
            clientSecret: AMADEUS_CLIENT_SECRET,
        });

        const response = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: date,
            adults: '1',
            max: '10',
        });

        if (response.data && response.data.length > 0) {
            // Cache the successful response for 5 minutes
            await cacheUtils.set(cacheKey, response.data, cacheDurations.SHORT);
            return NextResponse.json(response.data);
        } else {
            console.log("No flights found from Amadeus.");
            // Return empty array instead of mock data in production to avoid confusing users
            // unless MOCK fallback is desired.
            return NextResponse.json([]);
        }

    } catch (error: any) {
        console.error('Amadeus API Error:', error?.description || error);

        // Critical: In production, we typically DO NOT want to show mock data on API failure
        // as it misleads users.
        if (process.env.NODE_ENV === 'development') {
            const mockData = getMockFlights(origin, destination, date);
            await cacheUtils.set(cacheKey, mockData, cacheDurations.SHORT);
            return NextResponse.json(mockData);
        }

        return NextResponse.json(
            { error: 'Failed to fetch flight offers.' },
            { status: 500 }
        );
    }
}
