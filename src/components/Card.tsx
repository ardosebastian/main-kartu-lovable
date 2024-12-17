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
  const [isClickable, setIsClickable] = useState(true);

  useEffect(() => {
    if (!isFlipped) {
      setCurrentQuestion(question);
    }
  }, [question, isFlipped]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Jika kartu sedang dalam animasi shake atau tidak bisa diklik, abaikan klik
    if (!isClickable || isShaking) {
      return;
    }

    // Jika klik berasal dari timer, abaikan flip
    if ((e.target as HTMLElement).closest('.timer-container')) {
      return;
    }

    if (!isFlipped) {
      setIsFlipped(true);
      if (question.hasTimer) {
        // Add a delay to show timer after card is fully flipped
        setTimeout(() => {
          setShowTimer(true);
        }, 500); // 500ms delay to ensure card flip animation completes
      }
    } else {
      setIsFlipped(false);
      setShowTimer(false);
      setIsClickable(false); // Nonaktifkan klik saat mulai shake
      setTimeout(() => {
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
          setIsClickable(true); // Aktifkan kembali klik setelah shake selesai
          onNext();
        }, 800);
      }, 1000);
    }
  };

  return (
    <div 
      className="w-full h-full flex items-start justify-center p-8 md:p-16 pt-16 md:pt-32"
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
          className={`relative w-full h-full transition-all duration-500 transform-style-3d ${
            isFlipped ? "animate-flip" : "animate-flip-back"
          }`}
        >
          {/* Front of card */}
          <div
            className="absolute w-full h-full backface-hidden rounded-3xl shadow-xl p-6 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
            }}
          >
            <img 
              src="https://res.cloudinary.com/dwwf2eqhc/image/upload/v1734390558/logo-kikuk_j1c4wu.svg" 
              alt="Kartu Kikuk Logo" 
              className="w-32 h-32 object-contain"
              loading="lazy"
              decoding="async"
              width={128}
              height={128}
            />
          </div>

          {/* Back of card */}
          <div
            className="absolute w-full h-full backface-hidden rounded-3xl shadow-xl rotate-y-180 bg-white p-6 flex flex-col"
          >
            <div className="flex-grow flex flex-col items-center justify-center text-center font-rounded">
              <h3 className="text-xl font-bold mb-4 tracking-tight">
                {currentQuestion.type === "challenge" ? "Tantangan" : "Pertanyaan"}
              </h3>
              <p className="text-lg mb-6 font-rounded tracking-tight">
                {currentQuestion.text}
              </p>
            </div>
            
            {currentQuestion.hasTimer && currentQuestion.duration && (
              <div className={`flex justify-center mb-4 timer-container ${showTimer ? 'animate__animated animate__bounceIn' : ''}`}>
                <Timer 
                  duration={currentQuestion.duration} 
                  onComplete={() => setShowTimer(false)}
                  isVisible={showTimer}
                  position="bottom"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};