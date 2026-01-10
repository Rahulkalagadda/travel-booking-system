/**
 * My Rooms API Route
 * GET /api/rooms/my-rooms - Get rooms owned by authenticated user
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

        // Get owner's hotels first
        const hotelsSnapshot = await adminDb
            .collection('hotels')
            .where('ownerId', '==', user.uid)
            .get();

        if (hotelsSnapshot.empty) {
            return NextResponse.json({ rooms: [] });
        }

        const hotelIds = hotelsSnapshot.docs.map(doc => doc.id);

        // Get rooms for those hotels
        const roomsSnapshot = await adminDb
            .collection('rooms')
            .where('hotelId', 'in', hotelIds)
            .get();

        const rooms = roomsSnapshot.docs.map(doc => {
            const roomData = doc.data();
            const hotel = hotelsSnapshot.docs.find(h => h.id === roomData.hotelId);

            return {
                id: doc.id,
                ...roomData,
                hotelName: hotel?.data().name || 'Unknown Hotel',
                createdAt: roomData.createdAt?.toDate?.()?.toISOString() || roomData.createdAt,
            };
        });

        return NextResponse.json({ rooms });

    } catch (error) {
        console.error('Error fetching owner rooms:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rooms' },
            { status: 500 }
        );
    }
}
