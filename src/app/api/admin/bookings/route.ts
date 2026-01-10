/**
 * Admin Bookings API Route
 * GET /api/admin/bookings - Get all bookings (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
    try {
        const authResult = await requireAdmin(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const bookingsSnapshot = await adminDb
            .collection('bookings')
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
        console.error('Error fetching all bookings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}
