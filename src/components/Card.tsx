import React, { useState, useEffect } from "react";
import { Timer } from "./Timer";

interface CardProps {
  onNext: () => void;
}

export const Card: React.FC<CardProps> = ({ onNext }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
      setTimeout(() => {
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
          onNext();
          setIsFlipped(true);
        }, 500);
      }, 600);
    }
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
        minHeight: "100vh",
      }}
    >
      <div
        className={`relative w-full max-w-sm aspect-[3/4] cursor-pointer perspective-1000 ${
          isShaking ? "animate-shake" : ""
        }`}
        onClick={handleCardClick}
      >
        <div
          className={`w-full h-full transition-transform duration-600 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of card */}
          <div
            className="absolute w-full h-full backface-hidden rounded-2xl shadow-lg"
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
            className="absolute w-full h-full backface-hidden rounded-2xl shadow-lg rotate-y-180 bg-white"
          >
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Tantangan</h3>
              <p className="text-lg mb-4">
                Berikan pasangan anda pijatan selama 2 menit
              </p>
              {showTimer && <Timer duration={120} onComplete={() => setShowTimer(false)} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};