# Translation Debugging Guide

## Issue: Profile Labels Not Translating

### Root Cause Analysis

The translation system works as follows:

1. **LanguageProvider** manages the current language (default: English)
2. **useLabels** hook fetches translations from Translation Service
3. **English Bypass**: When `languageCode === 'en'`, no API call is made (returns source labels)
4. **French/Spanish**: API calls `/api/v1/translation/translate/batch` to fetch translations

### Step-by-Step Debugging

#### 1. Verify Translation Service is Running

```bash
# Check Translation Service health
curl -s http://localhost:3007/api/v1/health | jq .

# Expected response:
# {
#   "data": {
#     "status": "ok",
#     "service": "translation-service",
#     "version": "1.0.0"
#   }
# }
```

#### 2. Verify Translations Exist in Database

```bash
# Check French profile translations
curl -s "http://localhost:3007/api/v1/translation/translations?limit=100" | \
  jq '[.data.translations[] | select(.context.module == "profile" and .languageCode == "fr")] | length'

# Expected: 57

# Check Spanish profile translations
curl -s "http://localhost:3007/api/v1/translation/translations?limit=100" | \
  jq '[.data.translations[] | select(.context.module == "profile" and .languageCode == "es")] | length'

# Expected: 57
```

#### 3. Test Batch Translation API

```bash
# Test French translations
curl -s "http://localhost:3007/api/v1/translation/translate/batch" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "texts": ["User Details", "Profile", "Basic Information"],
    "targetLanguage": "fr",
    "sourceLanguage": "en"
  }' | jq .

# Expected response:
# {
#   "data": {
#     "translations": [
#       {
#         "text": "User Details",
#         "translatedText": "Détails de l'utilisateur",
#         "fromCache": true
#       },
#       {
#         "text": "Profile",
#         "translatedText": "Profil",
#         "fromCache": true
#       },
#       {
#         "text": "Basic Information",
#         "translatedText": "Informations de base",
#         "fromCache": true
#       }
#     ]
#   }
# }
```

#### 4. Check Frontend Language State

Open browser console and run:

```javascript
// Check current language
console.log('Current Language:', localStorage.getItem('current_language'));
console.log('Language Data:', JSON.parse(localStorage.getItem('current_language_data') || '{}'));

// Check React Query cache
console.log('React Query DevTools:', window.__REACT_QUERY_DEVTOOLS__);
```

#### 5. Monitor Network Requests

1. Open browser DevTools → Network tab
2. Filter by "translate"
3. Switch language to French
4. You should see a POST request to `/api/v1/translation/translate/batch`
5. Check the response payload

### Common Issues & Solutions

#### Issue 1: Language Not Changing

**Symptom**: UI stays in English after clicking language selector

**Solution**:
1. Check if `LanguageSelector` component is rendered in the header
2. Verify `useLanguageSelector` hook is properly connected
3. Check browser console for errors
4. Clear localStorage: `localStorage.clear()` and refresh

#### Issue 2: API Calls Failing

**Symptom**: Network errors in console, translations don't load

**Check**:
```bash
# Verify Translation Service is running
docker ps | grep translation-service

# Check logs
docker logs translation-service-container-name
```

**Solution**:
```bash
# Restart Translation Service
cd translation-service
docker-compose restart
```

#### Issue 3: Translations Return Empty

**Symptom**: API returns empty `translatedText` or original text

**Cause**: Translations don't exist in database

**Solution**:
```bash
# Re-run seeder
cd /opt/cursor-project/fullstack-project
node scripts/seed-profile-translations.js
```

#### Issue 4: English Shows Instead of Translation

**Symptom**: Labels stay in English even in French/Spanish

**Debug**:
1. Check if `currentLanguage.code` is actually 'fr' or 'es'
2. Verify `useLabels` hook receives correct language code
3. Check console for translation loading logs

**Add debug logging** to `useLabels.ts`:
```typescript
console.log('🔍 DEBUG: Language Code:', languageCode);
console.log('🔍 DEBUG: Current Language:', currentLanguage);
console.log('🔍 DEBUG: Translation Map Size:', translationMap?.size || 0);
console.log('🔍 DEBUG: Translated Labels:', translatedLabels);
```

### Manual Testing Checklist

#### Test 1: English (Default)
- [ ] Open http://localhost:3000/users
- [ ] Click "View Details" on any user
- [ ] Click "Profile" tab
- [ ] **Expected**: All labels in English (no API calls)
- [ ] Verify in Network tab: No calls to `/translate/batch`

#### Test 2: Switch to French
- [ ] Click language selector in header
- [ ] Select "Français"
- [ ] **Expected**: Labels change to French immediately
- [ ] Verify in Network tab: One POST to `/translate/batch`
- [ ] Check response contains French translations
- [ ] Verify UI updates: "Profile" → "Profil"

#### Test 3: Switch to Spanish
- [ ] Click language selector
- [ ] Select "Español"
- [ ] **Expected**: Labels change to Spanish immediately
- [ ] Verify in Network tab: One POST to `/translate/batch`
- [ ] Check response contains Spanish translations
- [ ] Verify UI updates: "Profile" → "Perfil"

#### Test 4: Create Profile in French
- [ ] Switch to French
- [ ] Click "Create Profile"
- [ ] Verify form labels are in French
- [ ] Fill form and save
- [ ] **Expected**: Success toast in French: "Profil créé avec succès"

#### Test 5: Edit Profile in Spanish
- [ ] Switch to Spanish
- [ ] Click "Edit Profile"
- [ ] Verify form labels are in Spanish
- [ ] Update profile
- [ ] **Expected**: Success toast in Spanish: "Perfil actualizado exitosamente"

### Quick Fix Commands

```bash
# Reset everything
cd /opt/cursor-project/fullstack-project

# Restart services
docker-compose -f docker-compose.hybrid.yml restart translation-service

# Re-seed translations
node scripts/seed-profile-translations.js

# Rebuild React app
cd react-admin
npm run build

# Clear browser cache
# In browser console:
# localStorage.clear(); location.reload();
```

### Debug Code Snippets

#### Add to UserDetails.tsx for debugging:

```typescript
useEffect(() => {
  console.log('🔍 UserDetails - Current Language:', currentLanguage);
  console.log('🔍 UserDetails - Labels:', L);
}, [currentLanguage, L]);
```

#### Add to useProfileLabels for debugging:

```typescript
useEffect(() => {
  console.log('🔍 useProfileLabels - Language Code:', currentLanguage?.code);
  console.log('🔍 useProfileLabels - isLoading:', isLoading);
  console.log('🔍 useProfileLabels - Labels sample:', {
    tabs: labels.tabs,
    actions: labels.actions,
  });
}, [currentLanguage, isLoading, labels]);
```

### Expected Console Output (French)

```
🔄 Fetching 60 profile labels for fr...
✅ profile labels loaded in 145ms. Cache hits: 57/60
🔍 useProfileLabels - Language Code: fr
🔍 useProfileLabels - Labels sample: {
  tabs: { userDetails: 'Détails de l'utilisateur', profile: 'Profil' },
  actions: { create: 'Créer un profil', edit: 'Modifier le profil', ... }
}
```

### Still Not Working?

If translations still don't appear after following all steps:

1. **Check React app is using latest code**:
   ```bash
   cd react-admin
   npm run build
   # Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   ```

2. **Verify LanguageProvider is wrapping the app**:
   ```typescript
   // In App.tsx or index.tsx
   <QueryProvider>
     <ThemeProvider>
       <LanguageProvider>  {/* Must wrap entire app */}
         <AuthProvider>
           <AppRoutes />
         </AuthProvider>
       </LanguageProvider>
     </ThemeProvider>
   </QueryProvider>
   ```

3. **Check for console errors**:
   - Open DevTools → Console
   - Look for red errors related to translation, language, or API calls
   - Share error messages for further debugging

4. **Enable React Query DevTools**:
   ```typescript
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
   
   // Add to App component
   <ReactQueryDevtools initialIsOpen={false} />
   ```
   - Check if translation queries are running
   - Verify cache status

---

## Contact

If issue persists, provide:
1. Browser console output
2. Network tab screenshot (filter: translate)
3. Current language from localStorage
4. React Query cache state
