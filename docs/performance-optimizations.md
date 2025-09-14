# Astro Production Optimization Guide

This document explains the optimizations implemented in the Astro configuration for production builds.

## Performance Optimizations

### 1. Code Minification
- **JavaScript**: Using Terser for advanced minification with aggressive compression settings
- **CSS**: Using LightningCSS for fast and efficient CSS optimization
- **HTML**: Built-in HTML compression to reduce file sizes

### 2. Asset Optimization
- **Image Optimization**: Using Sharp for high-quality image processing
- **Asset Inlining**: Assets smaller than 4KB are inlined to reduce HTTP requests
- **Code Splitting**: Vendor code (Preact) is split into separate chunks for better caching

### 3. Prefetching
- **Automatic Prefetching**: All discovered pages are prefetched for instant navigation
- **Viewport Strategy**: Resources are loaded based on viewport visibility for optimal performance

### 4. Caching Improvements
- **Content Collection Cache**: Experimental feature to improve build times for content collections
- **Manual Chunking**: Vendor libraries are separated for better long-term caching

## Configuration Files

### astro.config.mjs
The main configuration file contains general settings suitable for both development and production.

### astro.config.prod.mjs
The production-specific configuration includes additional optimizations:
- Aggressive code minification
- Console and debugger statement removal
- Advanced Terser compression options
- CSS optimization with LightningCSS

## Build Scripts

### `build:prod`
This script uses the production configuration for maximum optimization:
```bash
npm run build:prod
```

## Deployment Recommendations

1. **Static Hosting**: The site is configured for static deployment
2. **Asset Caching**: Configure your CDN/server to cache assets with proper cache headers
3. **Compression**: Enable gzip/Brotli compression on your server for optimal delivery

## Performance Benefits

These optimizations provide:
- Reduced bundle sizes
- Faster load times
- Better caching strategies
- Improved user experience
- Lower bandwidth usage