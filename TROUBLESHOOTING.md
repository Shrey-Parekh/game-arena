# Nexus Arena - Troubleshooting Guide

Common issues and their solutions.

## 🔴 Installation Issues

### "npm install" fails

**Problem:** Dependencies won't install

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

### Node version issues

**Problem:** "Unsupported engine" error

**Solution:**
```bash
# Check your Node version
node --version

# Should be v18 or higher
# If not, install Node 18+
# Visit: https://nodejs.org
```

## 🔴 Database Issues

### "relation does not exist" error

**Problem:** Database tables not created

**Solution:**
1. Go to Supabase dashboard
2. SQL Editor
3. Run `backend/database/schema.sql`
4. Run `backend/database/seed.sql`
5. Verify tables exist in Table Editor

### "permission denied" error

**Problem:** RLS policies blocking access

**Solution:**
1. Check Supabase dashboard → Authentication
2. Verify RLS policies in SQL Editor
3. Make sure policies allow authenticated users
4. Try disabling RLS temporarily for testing:
```sql
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
```

### No questions loading

**Problem:** truth_or_dare_questions table empty

**Solution:**
```bash
# Run seed file again
# Copy backend/database/seed.sql
# Paste in Supabase SQL Editor
# Execute
```

## 🔴 Backend Issues

### Backend won't start

**Problem:** Server crashes on startup

**Check:**
```bash
# 1. Check if port 3001 is in use
# Windows:
netstat -ano | findstr :3001

# Mac/Linux:
lsof -i :3001

# 2. Kill the process if needed
# Windows:
taskkill /PID <PID> /F

# Mac/Linux:
kill -9 <PID>

# 3. Try a different port
# Edit backend/.env:
PORT=3002
```

### "Supabase connection failed"

**Problem:** Can't connect to database

**Check:**
1. Verify `SUPABASE_URL` in `backend/.env`
2. Verify `SUPABASE_ANON_KEY` in `backend/.env`
3. Check Supabase dashboard is accessible
4. Check internet connection
5. Try the credentials in Supabase dashboard

### "Authentication failed" on Socket.IO

**Problem:** JWT token verification fails

**Check:**
1. User is logged in on frontend
2. Token is being sent in Socket.IO handshake
3. Backend can verify token with Supabase
4. Check backend console for specific error

## 🔴 Frontend Issues

### Frontend won't start

**Problem:** Vite dev server crashes

**Solutions:**
```bash
# 1. Clear Vite cache
rm -rf frontend/.vite
rm -rf frontend/node_modules/.vite

# 2. Reinstall dependencies
cd frontend
rm -rf node_modules
npm install

# 3. Check for port conflicts
# Edit vite.config.js to use different port:
server: {
  port: 5174
}
```

### "Failed to fetch" errors

**Problem:** Can't connect to backend

**Check:**
1. Backend is running (`cd backend && npm run dev`)
2. `VITE_SOCKET_URL` in `frontend/.env` is correct
3. Backend URL is accessible
4. CORS is configured correctly
5. Check browser console for specific error

### White screen / blank page

**Problem:** React app not rendering

**Solutions:**
```bash
# 1. Check browser console for errors
# Press F12 → Console tab

# 2. Clear browser cache
# Ctrl+Shift+Delete (Windows)
# Cmd+Shift+Delete (Mac)

# 3. Try incognito/private mode

# 4. Rebuild
cd frontend
npm run build
npm run dev
```

## 🔴 Authentication Issues

### Can't sign up

**Problem:** Signup fails with error

**Check:**
1. Email format is valid
2. Password is at least 6 characters
3. Supabase Auth is enabled
4. Check Supabase Auth logs
5. Email confirmation might be required

**Solution:**
```bash
# Disable email confirmation in Supabase:
# Dashboard → Authentication → Settings
# Disable "Enable email confirmations"
```

### Can't log in

**Problem:** Login fails with error

**Check:**
1. Credentials are correct
2. User exists in Supabase Auth
3. Check browser console for error
4. Check Supabase Auth logs

### Token expired

**Problem:** "Invalid token" error

**Solution:**
```bash
# User needs to log in again
# Token refresh should be automatic
# Check AuthContext.jsx for token refresh logic
```

## 🔴 Socket.IO Issues

### "Socket disconnected" constantly

**Problem:** Connection keeps dropping

**Check:**
1. Backend is running and stable
2. Network connection is stable
3. No firewall blocking WebSocket
4. Check backend logs for errors

**Solution:**
```javascript
// Increase timeout in frontend/src/utils/socket.js:
timeout: 30000  // Increase from 20000
```

### "Connection lost" message

**Problem:** Can't establish Socket.IO connection

**Check:**
1. `VITE_SOCKET_URL` matches backend URL
2. Backend is running
3. CORS allows frontend origin
4. WebSocket is not blocked by firewall/proxy

### Messages not received

**Problem:** Socket events not working

**Check:**
1. Event names match exactly (case-sensitive)
2. Socket is connected before emitting
3. Room code is correct
4. Check backend logs for event handling
5. Check browser console for errors

## 🔴 Game Issues

### Room code doesn't work

**Problem:** "Room not found" error

**Check:**
1. Room code is exactly 6 characters
2. Room hasn't expired (1 hour limit)
3. Room exists in database
4. Check Supabase rooms table

### Can't start game

**Problem:** "Start Game" button doesn't work

**Check:**
1. User is the host
2. At least 2 players in room
3. Socket is connected
4. Check browser console for errors
5. Check backend logs

### Questions not loading

**Problem:** No questions appear

**Check:**
1. Seed data was loaded
2. Spice level is selected
3. Questions exist for that type/level
4. Check backend logs for database errors

### Timer not working

**Problem:** Countdown doesn't start

**Check:**
1. Timer component is rendering
2. Duration is set correctly
3. Check browser console for errors
4. Try refreshing the page

### Scores not updating

**Problem:** Points don't change

**Check:**
1. Answer was submitted successfully
2. Socket event was received
3. GameContext is updating state
4. Check browser console for state updates

## 🔴 Deployment Issues

### Vercel build fails

**Problem:** Frontend deployment fails

**Solutions:**
```bash
# 1. Check build locally
cd frontend
npm run build

# 2. Check environment variables in Vercel
# All VITE_* variables must be set

# 3. Check build logs in Vercel dashboard
# Look for specific error messages
```

### Render deployment fails

**Problem:** Backend deployment fails

**Solutions:**
```bash
# 1. Check build command is correct
# Build Command: npm install
# Start Command: node src/server.js

# 2. Check environment variables
# All variables must be set in Render

# 3. Check logs in Render dashboard
```

### CORS errors in production

**Problem:** Frontend can't connect to backend

**Solution:**
```bash
# 1. Update CLIENT_URL in Render
CLIENT_URL=https://your-app.vercel.app

# 2. Redeploy backend

# 3. Verify CORS settings in backend/src/server.js
```

### Socket.IO not connecting in production

**Problem:** WebSocket connection fails

**Check:**
1. `VITE_SOCKET_URL` points to Render backend
2. Backend is running (not sleeping)
3. HTTPS is used (not HTTP)
4. WebSocket is not blocked

## 🔴 Performance Issues

### Slow loading

**Problem:** App takes long to load

**Solutions:**
1. Check network tab in browser DevTools
2. Optimize images and assets
3. Enable code splitting
4. Use production build
5. Check backend response times

### Backend sleeping (Render free tier)

**Problem:** First request takes 30-60 seconds

**Solutions:**
1. Upgrade to paid plan ($7/month)
2. Use UptimeRobot to ping every 14 minutes
3. Accept the cold start delay
4. Show loading message to users

## 🆘 Getting Help

If none of these solutions work:

1. **Check Logs:**
   - Browser console (F12)
   - Backend terminal output
   - Supabase logs
   - Vercel/Render logs

2. **Isolate the Issue:**
   - Does it work locally?
   - Does it work in production?
   - Can you reproduce it?
   - What's the exact error message?

3. **Debug Steps:**
   ```bash
   # 1. Check all services are running
   # 2. Check all environment variables
   # 3. Check network requests
   # 4. Check database state
   # 5. Try in incognito mode
   # 6. Try different browser
   ```

4. **Common Fixes:**
   ```bash
   # Clear everything and start fresh
   cd frontend
   rm -rf node_modules .vite dist
   npm install
   
   cd ../backend
   rm -rf node_modules
   npm install
   
   # Restart both servers
   ```

## 📞 Support Resources

- Supabase Docs: https://supabase.com/docs
- Socket.IO Docs: https://socket.io/docs
- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs

---

**Still stuck?** Check the spec files in `.kiro/specs/nexus-arena-mvp/` for detailed implementation details.
