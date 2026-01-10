import { unstable_cache } from 'next/cache';

export async function getCachedData<T>(
    fetcher: () => Promise<T>,
    keyParts: string[],
    revalidateSeconds: number = 3600
): Promise<T> {
    const cachedFetcher = unstable_cache(
        fetcher,
        keyParts,
        { revalidate: revalidateSeconds }
    );
    return cachedFetcher();
}
