import React, { createContext, useContext, useState, useCallback } from 'react';
import { getQuestion, resetUsedQuestions, type Question } from '@/lib/questions';

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface CellState {
  category: string;
  points: number;
  used: boolean;
  question?: Question;
}

interface GameState {
  phase: 'setup' | 'playing' | 'question';
  categories: string[];
  questionsPerCategory: number;
  players: Player[];
  board: CellState[][];
  currentQuestion: CellState | null;
  activePlayerIndex: number;
}

interface GameContextType extends GameState {
  setCategories: (cats: string[]) => void;
  setQuestionsPerCategory: (n: number) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startGame: () => void;
  selectCell: (catIdx: number, rowIdx: number) => void;
  answerCorrect: (playerId: string) => void;
  answerWrong: (playerId: string) => void;
  closeQuestion: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    phase: 'setup',
    categories: [],
    questionsPerCategory: 5,
    players: [],
    board: [],
    currentQuestion: null,
    activePlayerIndex: 0,
  });

  const setCategories = useCallback((cats: string[]) => {
    setState(s => ({ ...s, categories: cats }));
  }, []);

  const setQuestionsPerCategory = useCallback((n: number) => {
    setState(s => ({ ...s, questionsPerCategory: n }));
  }, []);

  const addPlayer = useCallback((name: string) => {
    setState(s => ({
      ...s,
      players: [...s.players, { id: crypto.randomUUID(), name, score: 0 }],
    }));
  }, []);

  const removePlayer = useCallback((id: string) => {
    setState(s => ({
      ...s,
      players: s.players.filter(p => p.id !== id),
    }));
  }, []);

  const startGame = useCallback(() => {
    resetUsedQuestions();
    setState(s => {
      const board = s.categories.map(cat => {
        return Array.from({ length: s.questionsPerCategory }, (_, i) => {
          const points = (i + 1) * 100;
          const question = getQuestion(cat, i + 1, s.questionsPerCategory);
          return { category: cat, points, used: false, question };
        });
      });
      return { ...s, phase: 'playing', board, activePlayerIndex: 0 };
    });
  }, []);

  const selectCell = useCallback((catIdx: number, rowIdx: number) => {
    setState(s => {
      const cell = s.board[catIdx]?.[rowIdx];
      if (!cell || cell.used) return s;
      const newBoard = s.board.map((col, ci) =>
        col.map((c, ri) =>
          ci === catIdx && ri === rowIdx ? { ...c, used: true } : c
        )
      );
      return { ...s, phase: 'question', currentQuestion: cell, board: newBoard };
    });
  }, []);

  const answerCorrect = useCallback((playerId: string) => {
    setState(s => ({
      ...s,
      players: s.players.map(p =>
        p.id === playerId
          ? { ...p, score: p.score + (s.currentQuestion?.points ?? 0) }
          : p
      ),
    }));
  }, []);

  const answerWrong = useCallback((playerId: string) => {
    setState(s => ({
      ...s,
      players: s.players.map(p =>
        p.id === playerId
          ? { ...p, score: p.score - (s.currentQuestion?.points ?? 0) }
          : p
      ),
    }));
  }, []);

  const closeQuestion = useCallback(() => {
    setState(s => ({
      ...s,
      phase: 'playing',
      currentQuestion: null,
      activePlayerIndex: (s.activePlayerIndex + 1) % Math.max(1, s.players.length),
    }));
  }, []);

  const resetGame = useCallback(() => {
    resetUsedQuestions();
    setState({
      phase: 'setup',
      categories: [],
      questionsPerCategory: 5,
      players: [],
      board: [],
      currentQuestion: null,
      activePlayerIndex: 0,
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        setCategories,
        setQuestionsPerCategory,
        addPlayer,
        removePlayer,
        startGame,
        selectCell,
        answerCorrect,
        answerWrong,
        closeQuestion,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
