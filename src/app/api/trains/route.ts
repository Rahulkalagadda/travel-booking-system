import { NextResponse } from 'next/server';
import { searchTrains, isAPIConfigured } from '@/lib/railway-api';
import { transformAPIResponseToTrain } from '@/lib/railway-transformers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        if (!isAPIConfigured()) {
            return NextResponse.json(
                {
                    error: 'Railway API is not configured',
                    message: 'Please add RAILWAY_API_KEY to your environment variables'
                },
                { status: 503 }
            );
        }

        // Note: This endpoint returns all trains, which may not be practical
        // Consider using the /search endpoint with specific routes instead
        return NextResponse.json({
            message: 'Please use /api/trains/search with from and to parameters',
            example: '/api/trains/search?from=Delhi&to=Mumbai&date=2026-01-15'
        });
    } catch (error) {
        console.error('Error fetching trains:', error);
        return NextResponse.json(
            { error: 'Failed to fetch trains' },
            { status: 500 }
        );
    }
}
