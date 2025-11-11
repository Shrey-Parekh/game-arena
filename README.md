# Nexus Arena

> Your virtual hangout spot for long-distance friendships

A social gaming platform where friends can connect and play quick 3-5 minute games together across distances through real-time multiplayer sessions.

## 🚀 Quick Start

**New here?** → Start with **[GETTING_STARTED.md](GETTING_STARTED.md)** for a visual step-by-step guide

**Need help?** → Check **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for common issues

## 🎮 Features

### Two-Player Mode (Intimate Hangouts)
Conversation-focused games for close friends:
- **Truth or Dare** - Classic party game with customizable spice levels
- More games coming soon: Would You Rather, Never Have I Ever, 20 Questions

### Multiplayer Mode (2-6 players)
Group party games:
- **Imposter Game** - Prompt-based deception game
- **Pictionary** - Real-time drawing and guessing
- More games coming soon

## 🚀 Tech Stack

**Frontend:**
- React 18+ with Vite
- Socket.IO Client v4.x
- Supabase JS Client v2.x
- Tailwind CSS v3.x
- React Router v6.x
- Framer Motion

**Backend:**
- Node.js v18+ with Express v4.x
- Socket.IO v4.x
- Supabase JS v2.x
- node-cron

**Database & Auth:**
- Supabase PostgreSQL
- Supabase Auth (JWT)

## 📚 Documentation

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Visual step-by-step setup guide 📖
- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes ⚡
- **[SETUP.md](SETUP.md)** - Detailed setup instructions 📘
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to production 🚀
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Fix common issues 🔧
- **[COMMANDS.md](COMMANDS.md)** - All commands reference ⌨️
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines 🤝

### 🎨 Design System

- **[frontend/DESIGN_SYSTEM.md](frontend/DESIGN_SYSTEM.md)** - Complete design system documentation 🎨
- **[frontend/DESIGN_QUICK_REFERENCE.md](frontend/DESIGN_QUICK_REFERENCE.md)** - Quick reference guide 📋

## 📋 Prerequisites

- Node.js v18 or higher
- npm or yarn
- Supabase account (credentials already configured)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd nexus-arena
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies
```bash
cd ../backend
npm install
```

### 4. Environment Setup

**Frontend (.env):**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SOCKET_URL=http://localhost:3001
```

**Backend (.env):**
```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 5. Database Setup

Run the SQL migrations in your Supabase dashboard to create the required tables:
- `rooms`
- `room_players`
- `game_sessions`
- `truth_or_dare_questions`

See `backend/database/schema.sql` for the complete schema.

## 🏃 Running the Application

### Development Mode

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

The frontend will be available at `http://localhost:5173`
The backend will be available at `http://localhost:3001`

## 📁 Project Structure

```
nexus-arena/
├── frontend/               # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── package.json
├── backend/               # Node.js backend server
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Data models
│   │   ├── socket/        # Socket.IO handlers
│   │   └── utils/         # Utility functions
│   └── package.json
└── README.md
```

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set framework preset to "Vite"
3. Add environment variables in Vercel dashboard
4. Deploy

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `node src/server.js`
5. Add environment variables
6. Deploy

## 🎯 How to Play

1. **Sign up or log in** to create your account
2. **Choose a mode**: 2-Player or Multiplayer
3. **Create a room** and share the 6-character code with friends
4. **Wait in the lobby** for everyone to join
5. **Start the game** and have fun!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- None yet! Report issues on GitHub.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ for long-distance friendships
