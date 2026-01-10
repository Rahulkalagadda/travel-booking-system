/**
 * Individual Bus API Route
 * DELETE /api/buses/[id] - Delete bus (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/auth-middleware';

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

        const busId = params.id;

        await adminDb.collection('buses').doc(busId).delete();

        return NextResponse.json({
            message: 'Bus deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting bus:', error);
        return NextResponse.json(
            { error: 'Failed to delete bus' },
            { status: 500 }
        );
    }
}
