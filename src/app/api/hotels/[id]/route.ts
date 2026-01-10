/**
 * Individual Hotel API Route
 * GET /api/hotels/[id] - Get hotel by ID
 * DELETE /api/hotels/[id] - Delete hotel (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/auth-middleware';

/**
 * GET /api/hotels/[id]
 * Get a specific hotel by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const hotelId = params.id;

        const hotelDoc = await adminDb.collection('hotels').doc(hotelId).get();

        if (!hotelDoc.exists) {
            return NextResponse.json(
                { error: 'Hotel not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            hotel: {
                id: hotelDoc.id,
                ...hotelDoc.data(),
                createdAt: hotelDoc.data()!.createdAt?.toDate?.()?.toISOString() || hotelDoc.data()!.createdAt,
            },
        });

    } catch (error) {
        console.error('Error fetching hotel:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hotel' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/hotels/[id]
 * Delete a hotel (admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await requireAdmin(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const hotelId = params.id;

        // Delete associated rooms first
        const roomsSnapshot = await adminDb
            .collection('rooms')
            .where('hotelId', '==', hotelId)
            .get();

        const batch = adminDb.batch();

        roomsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Delete the hotel
        batch.delete(adminDb.collection('hotels').doc(hotelId));

        await batch.commit();

        return NextResponse.json({
            message: 'Hotel deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting hotel:', error);
        return NextResponse.json(
            { error: 'Failed to delete hotel' },
            { status: 500 }
        );
    }
}
