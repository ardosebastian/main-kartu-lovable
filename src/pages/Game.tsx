import React, { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import type { Question, LevelInfo } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const levels: LevelInfo[] = [
  {
    id: 1,
    name: "Bisikan Menggoda",
    description: "Deep talk seputar seks"
  },
  {
    id: 2,
    name: "Sentuhan Nakal",
    description: "Tantangan melibatkan sentuhan"
  },
  {
    id: 3,
    name: "Puncak Gairah",
    description: "Tantangan hubungan intim"
  }
];

const questions: Question[] = [
  {
    type: "question",
    text: "Ceritakan fantasi terliar anda",
    hasTimer: false,
    level: 1
  },
  {
    type: "challenge",
    text: "Berikan 3 ciuman di tempat yang berbeda",
    hasTimer: false,
    level: 2
  },
  {
    type: "challenge",
    text: "Lakukan tarian seksi selama 1 menit",
    hasTimer: true,
    duration: 60,
    level: 2
  },
  {
    type: "challenge",
    text: "Berikan pasangan anda pijatan selama 2 menit",
    hasTimer: true,
    duration: 120,
    level: 1
  },
  {
    type: "question",
    text: "Bagian mana dari tubuh pasangan yang paling anda sukai?",
    hasTimer: false,
    level: 1
  },
  {
    type: "challenge",
    text: "Buat pasangan anda tertawa tanpa menggelitik selama 30 detik",
    hasTimer: true,
    duration: 30,
    level: 1
  },
  {
    type: "question",
    text: "Ceritakan pengalaman romantis yang tidak akan pernah anda lupakan",
    hasTimer: false,
    level: 1
  },
  {
    type: "challenge",
    text: "Bisikkan kata-kata nakal di telinga pasangan selama 1 menit",
    hasTimer: true,
    duration: 60,
    level: 2
  },
  {
    type: "question",
    text: "Apa yang membuat anda terangsang?",
    hasTimer: false,
    level: 1
  },
  {
    type: "challenge",
    text: "Berpelukan erat selama 30 detik tanpa berbicara",
    hasTimer: true,
    duration: 30,
    level: 2
  }
];

const Game = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);

  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
      setShowCard(true);
    }, 2000);

    return () => clearTimeout(welcomeTimer);
  }, []);

  const handleNext = () => {
    const nextQuestionIndex = (currentQuestion + 1) % questions.length;
    const questionsInCurrentLevel = questions.filter(q => q.level === currentLevel);
    const completedInLevel = questionsCompleted + 1;
    
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
      className="w-full min-h-screen flex flex-col pb-24"
      style={{
        background: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
      }}
    >
      <Header />

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
            className="flex-1 flex flex-col pt-4"
          >
            <div className="flex-1 flex items-center justify-center min-h-[500px]">
              <Card onNext={handleNext} question={questions[currentQuestion]} />
            </div>
            
            <div className="w-full px-7 md:px-8 -mt-12 mt-2 mb-5">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 max-w-sm mx-auto shadow-lg" style={{
                background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 120%)"
              }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Level {currentLevel}:</span>
                  <span className="text-sm font-medium">{levels[currentLevel - 1].name}</span>
                </div>
                <Progress value={getCurrentLevelProgress()} className="h-2" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
