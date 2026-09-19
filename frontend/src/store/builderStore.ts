import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gpa: string;
  description: string;
  orderIndex?: number;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  orderIndex?: number;
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  url: string;
  technologies: string;
  orderIndex?: number;
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  proficiency: string;
  orderIndex?: number;
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  url: string;
  orderIndex?: number;
}

export interface BuilderResume {
  id?: string;
  title: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  themeColor: string;
  templateName: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  updatedAt?: string;
}

interface BuilderState {
  currentResume: BuilderResume;
  isSaving: boolean;
  lastSaved: Date | null;
  setCurrentResume: (resume: BuilderResume) => void;
  updateField: (field: keyof BuilderResume, value: any) => void;
  setSaving: (isSaving: boolean) => void;
  setLastSaved: (date: Date) => void;
  reset: () => void;
}

const defaultResume: BuilderResume = {
  title: 'Untitled Resume',
  fullName: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  summary: '',
  themeColor: 'emerald',
  templateName: 'modern',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
};

export const useBuilderStore = create<BuilderState>()(
  devtools(
    persist(
      (set) => ({
        currentResume: { ...defaultResume },
        isSaving: false,
        lastSaved: null,
        setCurrentResume: (resume) => set({ currentResume: resume }),
        updateField: (field, value) =>
          set((state) => ({
            currentResume: {
              ...state.currentResume,
              [field]: value,
            },
          })),
        setSaving: (isSaving) => set({ isSaving }),
        setLastSaved: (date) => set({ lastSaved: date }),
        reset: () => set({ currentResume: { ...defaultResume }, lastSaved: null }),
      }),
      {
        name: 'resume-builder-storage',
      }
    )
  )
);
