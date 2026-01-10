/**
 * Bookings API Route
 * GET /api/bookings - Get user's bookings
 * POST /api/bookings - Create new booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAuth } from '@/lib/auth-middleware';
import type { NewBooking, Booking } from '@/lib/types';
import { differenceInDays, startOfDay } from 'date-fns';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * GET /api/bookings
 * Get all bookings for the authenticated user
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await requireAuth(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { user } = authResult;

        // Fetch bookings from Firestore
        const bookingsSnapshot = await adminDb
            .collection('bookings')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .get();

        const bookings = bookingsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore Timestamps to ISO strings for JSON serialization
            fromDate: doc.data().fromDate?.toDate?.()?.toISOString() || doc.data().fromDate,
            toDate: doc.data().toDate?.toDate?.()?.toISOString() || doc.data().toDate,
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        }));

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/bookings
 * Create a new booking
 */
export async function POST(request: NextRequest) {
    try {
        const authResult = await requireAuth(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { user } = authResult;
        const bookingData: NewBooking = await request.json();

        // Validation
        if (!bookingData.roomId || !bookingData.hotelId || !bookingData.fromDate || !bookingData.toDate) {
            return NextResponse.json(
                { error: 'Missing required booking information' },
                { status: 400 }
            );
        }

        // Convert dates
        const fromDate = new Date(bookingData.fromDate);
        const toDate = new Date(bookingData.toDate);

        // Check for double booking
        const existingBookingsSnapshot = await adminDb
            .collection('bookings')
            .where('roomId', '==', bookingData.roomId)
            .where('status', '==', 'confirmed')
            .get();

        const newBookingStart = startOfDay(fromDate);
        const newBookingEnd = startOfDay(toDate);

        const isOverlapping = existingBookingsSnapshot.docs.some(doc => {
            const booking = doc.data();
            const existingStart = startOfDay(booking.fromDate.toDate());
            const existingEnd = startOfDay(booking.toDate.toDate());

            return (newBookingStart < existingEnd) && (newBookingEnd > existingStart);
        });

        if (isOverlapping) {
            return NextResponse.json(
                { error: 'This room is unavailable for the selected dates' },
                { status: 409 }
            );
        }

        // Fetch room and hotel details
        const roomDoc = await adminDb.collection('rooms').doc(bookingData.roomId).get();
        const hotelDoc = await adminDb.collection('hotels').doc(bookingData.hotelId).get();
        const userDoc = await adminDb.collection('users').doc(user.uid).get();

        if (!roomDoc.exists || !hotelDoc.exists || !userDoc.exists) {
            return NextResponse.json(
                { error: 'Room, hotel, or user not found' },
                { status: 404 }
            );
        }

        const room = roomDoc.data();
        const hotel = hotelDoc.data();
        const userData = userDoc.data();

        const numberOfNights = differenceInDays(toDate, fromDate);

        if (numberOfNights <= 0) {
            return NextResponse.json(
                { error: 'Booking must be for at least one night' },
                { status: 400 }
            );
        }

        // Create booking
        const newBooking = {
            userId: user.uid,
            roomId: bookingData.roomId,
            hotelId: bookingData.hotelId,
            fromDate: FieldValue.serverTimestamp(),
            toDate: FieldValue.serverTimestamp(),
            totalPrice: room!.price * numberOfNights,
            status: 'confirmed',
            createdAt: FieldValue.serverTimestamp(),
            hotelName: hotel!.name,
            hotelLocation: hotel!.location,
            roomTitle: room!.title,
            coverImage: hotel!.coverImage,
            userName: userData!.name,
            hotelOwnerId: hotel!.ownerId,
        };

        // Store actual dates separately for querying
        const bookingRef = await adminDb.collection('bookings').add({
            ...newBooking,
            fromDate: fromDate,
            toDate: toDate,
        });

        const createdBooking = await bookingRef.get();

        return NextResponse.json({
            booking: {
                id: createdBooking.id,
                ...createdBooking.data(),
                fromDate: fromDate.toISOString(),
                toDate: toDate.toISOString(),
                createdAt: new Date().toISOString(),
            },
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}
