import { create } from 'zustand';

export interface ResumeAnalysis {
  resumeId: string;
  fileName: string;
  // Summary
  candidateName?: string;
  email?: string;
  phone?: string;
  education?: string;
  createdAt?: string;
  fileSize?: number;

  // Scores
  atsScore: number;
  grammarScore: number;
  formattingScore: number;
  keywordMatchScore: number;
  completenessScore: number;
  jobMatchPercentage: number;

  // Stats
  experienceYears: number;
  projectsCount: number;
  certificatesCount: number;

  // Skills
  technicalSkills: string[];
  softSkills: string[];
  tools: string[];
  frameworks: string[];
  databases: string[];
  cloud: string[];

  // Match Analysis
  matchedKeywords: string[];
  missingKeywords: string[];
  missingSkills: string[];
  matchedSkills: string[];

  missingSections: string[];
  suggestions: string[];
}

interface ResumeState {
  latestAnalysis: ResumeAnalysis | null;
  isLoading: boolean;
  setLatestAnalysis: (analysis: ResumeAnalysis | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearAnalysis: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  latestAnalysis: null,
  isLoading: false,
  setLatestAnalysis: (analysis) => set({ latestAnalysis: analysis }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearAnalysis: () => set({ latestAnalysis: null }),
}));
