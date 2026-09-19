'use client';

import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useInterviewStore } from '@/store/interviewStore';
import { Loader2, Mic, StopCircle, Clock, CheckCircle2, Pause, Play } from 'lucide-react';

export default function ActiveInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { currentQuestion, setCurrentQuestion, isPaused, setIsPaused } = useInterviewStore();
  const unwrappedParams = use(params);
  const interviewId = unwrappedParams.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [answerText, setAnswerText] = useState('');
  
  // Timer State
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes guideline
  const [timeTaken, setTimeTaken] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  async function fetchNextQuestion() {
    setIsLoading(true);
    setAnswerText('');
    setTimeRemaining(120);
    setTimeTaken(0);
    
    try {
      const res = await axios.get(`${API_URL}/interviews/${interviewId}/question`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (res.status === 204 || !res.data) {
        // No more questions -> complete interview
        handleCompleteInterview();
      } else {
        setCurrentQuestion(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch next question", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId, accessToken]);

  useEffect(() => {
    if (isLoading || isCompleting || !currentQuestion) return;

    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
        setTimeTaken((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading, isCompleting, currentQuestion, isPaused]);

  const togglePause = async () => {
    try {
      const endpoint = isPaused ? 'resume' : 'pause';
      await axios.post(`${API_URL}/interviews/${interviewId}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setIsPaused(!isPaused);
    } catch (err) {
      console.error("Failed to toggle pause state", err);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || !currentQuestion) return;
    
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/interviews/${interviewId}/questions/${currentQuestion.id}/answer`, {
        answer: answerText,
        timeTakenSeconds: timeTaken
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      await fetchNextQuestion();
    } catch (err) {
      console.error("Failed to submit answer", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleCompleteInterview() {
    setIsCompleting(true);
    try {
      await axios.post(`${API_URL}/interviews/${interviewId}/complete`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      router.push(`/dashboard/interview/${interviewId}/report`);
    } catch (err) {
      console.error("Failed to complete interview", err);
      setIsCompleting(false);
    }
  };

  if (isLoading && !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (isCompleting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
        <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">Interview Complete!</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Generating your AI evaluation report...</p>
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400 mt-4" />
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercentage = currentQuestion 
    ? ((currentQuestion.questionOrder - 1) / currentQuestion.totalQuestions) * 100 
    : 0;

  return (
    <div className="mx-auto max-w-4xl py-6">
      {/* Header & Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              {currentQuestion?.questionOrder}
            </span>
            of {currentQuestion?.totalQuestions}
          </h1>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePause}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <div className={`flex items-center gap-2 font-mono text-lg font-medium ${timeRemaining <= 30 ? 'text-red-500 animate-pulse' : 'text-zinc-950 dark:text-white'}`}>
              <Clock className="h-5 w-5 text-zinc-400" />
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className={`rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-10 transition-opacity duration-300 ${isPaused ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          {currentQuestion?.category} Category
        </div>
        <h2 className="mb-8 text-2xl font-medium leading-relaxed text-zinc-950 dark:text-white sm:text-3xl">
          {currentQuestion?.questionText}
        </h2>

        {/* Answer Area */}
        <div className="space-y-4">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={isPaused || isSubmitting}
            placeholder="Type your answer here, or imagine you are speaking it out loud..."
            className="h-48 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-black/50 dark:text-white dark:placeholder-zinc-600"
          />
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Guideline: Aim for 2-3 paragraphs. The timer is just a recommendation.
            </p>
            <button
              onClick={handleSubmitAnswer}
              disabled={isPaused || isSubmitting || !answerText.trim()}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Submit Answer'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Full screen pause overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
          <div className="text-center">
            <Pause className="mx-auto h-16 w-16 text-white mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Interview Paused</h2>
            <button 
              onClick={togglePause}
              className="mt-6 rounded-lg bg-emerald-600 px-8 py-3 text-lg font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Resume Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
