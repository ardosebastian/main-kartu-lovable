import React, { useState, useEffect } from "react";
import { Timer } from "./Timer";
import type { Question } from "@/types";
import 'animate.css';

interface CardProps {
  onNext: () => void;
  question: Question;
}

export const Card: React.FC<CardProps> = ({ onNext, question }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(question);

  // Create audio element for flip sound
  const flipSound = new Audio("/flip-sound.mp3");

  useEffect(() => {
    if (!isFlipped) {
      setCurrentQuestion(question);
    }
  }, [question, isFlipped]);

  const handleCardClick = () => {
    // Play flip sound
    flipSound.play().catch(console.error);

    if (!isFlipped) {
      setIsFlipped(true);
      if (question.hasTimer) {
        setShowTimer(true);
      }
    } else {
      setIsFlipped(false);
      setShowTimer(false);
      setTimeout(() => {
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
          onNext();
        }, 800);
      }, 1000);
    }
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center p-8 md:p-12"
      style={{
        background: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
        minHeight: "100vh",
      }}
    >
      <div
        className={`relative w-full max-w-sm aspect-[3/4] cursor-pointer perspective-1000 ${
          isShaking ? "animate__animated animate__shakeY" : ""
        }`}
        onClick={handleCardClick}
      >
        <div
          className={`w-full h-full transition-all duration-1000 transform-style-3d ${
            isFlipped ? "animate-flip" : "animate-flip-back"
          }`}
        >
          {/* Front of card */}
          <div
            className="absolute w-full h-full backface-hidden rounded-3xl shadow-xl p-6"
            style={{
              background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
            }}
          >
            <div className="flex items-center justify-center h-full">
              <h2 className="text-2xl font-bold text-gray-800">Tap untuk Mulai</h2>
            </div>
          </div>

          {/* Back of card */}
          <div
            className="absolute w-full h-full backface-hidden rounded-3xl shadow-xl rotate-y-180 bg-white p-6"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h3 className="text-xl font-bold mb-4">
                {currentQuestion.type === "challenge" ? "Tantangan" : "Pertanyaan"}
              </h3>
              <p className="text-lg mb-6">
                {currentQuestion.text}
              </p>
              {showTimer && currentQuestion.hasTimer && currentQuestion.duration && (
                <Timer duration={currentQuestion.duration} onComplete={() => setShowTimer(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};