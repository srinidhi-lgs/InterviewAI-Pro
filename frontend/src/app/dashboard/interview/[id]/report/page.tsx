'use client';

import { useEffect, useState, use } from 'react';
import axios from 'axios';
import { API_URL } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Loader2, TrendingUp, TrendingDown, Target, Zap, CheckCircle2, MessageSquare, Code } from 'lucide-react';
import Link from 'next/link';

interface InterviewResult {
  interviewId: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export default function InterviewReportPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const interviewId = unwrappedParams.id;
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${API_URL}/interviews/${interviewId}/report`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setResult(res.data);
      } catch (err: any) {
        setError('Failed to load interview report');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [interviewId, accessToken]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-500/10 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
          AI Interview Report
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Detailed heuristic breakdown of your mock interview performance.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            Overall Score
          </div>
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-zinc-50 dark:bg-black">
            <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="fill-none stroke-zinc-200 stroke-[8] dark:stroke-zinc-800" />
              <circle
                cx="50" cy="50" r="40"
                className="fill-none stroke-emerald-500 stroke-[8]"
                strokeDasharray={`${(result.overallScore / 100) * 251.2} 251.2`}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-3xl font-bold text-zinc-950 dark:text-white">{result.overallScore}%</span>
          </div>
        </div>

        {/* Technical Score */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-blue-500 mb-4">
            <Code className="h-4 w-4" /> Technical
          </div>
          <div className="text-5xl font-bold text-zinc-950 dark:text-white">{result.technicalScore}%</div>
          <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            Accuracy and completeness of your technical answers.
          </div>
        </div>

        {/* Communication Score */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-purple-500 mb-4">
            <MessageSquare className="h-4 w-4" /> Communication
          </div>
          <div className="text-5xl font-bold text-zinc-950 dark:text-white">{result.communicationScore}%</div>
          <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            Clarity, length, and structure of behavioral answers.
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Strengths */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900/50 dark:bg-emerald-900/10">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-400">
            <TrendingUp className="h-5 w-5" /> Key Strengths
          </h3>
          <ul className="space-y-3">
            {result.strengths.length > 0 ? result.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {str}
              </li>
            )) : <li className="text-sm text-zinc-500">No specific strengths detected in this session.</li>}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 dark:border-rose-900/50 dark:bg-rose-900/10">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-rose-800 dark:text-rose-400">
            <TrendingDown className="h-5 w-5" /> Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {result.weaknesses.length > 0 ? result.weaknesses.map((weak, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                {weak}
              </li>
            )) : <li className="text-sm text-zinc-500">No major weaknesses detected. Great job!</li>}
          </ul>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-zinc-950 dark:text-white">
          <Zap className="h-5 w-5 text-amber-500" /> Actionable Advice
        </h3>
        <div className="space-y-4">
          {result.suggestions.length > 0 ? result.suggestions.map((sug, i) => (
            <div key={i} className="rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
              {sug}
            </div>
          )) : <div className="text-sm text-zinc-500">Keep practicing!</div>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Link 
          href="/dashboard"
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
