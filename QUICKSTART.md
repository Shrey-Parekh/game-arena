# Nexus Arena - Quick Start

Get up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
# Install all dependencies at once
npm run install-all

# Or install separately:
cd frontend && npm install
cd ../backend && npm install
```

### 2. Setup Database
1. Go to https://supabase.com/dashboard
2. Open SQL Editor
3. Copy & paste `backend/database/schema.sql` → Execute
4. Copy & paste `backend/database/seed.sql` → Execute

### 3. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Open App
Visit: http://localhost:5173

## 🎮 First Game

1. **Sign Up** with any email/password
2. **Create Room** → 2 Players → Truth or Dare
3. **Copy Room Code** (6 characters)
4. **Open Incognito Window** → Sign up with different email
5. **Join Room** with the code
6. **Start Game** (as host)
7. **Play!** Choose Truth or Dare

## 📁 Project Structure

```
nexus-arena/
├── frontend/          # React app (Port 5173)
├── backend/           # Node.js server (Port 3001)
├── README.md          # Full documentation
├── SETUP.md           # Detailed setup guide
├── DEPLOYMENT.md      # Production deployment
└── QUICKSTART.md      # This file
```

## 🔧 Environment Variables

Already configured in `.env` files:
- ✅ Supabase URL
- ✅ Supabase API Key
- ✅ Socket.IO URL
- ✅ CORS settings

## ❓ Troubleshooting

**Backend won't start?**
```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

**Frontend won't start?**
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

**Database errors?**
- Run both SQL files in Supabase SQL Editor
- Check Supabase dashboard for errors

**Socket connection failed?**
- Make sure backend is running first
- Check backend terminal for "Socket connected" message

## 📚 Next Steps

- Read [SETUP.md](SETUP.md) for detailed setup
- Read [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to production
- Check `.kiro/specs/nexus-arena-mvp/` for full specifications

## 🆘 Need Help?

1. Check browser console (F12)
2. Check backend terminal output
3. Review Supabase logs
4. Read the full README.md

---

**That's it! You're ready to play!** 🎉
