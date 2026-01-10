# 🚂 IRCTC1 RapidAPI Integration - Setup Complete

## ✅ Configuration Updated

Your railway booking feature is now configured to use the **IRCTC1 RapidAPI** endpoint.

### 📝 Your `.env.local` Should Contain:

```env
RAILWAY_API_KEY=065376fa4emsh8dd483192984e5fp10a1a9jsn6d9ce037deab
RAILWAY_API_BASE_URL=https://irctc1.p.rapidapi.com/api/v1
RAILWAY_API_HOST=irctc1.p.rapidapi.com
```

## 🔄 Changes Made

### 1. Updated API Endpoints
- ✅ Changed from generic `indian-railway-api` to `irctc1.p.rapidapi.com`
- ✅ Updated base URL to `https://irctc1.p.rapidapi.com/api/v1`
- ✅ Fixed header names (lowercase `x-rapidapi-key` instead of `X-RapidAPI-Key`)

### 2. Updated Search Logic
- ✅ Added `searchStation()` function to convert station names to codes
- ✅ Updated `searchTrains()` to use IRCTC1 API format
- ✅ Uses `/searchStation` endpoint first, then `/searchTrain`

### 3. API Flow
```
User enters: "Delhi" → "Mumbai"
       ↓
searchStation("Delhi") → Returns station code (e.g., "NDLS")
       ↓
searchStation("Mumbai") → Returns station code (e.g., "CSTM")
       ↓
searchTrain(fromCode, toCode) → Returns list of trains
       ↓
Transform to our Train type → Display results
```

## 🚀 Next Steps

### 1. Update Your `.env.local`
Copy this into your `.env.local` file:
```env
RAILWAY_API_KEY=065376fa4emsh8dd483192984e5fp10a1a9jsn6d9ce037deab
RAILWAY_API_BASE_URL=https://irctc1.p.rapidapi.com/api/v1
RAILWAY_API_HOST=irctc1.p.rapidapi.com
```

### 2. Restart the Server
```bash
# Stop all running servers (Ctrl+C)
# Then start fresh:
npm run dev
```

### 3. Test the Configuration
```
http://localhost:3000/api/trains/config-check
```

**Expected Response:**
```json
{
  "configured": {
    "hasApiKey": true,
    "hasBaseUrl": true,
    "hasHost": true
  },
  "message": "Railway API is configured ✅"
}
```

### 4. Test Train Search
```
http://localhost:3000/railway
```

Search for:
- **From**: Delhi
- **To**: Mumbai
- **Date**: Any future date

## 📊 IRCTC1 API Endpoints

Your subscription includes:

### 1. Search Station
```
GET /api/v1/searchStation?query=BJU
```
Returns station codes and names

### 2. Search Train
```
GET /api/v1/searchTrain?fromStationCode=NDLS&toStationCode=CSTM
```
Returns trains between stations

### 3. Get Train
```
GET /api/v1/getTrain?trainNo=12301
```
Returns train details

### 4. PNR Status
```
GET /api/v1/checkPNR?pnrNumber=1234567890
```
Returns PNR status

### 5. Live Train Status
```
GET /api/v1/liveTrainStatus?trainNo=12301&startDay=0
```
Returns live train location

## 🎯 Station Code Examples

Common Indian Railway station codes:

| City | Station Name | Code |
|------|-------------|------|
| Delhi | New Delhi | NDLS |
| Mumbai | Mumbai Central | BCT |
| Mumbai | Chhatrapati Shivaji Terminus | CSTM |
| Bangalore | Bangalore City | SBC |
| Chennai | Chennai Central | MAS |
| Kolkata | Howrah Junction | HWH |
| Hyderabad | Hyderabad Deccan | HYB |
| Pune | Pune Junction | PUNE |
| Ahmedabad | Ahmedabad Junction | ADI |
| Jaipur | Jaipur Junction | JP |

## 🔧 Troubleshooting

### Issue: Still getting 503 error

**Solution:**
1. Verify `.env.local` has the correct values (see above)
2. Make sure the file is in the project root (same level as `package.json`)
3. Stop ALL running dev servers
4. Wait 5 seconds
5. Start fresh: `npm run dev`
6. Test: `http://localhost:3000/api/trains/config-check`

### Issue: "Station not found"

**Solution:**
- Try using full station names (e.g., "New Delhi" instead of "Delhi")
- Or use station codes directly (e.g., "NDLS" for New Delhi)
- Check available stations at: `http://localhost:3000/api/trains/stations`

### Issue: No trains found

**Solution:**
- Verify the route exists (not all stations have direct trains)
- Try popular routes first (Delhi-Mumbai, Mumbai-Bangalore, etc.)
- Check the date is in the future

## 📚 API Response Format

### searchStation Response:
```json
{
  "data": [
    {
      "code": "NDLS",
      "name": "NEW DELHI",
      "state": "Delhi"
    }
  ]
}
```

### searchTrain Response:
```json
{
  "data": [
    {
      "train_number": "12301",
      "train_name": "RAJDHANI EXP",
      "from_station": "NDLS",
      "to_station": "CSTM",
      "from_time": "16:55",
      "to_time": "08:35",
      "duration": "15:40",
      "classes": ["1A", "2A", "3A"]
    }
  ]
}
```

## 🎨 Next Features to Implement

1. **Station Autocomplete** - Use `/searchStation` for autocomplete
2. **Train Details Page** - Use `/getTrain` for detailed info
3. **PNR Checker** - Use `/checkPNR` for status
4. **Live Tracking** - Use `/liveTrainStatus` for real-time location

## 💡 Pro Tips

1. **Cache Station Codes** - Station codes rarely change, cache them
2. **Autocomplete** - Implement station search autocomplete for better UX
3. **Error Handling** - Show helpful messages when stations aren't found
4. **Loading States** - Show loading while searching for stations

---

**Status**: ✅ Ready to Test
**API**: IRCTC1 RapidAPI
**Date**: January 10, 2026
