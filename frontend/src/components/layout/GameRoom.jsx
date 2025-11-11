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
          <div className="text-center py-12">
            <p className="text-text/70">Game type not supported yet</p>
          </div>
        )
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {renderGame()}
    </div>
  )
}

export default GameRoom
