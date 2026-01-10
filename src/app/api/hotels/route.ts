/**
 * Hotels API Route
 * GET /api/hotels - Get all approved hotels
 * POST /api/hotels - Create new hotel
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAuth, requireOwner } from '@/lib/auth-middleware';
import type { NewHotel } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * GET /api/hotels
 * Get all approved hotels
 */
export async function GET(request: NextRequest) {
    try {
        const hotelsSnapshot = await adminDb
            .collection('hotels')
            .where('status', '==', 'approved')
            .get();

        const hotels = hotelsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        }));

        return NextResponse.json({ hotels });

    } catch (error) {
        console.error('Error fetching hotels:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hotels' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/hotels
 * Create a new hotel (requires owner role)
 */
export async function POST(request: NextRequest) {
    try {
        const authResult = await requireOwner(request);

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { user } = authResult;
        const hotelData: NewHotel = await request.json();

        // Validation
        if (!hotelData.name || !hotelData.location) {
            return NextResponse.json(
                { error: 'Missing required hotel information' },
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

        // Create hotel
        const newHotel = {
            ...hotelData,
            ownerId: user.uid,
            ownerName: userData.name,
            ownerEmail: userData.email,
            status: 'pending',
            coverImage: hotelData.coverImage || 'https://placehold.co/1200x800.png',
            createdAt: FieldValue.serverTimestamp(),
        };

        const hotelRef = await adminDb.collection('hotels').add(newHotel);
        const createdHotel = await hotelRef.get();

        return NextResponse.json({
            hotel: {
                id: createdHotel.id,
                ...createdHotel.data(),
                createdAt: new Date().toISOString(),
            },
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating hotel:', error);
        return NextResponse.json(
            { error: 'Failed to create hotel' },
            { status: 500 }
        );
    }
}
