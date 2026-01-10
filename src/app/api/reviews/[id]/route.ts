/**
 * Individual Review API Route
 * DELETE /api/reviews/[id] - Delete review (admin only)
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

        const { searchParams } = new URL(request.url);
        const hotelId = searchParams.get('hotelId');
        const reviewId = params.id;

        if (!hotelId) {
            return NextResponse.json(
                { error: 'hotelId parameter is required' },
                { status: 400 }
            );
        }

        await adminDb
            .collection(`hotels/${hotelId}/reviews`)
            .doc(reviewId)
            .delete();

        return NextResponse.json({
            message: 'Review deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json(
            { error: 'Failed to delete review' },
            { status: 500 }
        );
    }
}
