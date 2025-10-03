# Form Submission Error Fix

## Problem Description

All forms on https://zerodolg.ru (except for the Bitrix callback widget) were
returning the error:

```
Unexpected token '<', "<html> <h"... is not valid JSON
```

## Root Cause

**Content-Type Mismatch:**

1. **Frontend Forms** (`FormEnhancedFinal.tsx`) were sending data as **JSON**:
   - Content-Type: `application/json`
   - Body: `JSON.stringify(submissionData)`

2. **Backend API** (`/api/form.ts`) was expecting **FormData**:
   - Using `request.formData()` to parse the request
   - This caused the API to fail and likely return an HTML error page from
     Bitrix24

3. When the client tried to parse the HTML error page as JSON, it caused the
   error:
   ```
   Unexpected token '<', "<html> <h"... is not valid JSON
   ```

## Solution

Modified `/src/pages/api/form.ts` to support **both JSON and FormData** formats:

### Changes Made

```typescript
// Before (lines 9-19):
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    const name = data.get('name')?.toString() || '';
    const phone = data.get('phone')?.toString() || '';
    const email = data.get('email')?.toString() || '';
    const message = data.get('message')?.toString() || '';
    const formType = data.get('formType')?.toString() || 'callback';

// After (lines 9-29):
export const POST: APIRoute = async ({ request }) => {
  try {
    // Support both JSON and FormData
    const contentType = request.headers.get('content-type') || '';
    let data: Record<string, unknown>;

    if (contentType.includes('application/json')) {
      // If data comes as JSON
      data = await request.json();
    } else {
      // If data comes as FormData
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    // Extract fields
    const name = (data['name'] as string) || '';
    const phone = (data['phone'] as string) || '';
    const email = (data['email'] as string) || '';
    const message = (data['message'] as string) || '';
    const formType = (data['formType'] as string) || 'callback';
```

## What Forms Are Affected

### ✅ Fixed Forms (using JSON):

- **Hero Form** - Main homepage contact form
- **CTA Forms** - Call-to-action forms throughout the site
- **Consultation Forms** - Free consultation request forms
- **Calculator Form** - Bankruptcy cost calculator
- **Section Forms** - Various section-specific forms
- **Footer Form** - Contact form in footer

### ℹ️ Not Affected:

- **Bitrix Callback Widget** - Uses its own API (bitrix.callback)
- **Lead Magnets Forms** - Currently commented out (lines 414-416 in
  lead-magnets.tsx)

## Files Modified

1. **`src/pages/api/form.ts`**
   - Lines 9-29: Added content-type detection
   - Now supports both JSON and FormData

## Testing Recommendations

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Test each form type:**
   - Fill out and submit the hero form
   - Fill out and submit the CTA form
   - Fill out and submit the consultation form
   - Test the calculator form
3. **Verify in browser DevTools:**
   - Open Network tab
   - Submit a form
   - Check the request payload (should be JSON)
   - Check the response (should be valid JSON with `success: true`)

4. **Check Bitrix24:**
   - Verify that leads are being created correctly
   - Check that all form fields are populated

## Additional Notes

### Legacy Code Found

- `src/islands/forms/form-logic.tsx` - Uses FormData but is not imported
  anywhere
  - This appears to be legacy code
  - Can be safely removed if confirmed unused

### Bitrix24 Integration

- The API correctly integrates with Bitrix24 webhook
- Webhook URL: `https://zerodolg.bitrix24.ru/rest/1/sn1lo90na6t13v1d/`
- Creates leads via `crm.lead.add` endpoint

### Analytics Tracking

- Forms include Enhanced Conversions data
- Tracks conversion with proper values based on form type
- Integrates with Google Analytics and Yandex Metrika

## Next Steps

1. ✅ **Deploy to production** - The fix is ready
2. ⚠️ **Test on production** - Submit test forms to verify
3. 📊 **Monitor errors** - Watch for any new form submission errors
4. 🧹 **Clean up** - Consider removing unused `form-logic.tsx` file

## Expected Result

After this fix:

- ✅ All forms should submit successfully
- ✅ Users should see success messages
- ✅ Leads should be created in Bitrix24
- ✅ No more JSON parsing errors
- ✅ Analytics tracking should work correctly

---

**Fixed by:** AI Assistant  
**Date:** 2025-10-03  
**Status:** ✅ Ready for deployment
