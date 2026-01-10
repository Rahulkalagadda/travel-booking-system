# Indian Railway API Integration Plan

## Overview
This document outlines the integration of **Indian Railway APIs** to fetch real-time train data instead of using static Firestore data.

## Available API Options

### Recommended: RapidAPI - Indian Railway APIs
Based on research, the best options for Indian Railway data are:

1. **Indian Railway IRCTC API** (RapidAPI)
   - Live train running status
   - PNR status
   - Train schedules
   - Seat availability
   - Station information

2. **Indian Rail API** (indianrailapi.com)
   - Train schedules
   - Live running status
   - PNR status
   - Trains between stations
   - Train routes

3. **RailwayAPI** (railwayapi.com)
   - JSON-based API
   - Live Train Status
   - PNR Status
   - Train Schedule
   - Station Details

## Implementation Strategy

### Phase 1: API Setup & Configuration

#### 1.1 Environment Variables
Add to `.env.local`:
```env
# Indian Railway API Configuration
RAILWAY_API_KEY=your_api_key_here
RAILWAY_API_BASE_URL=https://indian-railway-api.p.rapidapi.com
RAILWAY_API_HOST=indian-railway-api.p.rapidapi.com

# Alternative: Indian Rail API
INDIAN_RAIL_API_KEY=your_api_key_here
INDIAN_RAIL_API_BASE_URL=https://indianrailapi.com/api/v2
```

#### 1.2 API Service Layer
Create `src/lib/railway-api.ts`:
```typescript
// Railway API service for fetching live train data

const RAILWAY_API_CONFIG = {
  baseUrl: process.env.RAILWAY_API_BASE_URL,
  apiKey: process.env.RAILWAY_API_KEY,
  host: process.env.RAILWAY_API_HOST,
};

export interface TrainSearchParams {
  from: string;
  to: string;
  date?: string;
}

export interface LiveTrainStatus {
  trainNumber: string;
  currentStation: string;
  delay: string;
  expectedArrival: string;
}

export interface PNRStatus {
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  dateOfJourney: string;
  passengers: Array<{
    number: number;
    currentStatus: string;
    bookingStatus: string;
  }>;
}

// Fetch trains between stations
export async function searchTrains(params: TrainSearchParams) {
  const response = await fetch(
    `${RAILWAY_API_CONFIG.baseUrl}/trains/between-stations?from=${params.from}&to=${params.to}`,
    {
      headers: {
        'X-RapidAPI-Key': RAILWAY_API_CONFIG.apiKey!,
        'X-RapidAPI-Host': RAILWAY_API_CONFIG.host!,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch trains');
  }
  
  return response.json();
}

// Get live train running status
export async function getLiveTrainStatus(trainNumber: string, date: string) {
  const response = await fetch(
    `${RAILWAY_API_CONFIG.baseUrl}/live-status?trainNumber=${trainNumber}&date=${date}`,
    {
      headers: {
        'X-RapidAPI-Key': RAILWAY_API_CONFIG.apiKey!,
        'X-RapidAPI-Host': RAILWAY_API_CONFIG.host!,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch live status');
  }
  
  return response.json();
}

// Check PNR status
export async function checkPNRStatus(pnr: string): Promise<PNRStatus> {
  const response = await fetch(
    `${RAILWAY_API_CONFIG.baseUrl}/pnr-status?pnr=${pnr}`,
    {
      headers: {
        'X-RapidAPI-Key': RAILWAY_API_CONFIG.apiKey!,
        'X-RapidAPI-Host': RAILWAY_API_CONFIG.host!,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch PNR status');
  }
  
  return response.json();
}

// Get train schedule
export async function getTrainSchedule(trainNumber: string) {
  const response = await fetch(
    `${RAILWAY_API_CONFIG.baseUrl}/train-schedule?trainNumber=${trainNumber}`,
    {
      headers: {
        'X-RapidAPI-Key': RAILWAY_API_CONFIG.apiKey!,
        'X-RapidAPI-Host': RAILWAY_API_CONFIG.host!,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch train schedule');
  }
  
  return response.json();
}

// Get seat availability
export async function getSeatAvailability(
  trainNumber: string,
  from: string,
  to: string,
  date: string,
  classType: string
) {
  const response = await fetch(
    `${RAILWAY_API_CONFIG.baseUrl}/seat-availability?trainNumber=${trainNumber}&from=${from}&to=${to}&date=${date}&class=${classType}`,
    {
      headers: {
        'X-RapidAPI-Key': RAILWAY_API_CONFIG.apiKey!,
        'X-RapidAPI-Host': RAILWAY_API_CONFIG.host!,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch seat availability');
  }
  
  return response.json();
}
```

### Phase 2: Update API Routes

#### 2.1 Update `/api/trains/search/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { searchTrains } from '@/lib/railway-api';
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

        // Fetch from Indian Railway API
        const apiResponse = await searchTrains({ from, to, date });
        
        // Transform API response to our Train type
        const trains = transformAPIResponseToTrain(apiResponse);
        
        return NextResponse.json(trains);
    } catch (error) {
        console.error('Error searching trains:', error);
        return NextResponse.json(
            { error: 'Failed to search trains' },
            { status: 500 }
        );
    }
}
```

#### 2.2 Create Data Transformer
Create `src/lib/railway-transformers.ts`:
```typescript
import type { Train, TrainSeat } from './types';

// Transform Indian Railway API response to our Train type
export function transformAPIResponseToTrain(apiResponse: any): Train[] {
  if (!apiResponse || !apiResponse.data) {
    return [];
  }

  return apiResponse.data.map((train: any) => ({
    id: train.train_number || train.trainNumber,
    trainNumber: train.train_number || train.trainNumber,
    trainName: train.train_name || train.trainName,
    depart: train.from_station_name || train.fromStation,
    arrive: train.to_station_name || train.toStation,
    departTime: train.departure_time || train.departureTime,
    arriveTime: train.arrival_time || train.arrivalTime,
    duration: train.duration || calculateDuration(train),
    runningDays: train.running_days || train.runDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    seats: transformSeats(train.classes || train.availableClasses),
    amenities: train.amenities || ['Pantry', 'Security'],
  }));
}

function transformSeats(classes: any[]): TrainSeat[] {
  if (!classes || !Array.isArray(classes)) {
    return [];
  }

  return classes.map((cls: any) => ({
    id: cls.class_code || cls.classCode,
    class: cls.class_code || cls.classCode,
    price: parseInt(cls.fare || cls.price || '0'),
    available: parseInt(cls.available_seats || cls.availableSeats || '0'),
    status: determineStatus(parseInt(cls.available_seats || cls.availableSeats || '0')),
  }));
}

function determineStatus(available: number): 'available' | 'limited' | 'waitlist' {
  if (available > 10) return 'available';
  if (available > 0) return 'limited';
  return 'waitlist';
}

function calculateDuration(train: any): string {
  // Calculate duration from departure and arrival times
  // This is a simplified version
  return train.duration || '0h 0m';
}
```

### Phase 3: Add New Features

#### 3.1 PNR Status Checker
Create `src/app/railway/pnr-status/page.tsx`:
```typescript
"use client"

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function PNRStatusPage() {
  const [pnr, setPnr] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/trains/pnr-status?pnr=${pnr}`);
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-12 container px-4">
        <h1 className="text-3xl font-bold mb-8">Check PNR Status</h1>
        <Card className="max-w-2xl">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Input
                placeholder="Enter 10-digit PNR"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                maxLength={10}
              />
              <Button onClick={checkStatus} disabled={loading}>
                {loading ? 'Checking...' : 'Check Status'}
              </Button>
            </div>
            
            {status && (
              <div className="mt-6">
                {/* Display PNR status details */}
                <h2 className="text-xl font-bold">{status.trainName}</h2>
                <p>Train Number: {status.trainNumber}</p>
                <p>From: {status.from} → To: {status.to}</p>
                {/* Add more status details */}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
```

#### 3.2 Live Train Status
Create API route `/api/trains/live-status/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getLiveTrainStatus } from '@/lib/railway-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const trainNumber = searchParams.get('trainNumber');
  const date = searchParams.get('date');

  if (!trainNumber || !date) {
    return NextResponse.json(
      { error: 'Train number and date are required' },
      { status: 400 }
    );
  }

  try {
    const status = await getLiveTrainStatus(trainNumber, date);
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch live status' },
      { status: 500 }
    );
  }
}
```

### Phase 4: Caching Strategy

#### 4.1 Redis Caching (Optional)
Since you already have Redis setup, cache API responses:

```typescript
import { redis } from '@/lib/redis';

export async function getCachedTrains(from: string, to: string, date: string) {
  const cacheKey = `trains:${from}:${to}:${date}`;
  
  // Try to get from cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from API
  const trains = await searchTrains({ from, to, date });
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(trains));
  
  return trains;
}
```

## Implementation Checklist

- [ ] Sign up for Indian Railway API (RapidAPI or indianrailapi.com)
- [ ] Add API keys to `.env.local`
- [ ] Create `src/lib/railway-api.ts` service layer
- [ ] Create `src/lib/railway-transformers.ts` for data transformation
- [ ] Update `/api/trains/search/route.ts` to use live API
- [ ] Create `/api/trains/pnr-status/route.ts`
- [ ] Create `/api/trains/live-status/route.ts`
- [ ] Create PNR Status page
- [ ] Create Live Train Status page
- [ ] Add caching layer (optional)
- [ ] Update UI to show real-time data
- [ ] Add error handling and fallbacks
- [ ] Test with various routes and dates

## API Providers Comparison

| Feature | RapidAPI (Indian Railway) | IndianRailAPI.com | RailwayAPI.com |
|---------|---------------------------|-------------------|----------------|
| Free Tier | Yes (limited) | Yes | Yes |
| PNR Status | ✅ | ✅ | ✅ |
| Live Status | ✅ | ✅ | ✅ |
| Seat Availability | ✅ | ✅ | ✅ |
| Train Schedule | ✅ | ✅ | ✅ |
| Documentation | Excellent | Good | Good |
| Rate Limits | Varies by plan | 100 req/day (free) | Varies |

## Recommended: RapidAPI Integration

**Why RapidAPI?**
1. Already using RapidAPI for other services
2. Unified billing and API management
3. Better documentation
4. More reliable uptime
5. Easy to scale

## Next Steps

1. **Choose API Provider**: Sign up for RapidAPI's Indian Railway API
2. **Get API Key**: Obtain your API key from the provider
3. **Implement Service Layer**: Create the railway-api.ts service
4. **Update Routes**: Modify existing API routes to use live data
5. **Test**: Thoroughly test with various routes and edge cases
6. **Deploy**: Update environment variables in production

## Cost Considerations

- **Free Tier**: Most providers offer 100-500 requests/day free
- **Paid Plans**: Start from $10-50/month for higher limits
- **Caching**: Implement Redis caching to reduce API calls
- **Optimization**: Cache popular routes and schedules

## Error Handling

Implement proper fallbacks:
1. If API fails, show cached data (if available)
2. If no cached data, show Firestore seed data
3. Display user-friendly error messages
4. Log errors for monitoring

## Security

- Never expose API keys in client-side code
- Use environment variables
- Implement rate limiting
- Validate all user inputs
- Sanitize API responses

---

**Status**: Ready for Implementation
**Priority**: High
**Estimated Time**: 2-3 days
