# 🔧 How to Fix the Firebase Authentication Error

## ❌ Current Error
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=mock_key_for_build 400 (Bad Request)
Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

## 🔍 Root Cause
You don't have a `.env.local` file with your Firebase credentials. The app is using a fallback mock key which doesn't work for authentication.

## ✅ Solution: Create .env.local File

### Step 1: Create the File
In your project root directory, create a file named `.env.local`:

```bash
# In PowerShell
New-Item -Path ".env.local" -ItemType File
```

Or manually create a file named `.env.local` in:
```
c:\Users\Lenovo\Downloads\hotel-reservation-main\.env.local
```

### Step 2: Get Firebase Credentials

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Select your project (or create one)

2. **Get Client SDK Config:**
   - Click the **gear icon** (⚙️) → **Project Settings**
   - Scroll to **"Your apps"** section
   - If no web app exists, click **"Add app"** → Select **Web** (</>) icon
   - Copy the `firebaseConfig` object values

3. **Get Admin SDK Config (for backend API):**
   - Go to **Project Settings** → **Service Accounts** tab
   - Click **"Generate New Private Key"** button
   - Download the JSON file
   - Keep it safe (don't commit to git!)

### Step 3: Fill in .env.local

Copy this template into your `.env.local` file and replace with your actual values:

```env
# ============================================================================
# FIREBASE CLIENT SDK (Required for Login/Authentication)
# ============================================================================
# Replace these with values from Firebase Console > Project Settings > Your apps

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# ============================================================================
# FIREBASE ADMIN SDK (Required for Backend API - Optional for now)
# ============================================================================
# You can add these later when you're ready to use the backend API

# Option 1: Paste entire service account JSON (remove line breaks)
# FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...",...}'

# Option 2: Individual fields from the JSON file
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
# FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
```

### Step 4: Restart Development Server

After creating `.env.local`:

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 5: Test Login

Try logging in again. The error should be gone!

---

## 📋 Quick Checklist

- [ ] Created `.env.local` file in project root
- [ ] Added `NEXT_PUBLIC_FIREBASE_API_KEY` with real value
- [ ] Added `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] Added `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] Added `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] Added `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] Added `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] Added `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- [ ] Restarted dev server
- [ ] Tested login

---

## 🎯 Where to Find Each Value

### In Firebase Console (firebaseConfig object):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "xxx.firebaseapp.com", // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "your-project",      // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "xxx.appspot.com", // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123...",    // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123...",              // → NEXT_PUBLIC_FIREBASE_APP_ID
  measurementId: "G-XXX"          // → NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
```

---

## ⚠️ Important Notes

1. **Never commit `.env.local` to git** - It's already in `.gitignore`
2. **All values starting with `NEXT_PUBLIC_` are visible in browser** - This is normal for Firebase client SDK
3. **Admin SDK credentials are secret** - Only use on server-side
4. **Restart server after changing `.env.local`** - Changes won't apply until restart

---

## 🆘 Still Having Issues?

### Error: "Project not found"
- Make sure `NEXT_PUBLIC_FIREBASE_PROJECT_ID` matches your Firebase project

### Error: "Invalid API key"
- Double-check you copied the full API key
- Make sure there are no extra spaces
- Verify the key is from the correct Firebase project

### Error: "Auth domain not configured"
- Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Can't find Firebase Console values?
1. Go to https://console.firebase.google.com/
2. Select your project
3. Click gear icon (⚙️) → Project Settings
4. Scroll to "Your apps" section
5. If empty, click "Add app" → Web
6. Copy the config values

---

## 🚀 After Fixing

Once you have `.env.local` configured:
1. Login should work ✅
2. You can start using the app ✅
3. Later, add Admin SDK credentials for backend API ✅

---

**Need the template?** Here's a one-liner to create the file:

```powershell
@"
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
"@ | Out-File -FilePath .env.local -Encoding utf8
```

Then edit the file and replace the placeholder values!
