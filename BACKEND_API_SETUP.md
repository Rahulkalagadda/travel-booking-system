# Backend API Implementation - Environment Setup

## Required Environment Variables

To use the Firebase Admin SDK for secure server-side database access, you need to add the following environment variables to your `.env.local` file:

### Option 1: Service Account JSON (Recommended for Production)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Add the entire JSON content as a single environment variable:

```env
# Firebase Admin SDK - Service Account JSON
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id",...}'
```

### Option 2: Individual Environment Variables (Easier for Development)

Extract the following fields from your service account JSON and add them separately:

```env
# Firebase Admin SDK - Individual Fields
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"

# These should already exist from your client-side Firebase config
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

## Important Notes

### Security Best Practices

1. **NEVER commit `.env.local` to version control**
   - Already included in `.gitignore`
   - Contains sensitive credentials

2. **Use different Firebase projects for development and production**
   - Development: Use test data
   - Production: Use production credentials

3. **Restrict Firebase Admin SDK permissions**
   - Only grant necessary permissions
   - Use Firebase Security Rules as additional layer

### Environment Variable Format

- **FIREBASE_PRIVATE_KEY**: Must include `\n` for line breaks
  - Example: `"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"`
  - The `\n` characters will be replaced with actual newlines in code

- **FIREBASE_SERVICE_ACCOUNT**: Must be valid JSON string
  - Wrap entire JSON in single quotes
  - Escape any internal quotes if needed

## Deployment

### Vercel

Add environment variables in:
**Project Settings** > **Environment Variables**

```
FIREBASE_SERVICE_ACCOUNT = {...}
```

### Other Platforms

Consult your platform's documentation for adding environment variables:
- **Netlify**: Site Settings > Build & Deploy > Environment
- **Railway**: Project > Variables
- **Render**: Environment > Environment Variables

## Verification

To verify your setup is working:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Check the console for Firebase Admin initialization
3. Try accessing any API endpoint:
   ```bash
   curl http://localhost:3000/api/hotels
   ```

4. You should see data returned (not an error)

## Troubleshooting

### Error: "No Firebase Admin credentials found"

**Solution**: Add `FIREBASE_SERVICE_ACCOUNT` or individual credentials to `.env.local`

### Error: "Invalid private key"

**Solution**: Ensure `FIREBASE_PRIVATE_KEY` includes proper line breaks (`\n`)

### Error: "Permission denied"

**Solution**: 
1. Check Firebase Security Rules
2. Verify service account has necessary permissions
3. Ensure you're using the correct project ID

### Error: "Token verification failed"

**Solution**:
1. Ensure client is sending valid Firebase Auth token
2. Check that token hasn't expired
3. Verify Auth domain matches your Firebase project

## Migration Checklist

- [ ] Add Firebase Admin credentials to `.env.local`
- [ ] Install firebase-admin package (already in package.json)
- [ ] Test API endpoints locally
- [ ] Update frontend components to use API client
- [ ] Remove direct Firebase imports from components
- [ ] Test authentication flow
- [ ] Deploy to staging environment
- [ ] Verify production environment variables
- [ ] Deploy to production
- [ ] Monitor for errors

## Support

If you encounter issues:
1. Check Firebase Console for service account status
2. Verify all environment variables are set correctly
3. Check server logs for detailed error messages
4. Ensure Firebase project billing is enabled (required for some features)
