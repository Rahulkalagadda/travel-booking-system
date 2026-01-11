import { NextRequest, NextResponse } from 'next/server';
import { checkPNRStatus, isAPIConfigured } from '@/lib/railway-api';
import { transformPNRStatus } from '@/lib/railway-transformers';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

// Mock PNR data generator
function generateMockPNRStatus(pnr: string) {
    const trains = [
        { number: '12301', name: 'Rajdhani Express', from: 'New Delhi', to: 'Mumbai Central' },
        { number: '12430', name: 'Shatabdi Express', from: 'New Delhi', to: 'Lucknow' },
        { number: '12626', name: 'Karnataka Express', from: 'New Delhi', to: 'Bangalore' },
    ];

    const train = trains[parseInt(pnr[0]) % trains.length];
    const date = new Date();
    date.setDate(date.getDate() + 7); // Journey in 7 days

    return {
        pnr,
        trainNumber: train.number,
        trainName: train.name,
        dateOfJourney: date.toISOString().split('T')[0],
        from: train.from,
        to: train.to,
        boardingPoint: train.from,
        reservationUpto: train.to,
        passengers: [
            {
                number: 1,
                currentStatus: 'CNF',
                bookingStatus: 'CNF',
                coach: 'A1',
                berth: '23',
            }
        ],
        chartStatus: 'Chart Not Prepared',
    };
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const pnr = searchParams.get('pnr') || '';

        if (!pnr) {
            return NextResponse.json(
                { error: 'PNR number is required' },
                { status: 400 }
            );
        }

        // Validate PNR format (10 digits)
        if (!/^\d{10}$/.test(pnr)) {
            return NextResponse.json(
                { error: 'Invalid PNR format. PNR must be 10 digits.' },
                { status: 400 }
            );
        }

        // First, check if this PNR exists in our bookings
        try {
            const bookingsRef = collection(db, 'trainBookings');
            const q = query(bookingsRef, where('pnr', '==', pnr));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const booking = snapshot.docs[0].data();
                return NextResponse.json({
                    success: true,
                    data: {
                        pnr: booking.pnr,
                        trainNumber: booking.trainNumber,
                        trainName: booking.trainName,
                        dateOfJourney: booking.date,
                        from: booking.boardingStation,
                        to: booking.destinationStation,
                        boardingPoint: booking.boardingStation,
                        reservationUpto: booking.destinationStation,
                        passengers: [
                            {
                                number: 1,
                                currentStatus: booking.status === 'confirmed' ? 'CNF' : 'WL',
                                bookingStatus: booking.status === 'confirmed' ? 'CNF' : 'WL',
                                coach: 'A1',
                                berth: '23',
                            }
                        ],
                        chartStatus: 'Chart Not Prepared',
                    },
                    source: 'booking',
                });
            }
        } catch (dbError) {
            console.log('⚠️ Could not check bookings database:', dbError);
        }

        // Try API if configured
        if (isAPIConfigured()) {
            try {
                console.log('Attempting to fetch PNR from API...');
                const apiResponse = await checkPNRStatus(pnr);
                const pnrStatus = transformPNRStatus(apiResponse);

                return NextResponse.json({
                    success: true,
                    data: pnrStatus,
                    source: 'api',
                });
            } catch (apiError: any) {
                console.log(`⚠️ API failed: ${apiError.message}`);
                console.log('📦 Falling back to mock PNR data...');
            }
        }

        // Fall back to mock data
        const mockData = generateMockPNRStatus(pnr);
        return NextResponse.json({
            success: true,
            data: mockData,
            source: 'mock',
            message: 'Demo PNR status (API quota exceeded)',
        });

    } catch (error: any) {
        console.error('Error checking PNR status:', error);

        return NextResponse.json(
            { error: 'Failed to check PNR status. Please try again later.' },
            { status: 500 }
        );
    }
}
