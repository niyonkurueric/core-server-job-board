# Deployment Guide for Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Git Repository**: Your project should be in a Git repository

## Important Notes for SQLite on Vercel

✅ **GOOD NEWS**: Your project has been configured to work with SQLite on Vercel using in-memory databases!

### How it works:

1. **Local Development**: Uses file-based SQLite database
2. **Vercel Production**: Uses in-memory SQLite database that gets recreated on each request
3. **Automatic Seeding**: Database is automatically seeded with sample data on Vercel
4. **No Data Persistence**: Data is reset on each serverless function invocation (this is normal for Vercel)

### If you need persistent data:

1. **Use Vercel Postgres**: For persistent PostgreSQL database
2. **Use Vercel KV**: For key-value storage
3. **Use External Database**: Supabase, Railway, etc.

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set project name
   - Set build command: `npm run build`
   - Set output directory: `.` (current directory)
   - Set install command: `npm install`

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub**
2. **Go to [vercel.com](https://vercel.com)**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure build settings**:
   - Framework Preset: `Node.js`
   - Build Command: `npm run build`
   - Output Directory: `.`
   - Install Command: `npm install`

## Environment Variables Setup

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" → "Environment Variables"
   - Add all variables from your `.env` file

2. **Required Variables**:
   ```
   JWT_SECRET=your_secure_jwt_secret
   NODE_ENV=production
   ```

## Database Setup

Your project is now configured to work with SQLite on Vercel! Here's what happens:

1. **Automatic Database Creation**: Tables are created automatically on Vercel
2. **Automatic Seeding**: Sample data is added automatically
3. **No Manual Setup Required**: Everything works out of the box

### What you get on Vercel:

- **Admin User**: `admin@example.com` / `admin123`
- **Sample Jobs**: 2 pre-created job listings
- **All Tables**: Users, jobs, applications, etc.

### Note about Data Persistence:

- **Local Development**: Data persists between server restarts
- **Vercel Production**: Data is reset on each request (this is normal for serverless)
- **For Persistent Data**: Consider upgrading to Vercel Postgres

## Testing Your Deployment

1. **Check Vercel Dashboard** for deployment status
2. **Test your API endpoints** using the provided URL
3. **Monitor logs** in Vercel Dashboard

## Common Issues & Solutions

### Issue: SQLite Database Errors

**Solution**: Switch to PostgreSQL or another cloud database

### Issue: Environment Variables Not Working

**Solution**: Ensure they're set in Vercel Dashboard

### Issue: Build Failures

**Solution**: Check build logs and ensure all dependencies are in `package.json`

## Post-Deployment

1. **Set up custom domain** (optional)
2. **Configure environment variables**
3. **Set up database**
4. **Test all endpoints**
5. **Monitor performance**

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Node.js on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js)
