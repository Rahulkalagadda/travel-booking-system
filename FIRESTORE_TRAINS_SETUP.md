# 🔥 Firebase Firestore - Trains Collection Setup Guide

## 📊 **Collection Structure**

```
trains (collection)
├── 12301 (document)
│   ├── trainNumber: "12301"
│   ├── trainName: "Rajdhani Express"
│   ├── depart: "New Delhi"
│   ├── arrive: "Mumbai Central"
│   ├── departTime: "16:55"
│   ├── arriveTime: "08:35"
│   ├── duration: "15h 40m"
│   ├── runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
│   ├── seats: [array of seat objects]
│   ├── amenities: ["WiFi", "Pantry", "Security", "Charging Points"]
│   └── createdAt: "2026-01-11T10:00:00.000Z"
├── 12430 (document)
├── 12626 (document)
└── ... (more trains)
```

---

## 🚀 **Method 1: Manual Creation (Easiest)**

### **Step 1: Access Firebase Console**
1. Go to https://console.firebase.google.com/
2. Select your project
3. Click "Firestore Database" in left sidebar

### **Step 2: Create Collection**
1. Click "+ Start collection"
2. Collection ID: `trains`
3. Click "Next"

### **Step 3: Add First Document**
1. Document ID: `12301` (use custom ID)
2. Add fields one by one:

| Field | Type | Value |
|-------|------|-------|
| trainNumber | string | 12301 |
| trainName | string | Rajdhani Express |
| depart | string | New Delhi |
| arrive | string | Mumbai Central |
| departTime | string | 16:55 |
| arriveTime | string | 08:35 |
| duration | string | 15h 40m |
| runningDays | array | Click "+" → Add: Mon, Tue, Wed, Thu, Fri, Sat, Sun |
| amenities | array | Click "+" → Add: WiFi, Pantry, Security, Charging Points |
| createdAt | string | 2026-01-11T10:00:00.000Z |

### **Step 4: Add Seats Array**
1. Add field: `seats`
2. Type: `array`
3. Click the array, then click "+"
4. For each seat, select "map" and add:

**Seat 1 (1A):**
- id: string → "1A"
- classType: string → "1A"
- price: number → 3500
- available: number → 12
- status: string → "available"

**Seat 2 (2A):**
- id: string → "2A"
- classType: string → "2A"
- price: number → 2200
- available: number → 8
- status: string → "available"

**Seat 3 (3A):**
- id: string → "3A"
- classType: string → "3A"
- price: number → 1600
- available: number → 5
- status: string → "limited"

**Seat 4 (SL):**
- id: string → "SL"
- classType: string → "SL"
- price: number → 600
- available: number → 0
- status: string → "waitlist"

5. Click "Save"

### **Step 5: Add More Trains**
Repeat for these train numbers:
- `12430` - Shatabdi Express (Delhi → Lucknow)
- `12626` - Karnataka Express (Delhi → Bangalore)
- `12860` - Gitanjali Express (Mumbai → Howrah)
- `12951` - Mumbai Rajdhani (Mumbai → Delhi)
- `12723` - Telangana Express (Hyderabad → Delhi)

---

## 📥 **Method 2: Using Firebase CLI (Advanced)**

### **Prerequisites:**
```bash
npm install -g firebase-tools
firebase login
```

### **Steps:**
1. **Initialize Firebase in your project:**
   ```bash
   firebase init firestore
   ```

2. **Use the import script:**
   ```bash
   firebase firestore:import ./trains-firestore-import.json
   ```

---

## 🔧 **Method 3: Using Firestore REST API**

You can also use the Firestore REST API to add documents programmatically.

### **Example cURL command:**
```bash
curl -X POST \
  "https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/trains?documentId=12301" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "trainNumber": {"stringValue": "12301"},
      "trainName": {"stringValue": "Rajdhani Express"},
      "depart": {"stringValue": "New Delhi"},
      "arrive": {"stringValue": "Mumbai Central"}
    }
  }'
```

---

## ✅ **Verification**

After adding the trains, verify:

1. **In Firebase Console:**
   - Go to Firestore Database
   - You should see `trains` collection
   - Click on it to see 6 documents

2. **In Your App:**
   - Visit: `http://localhost:3000/railway`
   - Search: Delhi → Mumbai
   - You should see trains from Firestore

3. **Check Logs:**
   - Look for: `✅ Found X trains from Firestore`

---

## 📋 **Complete Train Data**

### **Train 1: Rajdhani Express (12301)**
- Route: New Delhi → Mumbai Central
- Time: 16:55 → 08:35 (15h 40m)
- Classes: 1A, 2A, 3A, SL

### **Train 2: Shatabdi Express (12430)**
- Route: New Delhi → Lucknow
- Time: 06:10 → 12:25 (6h 15m)
- Classes: CC, EC

### **Train 3: Karnataka Express (12626)**
- Route: New Delhi → Bangalore
- Time: 19:50 → 06:00 (34h 10m)
- Classes: 1A, 2A, 3A, SL

### **Train 4: Gitanjali Express (12860)**
- Route: Mumbai CST → Howrah
- Time: 06:20 → 10:05 (27h 45m)
- Classes: 2A, 3A, SL

### **Train 5: Mumbai Rajdhani (12951)**
- Route: Mumbai Central → New Delhi
- Time: 16:25 → 08:35 (16h 10m)
- Classes: 1A, 2A, 3A

### **Train 6: Telangana Express (12723)**
- Route: Hyderabad → New Delhi
- Time: 17:15 → 12:05 (24h 50m)
- Classes: 2A, 3A, SL

---

## 🎯 **Quick Test Searches**

After setup, try these searches:

1. **Delhi → Mumbai**
   - Should return: Rajdhani Express (12301)

2. **Mumbai → Delhi**
   - Should return: Mumbai Rajdhani (12951)

3. **Delhi → Bangalore**
   - Should return: Karnataka Express (12626)

4. **Hyderabad → Delhi**
   - Should return: Telangana Express (12723)

---

## 🔐 **Security Rules**

Make sure your Firestore rules allow reading trains:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trains/{trainId} {
      allow read: if true;  // Public read access
      allow write: if request.auth != null;  // Only authenticated users can write
    }
  }
}
```

---

## 💡 **Tips**

1. **Document IDs**: Use train numbers as document IDs for easy lookup
2. **Indexing**: Firestore will auto-index common queries
3. **Backup**: Export your data regularly
4. **Testing**: Use Firestore emulator for local testing

---

## 🐛 **Troubleshooting**

### **Issue: Can't see trains in app**
- Check Firestore rules
- Verify collection name is exactly `trains`
- Check browser console for errors

### **Issue: Seats not showing**
- Make sure `seats` is an array of maps
- Verify field names match exactly (case-sensitive)
- Check `classType` not `class`

### **Issue: Search returns no results**
- Check station names match exactly
- Try searching with partial names (e.g., "Delhi" instead of "New Delhi")

---

**Status**: Ready to create trains collection manually
**File**: `trains-firestore-import.json` (for reference)
**Date**: January 11, 2026
