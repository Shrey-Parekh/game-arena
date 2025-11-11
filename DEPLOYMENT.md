# Nexus Arena - Deployment Guide

This guide covers deploying Nexus Arena to production using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Render account (free tier works)
- Your code pushed to a GitHub repository

## Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `nexus-arena-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: Free

### Step 3: Add Environment Variables
In the "Environment" section, add:

```
PORT=3001
SUPABASE_URL=https://qtitidbtpbgnxiwqvxip.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0aXRpZGJ0cGJnbnhpd3F2eGlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NjQ0ODAsImV4cCI6MjA3ODM0MDQ4MH0._Yju_diX8gR3XzJbYBK9l0-hPSPKYSk-Rx1TFfWo0VM
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
```

**Note**: You'll update `CLIENT_URL` after deploying the frontend.

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://nexus-arena-backend.onrender.com`)

### Step 5: Test Backend
Visit: `https://your-backend-url.onrender.com/health`

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "activeRooms": 0
}
```

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables
In the "Environment Variables" section, add:

```
VITE_SUPABASE_URL=https://qtitidbtpbgnxiwqvxip.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0aXRpZGJ0cGJnbnhpd3F2eGlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NjQ0ODAsImV4cCI6MjA3ODM0MDQ4MH0._Yju_diX8gR3XzJbYBK9l0-hPSPKYSk-Rx1TFfWo0VM
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

**Important**: Replace `your-backend-url` with your actual Render backend URL.

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Copy your frontend URL (e.g., `https://nexus-arena.vercel.app`)

## Part 3: Update Backend with Frontend URL

### Step 1: Update Render Environment
1. Go back to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://nexus-arena.vercel.app
   ```
5. Save changes (this will trigger a redeploy)

### Step 2: Update Supabase Auth Settings
1. Go to Supabase dashboard
2. Navigate to Authentication → URL Configuration
3. Add your Vercel URL to:
   - **Site URL**: `https://nexus-arena.vercel.app`
   - **Redirect URLs**: `https://nexus-arena.vercel.app/**`

## Part 4: Verify Deployment

### Test Checklist
- [ ] Frontend loads at Vercel URL
- [ ] Backend health check works
- [ ] User can sign up
- [ ] User can log in
- [ ] User can create a room
- [ ] User can join a room
- [ ] Socket.IO connection works
- [ ] Game starts successfully
- [ ] Questions load properly

### Common Issues

#### CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: 
- Verify `CLIENT_URL` in Render matches your Vercel URL exactly
- Check for trailing slashes
- Redeploy backend after changes

#### Socket.IO Connection Failed
**Problem**: WebSocket connection fails
**Solution**:
- Verify `VITE_SOCKET_URL` in Vercel points to Render backend
- Check Render logs for connection errors
- Ensure backend is running (free tier sleeps after inactivity)

#### Authentication Errors
**Problem**: Can't sign up or log in
**Solution**:
- Check Supabase Auth settings
- Verify redirect URLs include your Vercel domain
- Check browser console for specific errors

#### Database Errors
**Problem**: Rooms or questions not working
**Solution**:
- Verify you ran both SQL files in Supabase
- Check Supabase logs for query errors
- Verify RLS policies are correct

## Part 5: Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `CLIENT_URL` in Render after domain is active

### Render Custom Domain
1. Upgrade to paid plan (required for custom domains)
2. Go to service settings
3. Add custom domain
4. Update `VITE_SOCKET_URL` in Vercel

## Part 6: Monitoring & Maintenance

### Render Free Tier Limitations
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free (enough for one service)

**Solutions**:
- Upgrade to paid plan ($7/month) for always-on
- Use a service like UptimeRobot to ping every 14 minutes
- Accept the cold start delay

### Vercel Free Tier Limitations
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

### Monitoring Tools
- **Render**: Built-in logs and metrics
- **Vercel**: Analytics dashboard
- **Supabase**: Database logs and monitoring
- **Sentry** (optional): Error tracking

### Updating Your App

**Frontend Updates**:
1. Push changes to GitHub
2. Vercel auto-deploys from main branch
3. No downtime

**Backend Updates**:
1. Push changes to GitHub
2. Render auto-deploys from main branch
3. Brief downtime during deployment

## Part 7: Production Checklist

Before going live:
- [ ] Database schema is up to date
- [ ] All environment variables are set correctly
- [ ] CORS is configured properly
- [ ] Supabase RLS policies are enabled
- [ ] Error handling is working
- [ ] Test with multiple users
- [ ] Test on mobile devices
- [ ] Set up monitoring/alerts
- [ ] Document any custom configurations
- [ ] Create backup of database

## Cost Breakdown

**Free Tier** (Recommended for MVP):
- Vercel: $0/month
- Render: $0/month (with sleep)
- Supabase: $0/month (up to 500MB database)
- **Total**: $0/month

**Paid Tier** (For production):
- Vercel Pro: $20/month (optional)
- Render: $7/month (always-on)
- Supabase Pro: $25/month (optional)
- **Total**: $7-52/month depending on needs

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Service → Logs
2. Check Vercel logs: Dashboard → Deployments → View Logs
3. Check Supabase logs: Dashboard → Logs
4. Review browser console for frontend errors
5. Test locally to isolate the issue

---

Congratulations! Your app is now live! 🚀
