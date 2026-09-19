'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Target, Briefcase, Zap, Brain } from 'lucide-react';

export default function InterviewSetupPage() {
  const [jobRole, setJobRole] = useState('Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState('1-3 Years');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await axios.post(
        `${API_URL}/interviews/setup`,
        {
          jobRole,
          experienceLevel,
          interviewType,
          difficulty,
          numQuestions
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const interviewId = res.data.id;
      router.push(`/dashboard/interview/${interviewId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to setup interview. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
          Setup Mock Interview
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Customize your AI interview environment to match your target role.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <form onSubmit={handleStart} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-200 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-emerald-500" /> Job Role
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-200 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" /> Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              >
                <option value="Fresher">Fresher (0 Years)</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-200 flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" /> Interview Type
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              >
                <option value="Technical">Technical (Coding / Concepts)</option>
                <option value="HR">HR / Behavioral</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-200 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-200">Number of Questions</label>
              <input
                type="range"
                min="3"
                max="15"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {numQuestions} Questions
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Preparing AI Environment...
              </>
            ) : (
              'Start Mock Interview'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
