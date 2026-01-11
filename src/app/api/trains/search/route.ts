import { NextRequest, NextResponse } from 'next/server';
import { searchTrains, isAPIConfigured } from '@/lib/railway-api';
import { transformAPIResponseToTrain } from '@/lib/railway-transformers';
import { getFilteredTrains } from '@/lib/data';

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

        let trains;
        let source = 'firestore';

        // Try API first if configured
        if (isAPIConfigured()) {
            try {
                console.log('Attempting to fetch from Indian Railway API...');
                const apiResponse = await searchTrains({ from, to, date });
                trains = transformAPIResponseToTrain(apiResponse);
                source = 'api';
                console.log(`✅ Found ${trains.length} trains from API`);
            } catch (apiError: any) {
                console.log(`⚠️ API failed: ${apiError.message}`);
                console.log('📦 Falling back to Firestore data...');
                trains = await getFilteredTrains(from, to, date);
                console.log(`✅ Found ${trains.length} trains from Firestore`);
            }
        } else {
            // Use Firestore data directly
            console.log('📦 Using Firestore data (API not configured)');
            trains = await getFilteredTrains(from, to, date);
            console.log(`✅ Found ${trains.length} trains from Firestore`);
        }

        return NextResponse.json({
            data: trains,
            source,
            count: trains.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('❌ Error searching trains:', error);
        
        return NextResponse.json(
            { 
                error: 'Failed to search trains',
                details: error.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}
