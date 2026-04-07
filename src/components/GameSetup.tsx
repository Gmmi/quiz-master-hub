import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { ALL_CATEGORIES } from '@/lib/questions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function GameSetup() {
  const {
    categories,
    setCategories,
    questionsPerCategory,
    setQuestionsPerCategory,
    players,
    addPlayer,
    removePlayer,
    startGame,
  } = useGame();

  const [playerName, setPlayerName] = useState('');

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat));
    } else {
      if (categories.length >= 8) {
        toast.error('Massimo 8 categorie!');
        return;
      }
      setCategories([...categories, cat]);
    }
  };

  const randomCategories = () => {
    const count = Math.floor(Math.random() * 4) + 5; // 5-8
    setCategories(shuffleAndPick(ALL_CATEGORIES, count));
  };

  const handleAddPlayer = () => {
    const name = playerName.trim();
    if (!name) return;
    if (players.some(p => p.name === name)) {
      toast.error('Nome già in uso!');
      return;
    }
    addPlayer(name);
    setPlayerName('');
  };

  const handleStart = () => {
    if (categories.length < 5) {
      toast.error('Seleziona almeno 5 categorie!');
      return;
    }
    if (players.length < 1) {
      toast.error('Aggiungi almeno un giocatore!');
      return;
    }
    startGame();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8" style={{ animation: 'fade-in 0.5s ease-out' }}>
        {/* Title */}
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl tracking-wider text-primary">
            JEOPARDY!
          </h1>
          <p className="text-muted-foreground mt-2">Configura la tua partita</p>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-primary">Categorie</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={randomCategories}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              🎲 Casuali
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Seleziona da 5 a 8 categorie ({categories.length} selezionate)
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map(cat => {
              const selected = categories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    selected
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions per category */}
        <div className="space-y-3">
          <h2 className="text-2xl text-primary">Domande per categoria</h2>
          <div className="flex items-center gap-4">
            <Slider
              value={[questionsPerCategory]}
              onValueChange={([v]) => setQuestionsPerCategory(v)}
              min={5}
              max={10}
              step={1}
              className="flex-1"
            />
            <span className="text-2xl font-bold text-primary min-w-[3ch] text-center">
              {questionsPerCategory}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Punteggi: {Array.from({ length: questionsPerCategory }, (_, i) => (i + 1) * 100).join(', ')}
          </p>
        </div>

        {/* Players */}
        <div className="space-y-3">
          <h2 className="text-2xl text-primary">Giocatori</h2>
          <div className="flex gap-2">
            <Input
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddPlayer()}
              placeholder="Nome giocatore..."
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleAddPlayer}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Aggiungi
            </Button>
          </div>
          {players.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {players.map(p => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg"
                >
                  <span className="text-foreground font-medium">{p.name}</span>
                  <button
                    onClick={() => removePlayer(p.id)}
                    className="text-destructive hover:text-destructive/80 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Start */}
        <Button
          onClick={handleStart}
          size="lg"
          className="w-full text-xl py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-wider"
          style={{ fontFamily: 'Bebas Neue, cursive' }}
        >
          INIZIA PARTITA
        </Button>
      </div>
    </div>
  );
}
