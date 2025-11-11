# Nexus Arena - Setup Guide

This guide will help you get Nexus Arena up and running on your local machine.

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Supabase account (already configured)

## Step 1: Database Setup

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to the SQL Editor
3. Run the schema file:
   - Copy the contents of `backend/database/schema.sql`
   - Paste into SQL Editor and execute
4. Run the seed file:
   - Copy the contents of `backend/database/seed.sql`
   - Paste into SQL Editor and execute

This will create all necessary tables and populate the Truth or Dare questions.

## Step 2: Install Dependencies

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

## Step 3: Environment Variables

The `.env` files have already been created with your Supabase credentials:

**Frontend** (`frontend/.env`):
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ VITE_SOCKET_URL

**Backend** (`backend/.env`):
- ✅ PORT
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ CLIENT_URL
- ✅ NODE_ENV

## Step 4: Run the Application

You'll need two terminal windows:

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
╔═══════════════════════════════════════╗
║     Nexus Arena Backend Server        ║
╠═══════════════════════════════════════╣
║  Port: 3001                           ║
║  Environment: development             ║
║  Client URL: http://localhost:5173    ║
╚═══════════════════════════════════════╝

✓ Supabase connected
✓ Socket connected: ...
```

### Terminal 2 - Frontend Development Server
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 5: Access the Application

Open your browser and navigate to: **http://localhost:5173**

## Testing the Application

### Create Your First Game

1. **Sign Up**: Create a new account with email and password
2. **Create Room**: Click "Create Room" → Choose "2 Players" → Select "Truth or Dare"
3. **Copy Room Code**: You'll see a 6-character code (e.g., ABC123)
4. **Join from Another Browser**: 
   - Open an incognito/private window
   - Sign up with a different email
   - Click "Join Room" and enter the code
5. **Start Game**: As the host, click "Start Game"
6. **Play**: Choose Truth or Dare and answer questions!

## Troubleshooting

### Backend won't start
- Check if port 3001 is already in use
- Verify Supabase credentials in `backend/.env`
- Run `npm install` again in backend folder

### Frontend won't start
- Check if port 5173 is already in use
- Verify environment variables in `frontend/.env`
- Run `npm install` again in frontend folder

### Database errors
- Make sure you ran both `schema.sql` and `seed.sql` in Supabase
- Check Supabase dashboard for any error messages
- Verify RLS policies are enabled

### Socket connection issues
- Make sure backend is running first
- Check browser console for connection errors
- Verify VITE_SOCKET_URL matches backend port

### Authentication issues
- Check Supabase Auth is enabled in your project
- Verify email confirmation is disabled (for testing)
- Check browser console for auth errors

## Project Structure

```
nexus-arena/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts (Auth, Socket, Game)
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── package.json
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Data models
│   │   ├── socket/        # Socket.IO handlers
│   │   └── utils/         # Utility functions
│   ├── database/          # SQL files
│   └── package.json
└── README.md
```

## Next Steps

Once everything is working:

1. ✅ Test creating and joining rooms
2. ✅ Test playing Truth or Dare
3. ✅ Test disconnection/reconnection
4. ✅ Test with multiple browser windows
5. 🚀 Deploy to production (see README.md)

## Development Tips

- Use Chrome DevTools to debug Socket.IO connections
- Check Network tab for WebSocket messages
- Use React DevTools to inspect component state
- Check backend console for server logs

## Need Help?

- Check the main README.md for more information
- Review the spec files in `.kiro/specs/nexus-arena-mvp/`
- Check Supabase logs in the dashboard
- Look at browser console for frontend errors
- Check terminal output for backend errors

---

Happy coding! 🎮
