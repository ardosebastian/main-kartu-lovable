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

const MainCepat = () => {
  console.log('MainCepat component rendered');
  console.log('Questions:', questions);
  console.log('Levels:', levels);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);

  useEffect(() => {
    console.log('MainCepat useEffect triggered');
    const welcomeTimer = setTimeout(() => {
      console.log('Welcome timer completed');
      console.log('Setting showWelcome to false');
      setShowWelcome(false);
    }, 100);

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

  return (
    <div 
      className="w-full min-h-[100dvh] flex items-center justify-center"
      style={{
        background: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
      }}
    >
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 flex items-center justify-center"
          >
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6 px-4 -mt-4 md:-mt-8"
          >
            <Card onNext={handleNext} question={questions[currentQuestion]} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainCepat;
