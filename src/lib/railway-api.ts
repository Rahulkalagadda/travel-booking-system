/**
 * Railway API Service
 * Handles all interactions with Indian Railway API
 */

// Debug: Log environment variables (remove in production)
console.log('Railway API Config Check:', {
    hasApiKey: !!process.env.RAILWAY_API_KEY,
    apiKeyLength: process.env.RAILWAY_API_KEY?.length || 0,
    baseUrl: process.env.RAILWAY_API_BASE_URL,
    host: process.env.RAILWAY_API_HOST,
});

const RAILWAY_API_CONFIG = {
    baseUrl: process.env.RAILWAY_API_BASE_URL || 'https://indian-railway-api.p.rapidapi.com',
    apiKey: process.env.RAILWAY_API_KEY || '',
    host: process.env.RAILWAY_API_HOST || 'indian-railway-api.p.rapidapi.com',
};

export interface TrainSearchParams {
    from: string;
    to: string;
    date?: string;
}

export interface LiveTrainStatus {
    trainNumber: string;
    trainName: string;
    currentStation: string;
    delay: string;
    expectedArrival: string;
    lastUpdated: string;
}

export interface PNRStatus {
    pnr: string;
    trainNumber: string;
    trainName: string;
    from: string;
    to: string;
    dateOfJourney: string;
    chartPrepared: boolean;
    passengers: Array<{
        number: number;
        currentStatus: string;
        bookingStatus: string;
        coach: string;
        berth: string;
    }>;
}

export interface SeatAvailabilityParams {
    trainNumber: string;
    from: string;
    to: string;
    date: string;
    classType: string;
}

/**
 * Fetch trains between two stations
 */
export async function searchTrains(params: TrainSearchParams) {
    try {
        // IRCTC1 API uses different endpoint structure
        // First, we need to search for station codes
        const fromStation = await searchStation(params.from);
        const toStation = await searchStation(params.to);

        if (!fromStation || !toStation) {
            throw new Error('Station not found. Please check station names.');
        }

        // Now search for trains between stations
        const url = new URL(`${RAILWAY_API_CONFIG.baseUrl}/api/v1/searchTrain`);
        url.searchParams.append('fromStationCode', fromStation.code);
        url.searchParams.append('toStationCode', toStation.code);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAILWAY_API_CONFIG.apiKey,
                'x-rapidapi-host': RAILWAY_API_CONFIG.host,
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching trains:', error);
        throw error;
    }
}

/**
 * Search for station by name to get station code
 */
async function searchStation(query: string): Promise<{ code: string; name: string } | null> {
    try {
        console.log(`Searching for station: "${query}"`);
        
        // Try searching with the query as-is first
        let url = new URL(`${RAILWAY_API_CONFIG.baseUrl}/api/v1/searchStation`);
        url.searchParams.append('query', query.toUpperCase());

        let response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAILWAY_API_CONFIG.apiKey,
                'x-rapidapi-host': RAILWAY_API_CONFIG.host,
            },
            next: { revalidate: 86400 }, // Cache for 24 hours
        });

        if (!response.ok) {
            console.error(`Station search failed: ${response.status}`);
            return null;
        }

        let data = await response.json();
        console.log(`Station search for "${query}" returned ${data.data?.length || 0} results`);

        if (data.data && data.data.length > 0) {
            // Find the best matching station
            const stations = data.data;
            const queryLower = query.toLowerCase();
            
            // Priority 1: Exact name match
            let match = stations.find((s: any) => 
                s.name.toLowerCase() === queryLower || 
                s.eng_name?.toLowerCase() === queryLower
            );
            
            // Priority 2: Starts with query
            if (!match) {
                match = stations.find((s: any) => 
                    s.name.toLowerCase().startsWith(queryLower)
                );
            }
            
            // Priority 3: Contains query and is a major station (shorter code = major station)
            if (!match) {
                match = stations
                    .filter((s: any) => s.name.toLowerCase().includes(queryLower))
                    .sort((a: any, b: any) => a.code.length - b.code.length)[0];
            }
            
            // Priority 4: Just take the first result
            if (!match) {
                match = stations[0];
            }
            
            console.log(`Selected station: ${match.name} (${match.code})`);
            
            return {
                code: match.code,
                name: match.name,
            };
        }

        console.log(`No stations found for query: "${query}"`);
        return null;
    } catch (error) {
        console.error('Error searching station:', error);
        return null;
    }
}

/**
 * Get live train running status
 */
export async function getLiveTrainStatus(
    trainNumber: string,
    date: string
): Promise<LiveTrainStatus> {
    try {
        const url = new URL(`${RAILWAY_API_CONFIG.baseUrl}/live-status`);
        url.searchParams.append('trainNumber', trainNumber);
        url.searchParams.append('date', date);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAILWAY_API_CONFIG.apiKey,
                'x-rapidapi-host': RAILWAY_API_CONFIG.host,
            },
            next: { revalidate: 60 }, // Cache for 1 minute (live data)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching live train status:', error);
        throw error;
    }
}

/**
 * Check PNR status
 */
export async function checkPNRStatus(pnr: string): Promise<PNRStatus> {
    try {
        const url = new URL(`${RAILWAY_API_CONFIG.baseUrl}/pnr-status`);
        url.searchParams.append('pnr', pnr);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAILWAY_API_CONFIG.apiKey,
                'x-rapidapi-host': RAILWAY_API_CONFIG.host,
            },
            cache: 'no-store', // Don't cache PNR status
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking PNR status:', error);
        throw error;
    }
}

/**
 * Get train schedule
 */
export async function getTrainSchedule(trainNumber: string) {
    try {
        const url = new URL(`${RAILWAY_API_CONFIG.baseUrl}/train-schedule`);
        url.searchParams.append('trainNumber', trainNumber);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAILWAY_API_CONFIG.apiKey,
                'x-rapidapi-host': RAILWAY_API_CONFIG.host,
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching train schedule:', error);
        throw error;
    }
}

/**
 * Get seat availability
 */
export async function getSeatAvailability(params: SeatAvailabilityParams) {
    try {
        const url = new URL(`${RAILWAY_API_CONFIG.baseUrl}/seat-availability`);
        url.searchParams.append('trainNumber', params.trainNumber);
        url.searchParams.append('from', params.from);
        url.searchParams.append('to', params.to);
        url.searchParams.append('date', params.date);
        url.searchParams.append('class', params.classType);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAILWAY_API_CONFIG.apiKey,
                'x-rapidapi-host': RAILWAY_API_CONFIG.host,
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching seat availability:', error);
        throw error;
    }
}

/**
 * Get list of all stations
 */
export async function getAllStations() {
    try {
        const url = new URL(`${RAILWAY_API_CONFIG.baseUrl}/stations`);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAILWAY_API_CONFIG.apiKey,
                'x-rapidapi-host': RAILWAY_API_CONFIG.host,
            },
            next: { revalidate: 86400 }, // Cache for 24 hours
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching stations:', error);
        throw error;
    }
}

/**
 * Check if API is configured
 */
export function isAPIConfigured(): boolean {
    return !!(RAILWAY_API_CONFIG.apiKey && RAILWAY_API_CONFIG.baseUrl);
}
