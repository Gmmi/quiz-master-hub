import { GameProvider, useGame } from '@/context/GameContext';
import GameSetup from '@/components/GameSetup';
import GameBoard from '@/components/GameBoard';

function GameRouter() {
  const { phase } = useGame();
  if (phase === 'setup') return <GameSetup />;
  return <GameBoard />;
}

export default function Index() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
