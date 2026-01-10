/**
 * Room Status API Route
 * PATCH /api/rooms/[id]/status - Update room status (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/auth-middleware';

export async function PATCH(
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

        const roomId = params.id;
        const { status } = await request.json();

        if (!status || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be "approved" or "rejected"' },
                { status: 400 }
            );
        }

        await adminDb.collection('rooms').doc(roomId).update({ status });

        return NextResponse.json({
            message: `Room ${status} successfully`,
        });

    } catch (error) {
        console.error('Error updating room status:', error);
        return NextResponse.json(
            { error: 'Failed to update room status' },
            { status: 500 }
        );
    }
}
