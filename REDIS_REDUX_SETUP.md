# Redis & Redux Setup Guide

## 🎉 Installation Complete

The following libraries have been installed:
- `@reduxjs/toolkit` - Modern Redux with less boilerplate
- `react-redux` - React bindings for Redux
- `@upstash/redis` - Serverless Redis client

## 📁 Files Created

### Redux Store Structure
```
src/
├── store/
│   ├── store.ts              # Main Redux store configuration
│   ├── hooks.ts              # Typed Redux hooks
│   └── slices/
│       ├── userSlice.ts      # User authentication & preferences
│       ├── bookingSlice.ts   # Booking management
│       ├── hotelSlice.ts     # Hotel search & filters
│       └── uiSlice.ts        # UI state (modals, toasts, theme)
├── components/
│   └── providers/
│       └── ReduxProvider.tsx # Redux provider wrapper
└── lib/
    └── redis.ts              # Redis utilities & cache functions
```

### API Routes
```
src/app/api/
└── cache/
    └── route.ts              # Cache management API
```

## 🔧 Setup Instructions

### 1. Configure Redis (Upstash)

1. **Sign up for Upstash** (free tier available):
   - Go to https://upstash.com/
   - Create a new Redis database

2. **Add credentials to `.env.local`**:
```env
# Redis Configuration (Upstash)
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

### 2. Wrap Your App with Redux Provider

Update `src/app/layout.tsx`:

```tsx
import { ReduxProvider } from '@/components/providers/ReduxProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {/* Your existing providers */}
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
```

## 🚀 Usage Examples

### Using Redux in Components

```tsx
'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/slices/userSlice';
import { addBooking } from '@/store/slices/bookingSlice';
import { addToast } from '@/store/slices/uiSlice';

export default function MyComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.currentUser);
  const bookings = useAppSelector((state) => state.booking.bookings);
  
  const handleBooking = () => {
    dispatch(addBooking({
      id: '123',
      hotelName: 'Grand Hotel',
      // ... other booking data
    }));
    
    dispatch(addToast({
      message: 'Booking created successfully!',
      type: 'success',
    }));
  };
  
  return <div>{/* Your component */}</div>;
}
```

### Using Redis Cache

```tsx
import { cacheUtils, cacheKeys, cacheDurations } from '@/lib/redis';

// Cache hotel search results
async function searchHotels(location: string) {
  const cacheKey = cacheKeys.hotelSearch(location);
  
  // Try to get from cache first
  const cached = await cacheUtils.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // If not cached, fetch from API
  const results = await fetchHotelsFromAPI(location);
  
  // Cache for 30 minutes
  await cacheUtils.set(cacheKey, results, cacheDurations.MEDIUM);
  
  return results;
}

// Cache user profile
async function getUserProfile(userId: string) {
  const cacheKey = cacheKeys.userProfile(userId);
  
  const cached = await cacheUtils.get(cacheKey);
  if (cached) return cached;
  
  const profile = await fetchUserProfile(userId);
  await cacheUtils.set(cacheKey, profile, cacheDurations.LONG);
  
  return profile;
}
```

### Using Cache API Route

```tsx
// Client-side cache operations
async function cacheData(key: string, value: any, ttl?: number) {
  const response = await fetch('/api/cache', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value, ttl }),
  });
  return response.json();
}

async function getCachedData(key: string) {
  const response = await fetch(`/api/cache?key=${key}`);
  return response.json();
}

async function deleteCachedData(key: string) {
  const response = await fetch(`/api/cache?key=${key}`, {
    method: 'DELETE',
  });
  return response.json();
}
```

## 🎯 Optimization Strategies

### 1. Cache Amadeus API Responses
```tsx
import { cacheUtils, cacheKeys, cacheDurations } from '@/lib/redis';

async function searchHotelsWithCache(params: SearchParams) {
  const cacheKey = cacheKeys.amadeus('hotels', JSON.stringify(params));
  
  // Check cache first
  const cached = await cacheUtils.get(cacheKey);
  if (cached) return cached;
  
  // Call Amadeus API
  const results = await amadeusClient.search(params);
  
  // Cache for 5 minutes (hotel availability changes frequently)
  await cacheUtils.set(cacheKey, results, cacheDurations.SHORT);
  
  return results;
}
```

### 2. Persist Redux State
```tsx
// In your store.ts, add middleware to sync with localStorage
import { configureStore } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify({
      user: state.user,
      ui: { theme: state.ui.theme },
    });
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    // Handle errors
  }
};

export const store = configureStore({
  reducer: { /* ... */ },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});
```

### 3. Rate Limiting with Redis
```tsx
import { redis } from '@/lib/redis';

async function checkRateLimit(userId: string, limit = 100) {
  const key = `ratelimit:${userId}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    // Set expiration on first request
    await redis.expire(key, 60); // 1 minute window
  }
  
  return current <= limit;
}
```

## 📊 Performance Benefits

### Redux Benefits:
✅ **Centralized State** - Single source of truth
✅ **Predictable Updates** - Time-travel debugging
✅ **Performance** - Selective re-renders with selectors
✅ **DevTools** - Redux DevTools for debugging
✅ **Persistence** - Easy state persistence

### Redis Benefits:
✅ **Fast Caching** - Sub-millisecond response times
✅ **Reduced API Calls** - Cache expensive operations
✅ **Scalability** - Serverless, auto-scaling
✅ **Cost Savings** - Fewer Amadeus API calls
✅ **Better UX** - Instant responses for cached data

## 🔍 Monitoring

### Check Redis Stats
```tsx
import { redis } from '@/lib/redis';

async function getRedisStats() {
  const info = await redis.info();
  console.log('Redis Info:', info);
}
```

### Monitor Redux State
```tsx
// In development, use Redux DevTools browser extension
// https://github.com/reduxjs/redux-devtools
```

## 🎨 Next Steps

1. **Integrate with existing Firebase auth** - Update userSlice when user logs in
2. **Cache hotel search results** - Reduce Amadeus API calls
3. **Implement optimistic updates** - Better UX for bookings
4. **Add rate limiting** - Protect your API routes
5. **Monitor cache hit rates** - Optimize cache strategy

## 📚 Resources

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Upstash Redis Docs](https://docs.upstash.com/redis)
- [Next.js with Redux](https://nextjs.org/docs/app/building-your-application/data-fetching/caching)
