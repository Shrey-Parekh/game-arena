import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import { GameProvider } from './contexts/GameContext'
import Home from './pages/Home'
import ModeSelect from './pages/ModeSelect'
import GameSelect from './pages/GameSelect'
import Game from './pages/Game'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <GameProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mode-select" element={<ModeSelect />} />
              <Route path="/game-select" element={<GameSelect />} />
              <Route path="/game" element={<Game />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </GameProvider>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
