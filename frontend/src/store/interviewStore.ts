import { create } from 'zustand';

interface InterviewQuestion {
  id: string;
  interviewId: string;
  questionOrder: number;
  category: string;
  questionText: string;
  totalQuestions: number;
}

interface InterviewState {
  currentQuestion: InterviewQuestion | null;
  setCurrentQuestion: (q: InterviewQuestion | null) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  currentQuestion: null,
  setCurrentQuestion: (q) => set({ currentQuestion: q }),
  isPaused: false,
  setIsPaused: (paused) => set({ isPaused: paused }),
}));
