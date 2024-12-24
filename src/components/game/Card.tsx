import React, { useState, useEffect } from "react";
import Timer from "@/components/game/Timer";
import type { Question } from "@/types";
import 'animate.css';

interface CardProps {
  onNext: () => void;
  question: Question;
  onTurnChange: () => void;
  onCardFlip: (isFlipping: boolean) => void;
  isFlipped: boolean;
}

const Card: React.FC<CardProps> = ({ 
  onNext, 
  question, 
  onTurnChange, 
  onCardFlip,
  isFlipped: parentIsFlipped 
}) => {
  const [localIsFlipped, setLocalIsFlipped] = useState(parentIsFlipped);
  const [isShaking, setIsShaking] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [isClickable, setIsClickable] = useState(true);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Sync local state dengan parent state
  useEffect(() => {
    setLocalIsFlipped(parentIsFlipped);
  }, [parentIsFlipped]);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!localIsFlipped) {
      setCurrentQuestion(question);
    }
  }, [question, localIsFlipped]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isClickable || isShaking) {
      return;
    }

    if ((e.target as HTMLElement).closest('.timer-container')) {
      return;
    }

    if (!localIsFlipped) {
      setLocalIsFlipped(true);
      onCardFlip(true);
      if (question.hasTimer) {
        setTimeout(() => {
          setShowTimer(true);
        }, 500);
      }
    } else {
      setLocalIsFlipped(false);
      setShowTimer(false);
      setIsClickable(false);

      setTimeout(() => {
        setIsShaking(true);
        
        setTimeout(() => {
          setIsShaking(false);
          setIsClickable(true);
          onCardFlip(false);
          onTurnChange();
          onNext();
        }, 800);
      }, 1000);
    }
  };

  return (
    <div 
      className="w-full flex-1 flex items-center justify-center px-4 py-4 pb-24"
    >
      <div
        className={`relative w-[85vw] md:w-[400px] cursor-pointer perspective-1000 
          ${isShaking ? "animate__animated animate__shakeY" : ""}
          ${windowHeight > 700 ? "aspect-[3/4]" : "h-[calc(100vh-16rem)]"}
          sm:aspect-[3/4] md:aspect-[3/4]`}
        onClick={handleCardClick}
      >
        <div
          className={`relative w-full h-full transition-all duration-500 transform-style-3d ${
            localIsFlipped ? "animate-flip" : "animate-flip-back"
          }`}
        >
          {/* Front of card */}
          <div
            className="absolute w-full h-full backface-hidden rounded-3xl shadow-xl p-4 md:p-6 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)"
            }}
          >
            <img 
              src="https://res.cloudinary.com/dwwf2eqhc/image/upload/v1734390558/logo-kikuk_j1c4wu.svg" 
              alt="Kartu Kikuk Logo" 
              className={`${windowHeight < 500 ? "w-20 h-20" : "w-24 md:w-32 h-24 md:h-32"} object-contain`}
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
            <div className="flex-grow flex flex-col items-center justify-center text-center font-rounded p-2">
              <h3 className={`${windowHeight < 500 ? "text-sm" : "text-base md:text-xl"} font-bold mb-2 tracking-tight`}>
                {currentQuestion.type === "challenge" ? "Tantangan" : "Pertanyaan"}
              </h3>
              <p className={`${windowHeight < 500 ? "text-base" : "text-lg md:text-xl"}`}>
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