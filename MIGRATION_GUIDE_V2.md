# Backend API Migration Guide

## 🎯 Overview

This guide will help you migrate from **direct Firebase client-side access** to a **secure backend API architecture**.

### What Changed?

**Before (INSECURE):**
```
Frontend Components → Firebase Client SDK → Firestore Database
```

**After (SECURE):**
```
Frontend Components → API Client → Backend API Routes → Firebase Admin SDK → Firestore Database
```

---

## 📋 Migration Steps

### Step 1: Install Dependencies ✅

The `firebase-admin` package has been added to `package.json`.

Run:
```bash
npm install
```

### Step 2: Configure Firebase Admin SDK

Follow the instructions in `BACKEND_API_SETUP.md` to:
1. Get your Firebase service account credentials
2. Add them to `.env.local`
3. Verify the setup

### Step 3: Update Frontend Components

Replace direct Firebase calls with API client calls in your components.

#### Example Migration

**BEFORE (user-bookings.tsx):**
```typescript
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

// Direct Firestore access
const bookingsQuery = query(
    collection(db, 'bookings'),
    where('userId', '==', user.id)
);

const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
    const userBookings = snapshot.docs.map(doc => fromFirestore<Booking>(doc));
    setBookings(userBookings);
});
```

**AFTER (user-bookings.tsx):**
```typescript
import { api } from '@/lib/api-client';

// Secure API call
useEffect(() => {
    const fetchBookings = async () => {
        try {
            setLoading(true);
            const bookings = await api.bookings.getMyBookings();
            setBookings(bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load bookings',
            });
        } finally {
            setLoading(false);
        }
    };
    
    if (user) {
        fetchBookings();
    }
}, [user]);
```

### Step 4: Component-by-Component Migration

Here's the migration checklist for each component:

#### ✅ user-bookings.tsx
- [ ] Replace `onSnapshot` with `api.bookings.getMyBookings()`
- [ ] Replace `cancelBooking` with `api.bookings.cancelBooking(id)`
- [ ] Remove Firebase imports
- [ ] Add error handling with toast notifications

#### ✅ reviews-section.tsx
- [ ] Replace `onSnapshot` with `api.reviews.getHotelReviews(hotelId)`
- [ ] Update to poll or use React Query for real-time updates
- [ ] Remove Firebase imports

#### ✅ owner-dashboard.tsx
- [ ] Replace hotels query with `api.hotels.getMyHotels()`
- [ ] Replace rooms query with `api.rooms.getMyRooms()`
- [ ] Replace bookings query with `api.bookings.getOwnerBookings()`
- [ ] Remove Firebase imports

#### ✅ admin-dashboard.tsx
- [ ] Replace hotels query with `api.admin.getPendingHotels()`
- [ ] Replace rooms query with `api.admin.getPendingRooms()`
- [ ] Replace bookings query with `api.admin.getAllBookings()`
- [ ] Replace users query with `api.users.getAllUsers()`
- [ ] Remove Firebase imports

#### ✅ flight-booking-modal.tsx
- [ ] Replace `addDoc` with `api.bookings.createBooking()`
- [ ] Remove Firebase imports

#### ✅ bus-booking-modal.tsx
- [ ] Replace `addDoc` with `api.bookings.createBooking()`
- [ ] Remove Firebase imports

#### ✅ admin-promoter.tsx
- [ ] Replace `updateDoc` with `api.users.promoteToAdmin(userId)`
- [ ] Remove Firebase imports

#### ✅ bookings-dashboard.tsx
- [ ] Replace `onSnapshot` with `api.bookings.getMyBookings()`
- [ ] Remove Firebase imports

#### ✅ dashboard/upcoming-trip.tsx
- [ ] Replace query with `api.bookings.getMyBookings()`
- [ ] Filter for upcoming trips in frontend
- [ ] Remove Firebase imports

---

## 🔄 Real-time Updates

Since we're moving away from `onSnapshot`, you have two options for real-time updates:

### Option 1: Polling (Simple)
```typescript
useEffect(() => {
    const fetchData = async () => {
        const data = await api.bookings.getMyBookings();
        setBookings(data);
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
}, []);
```

### Option 2: React Query (Recommended)
```bash
npm install @tanstack/react-query
```

```typescript
import { useQuery } from '@tanstack/react-query';

const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.bookings.getMyBookings(),
    refetchInterval: 30000, // Auto-refetch every 30 seconds
});
```

### Option 3: WebSockets (Advanced)
For true real-time updates, consider implementing WebSockets or Server-Sent Events.

---

## 📝 API Client Usage Examples

### Bookings
```typescript
import { api } from '@/lib/api-client';

// Get user's bookings
const bookings = await api.bookings.getMyBookings();

// Create booking
const newBooking = await api.bookings.createBooking({
    roomId: 'room123',
    hotelId: 'hotel456',
    fromDate: new Date('2026-01-15'),
    toDate: new Date('2026-01-20'),
});

// Cancel booking
await api.bookings.cancelBooking('booking789');
```

### Hotels
```typescript
// Get all hotels
const hotels = await api.hotels.getHotels();

// Search hotels
const results = await api.hotels.searchHotels({
    destination: 'Mumbai',
    facilities: ['wifi', 'pool'],
    minPrice: 1000,
    maxPrice: 5000,
});

// Get specific hotel
const hotel = await api.hotels.getHotel('hotel123');

// Create hotel (owner only)
const newHotel = await api.hotels.createHotel({
    name: 'My Hotel',
    location: 'Mumbai, India',
    description: 'A great hotel',
    // ... other fields
});
```

### Reviews
```typescript
// Get hotel reviews
const reviews = await api.reviews.getHotelReviews('hotel123');

// Create review
const newReview = await api.reviews.createReview({
    hotelId: 'hotel123',
    rating: 5,
    comment: 'Excellent stay!',
});
```

### Admin Operations
```typescript
// Get pending hotels
const pendingHotels = await api.admin.getPendingHotels();

// Approve hotel
await api.hotels.updateHotelStatus('hotel123', 'approved');

// Get all users
const users = await api.users.getAllUsers();

// Promote user to admin
await api.users.promoteToAdmin('user123');
```

---

## 🧪 Testing

### Test API Endpoints

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Test with curl:**
   ```bash
   # Get hotels (no auth required)
   curl http://localhost:3000/api/hotels
   
   # Get bookings (requires auth)
   curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
        http://localhost:3000/api/bookings
   ```

3. **Test with Postman:**
   - Import the API endpoints
   - Add Firebase Auth token to headers
   - Test all CRUD operations

### Get Firebase Auth Token

In your browser console (when logged in):
```javascript
firebase.auth().currentUser.getIdToken().then(console.log)
```

---

## 🚨 Breaking Changes

### 1. No More Real-time Listeners
- `onSnapshot` is removed
- Use polling or React Query instead
- Consider WebSockets for critical real-time features

### 2. Date Handling
- API returns ISO string dates
- Convert to Date objects in frontend:
  ```typescript
  const booking = await api.bookings.getBooking('id');
  const fromDate = new Date(booking.fromDate);
  ```

### 3. Error Handling
- All API calls can throw errors
- Always wrap in try-catch:
  ```typescript
  try {
      await api.bookings.createBooking(data);
  } catch (error) {
      toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message,
      });
  }
  ```

---

## 📊 Migration Progress Tracker

### Core Infrastructure
- [x] Firebase Admin SDK setup
- [x] Authentication middleware
- [x] API client library
- [x] Environment configuration

### API Routes
- [x] Bookings API (GET, POST, DELETE)
- [x] Hotels API (GET, POST, DELETE, PATCH)
- [x] Rooms API (GET, POST, PATCH)
- [x] Reviews API (GET, POST, DELETE)
- [x] Users API (GET, PATCH)
- [x] Admin API (pending hotels, rooms, bookings)
- [x] Buses API (GET, POST, DELETE, search)
- [x] Flights API (search)

### Frontend Components
- [ ] user-bookings.tsx
- [ ] reviews-section.tsx
- [ ] owner-dashboard.tsx
- [ ] admin-dashboard.tsx
- [ ] flight-booking-modal.tsx
- [ ] bus-booking-modal.tsx
- [ ] admin-promoter.tsx
- [ ] bookings-dashboard.tsx
- [ ] dashboard/upcoming-trip.tsx
- [ ] hotel-onboarding-form.tsx
- [ ] add-review-form.tsx
- [ ] signup-form.tsx

### Testing
- [ ] Unit tests for API routes
- [ ] Integration tests
- [ ] E2E tests
- [ ] Load testing

### Deployment
- [ ] Environment variables configured
- [ ] Staging deployment
- [ ] Production deployment
- [ ] Monitoring setup

---

## 🔒 Security Checklist

- [ ] Firebase Admin credentials secured
- [ ] `.env.local` in `.gitignore`
- [ ] All API routes have authentication
- [ ] Role-based access control implemented
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured (optional)
- [ ] CORS configured properly
- [ ] Firebase Security Rules updated
- [ ] Audit logs implemented (optional)

---

## 📚 Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## 🆘 Need Help?

If you encounter issues during migration:

1. Check the `BACKEND_API_SETUP.md` for environment setup
2. Review the `FRONTEND_DATABASE_ACCESS_ANALYSIS.md` for security context
3. Check server logs for detailed error messages
4. Verify Firebase Admin credentials are correct
5. Ensure all environment variables are set

---

## 🎉 Post-Migration

Once migration is complete:

1. **Remove unused code:**
   - Delete direct Firebase imports from components
   - Remove `fromFirestore` helper usage in components
   - Clean up unused dependencies

2. **Update documentation:**
   - Document new API endpoints
   - Update README with new architecture
   - Create API documentation (consider Swagger/OpenAPI)

3. **Monitor performance:**
   - Check API response times
   - Monitor error rates
   - Set up alerts for failures

4. **Optimize:**
   - Add caching where appropriate
   - Implement rate limiting
   - Add request/response compression

---

**Status:** Backend API infrastructure is complete. Frontend migration is ready to begin.

**Estimated Migration Time:** 2-3 days for all components

**Priority:** CRITICAL - This addresses a major security vulnerability
