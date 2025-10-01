# Debugging Blog Content Loading Issues

## Issue Description

Certain blog pages (like "Банкротство при ипотеке," "Банкротство через МФЦ,"
etc.) are not displaying their content while other blog posts work fine.

## Verified Facts

1. ✅ Build completes successfully without errors
2. ✅ Markdown files have proper frontmatter and content
3. ✅ Content collection schema is correctly defined
4. ✅ Blog listing page displays all posts correctly
5. ✅ Individual blog post pages load (header, footer, sidebar visible)

## Potential Causes

### 1. Client-Side Rendering Issue

The `<Content />` component might be failing to hydrate on the client side.

**Solution:** Check browser console for JavaScript errors

### 2. CSS/Styling Issue

The prose classes might not be applying, making content invisible.

**Solution:** Inspect the element in browser DevTools to see if content HTML is
present

### 3. Markdown Rendering Issue

Special characters or formatting in certain posts might break the markdown
parser.

**Solution:** Look for unusual characters, unclosed code blocks, or malformed
HTML

### 4. Large Content Size

Posts with very long content might timeout during rendering.

**Solution:** Check if problematic posts are significantly longer than working
ones

## Diagnostic Steps

### Step 1: Check Browser Console

Open the non-loading blog post in browser and check console for errors:

```
F12 → Console tab
```

Look for:

- Runtime errors
- Failed network requests
- Hydration mismatches

### Step 2: Inspect Page Source

View page source (Ctrl+U) and check if the article content is in the HTML:

```html
<article class="bg-white rounded-xl shadow-lg p-8...">
  <!-- Content should be here -->
</article>
```

### Step 3: Check Element Visibility

Inspect the article element:

```
F12 → Elements tab → Find <article>
```

Check computed styles - is anything setting `display: none` or
`visibility: hidden`?

### Step 4: Compare Posts

Compare a working post with a non-working post:

- File size
- Content length
- Special characters
- Date formats
- Tag structures

### Step 5: Test in Development

Run dev server and test the specific posts:

```
npm run dev
```

Navigate to: `http://localhost:4321/blog/blog-bankruptcy-mortgage/`

## Quick Fixes to Try

### Fix 1: Add Error Boundary

Add try-catch around Content rendering in `[slug].astro`:

```astro
{
  (() => {
    try {
      return <Content />;
    } catch (error) {
      console.error('Content rendering error:', error);
      return <div class='text-red-600'>Error loading content</div>;
    }
  })()
}
```

### Fix 2: Check Prose Styles

Verify Tailwind prose is working by temporarily adding visible styling:

```astro
<article class='...prose prose-lg... bg-yellow-50'>
  <Content />
</article>
```

### Fix 3: Simplify Content

Temporarily simplify the problematic markdown to isolate the issue:

1. Remove all special formatting
2. Test if basic text renders
3. Gradually add back formatting to find the culprit

### Fix 4: Clear Build Cache

```bash
rm -rf dist .astro node_modules/.astro
npm run build
```

### Fix 5: Check for Encoding Issues

Ensure markdown files are saved in UTF-8 encoding without BOM.

## Expected Findings

Based on the code review, the most likely issues are:

1. **Prose styles not loading** - The content is there but invisible due to CSS
2. **Runtime JavaScript error** - Something in the page is breaking client-side
3. **Hydration mismatch** - Server-rendered content doesn't match client
   expectation
4. **Special characters** - Cyrillic text or special symbols breaking the parser

## Next Steps

1. Run diagnostic steps 1-3 first
2. Report findings (console errors, source code presence, computed styles)
3. Apply appropriate fix based on findings
4. Test multiple affected pages to confirm fix works universally
