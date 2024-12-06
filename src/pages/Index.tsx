import React, { useState } from "react";
import { Card } from "@/components/Card";

const questions = [
  {
    type: "challenge",
    text: "Berikan pasangan anda pijatan selama 2 menit",
    hasTimer: true,
    duration: 120
  },
  {
    type: "question",
    text: "Ceritakan fantasi terliar anda",
    hasTimer: false
  },
  {
    type: "challenge",
    text: "Berikan 3 ciuman di tempat yang berbeda",
    hasTimer: false
  },
  {
    type: "challenge",
    text: "Lakukan tarian seksi selama 1 menit",
    hasTimer: true,
    duration: 60
  },
  {
    type: "question",
    text: "Bagian mana dari tubuh pasangan yang paling anda sukai?",
    hasTimer: false
  },
  {
    type: "challenge",
    text: "Buat pasangan anda tertawa tanpa menggelitik selama 30 detik",
    hasTimer: true,
    duration: 30
  },
  {
    type: "question",
    text: "Ceritakan pengalaman romantis yang tidak akan pernah anda lupakan",
    hasTimer: false
  },
  {
    type: "challenge",
    text: "Bisikkan kata-kata nakal di telinga pasangan selama 1 menit",
    hasTimer: true,
    duration: 60
  },
  {
    type: "question",
    text: "Apa yang membuat anda terangsang?",
    hasTimer: false
  },
  {
    type: "challenge",
    text: "Berpelukan erat selama 30 detik tanpa berbicara",
    hasTimer: true,
    duration: 30
  }
];

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleNext = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
  };

  return <Card onNext={handleNext} question={questions[currentQuestion]} />;
};

export default Index;