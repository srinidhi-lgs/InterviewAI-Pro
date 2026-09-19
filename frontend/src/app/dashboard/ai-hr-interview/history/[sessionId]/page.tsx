'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Loader2, ArrowLeft, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AIHRInterviewHistory() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!sessionId) return;
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    if (!sessionId) {
      console.error("Session ID is missing.");
      return;
    }
    
    try {
      const res = await axios.get(`${API_URL}/ai-interview/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setSession(res.data);
    } catch (err: any) {
      setError('Failed to load interview history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
        <p>{error || 'Session not found'}</p>
        <button onClick={() => router.push('/dashboard')} className="mt-4 underline">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800"
        >
          <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
            AI HR Interview Report
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {session.jobRole} • {session.experienceLevel} • {new Date(session.completedAt || session.startedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 mb-4">
            <Trophy className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Overall Score</h3>
          <p className="mt-2 text-3xl font-bold text-zinc-950 dark:text-white">{session.score || 0}/100</p>
        </div>
        
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 mb-4">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Questions Answered</h3>
          <p className="mt-2 text-3xl font-bold text-zinc-950 dark:text-white">{session.numQuestions}</p>
        </div>
        
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 mb-4">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Status</h3>
          <p className="mt-2 text-xl font-bold text-zinc-950 dark:text-white capitalize">{session.status.toLowerCase().replace('_', ' ')}</p>
        </div>
      </div>
      
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-semibold text-zinc-950 dark:text-white mb-4">Overall Feedback</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {session.feedback || "Detailed feedback will be available shortly."}
        </p>
      </div>
      
      <div className="flex justify-end">
        <Link 
          href="/dashboard/ai-hr-interview/setup"
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 shadow-sm"
        >
          Start New AI Interview
        </Link>
      </div>
    </div>
  );
}
