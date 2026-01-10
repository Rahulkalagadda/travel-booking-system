/**
 * Rooms API Route
 * GET /api/rooms - Get rooms (filtered by hotelId if provided)
 * POST /api/rooms - Create new room
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireOwner } from '@/lib/auth-middleware';
import type { NewRoom } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * GET /api/rooms
 * Get rooms, optionally filtered by hotelId
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const hotelId = searchParams.get('hotelId');

        let query = adminDb.collection('rooms').where('status', '==', 'approved');

        if (hotelId) {
            query = query.where('hotelId', '==', hotelId);
        }

        const roomsSnapshot = await query.get();

        const rooms = roomsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        }));

        return NextResponse.json({ rooms });

    } catch (error) {
        console.error('Error fetching rooms:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rooms' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/rooms
 * Create a new room (requires owner role)
 */
export async function POST(request: NextRequest) {
    try {
        const authResult = await requireOwner(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { user } = authResult;
        const roomData: NewRoom = await request.json();

        // Validation
        if (!roomData.hotelId || !roomData.title || !roomData.price) {
            return NextResponse.json(
                { error: 'Missing required room information' },
                { status: 400 }
            );
        }

        // Verify hotel ownership
        const hotelDoc = await adminDb.collection('hotels').doc(roomData.hotelId).get();

        if (!hotelDoc.exists) {
            return NextResponse.json(
                { error: 'Hotel not found' },
                { status: 404 }
            );
        }

        const hotel = hotelDoc.data();

        if (hotel!.ownerId !== user.uid) {
            return NextResponse.json(
                { error: 'You can only add rooms to your own hotels' },
                { status: 403 }
            );
        }

        // Create room
        const newRoom = {
            ...roomData,
            images: roomData.images?.length > 0 ? roomData.images : ['https://placehold.co/600x400.png'],
            status: 'pending',
            createdAt: FieldValue.serverTimestamp(),
        };

        const roomRef = await adminDb.collection('rooms').add(newRoom);
        const createdRoom = await roomRef.get();

        return NextResponse.json({
            room: {
                id: createdRoom.id,
                ...createdRoom.data(),
                createdAt: new Date().toISOString(),
            },
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating room:', error);
        return NextResponse.json(
            { error: 'Failed to create room' },
            { status: 500 }
        );
    }
}
