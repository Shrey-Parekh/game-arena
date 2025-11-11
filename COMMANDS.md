# Nexus Arena - Command Reference

Quick reference for all commands you'll need.

## 📦 Installation

### Install All Dependencies
```bash
# From project root
npm run install-all
```

### Install Frontend Only
```bash
cd frontend
npm install
```

### Install Backend Only
```bash
cd backend
npm install
```

## 🚀 Development

### Start Backend Server
```bash
cd backend
npm run dev
```

### Start Frontend Server
```bash
cd frontend
npm run dev
```

### Start Both (requires 2 terminals)
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

## 🏗️ Build

### Build Frontend for Production
```bash
cd frontend
npm run build
```

### Preview Production Build
```bash
cd frontend
npm run preview
```

## 🧹 Cleanup

### Clear Frontend Cache
```bash
cd frontend
rm -rf node_modules .vite dist
npm install
```

### Clear Backend Cache
```bash
cd backend
rm -rf node_modules
npm install
```

### Clear All Caches
```bash
# Frontend
cd frontend
rm -rf node_modules .vite dist package-lock.json

# Backend
cd ../backend
rm -rf node_modules package-lock.json

# Reinstall
cd ../frontend && npm install
cd ../backend && npm install
```

## 🔍 Debugging

### Check Node Version
```bash
node --version
# Should be v18 or higher
```

### Check npm Version
```bash
npm --version
```

### Check Port Usage (Windows)
```bash
netstat -ano | findstr :3001
netstat -ano | findstr :5173
```

### Check Port Usage (Mac/Linux)
```bash
lsof -i :3001
lsof -i :5173
```

### Kill Process by Port (Windows)
```bash
# Find PID first
netstat -ano | findstr :3001

# Kill process
taskkill /PID <PID> /F
```

### Kill Process by Port (Mac/Linux)
```bash
# Kill directly
kill -9 $(lsof -t -i:3001)
kill -9 $(lsof -t -i:5173)
```

## 🗄️ Database

### Connect to Supabase
```bash
# Open Supabase dashboard
https://supabase.com/dashboard
```

### Run Schema
```sql
-- Copy contents of backend/database/schema.sql
-- Paste in Supabase SQL Editor
-- Execute
```

### Run Seed Data
```sql
-- Copy contents of backend/database/seed.sql
-- Paste in Supabase SQL Editor
-- Execute
```

### Check Tables
```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Count rooms
SELECT COUNT(*) FROM rooms;

-- Count questions
SELECT COUNT(*) FROM truth_or_dare_questions;
```

## 🔐 Environment Variables

### View Frontend Environment
```bash
cd frontend
cat .env
```

### View Backend Environment
```bash
cd backend
cat .env
```

### Edit Environment Variables
```bash
# Windows
notepad frontend/.env
notepad backend/.env

# Mac/Linux
nano frontend/.env
nano backend/.env
```

## 🌐 Git Commands

### Initialize Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### Create GitHub Repository
```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/your-username/nexus-arena.git
git branch -M main
git push -u origin main
```

### Commit Changes
```bash
git add .
git commit -m "Your commit message"
git push
```

### Create Branch
```bash
git checkout -b feature/your-feature
git push -u origin feature/your-feature
```

## 🚀 Deployment

### Deploy to Vercel (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Deploy to production
vercel --prod
```

### Deploy to Render (Backend)
```bash
# Push to GitHub first
git push

# Then deploy via Render dashboard
# https://render.com
```

## 🧪 Testing

### Test Backend Health
```bash
curl http://localhost:3001/health
```

### Test Backend in Browser
```
http://localhost:3001/health
```

### Test Frontend in Browser
```
http://localhost:5173
```

### Test Production Backend
```bash
curl https://your-backend.onrender.com/health
```

## 📊 Monitoring

### View Backend Logs
```bash
# In terminal where backend is running
# Logs appear automatically

# Or check Render dashboard
```

### View Frontend Logs
```bash
# In terminal where frontend is running
# Logs appear automatically

# Or check Vercel dashboard
```

### View Browser Console
```
Press F12 → Console tab
```

### View Network Requests
```
Press F12 → Network tab
```

## 🔧 Troubleshooting Commands

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall with Legacy Peer Deps
```bash
npm install --legacy-peer-deps
```

### Update npm
```bash
npm install -g npm@latest
```

### Check for Outdated Packages
```bash
cd frontend
npm outdated

cd ../backend
npm outdated
```

### Update Packages
```bash
# Update all packages
npm update

# Update specific package
npm update package-name
```

## 📱 Mobile Testing

### Expose to Network
```bash
cd frontend
npm run dev -- --host
```

### Access from Mobile
```
# Find your local IP
# Windows: ipconfig
# Mac/Linux: ifconfig

# Access at:
http://YOUR_IP:5173
```

## 🎨 Code Quality

### Lint Frontend
```bash
cd frontend
npm run lint
```

### Format Code (if Prettier installed)
```bash
npx prettier --write "src/**/*.{js,jsx}"
```

## 📦 Package Management

### List Installed Packages
```bash
npm list --depth=0
```

### Check Package Info
```bash
npm info package-name
```

### Install Specific Version
```bash
npm install package-name@version
```

### Uninstall Package
```bash
npm uninstall package-name
```

## 🔄 Updates

### Pull Latest Changes
```bash
git pull origin main
```

### Update Dependencies After Pull
```bash
cd frontend && npm install
cd ../backend && npm install
```

## 💾 Backup

### Backup Database
```bash
# Use Supabase dashboard
# Settings → Database → Backups
```

### Backup Code
```bash
# Commit and push to GitHub
git add .
git commit -m "Backup"
git push
```

## 🎯 Quick Commands

### Full Reset
```bash
# Stop all servers (Ctrl+C)
# Clear everything
cd frontend && rm -rf node_modules .vite dist
cd ../backend && rm -rf node_modules
# Reinstall
cd ../frontend && npm install
cd ../backend && npm install
# Restart servers
```

### Quick Start
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### Quick Deploy
```bash
git add .
git commit -m "Update"
git push
# Vercel and Render auto-deploy
```

---

**Tip:** Bookmark this file for quick reference! 📌
