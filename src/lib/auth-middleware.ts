/**
 * Authentication Middleware for API Routes
 * Verifies Firebase Auth tokens and extracts user information
 */

import { NextRequest } from 'next/server';
import { adminAuth } from './firebase-admin';
import type { User } from './types';

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        uid: string;
        email?: string;
        role?: string;
    };
}

/**
 * Verify Firebase Auth token from request headers
 * @param request - Next.js request object
 * @returns Decoded token with user information or null if invalid
 */
export async function verifyAuthToken(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            return null;
        }

        // Verify the token using Firebase Admin SDK
        const decodedToken = await adminAuth.verifyIdToken(token);

        return {
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: decodedToken.role as string | undefined,
        };
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

/**
 * Middleware to require authentication
 * Returns 401 if user is not authenticated
 */
export async function requireAuth(request: NextRequest) {
    const user = await verifyAuthToken(request);

    if (!user) {
        return {
            error: 'Unauthorized',
            status: 401,
        };
    }

    return { user };
}

/**
 * Middleware to require specific role
 * Returns 403 if user doesn't have required role
 */
export async function requireRole(request: NextRequest, requiredRole: string) {
    const authResult = await requireAuth(request);

    if ('error' in authResult) {
        return authResult;
    }

    const { user } = authResult;

    if (user.role !== requiredRole) {
        return {
            error: 'Forbidden - Insufficient permissions',
            status: 403,
        };
    }

    return { user };
}

/**
 * Middleware to require admin role
 */
export async function requireAdmin(request: NextRequest) {
    return requireRole(request, 'admin');
}

/**
 * Middleware to require owner role
 */
export async function requireOwner(request: NextRequest) {
    return requireRole(request, 'owner');
}

/**
 * Check if user is owner of a resource
 */
export async function isResourceOwner(
    request: NextRequest,
    resourceOwnerId: string
): Promise<boolean> {
    const authResult = await requireAuth(request);

    if ('error' in authResult) {
        return false;
    }

    return authResult.user.uid === resourceOwnerId;
}

/**
 * Get current user's full profile from Firestore
 */
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
    const authResult = await requireAuth(request);

    if ('error' in authResult) {
        return null;
    }

    try {
        const { adminDb } = await import('./firebase-admin');
        const userDoc = await adminDb.collection('users').doc(authResult.user.uid).get();

        if (!userDoc.exists) {
            return null;
        }

        return {
            id: userDoc.id,
            ...userDoc.data(),
        } as User;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}
