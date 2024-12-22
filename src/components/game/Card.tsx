import React, { useState, useEffect } from "react";
import Timer from "@/components/game/Timer";
import type { Question } from "@/types";
import 'animate.css';

interface CardProps {
  onNext: () => void;
  question: Question;
  onTurnChange: () => void;
  onCardFlip: (isFlipping: boolean) => void;
}

const Card: React.FC<CardProps> = ({ onNext, question, onTurnChange, onCardFlip }) => {
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
      onCardFlip(true);
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

      // Mulai sequence animasi
      setTimeout(() => {
        setIsShaking(true);
        
        // Setelah shake selesai
        setTimeout(() => {
          setIsShaking(false);
          setIsClickable(true);
          onCardFlip(false);
          // Trigger pergantian giliran sebelum kartu berikutnya
          onTurnChange();
          
          // Pindah ke kartu berikutnya
          onNext();
        }, 800);
      }, 1000);
    }
  };

  return (
    <div 
      className="w-full flex items-center justify-center px-4 mt-[4.5rem] mb-20"
    >
      <div
        className={`relative w-[85vw] md:w-[400px] h-[55vh] max-h-[500px] cursor-pointer perspective-1000 ${
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
            className="absolute w-full h-full backface-hidden rounded-3xl shadow-xl p-4 md:p-6 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
            }}
          >
            <img 
              src="https://res.cloudinary.com/dwwf2eqhc/image/upload/v1734390558/logo-kikuk_j1c4wu.svg" 
              alt="Kartu Kikuk Logo" 
              className="w-24 md:w-32 h-24 md:h-32 object-contain"
              loading="lazy"
              decoding="async"
              width={128}
              height={128}
            />
          </div>

          {/* Back of card */}
          <div
            className="absolute w-full h-full backface-hidden rounded-3xl shadow-xl rotate-y-180 bg-white p-3 md:p-6 flex flex-col"
          >
            <div className="flex-grow flex flex-col items-center justify-center text-center font-rounded">
              <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4 tracking-tight">
                {currentQuestion.type === "challenge" ? "Tantangan" : "Pertanyaan"}
              </h3>
              <p className="text-sm md:text-lg">
                {currentQuestion.text}
              </p>
            </div>

            {showTimer && question.hasTimer && question.duration && (
              <Timer 
                duration={question.duration} 
                onComplete={() => {
                  setShowTimer(false);
                  handleCardClick({} as React.MouseEvent);
                }} 
                isVisible={showTimer}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
