import React, { useState } from "react";
import { Card } from "@/components/Card";

const questions = [
  "Berikan pasangan anda pijatan selama 2 menit",
  "Ceritakan fantasi terliar anda",
  "Berikan 3 ciuman di tempat yang berbeda",
  // Tambahkan pertanyaan lainnya
];

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleNext = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
  };

  return <Card onNext={handleNext} />;
};

export default Index;