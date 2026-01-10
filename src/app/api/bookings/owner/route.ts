/**
 * Owner Bookings API Route
 * GET /api/bookings/owner - Get all bookings for hotels owned by the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireOwner } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
    try {
        const authResult = await requireOwner(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { user } = authResult;

        // Fetch bookings for hotels owned by this user
        const bookingsSnapshot = await adminDb
            .collection('bookings')
            .where('hotelOwnerId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .get();

        const bookings = bookingsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            fromDate: doc.data().fromDate?.toDate?.()?.toISOString() || doc.data().fromDate,
            toDate: doc.data().toDate?.toDate?.()?.toISOString() || doc.data().toDate,
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        }));

        return NextResponse.json({ bookings });

    } catch (error) {
        console.error('Error fetching owner bookings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}
