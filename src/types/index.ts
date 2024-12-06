export interface Question {
  type: "question" | "challenge";
  text: string;
  hasTimer: boolean;
  duration?: number;
}