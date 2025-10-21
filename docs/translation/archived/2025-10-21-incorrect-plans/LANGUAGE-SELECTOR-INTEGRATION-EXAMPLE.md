# Language Selector - Quick Integration Example

## 🚀 Add Language Selector to Carriers Page

This example shows how to add the LanguageSelector component to the Carriers page header.

### Step 1: Import the Component

Add this import at the top of `Carriers.tsx`:

```typescript
import { LanguageSelector } from '../../translations/components/LanguageSelector';
import { useLanguage } from '../../../app/providers/LanguageProvider';
```

### Step 2: Add Language Change Handler (Optional)

Inside the `Carriers` component, add a handler to re-translate when language changes:

```typescript
const Carriers: React.FC = () => {
  // ... existing code ...
  
  const { currentLanguage } = useLanguage();
  const { translateCarriers, isTranslating } = useCarrierTranslation();
  
  // Re-translate when language changes
  useEffect(() => {
    if (currentLanguage && carriers.length > 0) {
      const translate = async () => {
        const translated = await translateCarriers(carriers);
        setTranslatedCarriers(translated);
        setIsTranslated(true);
      };
      translate();
    }
  }, [currentLanguage]); // Add currentLanguage as dependency
  
  // ... rest of code ...
};
```

### Step 3: Update the Header JSX

Replace the existing header section (around line 395-410) with:

```tsx
{/* Header */}
<div className="flex items-center justify-between">
  <div className="flex items-center gap-3">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {'Carriers'}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {'Manage your carrier partners'}
      </p>
    </div>
    {isTranslated && (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        🌐 FR
      </span>
    )}
  </div>
  
  {/* Action Buttons */}
  <div className="flex items-center gap-3">
    {/* Language Selector */}
    <LanguageSelector minimal showFlags />
    
    {/* Add Carrier Button */}
    <Button
      onClick={() => {
        setModalTitle('Create New Carrier');
        setModalFooter(null);
        setShowCreateModal(true);
      }}
      className="flex items-center space-x-2"
    >
      <PlusIcon className="h-4 w-4" />
      {'Add Carrier'}
    </Button>
  </div>
</div>
```

### Complete Modified Section

Here's the complete updated header section with LanguageSelector integrated:

```tsx
// At the top of the file - add import
import { LanguageSelector } from '../../translations/components/LanguageSelector';
import { useLanguage } from '../../../app/providers/LanguageProvider';

// Inside the component
const Carriers: React.FC = () => {
  // ... existing state ...
  
  // Add language context
  const { currentLanguage } = useLanguage();
  
  // ... existing hooks ...
  
  const { translateCarriers, isTranslating } = useCarrierTranslation();
  const [translatedCarriers, setTranslatedCarriers] = useState<Carrier[]>([]);
  const [isTranslated, setIsTranslated] = useState(false);

  // Enhanced: Re-translate when language changes
  useEffect(() => {
    if (carriers.length > 0) {
      const translate = async () => {
        const translated = await translateCarriers(carriers);
        setTranslatedCarriers(translated);
        setIsTranslated(true);
      };
      translate();
    } else {
      setTranslatedCarriers([]);
      setIsTranslated(false);
    }
  }, [carriers, translateCarriers, currentLanguage]); // Added currentLanguage

  // ... rest of component ...

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Language Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {'Carriers'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {'Manage your carrier partners'}
            </p>
          </div>
          {isTranslated && currentLanguage && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
            </span>
          )}
        </div>
        
        {/* Action Buttons with Language Selector */}
        <div className="flex items-center gap-3">
          {/* Language Selector - Minimal Mode */}
          <LanguageSelector 
            minimal 
            showFlags 
            onChange={(lang) => {
              console.log(`Language changed to: ${lang.name}`);
              // Translation will auto-trigger via useEffect
            }}
          />
          
          {/* Add Carrier Button */}
          <Button
            onClick={() => {
              setModalTitle('Create New Carrier');
              setModalFooter(null);
              setShowCreateModal(true);
            }}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            {'Add Carrier'}
          </Button>
        </div>
      </div>
      
      {/* ... rest of JSX ... */}
    </div>
  );
};
```

### What This Does

1. **Language Selector Dropdown:** Shows minimal flag-based dropdown in header
2. **Auto-Translation:** When language changes, carriers are automatically re-translated
3. **Visual Indicator:** FR badge dynamically shows current language
4. **Clean Layout:** Language selector sits next to "Add Carrier" button

### Testing Steps

1. **Start Services:**
   ```bash
   # All Docker services running
   docker ps
   ```

2. **Open Browser:**
   ```
   http://localhost:3000/carriers
   ```

3. **Test Language Selector:**
   - Click language dropdown (shows flag icon)
   - See list of available languages (English, French, etc.)
   - Select French
   - Watch table data translate to French
   - FR badge appears next to title
   - Check Network tab - single batch translate request

4. **Test Persistence:**
   - Refresh page (Cmd+R / F5)
   - Selected language persists
   - Data translates automatically on load

### Alternative: Full Mode in Settings

For a settings page or preferences screen, use full mode:

```tsx
<div className="space-y-4">
  <h2 className="text-lg font-semibold">Language Preferences</h2>
  <p className="text-sm text-gray-600">
    Select your preferred language for translations
  </p>
  
  <LanguageSelector 
    showFlags 
    showCode 
    onChange={(lang) => {
      console.log(`Language set to: ${lang.name}`);
      toast.success(`Language changed to ${lang.name}`);
    }}
  />
</div>
```

### Visual Result

**Before (English):**
```
Carriers                                           [🇺🇸 ▼] [+ Add Carrier]
Manage your carrier partners
```

**After Selecting French:**
```
Carriers           🌐 FR                           [🇫🇷 ▼] [+ Add Carrier]
Manage your carrier partners

Table shows:
- FedEx Express → Expédition express rapide et fiable
- UPS → Service de colis uni
- etc.
```

### Benefits

✅ **User-Friendly:** Easy to switch languages  
✅ **Automatic:** Translations happen automatically  
✅ **Persistent:** Language choice saved in localStorage  
✅ **Fast:** Uses existing batch translation (no extra requests)  
✅ **Visual:** Clear indicator of current language  
✅ **Reusable:** Same component works in other pages  

### Next Steps

1. ✅ Add to Carriers page (as shown above)
2. ⏸️ Add to Customers page
3. ⏸️ Add to Pricing page
4. ⏸️ Add to main Header/Navbar for global access
5. ⏸️ Add to User Settings page

---

**Ready to integrate!** Just copy the code above into your Carriers.tsx file.
