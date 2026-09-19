'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Calendar, Briefcase, ChevronRight, Target } from 'lucide-react';
import Link from 'next/link';

interface InterviewHistoryItem {
  id: string;
  jobRole: string;
  experienceLevel: string;
  interviewType: string;
  difficulty: string;
  numQuestions: number;
  status: string;
  createdAt: string;
}

export default function InterviewHistoryPage() {
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/interviews/history`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setHistory(res.data.content || res.data); // Support Page<T> or List<T>
      } catch (err) {
        setError('Failed to load interview history');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Interview History
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Review your past mock interviews and track your progress.
          </p>
        </div>
        <Link 
          href="/dashboard/interview/setup"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          New Interview
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      {history.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <Target className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <h3 className="text-lg font-medium text-zinc-950 dark:text-white">No interviews yet</h3>
          <p className="mt-2 text-zinc-500">Take your first mock interview to get an AI evaluation!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <Link
              href={item.status === 'COMPLETED' ? `/dashboard/interview/${item.id}/report` : `/dashboard/interview/${item.id}`}
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 hover:border-emerald-500 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-950 dark:text-white">{item.jobRole}</h3>
                  <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{item.interviewType}</span>
                    <span>•</span>
                    <span>{item.difficulty}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                  {item.status}
                </span>
                <ChevronRight className="h-5 w-5 text-zinc-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
