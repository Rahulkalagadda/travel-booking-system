# ✅ How to Verify Redis Integration

## 🎯 Quick Verification (3 Methods)

---

## Method 1: Use the Test Page (Easiest) ⭐

### Step 1: Visit the Test Page
```
http://localhost:3000/test-redis
```

### Step 2: Run the Tests
1. Click **"Run Connection Test"** - Tests basic Redis read/write
2. Click **"Run Performance Test"** - Compares cached vs uncached speeds
3. Click **"Show Instructions"** - View console log instructions

### Step 3: Check Results
- ✅ **Green checkmark** = Redis is working!
- ❌ **Red X** = Check your Redis credentials

---

## Method 2: Check Console Logs (Most Reliable) 🔍

### Step 1: Open Browser Console
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I`
- **Firefox**: Press `F12`
- Go to **Console** tab

### Step 2: Search for Flights
Visit: `http://localhost:3000/flights/results?origin=DEL&destination=BOM&date=2026-02-01`

### Step 3: Look for These Messages

**First Search (Cache Miss):**
```
❌ Cache MISS - Fetching from Amadeus API
```

**Second Search (Cache Hit):**
```
✅ Cache HIT - Returning cached flight results
```

### What This Means:
- ✅ **See both messages?** Redis is working perfectly!
- ❌ **Only see "Cache MISS"?** Redis might not be configured
- ❌ **See errors?** Check your `.env.local` file

---

## Method 3: Check Terminal Output 💻

### Look at Your Terminal
Your dev server terminal should show:

**When Redis is Working:**
```bash
✅ Cache HIT - Returning cached flight results
✅ Cache HIT - Returning cached hotel search results
```

**When Redis is NOT Working:**
```bash
❌ Cache MISS - Fetching from Amadeus API
Redis cache error: [Error details]
```

---

## 🔧 Detailed Verification Steps

### 1. Check Environment Variables

**Open your `.env.local` file and verify:**
```env
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXXXXXXXXXXXXXXXXXXXXXXXx
```

**Common Issues:**
- ❌ Missing `UPSTASH_REDIS_REST_URL`
- ❌ Missing `UPSTASH_REDIS_REST_TOKEN`
- ❌ Extra spaces or quotes around values
- ❌ Using wrong credentials

**How to Fix:**
1. Go to https://upstash.com/
2. Log in to your account
3. Click on your Redis database
4. Copy **REST URL** and **REST TOKEN**
5. Paste into `.env.local` (no quotes needed)
6. Restart your dev server: `Ctrl+C` then `npm run dev`

---

### 2. Test API Endpoints Directly

#### Test Cache API
```bash
# In a new terminal, test the cache API:

# Set a value
curl -X POST http://localhost:3000/api/cache \
  -H "Content-Type: application/json" \
  -d '{"key":"test123","value":{"hello":"world"},"ttl":60}'

# Get the value
curl http://localhost:3000/api/cache?key=test123
```

**Expected Response:**
```json
{
  "data": {"hello": "world"},
  "cached": true
}
```

**If you see this:** ✅ Redis is working!

**If you see an error:** ❌ Check your Redis credentials

---

#### Test Flights API
```bash
# First call (should be slow)
curl "http://localhost:3000/api/flights?origin=DEL&destination=BOM&date=2026-02-01"

# Second call (should be fast)
curl "http://localhost:3000/api/flights?origin=DEL&destination=BOM&date=2026-02-01"
```

**Check terminal for:**
- First call: `❌ Cache MISS`
- Second call: `✅ Cache HIT`

---

### 3. Check Upstash Dashboard

#### Step 1: Log in to Upstash
Visit: https://console.upstash.com/

#### Step 2: Click on Your Database
You should see your Redis database listed

#### Step 3: Check Statistics
Look for:
- **Total Keys**: Should increase when you search
- **Total Commands**: Should show activity
- **Memory Usage**: Should show data being stored

#### Step 4: View Keys (Optional)
Click **"Data Browser"** to see cached keys like:
- `amadeus:flights:DEL-BOM-2026-02-01`
- `hotel:search:{params}`
- `bus:search:{params}`

**If you see keys:** ✅ Redis is caching data!

---

### 4. Performance Test

#### Manual Performance Test:

1. **Open Network Tab** in browser DevTools (F12)
2. **Search for flights** with specific parameters
3. **Note the response time** (e.g., 1500ms)
4. **Search again** with SAME parameters
5. **Note the new response time** (e.g., 50ms)

**Expected Results:**
- First search: 500ms - 3000ms
- Second search: 30ms - 100ms
- **Improvement: 10-30x faster!** ⚡

---

## 🚨 Troubleshooting

### Problem: "Cache MISS" every time

**Possible Causes:**
1. Redis credentials not set
2. Redis credentials incorrect
3. Server not restarted after adding credentials

**Solution:**
```bash
# 1. Check .env.local has correct credentials
# 2. Restart dev server
Ctrl+C
npm run dev
# 3. Try searching again
```

---

### Problem: "Redis cache error" in console

**Possible Causes:**
1. Invalid Redis URL or token
2. Upstash database is paused/deleted
3. Network connectivity issues

**Solution:**
1. Verify credentials at https://console.upstash.com/
2. Make sure database is active (not paused)
3. Copy fresh credentials and update `.env.local`
4. Restart server

---

### Problem: No cache logs appearing

**Possible Causes:**
1. Not using the updated API routes
2. Server not restarted
3. Logs being filtered out

**Solution:**
1. Make sure you're on the latest code
2. Restart dev server
3. Check terminal output (not just browser console)
4. Try the test page: `http://localhost:3000/test-redis`

---

## ✅ Success Indicators

### You'll know Redis is working when:

1. **Console Logs Show:**
   ```
   ✅ Cache HIT - Returning cached flight results
   ```

2. **Response Times:**
   - First search: ~1-3 seconds
   - Repeat search: ~50-100ms (20-30x faster!)

3. **Upstash Dashboard:**
   - Shows increasing key count
   - Shows memory usage
   - Shows command activity

4. **Test Page:**
   - All tests pass with green checkmarks
   - Performance test shows significant improvement

5. **Network Tab:**
   - Cached requests complete in <100ms
   - Uncached requests take 500ms-3s

---

## 📊 Expected Performance

### Flights API (Amadeus)
| Metric | Without Cache | With Cache | Improvement |
|--------|---------------|------------|-------------|
| Response Time | 1-3 seconds | 50-100ms | **20-30x faster** |
| API Calls | Every request | Once per 5 min | **95% reduction** |

### Hotels API (Firebase)
| Metric | Without Cache | With Cache | Improvement |
|--------|---------------|------------|-------------|
| Response Time | 500ms-1s | 30-50ms | **10-20x faster** |
| DB Reads | Every request | Once per 30 min | **90% reduction** |

### Buses API (Firebase)
| Metric | Without Cache | With Cache | Improvement |
|--------|---------------|------------|-------------|
| Response Time | 300-800ms | 30-50ms | **10-15x faster** |
| DB Reads | Every request | Once per 30 min | **90% reduction** |

---

## 🎯 Quick Test Checklist

Use this checklist to verify everything is working:

- [ ] `.env.local` has Redis credentials
- [ ] Dev server restarted after adding credentials
- [ ] Visit `http://localhost:3000/test-redis`
- [ ] Run "Connection Test" - passes with green checkmark
- [ ] Run "Performance Test" - shows improvement
- [ ] Search for flights twice - second is faster
- [ ] Terminal shows "Cache HIT" on second search
- [ ] Browser console shows "Cache HIT" on second search
- [ ] Upstash dashboard shows cached keys
- [ ] Network tab shows faster response times

**If all checked:** ✅ Redis is fully integrated and working!

---

## 🆘 Still Having Issues?

### Check These Common Mistakes:

1. **Forgot to restart server** after adding credentials
   ```bash
   Ctrl+C
   npm run dev
   ```

2. **Wrong environment file** (should be `.env.local`, not `.env`)

3. **Quotes around credentials** (remove them)
   ```env
   # ❌ Wrong
   UPSTASH_REDIS_REST_URL="https://..."
   
   # ✅ Correct
   UPSTASH_REDIS_REST_URL=https://...
   ```

4. **Spaces in credentials** (remove them)
   ```env
   # ❌ Wrong
   UPSTASH_REDIS_REST_URL = https://...
   
   # ✅ Correct
   UPSTASH_REDIS_REST_URL=https://...
   ```

5. **Using test/development database** (make sure it's active)

---

## 📞 Need Help?

### Debugging Commands:

```bash
# Check if Redis credentials are loaded
# Add this to any API route temporarily:
console.log('Redis URL:', process.env.UPSTASH_REDIS_REST_URL ? 'Set ✅' : 'Missing ❌');
console.log('Redis Token:', process.env.UPSTASH_REDIS_REST_TOKEN ? 'Set ✅' : 'Missing ❌');
```

### Test Redis Connection Directly:

Create a test file `test-redis.js`:
```javascript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'YOUR_REDIS_URL',
  token: 'YOUR_REDIS_TOKEN',
});

async function test() {
  try {
    await redis.set('test', 'Hello Redis!');
    const value = await redis.get('test');
    console.log('✅ Redis working! Value:', value);
  } catch (error) {
    console.error('❌ Redis error:', error);
  }
}

test();
```

Run: `node test-redis.js`

---

## 🎉 Success!

Once you see:
- ✅ Cache HIT messages in console
- ⚡ 10-30x faster response times
- 💰 95% reduction in API calls
- 📊 Keys appearing in Upstash dashboard

**Your Redis integration is working perfectly!** 🚀

---

**Last Updated:** 2026-01-11  
**Status:** Complete ✅
