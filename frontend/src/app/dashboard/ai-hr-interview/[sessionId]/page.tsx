'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import InterviewHeader from '@/components/ai-hr-interview/InterviewHeader';
import InterviewSidebar from '@/components/ai-hr-interview/InterviewSidebar';
import QuestionCard from '@/components/ai-hr-interview/QuestionCard';
import TranscriptPanel, { TranscriptEntry } from '@/components/ai-hr-interview/TranscriptPanel';
import VoiceRecorder from '@/components/ai-hr-interview/VoiceRecorder';
import AnswerInput from '@/components/ai-hr-interview/AnswerInput';
import SpeechPlayer from '@/components/ai-hr-interview/SpeechPlayer';
import CompletionDialog from '@/components/ai-hr-interview/CompletionDialog';

type AIStatus = 'idle' | 'speaking' | 'listening' | 'thinking';

export default function AIHRInterviewRoom() {
  const router = useRouter();
  const params = useParams();
  const { accessToken, isAuthenticated } = useAuthStore();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    // Wait until user authentication state is resolved before requesting session
    if (!accessToken && !isAuthenticated) return;
    fetchSession();
  }, [sessionId, accessToken, isAuthenticated]);

  const fetchSession = async () => {
    if (!sessionId) {
      console.error("Session ID is missing.");
      return;
    }
    
    try {
      const res = await api.get(`/ai-interview/session/${sessionId}`);
      setSession(res.data);
      
      if (res.data.status === 'COMPLETED') {
        setIsCompleted(true);
      } else {
        fetchNextQuestion();
      }
    } catch (err) {
      console.error("Failed to fetch session", err);
    }
  };

  const fetchNextQuestion = async () => {
    if (!sessionId) {
      console.error("Session ID is missing.");
      return;
    }

    setAiStatus('thinking');
    setIsProcessing(true);
    
    try {
      const res = await api.get(`/ai-interview/session/${sessionId}/question`);
      
      if (res.status === 204 || !res.data) {
        completeInterview();
      } else {
        setCurrentQuestion(res.data);
        setTranscript(prev => [...prev, { role: 'ai', text: res.data.question }]);
        setAiStatus('speaking'); // Trigger speech player
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Failed to fetch next question", err);
      setIsProcessing(false);
      setAiStatus('idle');
    }
  };

  const completeInterview = async () => {
    if (!sessionId) {
      console.error("Session ID is missing.");
      return;
    }

    setAiStatus('thinking');
    setIsProcessing(true);
    setIsCompleted(true);
    
    try {
      await api.post(`/ai-interview/session/${sessionId}/complete`, {});
      setIsProcessing(false);
    } catch (err) {
      console.error("Failed to complete interview", err);
      setIsProcessing(false);
    }
  };

  const submitAnswer = async (answer: string) => {
    if (!sessionId) {
      console.error("Session ID is missing.");
      return;
    }
    if (!currentQuestion || !answer.trim()) return;
    
    setTranscript(prev => [...prev, { role: 'user', text: answer }]);
    setAiStatus('thinking');
    setIsProcessing(true);
    
    try {
      await api.post(`/ai-interview/session/${sessionId}/question/${currentQuestion.id}/answer`, 
        { answer, timeTaken: 30 } // Dummy time taken for now
      );
      
      // Small delay for realism
      setTimeout(() => {
        fetchNextQuestion();
      }, 1000);
    } catch (err) {
      console.error("Failed to submit answer", err);
      setIsProcessing(false);
      setAiStatus('idle');
    }
  };

  const handleInterimTranscript = (text: string) => {
    setInterimTranscript(text);
    if (text && aiStatus !== 'listening') {
      setAiStatus('listening');
    }
  };

  const handleFinalTranscript = (text: string) => {
    setInterimTranscript('');
    submitAnswer(text);
  };

  if (!session) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="flex flex-col items-center animate-pulse">
          <div className="h-12 w-12 rounded-full bg-indigo-500/20 mb-4"></div>
          <p className="text-zinc-500">Loading Interview Room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-50 dark:bg-black overflow-hidden">
      <InterviewHeader 
        currentQuestion={currentQuestion?.questionOrder || session.numQuestions} 
        totalQuestions={session.numQuestions}
        onExit={() => setShowExitDialog(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - AI Avatar */}
        <div className="hidden lg:block w-80 shrink-0">
          <InterviewSidebar status={aiStatus} />
        </div>

        {/* Center Panel - Main Content */}
        <div className="flex flex-1 flex-col relative overflow-hidden">
          {/* Question Display */}
          <div className="flex-1 overflow-hidden">
            {currentQuestion ? (
              <QuestionCard 
                questionNumber={currentQuestion.questionOrder}
                questionText={currentQuestion.question}
                category={currentQuestion.category}
                difficulty={currentQuestion.difficulty}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500">
                Waiting for question...
              </div>
            )}
          </div>

          {/* Bottom Panel - Input */}
          <div className="shrink-0 border-t border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 sm:flex-row">
              <VoiceRecorder 
                onInterimTranscript={handleInterimTranscript}
                onFinalTranscript={handleFinalTranscript}
                isProcessing={isProcessing || isCompleted || aiStatus === 'speaking'}
              />
              <div className="flex-1 w-full">
                <AnswerInput 
                  onSubmit={submitAnswer} 
                  isProcessing={isProcessing || isCompleted || aiStatus === 'speaking'} 
                />
              </div>
            </div>
            
            {/* Hidden Speech Player */}
            {currentQuestion && (
              <div className="mt-4 flex justify-end px-4">
                <SpeechPlayer 
                  text={currentQuestion.question} 
                  onStart={() => setAiStatus('speaking')}
                  onEnd={() => setAiStatus('idle')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Transcript */}
        <div className="hidden w-80 shrink-0 border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:block">
          <div className="flex h-14 items-center border-b border-zinc-200 px-4 dark:border-zinc-800 font-semibold text-zinc-950 dark:text-white">
            Live Transcript
          </div>
          <div className="h-[calc(100%-3.5rem)]">
            <TranscriptPanel entries={transcript} interimTranscript={interimTranscript} />
          </div>
        </div>
      </div>

      <CompletionDialog 
        isOpen={isCompleted} 
        sessionId={sessionId} 
        isProcessing={isProcessing} 
      />

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">Exit Interview?</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Are you sure you want to leave? Your progress will be saved, but you'll need to resume later.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowExitDialog(false)}
                className="px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
