export interface LevelInfo {
  id: 1 | 2 | 3;
  name: string;
  description: string;
}

export interface Question {
  type: 'question' | 'challenge';
  text: string;
  hasTimer: boolean;
  level: 1 | 2 | 3;
  duration?: number;
}