import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const booking = await request.json();

        // Validate required fields
        if (!booking.trainId || !booking.name || !booking.email || !booking.phone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Add booking to Firestore
        const bookingsRef = collection(db, 'trainBookings');
        const docRef = await addDoc(bookingsRef, {
            ...booking,
            createdAt: new Date().toISOString(),
            status: 'confirmed',
        });

        return NextResponse.json({
            success: true,
            bookingId: docRef.id,
            pnr: booking.pnr,
            message: 'Booking confirmed successfully',
        });
    } catch (error: any) {
        console.error('Booking error:', error);
        return NextResponse.json(
            { error: 'Failed to create booking', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pnr = searchParams.get('pnr');

        if (!pnr) {
            return NextResponse.json(
                { error: 'PNR number required' },
                { status: 400 }
            );
        }

        // In a real app, query Firestore for the booking by PNR
        // For now, return mock data
        return NextResponse.json({
            pnr,
            status: 'confirmed',
            message: 'Booking found',
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch booking' },
            { status: 500 }
        );
    }
}
