import React, { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import type { Question } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const questions: Question[] = [
  {
    type: "challenge" as const,
    text: "Berikan pasangan anda pijatan selama 2 menit",
    hasTimer: true,
    duration: 120
  },
  {
    type: "question" as const,
    text: "Ceritakan fantasi terliar anda",
    hasTimer: false
  },
  {
    type: "challenge" as const,
    text: "Berikan 3 ciuman di tempat yang berbeda",
    hasTimer: false
  },
  {
    type: "challenge" as const,
    text: "Lakukan tarian seksi selama 1 menit",
    hasTimer: true,
    duration: 60
  },
  {
    type: "question" as const,
    text: "Bagian mana dari tubuh pasangan yang paling anda sukai?",
    hasTimer: false
  },
  {
    type: "challenge" as const,
    text: "Buat pasangan anda tertawa tanpa menggelitik selama 30 detik",
    hasTimer: true,
    duration: 30
  },
  {
    type: "question" as const,
    text: "Ceritakan pengalaman romantis yang tidak akan pernah anda lupakan",
    hasTimer: false
  },
  {
    type: "challenge" as const,
    text: "Bisikkan kata-kata nakal di telinga pasangan selama 1 menit",
    hasTimer: true,
    duration: 60
  },
  {
    type: "question" as const,
    text: "Apa yang membuat anda terangsang?",
    hasTimer: false
  },
  {
    type: "challenge" as const,
    text: "Berpelukan erat selama 30 detik tanpa berbicara",
    hasTimer: true,
    duration: 30
  }
];

const Game = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Show welcome message for 2 seconds, then fade in the card
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
      setShowCard(true);
    }, 2000);

    return () => clearTimeout(welcomeTimer);
  }, []);

  const handleNext = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
  };

  return (
    <div 
      className="w-full min-h-screen relative"
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
            <h1 className="text-4xl font-bold text-white text-center">
              Selamat Bermain! 💖
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
            className="w-full h-full"
          >
            <Card onNext={handleNext} question={questions[currentQuestion]} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
