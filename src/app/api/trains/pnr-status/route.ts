import { NextRequest, NextResponse } from 'next/server';
import { checkPNRStatus, isAPIConfigured } from '@/lib/railway-api';
import { transformPNRStatus } from '@/lib/railway-transformers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const pnr = searchParams.get('pnr') || '';

        if (!pnr) {
            return NextResponse.json(
                { error: 'PNR number is required' },
                { status: 400 }
            );
        }

        // Validate PNR format (10 digits)
        if (!/^\d{10}$/.test(pnr)) {
            return NextResponse.json(
                { error: 'Invalid PNR format. PNR must be 10 digits.' },
                { status: 400 }
            );
        }

        if (!isAPIConfigured()) {
            return NextResponse.json(
                { error: 'Railway API is not configured. Please add API credentials.' },
                { status: 503 }
            );
        }

        const apiResponse = await checkPNRStatus(pnr);
        const pnrStatus = transformPNRStatus(apiResponse);

        return NextResponse.json({
            success: true,
            data: pnrStatus,
        });
    } catch (error: any) {
        console.error('Error checking PNR status:', error);

        // Handle specific error cases
        if (error.message?.includes('404') || error.message?.includes('not found')) {
            return NextResponse.json(
                { error: 'PNR not found. Please check the PNR number and try again.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to check PNR status. Please try again later.' },
            { status: 500 }
        );
    }
}
