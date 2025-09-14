# 🚀 ZeroDolg Astro - Comprehensive Build and Deployment Guide

This guide provides detailed instructions for building and deploying the ZeroDolg Astro website with all optimizations and safety measures.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Pre-Build Validation](#pre-build-validation)
- [Production Build Process](#production-build-process)
- [Post-Build Verification](#post-build-verification)
- [Deployment](#deployment)
- [Rollback Procedures](#rollback-procedures)
- [CI/CD Integration](#cicd-integration)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## 🛠️ Prerequisites

Before building and deploying, ensure you have:

1. **Node.js** >= 18.x
2. **npm** >= 8.x
3. **Git** (for version control)
4. Access to required environment variables

## 🌍 Environment Setup

### 1. Environment Variables

The application requires several environment variables to function properly. These are defined in the `.env` file.

**Setup Process:**
```bash
# Create .env file from template
npm run env:setup

# Edit the .env file with your configuration
# (Instructions will be provided by the setup script)
```

**Required Variables:**
| Variable | Description | Example |
|----------|-------------|---------|
| `BITRIX24_WEBHOOK_URL` | Bitrix24 webhook for form submissions | `https://your-domain.bitrix24.ru/rest/1/your-webhook-key/` |
| `PUBLIC_SITE_URL` | Your website URL | `https://zerodolg.ru` |
| `PUBLIC_SITE_PHONE` | Contact phone number | `+7 (905) 577-33-87` |
| `PUBLIC_SITE_EMAIL` | Contact email | `info@zerodolg.ru` |

**Optional Variables:**
| Variable | Description | Default |
|----------|-------------|---------|
| `PUBLIC_GA_ID` | Google Analytics ID | Not set |
| `PUBLIC_YM_ID` | Yandex Metrika ID | Not set |
| `NODE_ENV` | Node environment | `production` |

### 2. Validate Environment

Always validate your environment configuration before building:

```bash
npm run env:validate
```

## 🔍 Pre-Build Validation

Before starting the build process, several validation checks are performed:

1. **Environment Validation** - Ensures all required variables are set
2. **Code Linting** - Checks code quality and style
3. **Type Checking** - Validates TypeScript types
4. **File Integrity** - Verifies required files exist

To run pre-build validation manually:
```bash
# Run all validation checks
node scripts/build-production.js --validate-only
```

## 🏭 Production Build Process

### Standard Production Build

The production build includes all optimizations:

```bash
# Run the comprehensive production build
npm run build:production
```

This command performs the following steps:

1. **Pre-Build Validation**
   - Environment variable validation
   - Code linting and fixing
   - TypeScript type checking

2. **Asset Optimization**
   - Image optimization
   - CSS/JS minification
   - Asset compression

3. **Security Checks**
   - .env file protection
   - Sensitive data detection

4. **Performance Optimizations**
   - Clean previous builds
   - Bundle optimization
   - Code splitting

5. **Build Execution**
   - Astro production build with `astro.config.prod.mjs`
   - Terser minification
   - LightningCSS optimization

### Build Configuration

The production build uses `astro.config.prod.mjs` which includes:

- **Minification**: Terser with aggressive compression
- **CSS Optimization**: LightningCSS
- **Asset Inlining**: Assets under 4KB are inlined
- **Chunking**: Vendor code is separated
- **Prefetching**: Automatic prefetching of viewport resources

## ✅ Post-Build Verification

After the build completes, verification checks ensure the build quality:

```bash
# Run post-build verification
npm run deploy:verify
```

Verification includes:

1. **Essential Files Check**
   - `index.html` existence
   - `assets/` directory existence

2. **Asset Optimization Verification**
   - Minification rate check
   - Total asset size analysis

3. **HTML Quality Check**
   - DOCTYPE validation
   - Title and meta description check
   - Inline style detection
   - Console statement detection

4. **Common Issue Detection**
   - robots.txt presence
   - sitemap.xml presence
   - Favicon presence

## 🚀 Deployment

### Manual Deployment

1. **Prepare Deployment Files**
   ```bash
   # Run the complete production build
   npm run build:production
   ```

2. **Verify Build**
   ```bash
   # Run post-build verification
   npm run deploy:verify
   ```

3. **Deploy Files**
   Upload the contents of the `dist/` directory to your production server.

### Deployment Checklist

Before deploying, ensure all items are completed:

```bash
npm run deploy:checklist
```

The checklist includes:
- ✅ Environment variables set
- ✅ Code passes linting
- ✅ TypeScript compilation successful
- ✅ Production build successful
- ✅ Astro dev toolbar disabled
- ✅ Images optimized
- ✅ All pages accessible
- ✅ Sitemap generated
- ✅ Backup of current production

## 🔄 Rollback Procedures

In case of deployment issues, you can rollback to a previous version:

### Automatic Rollback

```bash
# List available backups
node scripts/rollback.js --list

# Perform rollback to most recent backup
node scripts/rollback.js
```

### Manual Rollback

1. **Identify Backup**
   Check the `backups/` directory for available backups.

2. **Restore Backup**
   ```bash
   # Remove current deployment
   rm -rf dist/
   
   # Restore from backup (replace with actual backup name)
   cp -r backups/dist-YYYYMMDD-HHMMSS dist/
   ```

3. **Restart Services**
   Restart your web server to serve the restored version.

### Rollback Best Practices

1. Always create a backup before deploying:
   ```bash
   cp -r dist/ backups/dist-$(date +%Y%m%d-%H%M%S)/
   ```

2. Test rollbacks in a staging environment first

3. Monitor after rollback to ensure normal operation

## 🤖 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Validate environment
      run: npm run env:validate
      
    - name: Run production build
      run: npm run build:production
      
    - name: Verify build
      run: npm run deploy:verify
      
    - name: Deploy to server
      # Add your deployment steps here
      run: echo "Deploying to production server"
      
    - name: Create backup
      run: cp -r dist/ backups/dist-$(date +%Y%m%d-%H%M%S)/
```

### Deployment Script

Create a deployment script for your specific hosting environment:

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting deployment process..."

# 1. Run production build
echo "🏭 Building production version..."
npm run build:production

# 2. Verify build
echo "✅ Verifying build..."
npm run deploy:verify

# 3. Create backup of current deployment
echo "📦 Creating backup..."
cp -r dist/ backups/dist-$(date +%Y%m%d-%H%M%S)/

# 4. Deploy to server (replace with your deployment method)
echo "🚚 Deploying to server..."
# rsync -avz dist/ user@server:/path/to/web/root/

echo "🎉 Deployment completed!"
```

## 📊 Monitoring and Maintenance

### Performance Monitoring

1. **Lighthouse Reports**
   Regularly run Lighthouse audits:
   ```bash
   # If you have lighthouse installed
   lighthouse https://your-site.com --output json --output html
   ```

2. **Bundle Analysis**
   Analyze bundle size:
   ```bash
   # Install bundle analyzer if needed
   npm install -g bundle-analyzer
   
   # Analyze the build
   bundle-analyzer dist/client
   ```

### Security Monitoring

1. **Dependency Updates**
   Regularly check for outdated dependencies:
   ```bash
   npm outdated
   ```

2. **Security Audits**
   Run security audits:
   ```bash
   npm audit
   ```

### Maintenance Tasks

1. **Regular Backups**
   Create regular backups of your deployment:
   ```bash
   # Weekly backup
   cp -r dist/ backups/dist-$(date +%Y%m%d)-weekly/
   ```

2. **Log Analysis**
   Monitor deployment logs for issues:
   ```bash
   # Check rollback logs
   cat backups/rollback.log
   ```

## ⚠️ Troubleshooting

### Common Build Issues

1. **Environment Variables Missing**
   ```
   Error: Missing required environment variables
   ```
   Solution: Run `npm run env:setup` and `npm run env:validate`

2. **TypeScript Errors**
   ```
   TypeScript compilation failed
   ```
   Solution: Fix type errors reported by `npm run type-check`

3. **Linting Issues**
   ```
   Code linting failed
   ```
   Solution: Run `npm run lint:fix` or manually fix issues

### Deployment Issues

1. **Missing Assets**
   - Verify build completed successfully
   - Check `dist/` directory contents
   - Run `npm run deploy:verify`

2. **Performance Issues**
   - Run Lighthouse audit
   - Check bundle sizes
   - Optimize images

3. **Server Errors**
   - Check server logs
   - Verify file permissions
   - Ensure all required files are deployed

## 📞 Support

For deployment issues, contact:
- Development Team: [development@zerodolg.ru](mailto:development@zerodolg.ru)
- Infrastructure Team: [infrastructure@zerodolg.ru](mailto:infrastructure@zerodolg.ru)

## 📝 Version History

- **v1.0.0** (2025-01-08): Initial deployment guide
- **v1.1.0** (2025-09-14): Added rollback procedures and CI/CD integration

---