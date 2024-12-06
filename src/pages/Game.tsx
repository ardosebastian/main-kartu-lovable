import React, { useState } from "react";
import { Card } from "@/components/Card";
import type { Question } from "@/types";

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

  const handleNext = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
  };

  return <Card onNext={handleNext} question={questions[currentQuestion]} />;
};

export default Game;