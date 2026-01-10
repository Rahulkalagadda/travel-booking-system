/**
 * Individual Booking API Route
 * GET /api/bookings/[id] - Get booking by ID
 * DELETE /api/bookings/[id] - Cancel booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAuth } from '@/lib/auth-middleware';
import { startOfDay } from 'date-fns';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * GET /api/bookings/[id]
 * Get a specific booking by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await requireAuth(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { user } = authResult;
        const bookingId = params.id;

        const bookingDoc = await adminDb.collection('bookings').doc(bookingId).get();

        if (!bookingDoc.exists) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        const booking = bookingDoc.data();

        // Check if user owns this booking or is admin
        if (booking!.userId !== user.uid && user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            booking: {
                id: bookingDoc.id,
                ...booking,
                fromDate: booking!.fromDate?.toDate?.()?.toISOString() || booking!.fromDate,
                toDate: booking!.toDate?.toDate?.()?.toISOString() || booking!.toDate,
                createdAt: booking!.createdAt?.toDate?.()?.toISOString() || booking!.createdAt,
            },
        });

    } catch (error) {
        console.error('Error fetching booking:', error);
        return NextResponse.json(
            { error: 'Failed to fetch booking' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/bookings/[id]
 * Cancel a booking
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await requireAuth(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { user } = authResult;
        const bookingId = params.id;

        const bookingRef = adminDb.collection('bookings').doc(bookingId);
        const bookingDoc = await bookingRef.get();

        if (!bookingDoc.exists) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        const booking = bookingDoc.data();

        // Check if user owns this booking
        if (booking!.userId !== user.uid && user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Check if already cancelled
        if (booking!.status.trim().toLowerCase() === 'cancelled') {
            return NextResponse.json(
                { error: 'This booking has already been cancelled' },
                { status: 400 }
            );
        }

        // Check if booking date has passed
        const fromDate = booking!.fromDate.toDate();
        if (startOfDay(fromDate) < startOfDay(new Date())) {
            return NextResponse.json(
                { error: 'Cannot cancel a booking after the check-in date has passed' },
                { status: 400 }
            );
        }

        // Update booking status
        await bookingRef.update({
            status: 'cancelled',
            cancelledAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({
            message: 'Booking cancelled successfully',
        });

    } catch (error) {
        console.error('Error cancelling booking:', error);
        return NextResponse.json(
            { error: 'Failed to cancel booking' },
            { status: 500 }
        );
    }
}
