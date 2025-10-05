# CSS Optimization Guide

## Overview

This document analyzes the current CSS issues and provides recommendations for
improving code quality and security (CSP compliance).

## Current State

### Inline Styles: ~132 instances

**Primary locations:**

- `src/widgets/faq/Faq.astro` - ~70 instances
- `src/styles/interactive-components.css` - Multiple instances
- Other components: Header, Stats, CTA, etc.

### !important Usage: 30 instances

**Breakdown by file:**

- `src/styles/interactive-components.css` - 24 instances
- `src/styles/components.css` - 3 instances
- `src/styles/sections.css` - 1 instance
- Various `.astro` files - 2 instances

---

## 1. !important Usage Analysis

### ✅ Justified Usage (3 instances)

#### **File: `src/styles/components.css` (lines 458-460)**

```css
animation-duration: 0.01ms !important;
animation-iteration-count: 1 !important;
transition-duration: 0.01ms !important;
```

**Purpose:** Accessibility - Respects `prefers-reduced-motion` setting  
**Recommendation:** ✅ **KEEP** - This is a best practice for accessibility

---

### ⚠️ Questionable Usage (27 instances)

#### **File: `src/styles/interactive-components.css` (lines 22-43)**

```css
.calculator-summary-item {
  display: flex !important;
  width: 100% !important;
  justify-content: space-between !important;
  /* ... 13 more !important declarations */
}
```

**Issue:** Excessive use in component styles  
**Likely cause:** Overriding conflicting styles or fighting specificity issues

**Recommendation:** 🔧 **REFACTOR**

- Remove !important declarations
- Fix specificity issues at the root cause
- Use more specific selectors if needed
- Example fix:

```css
/* Instead of: */
.calculator-summary-item {
  display: flex !important;
}

/* Use: */
.calculator .calculator-summary-item {
  display: flex;
}
```

#### **File: `src/styles/interactive-components.css` (lines 590-612)**

```css
.faq-item {
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
}

.faq-item:hover {
  background: #f9fafb !important;
  border-color: #d1d5db !important;
}
```

**Issue:** Styling specificity conflicts  
**Recommendation:** 🔧 **REFACTOR**

- These should not need !important
- Check for conflicting styles in FAQ component
- Use proper cascade order

#### **File: `src/styles/interactive-components.css` (line 930)**

```css
@media (prefers-reduced-motion: reduce) {
  transform: none !important;
}
```

**Recommendation:** ✅ **KEEP** - Accessibility requirement

#### **File: `src/styles/sections.css` (line 249)**

```css
background: white !important;
```

**Recommendation:** 🔧 **REFACTOR** - Find why !important is needed and fix root
cause

---

## 2. Inline Styles Analysis

### Current State: ~132 inline styles

**Main offender: `src/widgets/faq/Faq.astro`** (~70 instances)

**Example from FAQ:**

```astro
<div style='border-bottom: 1px solid #e5e7eb; padding-bottom: 20px;'>
  <button
    style='display: flex; justify-content: space-between; align-items: center; width: 100%;'
  >
    ...
  </button>
</div>
```

### Why This Is a Problem

1. **Security (CSP):**
   - Requires `'unsafe-inline'` in CSP header
   - Weakens Content-Security-Policy protection
   - Makes site more vulnerable to XSS attacks

2. **Maintainability:**
   - Harder to update styles consistently
   - Duplicated CSS code
   - Difficult to override or customize

3. **Performance:**
   - Increased HTML size
   - Cannot be cached separately
   - No browser optimization

---

## 3. Recommended Refactoring Plan

### Phase 1: Extract FAQ Inline Styles (Priority: HIGH)

**Impact:** Reduces ~70 inline styles, improves security

**Steps:**

1. Create utility classes in `src/styles/faq-utilities.css`:

```css
.faq-item-wrapper {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 20px;
}

.faq-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px 0;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
}

.faq-answer {
  padding-top: 12px;
  color: #6b7280;
  line-height: 1.6;
}
```

2. Replace inline styles in `Faq.astro`:

```astro
<!-- Before -->
<div style='border-bottom: 1px solid #e5e7eb; padding-bottom: 20px;'>
  <button style='display: flex; justify-content: space-between; ...'>
    <!-- After -->
    <div class='faq-item-wrapper'>
      <button class='faq-button'></button>
    </div></button
  >
</div>
```

3. Import the styles:

```astro
---
import './styles/faq-utilities.css';
---
```

### Phase 2: Remove Unnecessary !important (Priority: MEDIUM)

**Impact:** Cleaner CSS, better maintainability

**Files to refactor:**

- `src/styles/interactive-components.css` (lines 22-43, 590-612)
- `src/styles/sections.css` (line 249)

**Approach:**

1. Identify why !important was added
2. Increase selector specificity instead
3. Reorder CSS to use cascade properly
4. Test thoroughly after removal

### Phase 3: Extract Other Inline Styles (Priority: LOW)

**Remaining ~62 inline styles in:**

- Header.astro
- Stats.astro
- Cta.astro
- Other components

**Approach:**

- Create component-specific utility classes
- Use Tailwind classes where appropriate
- Consider CSS modules for component isolation

---

## 4. Immediate Action Items

### ✅ Critical (Do First)

1. **Extract FAQ inline styles** → Create `faq-utilities.css`
2. **Remove calculator !important** → Fix specificity in
   `interactive-components.css`

### ⚠️ Important (Do Next)

3. **Audit remaining inline styles** → Document each use case
4. **Remove FAQ !important** → Fix background/border issues

### 📝 Nice to Have (Future)

5. **Migrate to Tailwind utilities** → Reduce custom CSS
6. **Implement CSS modules** → Better component isolation
7. **Enable strict CSP** → Remove 'unsafe-inline' after fixing

---

## 5. CSP Migration Path

### Current CSP (with inline styles):

```nginx
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
```

### Target CSP (after refactoring):

```nginx
# Option 1: Nonces (requires build-time generation)
style-src 'self' 'nonce-{random}' https://fonts.googleapis.com;

# Option 2: Hashes (for remaining critical inline styles)
style-src 'self' 'sha256-{hash}' https://fonts.googleapis.com;

# Option 3: Strict (best security, no inline styles)
style-src 'self' https://fonts.googleapis.com;
```

**Recommendation:** Target Option 3 for maximum security

---

## 6. Testing Checklist

After refactoring, test:

- [ ] FAQ accordion opens/closes correctly
- [ ] All hover states work
- [ ] Responsive breakpoints function
- [ ] No visual regressions
- [ ] CSP doesn't block styles (check browser console)
- [ ] Lighthouse performance score maintained

---

## 7. Monitoring

### Metrics to Track:

- **Inline styles count:** Target < 10 (critical only)
- **!important count:** Target < 5 (accessibility only)
- **CSS file size:** Should decrease ~5-10%
- **HTML file size:** Should decrease ~10-15%
- **Lighthouse score:** Maintain or improve

---

## 8. Resources

### Tools:

- [CSS Specificity Calculator](https://specificity.keegan.st/)
- [Can I Use - CSP](https://caniuse.com/contentsecuritypolicy2)
- [MDN - CSP style-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src)

### Best Practices:

- [Google CSP Guide](https://csp.withgoogle.com/docs/strict-csp.html)
- [CSS Guidelines](https://cssguidelin.es/)
- [BEM Methodology](http://getbem.com/)

---

## Current Status

✅ **Completed:**

- CSP headers enabled in all nginx configs
- Documentation created

⏳ **Pending:**

- Extract FAQ inline styles (~70 instances)
- Remove unnecessary !important declarations (~24 instances)
- Refactor remaining inline styles (~62 instances)

📊 **Progress:** 0/132 inline styles removed, 0/27 !important removed

---

## Notes

- Keep the 4 !important declarations related to `prefers-reduced-motion`
  (accessibility)
- Inline styles for dynamic values (e.g., JavaScript-computed positions) are
  acceptable
- Focus on FAQ component first - biggest impact for least effort
- Test incrementally - don't refactor everything at once
