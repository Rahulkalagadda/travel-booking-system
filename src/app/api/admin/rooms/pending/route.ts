/**
 * Admin Rooms API Route
 * GET /api/admin/rooms/pending - Get all pending rooms (admin only)
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

        const roomsSnapshot = await adminDb
            .collection('rooms')
            .where('status', '==', 'pending')
            .get();

        // Enrich with hotel names
        const rooms = await Promise.all(
            roomsSnapshot.docs.map(async (doc) => {
                const roomData = doc.data();
                const hotelDoc = await adminDb.collection('hotels').doc(roomData.hotelId).get();

                return {
                    id: doc.id,
                    ...roomData,
                    hotelName: hotelDoc.exists ? hotelDoc.data()!.name : 'Unknown Hotel',
                    createdAt: roomData.createdAt?.toDate?.()?.toISOString() || roomData.createdAt,
                };
            })
        );

        return NextResponse.json({ rooms });

    } catch (error) {
        console.error('Error fetching pending rooms:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pending rooms' },
            { status: 500 }
        );
    }
}
