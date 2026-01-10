import { NextRequest, NextResponse } from 'next/server';
import { cacheUtils, cacheKeys, cacheDurations } from '@/lib/redis';

/**
 * GET /api/cache
 * Retrieve cached data by key
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json(
                { error: 'Cache key is required' },
                { status: 400 }
            );
        }

        const data = await cacheUtils.get(key);

        if (!data) {
            return NextResponse.json(
                { error: 'Cache miss', data: null },
                { status: 404 }
            );
        }

        return NextResponse.json({ data, cached: true });
    } catch (error) {
        console.error('Cache GET error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve cache' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/cache
 * Set cached data with optional expiration
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { key, value, ttl } = body;

        if (!key || !value) {
            return NextResponse.json(
                { error: 'Key and value are required' },
                { status: 400 }
            );
        }

        const success = await cacheUtils.set(key, value, ttl);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to set cache' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, key });
    } catch (error) {
        console.error('Cache POST error:', error);
        return NextResponse.json(
            { error: 'Failed to set cache' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/cache
 * Delete cached data by key
 */
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json(
                { error: 'Cache key is required' },
                { status: 400 }
            );
        }

        const success = await cacheUtils.delete(key);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to delete cache' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, key });
    } catch (error) {
        console.error('Cache DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete cache' },
            { status: 500 }
        );
    }
}
