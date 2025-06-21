# EcoSwap Deployment Guide

This guide covers multiple deployment options for your EcoSwap React application, from free hosting to production-ready solutions.

## Prerequisites

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Test Locally**
   ```bash
   npm start
   ```
   Visit http://localhost:3000 to ensure everything works.

3. **Build for Production**
   ```bash
   npm run build
   ```
   This creates a `build/` folder with optimized production files.

## Deployment Options

### 1. Netlify (Recommended for Beginners) - FREE

**Pros:** Easy setup, automatic deployments, free SSL, custom domains
**Cons:** Limited to static sites

**Steps:**
1. Create account at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Deploy automatically on every push

**Manual Deploy:**
```bash
npm run build
# Drag and drop the 'build' folder to Netlify dashboard
```

### 2. Vercel - FREE

**Pros:** Excellent React support, fast CDN, automatic deployments
**Cons:** Limited to static/serverless

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts to deploy

**Or via GitHub:**
1. Connect repository at [vercel.com](https://vercel.com)
2. Auto-deploys on push

### 3. GitHub Pages - FREE

**Pros:** Free hosting for public repos
**Cons:** Only static sites, limited features

**Steps:**
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
3. Run: `npm run deploy`
4. Enable GitHub Pages in repository settings

### 4. Firebase Hosting - FREE tier available

**Pros:** Google infrastructure, good performance
**Cons:** Requires Firebase setup

**Steps:**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run: `firebase login`
3. Run: `firebase init hosting`
4. Set public directory to `build`
5. Run: `npm run build && firebase deploy`

### 5. AWS S3 + CloudFront (Production)

**Pros:** Highly scalable, professional
**Cons:** More complex, costs money

**Steps:**
1. Create S3 bucket
2. Enable static website hosting
3. Upload build files
4. Set up CloudFront distribution
5. Configure custom domain

## Environment Variables

For production, you may need environment variables:

1. Create `.env.production`:
   ```
   REACT_APP_API_URL=https://your-api.com
   REACT_APP_ENVIRONMENT=production
   ```

2. Most platforms automatically load these during build.

## Custom Domain Setup

### Netlify/Vercel:
1. Add custom domain in dashboard
2. Update DNS records as instructed
3. SSL certificate is automatic

### GitHub Pages:
1. Add CNAME file to public folder with your domain
2. Configure DNS A records to GitHub's IPs

## Performance Optimization

Before deploying:

1. **Optimize Images:** Compress images, use WebP format
2. **Code Splitting:** Already handled by Create React App
3. **Bundle Analysis:** 
   ```bash
   npm install --save-dev webpack-bundle-analyzer
   npm run build
   npx webpack-bundle-analyzer build/static/js/*.js
   ```

## Monitoring & Analytics

Add to your app:
1. **Google Analytics:** For user tracking
2. **Sentry:** For error monitoring
3. **Lighthouse:** For performance auditing

## Recommended Deployment Flow

1. **Development:** Local development server
2. **Staging:** Deploy to Netlify/Vercel preview
3. **Production:** Deploy to main domain

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Deploy to Netlify (after setup)
npm run build && netlify deploy --prod --dir=build

# Deploy to Vercel
vercel --prod

# Deploy to GitHub Pages
npm run deploy
```

## Troubleshooting

**Build Fails:**
- Check for console errors
- Ensure all dependencies are installed
- Verify Node.js version compatibility

**Routing Issues:**
- Add `_redirects` file for Netlify: `/* /index.html 200`
- Configure rewrites for other platforms

**Environment Variables Not Working:**
- Ensure they start with `REACT_APP_`
- Restart development server after changes
