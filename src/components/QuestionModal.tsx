import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';

export default function QuestionModal() {
  const { currentQuestion, players, answerCorrect, answerWrong, closeQuestion } = useGame();
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);

  if (!currentQuestion || !currentQuestion.question) return null;

  const handleAnswer = (playerId: string, correct: boolean) => {
    if (correct) {
      answerCorrect(playerId);
    } else {
      answerWrong(playerId);
    }
    setAnswered(true);
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl space-y-6"
        style={{ animation: 'slide-up 0.4s ease-out' }}
      >
        {/* Category & points */}
        <div className="text-center">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            {currentQuestion.category}
          </span>
          <div
            className="text-5xl md:text-6xl text-primary font-bold mt-1"
            style={{ fontFamily: 'Bebas Neue, cursive' }}
          >
            {currentQuestion.points}
          </div>
        </div>

        {/* Question */}
        <div className="bg-jeopardy-blue rounded-xl p-6 md:p-8 text-center border border-border/30">
          <p className="text-foreground text-xl md:text-2xl leading-relaxed">
            {currentQuestion.question.question}
          </p>
        </div>

        {/* Answer */}
        {!showAnswer ? (
          <Button
            onClick={() => setShowAnswer(true)}
            size="lg"
            className="w-full text-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Mostra risposta
          </Button>
        ) : (
          <div className="space-y-4" style={{ animation: 'fade-in 0.3s ease-out' }}>
            <div className="bg-secondary rounded-xl p-6 text-center border border-primary/30">
              <p className="text-sm text-muted-foreground mb-1">Risposta</p>
              <p className="text-primary text-xl md:text-2xl font-bold">
                {currentQuestion.question.answer}
              </p>
            </div>

            {/* Player scoring */}
            {!answered ? (
              <div className="space-y-3">
                <p className="text-center text-muted-foreground text-sm">
                  Seleziona il giocatore e il risultato:
                </p>
                {players.map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <span className="text-foreground font-medium flex-1">{p.name}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAnswer(p.id, true)}
                      className="bg-jeopardy-correct hover:bg-jeopardy-correct/80 text-foreground"
                    >
                      ✓ Corretta
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAnswer(p.id, false)}
                      className="bg-jeopardy-wrong hover:bg-jeopardy-wrong/80 text-foreground"
                    >
                      ✗ Sbagliata
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Button
                onClick={closeQuestion}
                size="lg"
                className="w-full text-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Torna al tabellone
              </Button>
            )}
          </div>
        )}

        {/* Skip button (if no answer shown yet or no scoring done) */}
        {!answered && (
          <button
            onClick={() => {
              setAnswered(true);
              closeQuestion();
            }}
            className="text-muted-foreground hover:text-foreground text-sm underline mx-auto block"
          >
            Salta domanda
          </button>
        )}
      </div>
    </div>
  );
}
