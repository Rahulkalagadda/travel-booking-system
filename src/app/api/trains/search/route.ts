import { NextRequest, NextResponse } from 'next/server';
import { searchTrains, isAPIConfigured } from '@/lib/railway-api';
import { transformAPIResponseToTrain } from '@/lib/railway-transformers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const from = searchParams.get('from') || '';
        const to = searchParams.get('to') || '';
        const date = searchParams.get('date') || '';

        if (!from || !to) {
            return NextResponse.json(
                { error: 'From and To parameters are required' },
                { status: 400 }
            );
        }

        // Check if API is configured
        if (!isAPIConfigured()) {
            return NextResponse.json(
                {
                    error: 'Railway API is not configured. Please add RAILWAY_API_KEY to your environment variables.',
                    hint: 'Add RAILWAY_API_KEY, RAILWAY_API_BASE_URL, and RAILWAY_API_HOST to .env.local'
                },
                { status: 503 }
            );
        }

        // Fetch from Indian Railway API only
        console.log('Fetching trains from Indian Railway API...');
        const apiResponse = await searchTrains({ from, to, date });
        const trains = transformAPIResponseToTrain(apiResponse);

        console.log(`Found ${trains.length} trains from Indian Railway API`);

        return NextResponse.json({
            data: trains,
            source: 'api',
            count: trains.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('Error searching trains:', error);

        // Provide helpful error messages
        if (error.message?.includes('404')) {
            return NextResponse.json(
                { error: 'No trains found for this route. Please check station names and try again.' },
                { status: 404 }
            );
        }

        if (error.message?.includes('401') || error.message?.includes('403')) {
            return NextResponse.json(
                { error: 'Invalid API key or unauthorized access. Please check your RAILWAY_API_KEY.' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                error: 'Failed to search trains from Indian Railway API',
                details: error.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}
