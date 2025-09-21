# Preact/Astro Compatibility Fixes - Rollback Plan

This document outlines how to rollback the changes made to fix the Preact component issues if they don't resolve the problem or cause other issues.

## Configuration Rollback

### astro.config.mjs
1. Restore `output` to `'static'`
2. Remove Preact compatibility options:
   - Remove `compat: true`
   - Remove `include` pattern
3. Revert Vite configuration to original settings:
   - Remove `preact/compat` from optimizeDeps
   - Remove React alias mapping
   - Remove esbuild JSX options
   - Restore original minification settings

### astro.config.prod.mjs
1. Apply the same rollback changes as astro.config.mjs
2. Revert production build settings to original:
   - Restore console.log dropping
   - Restore original minification settings

## Component Rollback

### Remove Modified Components
1. Delete `src/components/preact/client-interactions.tsx`
2. Restore `src/components/preact/header.tsx` to original version
3. Delete `src/components/preact/TestPreactComponent.tsx`

## Page Changes Rollback

### Index Page (src/pages/index.astro)
1. Remove `<ClientInteractions client:load />` component
2. Restore any other removed components

## Git Rollback Commands

If using Git, you can rollback all changes with:

```bash
# Rollback configuration files
git checkout HEAD -- astro.config.mjs
git checkout HEAD -- astro.config.prod.mjs

# Rollback component files
git checkout HEAD -- src/components/preact/

# Rollback page files
git checkout HEAD -- src/pages/index.astro

# If you want to rollback all changes
git reset --hard HEAD
```

## Package.json Considerations

If you updated any dependencies, you may need to restore the original package.json and run:

```bash
npm install
```

## Testing After Rollback

After rolling back changes:

1. Clean the project:
   ```bash
   npm run clean
   ```

2. Rebuild the project:
   ```bash
   npm run build
   ```

3. Test the development server:
   ```bash
   npm run dev
   ```

4. Verify that the original functionality is restored

## Alternative Approaches

If rolling back doesn't solve the issue, consider these alternative approaches:

1. **Update Dependencies**: Ensure all Astro and Preact dependencies are compatible
2. **Check Astro Documentation**: Review latest Astro documentation for Preact integration
3. **Create Minimal Test Case**: Create a minimal Astro project with just one Preact component to isolate the issue
4. **Consult Community**: Check Astro Discord, GitHub issues, or Stack Overflow for similar issues