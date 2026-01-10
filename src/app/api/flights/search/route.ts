/**
 * Flights Search API Route
 * GET /api/flights/search - Search flights by route and date
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

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

        const flightsSnapshot = await adminDb.collection('flights').get();

        const flights = flightsSnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            .filter(flight => {
                return flight.depart.toLowerCase().includes(from.toLowerCase()) &&
                    flight.arrive.toLowerCase().includes(to.toLowerCase());
            });

        return NextResponse.json({ flights });

    } catch (error) {
        console.error('Error searching flights:', error);
        return NextResponse.json(
            { error: 'Failed to search flights' },
            { status: 500 }
        );
    }
}
