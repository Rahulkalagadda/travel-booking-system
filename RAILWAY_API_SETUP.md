# 🚂 Indian Railway API Integration - Setup Guide

## ✅ What's Been Implemented

The following components have been successfully created:

### 1. **Core Service Layer**
- ✅ `src/lib/railway-api.ts` - Complete API service with all endpoints
- ✅ `src/lib/railway-transformers.ts` - Data transformation utilities
- ✅ Supports: Train search, PNR status, live tracking, seat availability

### 2. **API Routes**
- ✅ `/api/trains/search` - Updated with API integration + Firestore fallback
- ✅ `/api/trains/pnr-status` - New PNR status checker
- ✅ `/api/trains/live-status` - New live train tracking

### 3. **Frontend Updates**
- ✅ Search results page updated to handle API responses
- ✅ Data source tracking (API vs Firestore)
- ✅ Backward compatible with existing code

## 🚀 Quick Start Guide

### Step 1: Get Your API Key

**Recommended: RapidAPI**

1. Go to [RapidAPI Hub](https://rapidapi.com/hub)
2. Search for "Indian Railway" or "IRCTC"
3. Subscribe to an API (most have free tiers)
4. Copy your API key from the dashboard

**Popular Options:**
- **Indian Railway IRCTC API** - Most comprehensive
- **Indian Rail API** - Good alternative
- **Live Train Status API** - Focused on live data

### Step 2: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp env.railway.example .env.local
   ```

2. Edit `.env.local` and add your API key:
   ```env
   RAILWAY_API_KEY=your_actual_api_key_here
   RAILWAY_API_BASE_URL=https://indian-railway-api.p.rapidapi.com
   RAILWAY_API_HOST=indian-railway-api.p.rapidapi.com
   ```

3. Save the file

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test the Integration

1. Navigate to `/railway` page
2. Search for trains (e.g., From: "Delhi", To: "Mumbai")
3. Check the browser console - you should see:
   ```
   Fetching trains from Indian Railway API...
   Found X trains from API
   ```

## 📊 How It Works

### Intelligent Fallback System

The integration uses a smart fallback approach:

```
1. Try Indian Railway API first (if configured)
   ↓
2. If API fails or not configured → Use Firestore data
   ↓
3. Return results with source indicator
```

### Response Format

The API now returns:
```json
{
  "data": [...trains...],
  "source": "api" | "firestore",
  "count": 10
}
```

### Caching Strategy

- **Train Search**: 5 minutes cache
- **Live Status**: 1 minute cache  
- **PNR Status**: No cache (always fresh)
- **Train Schedule**: 1 hour cache

## 🎯 Available Features

### 1. Train Search (Already Integrated)
```typescript
GET /api/trains/search?from=Delhi&to=Mumbai&date=2026-01-15
```

### 2. PNR Status Checker (New)
```typescript
GET /api/trains/pnr-status?pnr=1234567890
```

### 3. Live Train Status (New)
```typescript
GET /api/trains/live-status?trainNumber=12301&date=2026-01-15
```

## 🔧 Testing Without API Key

The system works perfectly without an API key:

1. **Without API key**: Uses Firestore seed data (10 sample trains)
2. **With API key**: Uses live Indian Railway data

To test with seed data:
```bash
# Run the seed script
npx tsx src/lib/seed-trains.ts
```

## 🎨 Next Steps - UI Features

### 1. PNR Status Page (Recommended)

Create `src/app/railway/pnr-status/page.tsx`:
- Input field for 10-digit PNR
- Display passenger details
- Show booking status
- Chart preparation status

### 2. Live Train Tracking Page

Create `src/app/railway/live-status/page.tsx`:
- Train number input
- Current location display
- Delay information
- Expected arrival time

### 3. Enhanced Search Results

Add to search results page:
- "Check Live Status" button for each train
- Real-time seat availability
- Fare calendar
- Train route map

## 📝 API Provider Comparison

| Provider | Free Tier | Rate Limit | Best For |
|----------|-----------|------------|----------|
| **RapidAPI** | 100-500 req/day | Varies | Production |
| **IndianRailAPI** | 100 req/day | 100/day | Testing |
| **RailwayAPI** | Limited | Varies | Development |

## 🔐 Security Best Practices

✅ **Implemented:**
- API keys stored in environment variables
- Server-side API calls only
- Input validation on all endpoints
- Error handling with fallbacks

❌ **Never Do:**
- Expose API keys in client-side code
- Commit `.env.local` to Git
- Share API keys publicly

## 🐛 Troubleshooting

### Issue: "Railway API is not configured"

**Solution:**
1. Check `.env.local` exists
2. Verify `RAILWAY_API_KEY` is set
3. Restart development server

### Issue: "Failed to fetch trains"

**Solution:**
1. Check API key is valid
2. Verify API endpoint URL
3. Check RapidAPI subscription status
4. Review browser console for errors

### Issue: No trains found

**Solution:**
1. Try different station names
2. Check if API supports those stations
3. Falls back to Firestore automatically

## 📚 Code Examples

### Using the Railway API Service

```typescript
import { searchTrains, checkPNRStatus } from '@/lib/railway-api';

// Search trains
const trains = await searchTrains({
  from: 'Delhi',
  to: 'Mumbai',
  date: '2026-01-15'
});

// Check PNR
const status = await checkPNRStatus('1234567890');
```

### Transform API Response

```typescript
import { transformAPIResponseToTrain } from '@/lib/railway-transformers';

const apiResponse = await searchTrains(params);
const trains = transformAPIResponseToTrain(apiResponse);
```

## 🎯 Performance Tips

1. **Enable Caching**: API responses are cached automatically
2. **Use Redis**: Already configured in your project
3. **Batch Requests**: Combine multiple API calls when possible
4. **Monitor Usage**: Track API quota in RapidAPI dashboard

## 📈 Monitoring

Check API usage:
1. Go to RapidAPI Dashboard
2. View "Analytics" tab
3. Monitor request count
4. Set up alerts for quota limits

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Add `RAILWAY_API_KEY` to production environment
- [ ] Test API integration thoroughly
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure rate limiting
- [ ] Add Redis caching in production
- [ ] Test fallback to Firestore
- [ ] Monitor API quota usage
- [ ] Set up alerts for API failures

## 💡 Tips

1. **Start with Free Tier**: Test thoroughly before upgrading
2. **Cache Aggressively**: Reduce API calls with smart caching
3. **Handle Errors Gracefully**: Always have Firestore fallback
4. **Monitor Quota**: Set up alerts before hitting limits
5. **Test Edge Cases**: Invalid PNRs, non-existent trains, etc.

## 📞 Support

- **RapidAPI Support**: https://support.rapidapi.com
- **Indian Rail API Docs**: https://indianrailapi.com/docs
- **Project Issues**: Create an issue in your repository

---

**Status**: ✅ Ready for Testing
**Last Updated**: January 10, 2026
**Version**: 1.0.0
