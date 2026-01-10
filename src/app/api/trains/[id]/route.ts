import { NextRequest, NextResponse } from 'next/server';
import { getTrainById } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const train = await getTrainById(params.id);

        if (!train) {
            return NextResponse.json(
                { error: 'Train not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(train);
    } catch (error) {
        console.error('Error fetching train:', error);
        return NextResponse.json(
            { error: 'Failed to fetch train details' },
            { status: 500 }
        );
    }
}
