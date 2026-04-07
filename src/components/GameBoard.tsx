import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import QuestionModal from './QuestionModal';

export default function GameBoard() {
  const { categories, questionsPerCategory, board, players, activePlayerIndex, phase, resetGame } = useGame();

  const allUsed = board.every(col => col.every(c => c.used));

  return (
    <div className="min-h-screen flex flex-col p-2 md:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-3xl md:text-4xl text-primary tracking-wider">JEOPARDY!</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={resetGame}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Reset
        </Button>
      </div>

      {/* Scoreboard */}
      <div className="flex gap-2 md:gap-4 mb-3 overflow-x-auto pb-1">
        {players.map((p, i) => (
          <div
            key={p.id}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-center transition-all duration-300 ${
              i === activePlayerIndex
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary text-secondary-foreground'
            }`}
            style={i === activePlayerIndex ? { animation: 'glow-pulse 2s infinite' } : {}}
          >
            <div className="text-sm font-medium">{p.name}</div>
            <div className="text-lg font-bold" style={{ fontFamily: 'Bebas Neue, cursive' }}>
              {p.score}
            </div>
          </div>
        ))}
      </div>

      {/* Board */}
      <div
        className="grid gap-1 md:gap-2 flex-1"
        style={{
          gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
        }}
      >
        {/* Category headers */}
        {categories.map(cat => (
          <div
            key={cat}
            className="bg-jeopardy-blue text-primary text-center py-2 md:py-3 rounded-t-lg font-bold text-xs md:text-sm lg:text-base truncate px-1"
            style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.05em' }}
          >
            {cat}
          </div>
        ))}

        {/* Question cells */}
        {Array.from({ length: questionsPerCategory }, (_, rowIdx) =>
          categories.map((_, catIdx) => {
            const cell = board[catIdx]?.[rowIdx];
            if (!cell) return null;
            return (
              <GameCell key={`${catIdx}-${rowIdx}`} cell={cell} catIdx={catIdx} rowIdx={rowIdx} />
            );
          })
        )}
      </div>

      {/* End game */}
      {allUsed && (
        <div className="mt-4 text-center" style={{ animation: 'slide-up 0.5s ease-out' }}>
          <h2 className="text-4xl text-primary mb-2">Partita terminata!</h2>
          <p className="text-foreground text-xl">
            🏆 Vincitore:{' '}
            <span className="text-primary font-bold">
              {[...players].sort((a, b) => b.score - a.score)[0]?.name ?? '—'}
            </span>{' '}
            con {[...players].sort((a, b) => b.score - a.score)[0]?.score ?? 0} punti!
          </p>
        </div>
      )}

      {/* Question modal */}
      {phase === 'question' && <QuestionModal />}
    </div>
  );
}

function GameCell({ cell, catIdx, rowIdx }: { cell: { used: boolean; points: number }; catIdx: number; rowIdx: number }) {
  const { selectCell } = useGame();

  if (cell.used) {
    return (
      <div className="bg-muted/30 rounded-lg flex items-center justify-center min-h-[3rem] md:min-h-[4rem]">
        <span className="text-muted-foreground/30 text-lg">—</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => selectCell(catIdx, rowIdx)}
      className="bg-jeopardy-cell hover:bg-jeopardy-cell-hover text-primary font-bold rounded-lg flex items-center justify-center min-h-[3rem] md:min-h-[4rem] transition-all duration-200 hover:scale-105 active:scale-95 text-lg md:text-2xl cursor-pointer border border-border/30"
      style={{ fontFamily: 'Bebas Neue, cursive' }}
    >
      {cell.points}
    </button>
  );
}
