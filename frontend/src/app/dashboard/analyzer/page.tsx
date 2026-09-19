'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore } from '@/store/resumeStore';
import ResumeUpload from '@/components/resume/ResumeUpload';
import ResumeAnalysisView from '@/components/resume/ResumeAnalysis';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '@/lib/api';

export default function AnalyzerPage() {
  const { accessToken } = useAuthStore();
  const { latestAnalysis, setLatestAnalysis, isLoading, setIsLoading } = useResumeStore();
  const [init, setInit] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      if (!accessToken) return;
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL}/resume/latest`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.data.data) {
          setLatestAnalysis(res.data.data);
        } else {
          setLatestAnalysis(null);
        }
      } catch (error) {
        console.error('Failed to fetch latest resume:', error);
      } finally {
        setIsLoading(false);
        setInit(true);
      }
    };
    
    fetchLatest();
  }, [accessToken, setLatestAnalysis, setIsLoading]);

  if (!init || isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Resume Analyzer
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Upload your resume to get an ATS compatibility score, formatting feedback, and AI-driven suggestions.
        </p>
      </div>

      {!latestAnalysis ? (
        <ResumeUpload onUploadComplete={(analysis) => setLatestAnalysis(analysis)} />
      ) : (
        <ResumeAnalysisView 
          analysis={latestAnalysis} 
          onDelete={() => setLatestAnalysis(null)} 
        />
      )}
    </div>
  );
}
