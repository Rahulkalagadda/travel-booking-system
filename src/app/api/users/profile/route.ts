/**
 * User Profile API Route
 * GET /api/users/profile - Get current user's profile
 * PATCH /api/users/profile - Update current user's profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAuth } from '@/lib/auth-middleware';

/**
 * GET /api/users/profile
 * Get current user's profile
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await requireAuth(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { user } = authResult;

        const userDoc = await adminDb.collection('users').doc(user.uid).get();

        if (!userDoc.exists) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const userData = userDoc.data();

        return NextResponse.json({
            user: {
                id: userDoc.id,
                ...userData,
                password: undefined, // Never send password
                createdAt: userData!.createdAt?.toDate?.()?.toISOString() || userData!.createdAt,
            },
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user profile' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/users/profile
 * Update current user's profile
 */
export async function PATCH(request: NextRequest) {
    try {
        const authResult = await requireAuth(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { user } = authResult;
        const updates = await request.json();

        // Remove fields that shouldn't be updated via this endpoint
        delete updates.id;
        delete updates.password;
        delete updates.role;
        delete updates.email; // Email changes should go through Firebase Auth
        delete updates.createdAt;

        await adminDb.collection('users').doc(user.uid).update(updates);

        const updatedUserDoc = await adminDb.collection('users').doc(user.uid).get();
        const userData = updatedUserDoc.data();

        return NextResponse.json({
            user: {
                id: updatedUserDoc.id,
                ...userData,
                password: undefined,
                createdAt: userData!.createdAt?.toDate?.()?.toISOString() || userData!.createdAt,
            },
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json(
            { error: 'Failed to update user profile' },
            { status: 500 }
        );
    }
}
