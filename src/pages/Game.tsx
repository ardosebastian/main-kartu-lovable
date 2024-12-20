import React, { useState, useEffect } from "react";
import Card from "@/components/game/Card"; 
import type { Question, LevelInfo } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/common/Header";
import { toast } from "sonner";
import { Progress } from "@/components/common/progress";
import { questions } from "@/lib/data/questions";
import { levels } from "@/lib/data/levels";
import { BottomNavigation } from "@/components/common/BottomNavigation";

const Game = () => {
  console.log('Game component rendered');
  console.log('Questions:', questions);
  console.log('Levels:', levels);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);

  useEffect(() => {
    console.log('Game useEffect triggered');
    const welcomeTimer = setTimeout(() => {
      console.log('Welcome timer completed');
      setShowWelcome(false);
      setShowCard(true);
    }, 2000);

    return () => clearTimeout(welcomeTimer);
  }, []);

  const handleNext = () => {
    console.log('handleNext called');
    const nextQuestionIndex = (currentQuestion + 1) % questions.length;
    const questionsInCurrentLevel = questions.filter(q => q.level === currentLevel);
    const completedInLevel = questionsCompleted + 1;
    
    console.log('Next question index:', nextQuestionIndex);
    console.log('Questions in current level:', questionsInCurrentLevel);
    
    // Check if we should level up
    if (completedInLevel >= questionsInCurrentLevel.length && currentLevel < 3) {
      const nextLevel = (currentLevel + 1) as 1 | 2 | 3;
      const nextLevelInfo = levels.find(l => l.id === nextLevel);
      
      toast.success(`Level Up! Selamat datang di level "${nextLevelInfo?.name}"`, {
        description: nextLevelInfo?.description,
        duration: 5000,
      });
      
      setCurrentLevel(nextLevel);
      setQuestionsCompleted(0);
    } else {
      setQuestionsCompleted(completedInLevel);
    }
    
    setCurrentQuestion(nextQuestionIndex);
  };

  const getCurrentLevelProgress = () => {
    const questionsInLevel = questions.filter(q => q.level === currentLevel).length;
    return (questionsCompleted / questionsInLevel) * 100;
  };

  return (
    <div 
      className="w-full min-h-[100dvh] flex items-center justify-center"
      style={{
        background: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>

      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <h1 className="text-4xl font-bold text-white text-center">
              💖 Kikuk-kikuk! 💖
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-6 px-4 -mt-4"
          >
            <Card onNext={handleNext} question={questions[currentQuestion]} />
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 w-[85vw] md:w-[400px] shadow-lg" style={{
              background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 120%)"
            }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Level {currentLevel}:</span>
                <span className="text-sm font-medium">{levels[currentLevel - 1].name}</span>
              </div>
              <Progress value={getCurrentLevelProgress()} className="h-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
