# 🚀 Getting Started with Nexus Arena

Visual step-by-step guide to get you up and running.

## 📋 What You'll Need

```
✅ Node.js v18+
✅ npm or yarn
✅ Supabase account (credentials already configured)
✅ 2 terminal windows
✅ 15 minutes
```

## 🎯 Quick Overview

```
Step 1: Setup Database (5 min)
    ↓
Step 2: Install Dependencies (3 min)
    ↓
Step 3: Start Servers (2 min)
    ↓
Step 4: Test the App (5 min)
    ↓
🎉 You're Playing!
```

---

## Step 1: Setup Database (5 minutes)

### 1.1 Open Supabase Dashboard
```
🌐 Go to: https://supabase.com/dashboard
```

### 1.2 Navigate to SQL Editor
```
Dashboard → SQL Editor → New Query
```

### 1.3 Run Schema File
```
1. Open: backend/database/schema.sql
2. Copy all contents
3. Paste in SQL Editor
4. Click "Run" or press Ctrl+Enter
```

**Expected Result:**
```
✅ Success. No rows returned
```

### 1.4 Run Seed File
```
1. Open: backend/database/seed.sql
2. Copy all contents
3. Paste in SQL Editor
4. Click "Run" or press Ctrl+Enter
```

**Expected Result:**
```
✅ Success. 120 rows inserted
```

### 1.5 Verify Tables
```
Dashboard → Table Editor

You should see:
✅ rooms
✅ room_players
✅ game_sessions
✅ truth_or_dare_questions (120 rows)
```

---

## Step 2: Install Dependencies (3 minutes)

### 2.1 Open Terminal in Project Root
```bash
cd nexus-arena
```

### 2.2 Install All Dependencies
```bash
npm run install-all
```

**Or install separately:**

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

**Expected Output:**
```
✅ added XXX packages
✅ No vulnerabilities found
```

---

## Step 3: Start Servers (2 minutes)

### 3.1 Start Backend Server

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════╗
║     Nexus Arena Backend Server        ║
╠═══════════════════════════════════════╣
║  Port: 3001                           ║
║  Environment: development             ║
║  Client URL: http://localhost:5173    ║
╚═══════════════════════════════════════╝

✓ Supabase connected
```

**✅ Backend is running!**

### 3.2 Start Frontend Server

**Terminal 2:**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**✅ Frontend is running!**

---

## Step 4: Test the App (5 minutes)

### 4.1 Open the App
```
🌐 Open browser: http://localhost:5173
```

### 4.2 Create First Account
```
1. Enter email: test1@example.com
2. Enter password: password123
3. Click "Sign Up"
```

**Expected Result:**
```
✅ Redirected to home page
✅ See "Create Room" and "Join Room" options
```

### 4.3 Create a Room
```
1. Click "Create Room"
2. Choose "2 Players"
3. Select "Truth or Dare"
```

**Expected Result:**
```
✅ Room created
✅ See 6-character room code (e.g., ABC123)
✅ See "Waiting for players..." message
```

### 4.4 Join from Another Browser
```
1. Open incognito/private window
2. Go to: http://localhost:5173
3. Sign up with: test2@example.com / password123
4. Click "Join Room"
5. Enter the room code from step 4.3
```

**Expected Result:**
```
✅ Joined room
✅ Both players visible in lobby
✅ Host sees "Start Game" button
```

### 4.5 Start the Game
```
1. As host (first browser), click "Start Game"
```

**Expected Result:**
```
✅ Game starts
✅ Spice level selector appears
✅ Active player can choose Truth or Dare
```

### 4.6 Play a Round
```
1. Select spice level (Mild, Spicy, or Extreme)
2. Choose "Truth" or "Dare"
3. Answer the question
4. Submit answer
```

**Expected Result:**
```
✅ Question appears with timer
✅ Score updates after submission
✅ Turn switches to other player
```

---

## 🎉 Success!

You're now playing Nexus Arena!

```
✅ Database is set up
✅ Backend is running
✅ Frontend is running
✅ Game is working
✅ Real-time sync is working
```

---

## 🔍 Verification Checklist

### Backend Health Check
```bash
# Open in browser or use curl:
http://localhost:3001/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-...",
  "activeRooms": 1
}
```

### Frontend Check
```
✅ Page loads without errors
✅ Can sign up/login
✅ Can create rooms
✅ Can join rooms
✅ Socket connection shows "Connected"
```

### Database Check
```sql
-- In Supabase SQL Editor:
SELECT COUNT(*) FROM rooms;
-- Should return: 1 (your test room)

SELECT COUNT(*) FROM truth_or_dare_questions;
-- Should return: 120
```

---

## 🎮 What to Try Next

### Test Different Features
```
✅ Skip a turn (costs 1 point)
✅ Try different spice levels
✅ Play until someone wins (5 points)
✅ Click "Play Again"
✅ Test disconnect/reconnect
```

### Test Edge Cases
```
✅ Close browser and rejoin
✅ Refresh page during game
✅ Leave room and create new one
✅ Try invalid room code
```

---

## 🚨 Common Issues

### Backend won't start
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Mac/Linux

# Kill the process if needed
# Then restart: npm run dev
```

### Frontend won't start
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules .vite
npm install
npm run dev
```

### "Room not found" error
```
✅ Make sure backend is running
✅ Check room code is correct (6 characters)
✅ Room might have expired (1 hour limit)
```

### Socket connection failed
```
✅ Backend must be running first
✅ Check VITE_SOCKET_URL in frontend/.env
✅ Should be: http://localhost:3001
```

### No questions loading
```
✅ Run seed.sql in Supabase
✅ Check truth_or_dare_questions table has 120 rows
```

---

## 📚 Next Steps

### Learn More
```
📖 Read SETUP.md for detailed explanations
📖 Read PROJECT_STATUS.md to see what's built
📖 Read design.md to understand architecture
```

### Deploy to Production
```
🚀 Follow DEPLOYMENT.md
🚀 Deploy backend to Render
🚀 Deploy frontend to Vercel
```

### Customize
```
🎨 Modify colors in tailwind.config.js
🎮 Add new questions to database
🎯 Add new games (see CONTRIBUTING.md)
```

---

## 🆘 Need Help?

### Check These Resources
1. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues
2. **[COMMANDS.md](COMMANDS.md)** - Useful commands
3. **[SETUP.md](SETUP.md)** - Detailed setup
4. **Browser Console** - Press F12 → Console tab
5. **Backend Logs** - Check terminal output

### Debug Checklist
```
✅ Both servers running?
✅ Database tables created?
✅ Environment variables correct?
✅ No errors in browser console?
✅ No errors in backend terminal?
```

---

## 🎯 Quick Commands Reference

```bash
# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev

# Check backend health
curl http://localhost:3001/health

# Reinstall everything
npm run install-all
```

---

## 🎊 Congratulations!

You've successfully set up Nexus Arena!

**What you've accomplished:**
- ✅ Set up a real-time multiplayer platform
- ✅ Configured WebSocket communication
- ✅ Integrated authentication
- ✅ Created your first game room
- ✅ Played Truth or Dare with real-time sync

**You're ready to:**
- 🎮 Play with friends
- 🚀 Deploy to production
- 🎨 Customize the app
- 🎯 Add new features

---

**Happy gaming! 🎉**
