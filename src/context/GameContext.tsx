import React, { createContext, useState, useContext, ReactNode } from 'react';
import { levels } from '@/lib/data/levels';
import { questions } from '@/lib/data/questions';

// Tipe untuk level yang tersedia
type LevelType = 1 | 2 | 3;

// Struktur context game
interface GameContextType {
  currentLevel: LevelType;
  questionsCompleted: number;
  totalQuestions: number;
  levelProgress: number;
  updateLevel: (newLevel: LevelType) => void;
  completeQuestion: () => void;
  resetGame: () => void;
}

// Buat context dengan default value undefined
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState<LevelType>(1);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);

  // Hitung total pertanyaan untuk level saat ini
  const getQuestionsInCurrentLevel = () => 
    questions.filter(q => q.level === currentLevel).length;

  // Hitung progress level
  const calculateLevelProgress = () => {
    const totalQuestionsInLevel = getQuestionsInCurrentLevel();
    return totalQuestionsInLevel > 0 
      ? (questionsCompleted / totalQuestionsInLevel) * 100 
      : 0;
  };

  const updateLevel = (newLevel: LevelType) => {
    setCurrentLevel(newLevel);
    setQuestionsCompleted(0);
  };

  const completeQuestion = () => {
    const totalQuestionsInLevel = getQuestionsInCurrentLevel();
    const newQuestionsCompleted = questionsCompleted + 1;

    // Cek apakah perlu naik level
    if (newQuestionsCompleted >= totalQuestionsInLevel && currentLevel < 3) {
      const nextLevel = (currentLevel + 1) as LevelType;
      updateLevel(nextLevel);
    } else {
      setQuestionsCompleted(newQuestionsCompleted);
    }
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setQuestionsCompleted(0);
  };

  const contextValue: GameContextType = {
    currentLevel,
    questionsCompleted,
    totalQuestions: getQuestionsInCurrentLevel(),
    levelProgress: calculateLevelProgress(),
    updateLevel,
    completeQuestion,
    resetGame
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook untuk menggunakan context game
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
