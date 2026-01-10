/**
 * User Promotion API Route
 * POST /api/users/[id]/promote - Promote user to admin (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/auth-middleware';

export async function POST(
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

        const userId = params.id;

        // Update user role in Firestore
        await adminDb.collection('users').doc(userId).update({
            role: 'admin',
        });

        // Set custom claims in Firebase Auth
        await adminAuth.setCustomUserClaims(userId, { role: 'admin' });

        return NextResponse.json({
            message: 'User promoted to admin successfully',
        });

    } catch (error) {
        console.error('Error promoting user:', error);
        return NextResponse.json(
            { error: 'Failed to promote user' },
            { status: 500 }
        );
    }
}
