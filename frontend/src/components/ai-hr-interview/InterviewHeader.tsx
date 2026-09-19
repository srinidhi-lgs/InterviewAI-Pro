'use client';

import React from 'react';
import Timer from './Timer';
import ProgressBar from './ProgressBar';
import { LogOut } from 'lucide-react';

interface InterviewHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  onExit: () => void;
}

export default function InterviewHeader({ currentQuestion, totalQuestions, onExit }: InterviewHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-zinc-200 bg-white/50 backdrop-blur-md p-4 dark:border-zinc-800 dark:bg-black/50 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 text-white">
            <span className="font-bold">AI</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-950 dark:text-white">HR Interview Room</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Powered by AI Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Timer isRunning={true} />
          
          <button
            onClick={onExit}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Exit Interview</span>
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <ProgressBar current={currentQuestion} total={totalQuestions} />
      </div>
    </header>
  );
}
