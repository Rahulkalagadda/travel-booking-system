/**
 * Admin Hotels API Route
 * GET /api/admin/hotels/pending - Get all pending hotels (admin only)
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

        const hotelsSnapshot = await adminDb
            .collection('hotels')
            .where('status', '==', 'pending')
            .get();

        const hotels = hotelsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        }));

        return NextResponse.json({ hotels });

    } catch (error) {
        console.error('Error fetching pending hotels:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pending hotels' },
            { status: 500 }
        );
    }
}
