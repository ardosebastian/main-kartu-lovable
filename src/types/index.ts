export interface Question {
  type: "question" | "challenge";
  text: string;
  hasTimer: boolean;
  duration?: number;
  level: 1 | 2 | 3;
}

export type LevelInfo = {
  id: 1 | 2 | 3;
  name: string;
  description: string;
}