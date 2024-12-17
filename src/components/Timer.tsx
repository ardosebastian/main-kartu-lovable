import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import 'animate.css';

interface TimerProps {
  duration: number;
  onComplete: () => void;
  isVisible: boolean;
  position?: 'bottom' | 'center';
}

export const Timer: React.FC<TimerProps> = ({ 
  duration, 
  onComplete, 
  isVisible, 
  position = 'bottom' 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setIsReady(false);
      setIsRunning(false);
      setIsCompleted(false);
      setTimeLeft(duration);
      return;
    }
  }, [isVisible, duration]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsCompleted(true);
          setIsRunning(false);
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isRunning, onComplete]);

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsReady(false);
    setIsRunning(true);
  };

  const handleTimerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!isReady && !isRunning && !isCompleted) setIsReady(true);
    else if (isReady && !isRunning) handleStart(e);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!isVisible) return null;

  const positionClasses = position === 'center' 
    ? "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10" 
    : "absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10";

  return (
    <div 
      className={cn(
        positionClasses,
        "transition-all duration-500",
        isCompleted ? "animate__animated animate__fadeOut" : "animate__animated animate__fadeIn"
      )}
      onClick={handleTimerClick}
    >
      <div 
        className={cn(
          "bg-white/80 backdrop-blur-sm rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg border-2 border-pink-200 cursor-pointer font-rounded",
          "animate__animated",
          isReady ? "animate__bounceIn" : "",
          isRunning ? "animate__pulse animate__infinite" : "",
          isCompleted ? "animate__bounceOut" : ""
        )}
      >
        {!isReady && !isRunning && !isCompleted && (
          <div 
            className="text-base font-bold text-pink-600 animate__animated animate__pulse animate__infinite"
          >
            Mulai?
          </div>
        )}
        {isReady && !isRunning && (
          <div 
            className="text-base font-bold text-pink-600 animate__animated animate__bounceIn"
          >
            Siap?
          </div>
        )}
        {isRunning && (
          <div className="text-xl font-bold text-pink-600">
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </div>
        )}
      </div>
    </div>
  );
};