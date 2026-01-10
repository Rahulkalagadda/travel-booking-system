/**
 * Reviews API Route
 * GET /api/reviews - Get reviews for a hotel
 * POST /api/reviews - Create new review
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAuth } from '@/lib/auth-middleware';
import type { NewReview } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * GET /api/reviews
 * Get reviews for a specific hotel
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const hotelId = searchParams.get('hotelId');

        if (!hotelId) {
            return NextResponse.json(
                { error: 'hotelId parameter is required' },
                { status: 400 }
            );
        }

        const reviewsSnapshot = await adminDb
            .collection(`hotels/${hotelId}/reviews`)
            .orderBy('createdAt', 'desc')
            .get();

        const reviews = reviewsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        }));

        return NextResponse.json({ reviews });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/reviews
 * Create a new review (requires authentication)
 */
export async function POST(request: NextRequest) {
    try {
        const authResult = await requireAuth(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { user } = authResult;
        const reviewData: NewReview = await request.json();

        // Validation
        if (!reviewData.hotelId || !reviewData.rating || !reviewData.comment) {
            return NextResponse.json(
                { error: 'Missing required review information' },
                { status: 400 }
            );
        }

        if (reviewData.rating < 1 || reviewData.rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        // Get user details
        const userDoc = await adminDb.collection('users').doc(user.uid).get();
        const userData = userDoc.data();

        if (!userData) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Create review
        const newReview = {
            ...reviewData,
            userId: user.uid,
            userName: userData.name,
            userAvatar: `https://i.pravatar.cc/150?u=${user.uid}`,
            userCountry: userData.country || 'Unknown',
            createdAt: FieldValue.serverTimestamp(),
        };

        const reviewRef = await adminDb
            .collection(`hotels/${reviewData.hotelId}/reviews`)
            .add(newReview);

        const createdReview = await reviewRef.get();

        return NextResponse.json({
            review: {
                id: createdReview.id,
                ...createdReview.data(),
                createdAt: new Date().toISOString(),
            },
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json(
            { error: 'Failed to create review' },
            { status: 500 }
        );
    }
}
