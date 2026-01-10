/**
 * My Hotels API Route
 * GET /api/hotels/my-hotels - Get hotels owned by authenticated user
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

        const hotelsSnapshot = await adminDb
            .collection('hotels')
            .where('ownerId', '==', user.uid)
            .get();

        const hotels = hotelsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        }));

        return NextResponse.json({ hotels });

    } catch (error) {
        console.error('Error fetching owner hotels:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hotels' },
            { status: 500 }
        );
    }
}
