import { NextRequest, NextResponse } from 'next/server';
import { getLiveTrainStatus, isAPIConfigured } from '@/lib/railway-api';
import { transformLiveStatus } from '@/lib/railway-transformers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const trainNumber = searchParams.get('trainNumber') || '';
        const date = searchParams.get('date') || '';

        if (!trainNumber) {
            return NextResponse.json(
                { error: 'Train number is required' },
                { status: 400 }
            );
        }

        if (!date) {
            return NextResponse.json(
                { error: 'Date is required (format: YYYY-MM-DD)' },
                { status: 400 }
            );
        }

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json(
                { error: 'Invalid date format. Use YYYY-MM-DD.' },
                { status: 400 }
            );
        }

        if (!isAPIConfigured()) {
            return NextResponse.json(
                { error: 'Railway API is not configured. Please add API credentials.' },
                { status: 503 }
            );
        }

        const apiResponse = await getLiveTrainStatus(trainNumber, date);
        const liveStatus = transformLiveStatus(apiResponse);

        return NextResponse.json({
            success: true,
            data: liveStatus,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('Error fetching live train status:', error);

        // Handle specific error cases
        if (error.message?.includes('404') || error.message?.includes('not found')) {
            return NextResponse.json(
                { error: 'Train not found or not running on this date.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch live train status. Please try again later.' },
            { status: 500 }
        );
    }
}
