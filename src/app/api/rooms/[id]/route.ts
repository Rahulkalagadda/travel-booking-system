/**
 * Individual Room API Route
 * GET /api/rooms/[id] - Get room by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const roomId = params.id;

        const roomDoc = await adminDb.collection('rooms').doc(roomId).get();

        if (!roomDoc.exists) {
            return NextResponse.json(
                { error: 'Room not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            room: {
                id: roomDoc.id,
                ...roomDoc.data(),
                createdAt: roomDoc.data()!.createdAt?.toDate?.()?.toISOString() || roomDoc.data()!.createdAt,
            },
        });

    } catch (error) {
        console.error('Error fetching room:', error);
        return NextResponse.json(
            { error: 'Failed to fetch room' },
            { status: 500 }
        );
    }
}
