import React, { useState, useEffect } from "react";

interface TimerProps {
  duration: number;
  onComplete: () => void;
}

export const Timer: React.FC<TimerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-3xl font-bold">
      {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
    </div>
  );
};