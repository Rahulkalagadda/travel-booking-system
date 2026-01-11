import { NextRequest, NextResponse } from 'next/server';
import { getLiveTrainStatus, isAPIConfigured } from '@/lib/railway-api';
import { transformLiveStatus } from '@/lib/railway-transformers';

export const dynamic = 'force-dynamic';

// Mock live status generator
function generateMockLiveStatus(trainNumber: string, date: string) {
    const trains: Record<string, any> = {
        '12301': { name: 'Rajdhani Express', from: 'New Delhi', to: 'Mumbai Central' },
        '12430': { name: 'Shatabdi Express', from: 'New Delhi', to: 'Lucknow' },
        '12626': { name: 'Karnataka Express', from: 'New Delhi', to: 'Bangalore' },
        '12860': { name: 'Gitanjali Express', from: 'Mumbai CST', to: 'Howrah' },
        '12951': { name: 'Mumbai Rajdhani', from: 'Mumbai Central', to: 'New Delhi' },
        '12723': { name: 'Telangana Express', from: 'Hyderabad', to: 'New Delhi' },
    };

    const train = trains[trainNumber] || { name: 'Express Train', from: 'Station A', to: 'Station B' };

    const stations = [
        { name: train.from, arrival: null, departure: '16:55', delay: 0, status: 'Departed' },
        { name: 'Intermediate Station 1', arrival: '20:30', departure: '20:35', delay: 5, status: 'Running Late' },
        { name: 'Intermediate Station 2', arrival: '23:45', departure: '23:50', delay: 5, status: 'Yet to Arrive' },
        { name: train.to, arrival: '08:35', departure: null, delay: 0, status: 'Yet to Arrive' },
    ];

    return {
        trainNumber,
        trainName: train.name,
        date,
        currentStation: stations[1].name,
        status: 'Running',
        delay: 5,
        lastUpdated: new Date().toISOString(),
        stations,
    };
}

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

        // Try API if configured
        if (isAPIConfigured()) {
            try {
                console.log('Attempting to fetch live status from API...');
                const apiResponse = await getLiveTrainStatus(trainNumber, date);
                const liveStatus = transformLiveStatus(apiResponse);

                return NextResponse.json({
                    success: true,
                    data: liveStatus,
                    source: 'api',
                    timestamp: new Date().toISOString(),
                });
            } catch (apiError: any) {
                console.log(`⚠️ API failed: ${apiError.message}`);
                console.log('📦 Falling back to mock live status...');
            }
        }

        // Fall back to mock data
        const mockData = generateMockLiveStatus(trainNumber, date);
        return NextResponse.json({
            success: true,
            data: mockData,
            source: 'mock',
            message: 'Demo live status (API quota exceeded)',
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Error fetching live train status:', error);

        return NextResponse.json(
            { error: 'Failed to fetch live train status. Please try again later.' },
            { status: 500 }
        );
    }
}
