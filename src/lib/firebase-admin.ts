/**
 * Firebase Admin SDK Configuration
 * This file should ONLY be imported in server-side code (API routes, server components)
 * NEVER import this in client components
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App;
let adminDb: Firestore;
let adminAuth: Auth;

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials for server-side operations
 */
function initializeFirebaseAdmin() {
    if (getApps().length === 0) {
        // Check if we're using service account JSON or individual env vars
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            // Option 1: Service account JSON string
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            adminApp = initializeApp({
                credential: cert(serviceAccount),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        } else if (process.env.FIREBASE_PRIVATE_KEY) {
            // Option 2: Individual environment variables
            adminApp = initializeApp({
                credential: cert({
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        } else {
            // Fallback for development - uses application default credentials
            console.warn('⚠️ No Firebase Admin credentials found. Using default credentials.');
            adminApp = initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        }
    } else {
        adminApp = getApps()[0];
    }

    adminDb = getFirestore(adminApp);
    adminAuth = getAuth(adminApp);
}

// Initialize on module load
initializeFirebaseAdmin();

export { adminDb, adminAuth, adminApp };
