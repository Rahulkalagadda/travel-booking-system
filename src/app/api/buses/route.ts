/**
 * Buses API Route
 * GET /api/buses - Get all buses
 * POST /api/buses - Create new bus (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/auth-middleware';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * GET /api/buses
 * Get all buses
 */
export async function GET(request: NextRequest) {
    try {
        const busesSnapshot = await adminDb.collection('buses').get();

        const buses = busesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        }));

        return NextResponse.json({ buses });

    } catch (error) {
        console.error('Error fetching buses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch buses' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/buses
 * Create a new bus (admin only)
 */
export async function POST(request: NextRequest) {
    try {
        const authResult = await requireAdmin(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const busData = await request.json();

        // Generate seats
        const seats = [];
        const totalSeats = busData.totalSeats || 40;
        const price = parseInt(busData.price);

        for (let i = 1; i <= totalSeats; i++) {
            seats.push({
                id: `L${i}`,
                deck: 'lower',
                row: Math.ceil(i / 4),
                col: (i - 1) % 4,
                status: 'available',
                price: price,
            });
        }

        const newBus = {
            ...busData,
            seats,
            rating: 0,
            reviews: 0,
            createdAt: FieldValue.serverTimestamp(),
        };

        const busRef = await adminDb.collection('buses').add(newBus);
        const createdBus = await busRef.get();

        return NextResponse.json({
            bus: {
                id: createdBus.id,
                ...createdBus.data(),
                createdAt: new Date().toISOString(),
            },
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating bus:', error);
        return NextResponse.json(
            { error: 'Failed to create bus' },
            { status: 500 }
        );
    }
}
