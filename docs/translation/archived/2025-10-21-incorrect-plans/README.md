# 📁 Archived Incorrect Plans

**Archive Date**: October 21, 2025  
**Reason**: Plans created with incorrect assumptions about the system architecture

---

## 📋 Contents

This directory contains **documentation created with wrong assumptions** about how the translation system works.

### Issue: Assumed i18n-Style Keys
These documents assumed the system used **predefined translation keys** like `t('page.title')`, but the actual system uses **MD5-based content-addressable translation** where the text itself is the key.

### Files Archived:
1. **CARRIER-PAGE-LABEL-TRANSLATION-PLAN.md** - Used i18n-style keys (wrong approach)
2. **CARRIER-LABEL-TRANSLATION-SUMMARY.md** - Based on wrong plan above
3. **CONTENT-VS-LABEL-TRANSLATION-GUIDE.md** - Based on incorrect assumptions
4. **LANGUAGE-SELECTOR-INTEGRATION-EXAMPLE.md** - Redundant with LANGUAGE-SELECTOR-IMPLEMENTATION.md
5. **TRANSLATION-FEATURE-COMPLETE-SUMMARY.md** - Redundant summary

---

## ⚠️ What Was Wrong

### Incorrect Approach (These Archived Docs)
```typescript
// ❌ Wrong: These docs assumed this approach
const { t } = useCarrierLabels();
<h1>{t('page.title')}</h1>  // Using predefined keys

// Would require:
// - Key mappings in frontend
// - Context parameter in backend
// - Complex setup
```

### Correct Approach (Actual System)
```typescript
// ✅ Correct: Actual MD5-based system
const labels = await translateBatch([
  'Carriers',           // Just English text
  'Add Carrier',        // No keys needed
  'Name'
], 'fr');

// Backend:
// 1. Generates MD5 hash of text
// 2. Looks up translation by hash
// 3. Returns translated text
// Simple!
```

---

## 📚 For Correct Implementation

See: **`docs/translation/CARRIER-LABEL-TRANSLATION-MD5-PLAN.md`** for the correct implementation plan that matches your actual system architecture.

---

## 🎓 Lessons Learned

1. **Verify system architecture** before creating implementation plans
2. **MD5-based systems** are simpler than i18n key-based systems
3. **Text IS the key** (via hash) - no separate key management needed

---

**Status**: Incorrect assumptions - Do not use  
**Use**: Reference only to understand what NOT to do  
**Correct Docs**: See `docs/translation/README.md`
