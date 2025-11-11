import { useGame } from '../../contexts/GameContext'
import TruthOrDare from '../games/TruthOrDare'

function GameRoom() {
  const { gameType } = useGame()

  const renderGame = () => {
    switch (gameType) {
      case 'truth-or-dare':
        return <TruthOrDare />
      default:
        return (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card text-center max-w-md">
              <p className="text-xl text-textLight">Game type not supported yet</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen">
      {renderGame()}
    </div>
  )
}

export default GameRoom
