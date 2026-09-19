'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface AnswerInputProps {
  onSubmit: (text: string) => void;
  isProcessing: boolean;
}

export default function AnswerInput({ onSubmit, isProcessing }: AnswerInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isProcessing) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isProcessing}
          placeholder="Or type your answer here..."
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white p-4 pr-12 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          rows={3}
        />
        <button
          type="submit"
          disabled={!text.trim() || isProcessing}
          className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        You can use voice recording or type your answer above.
      </p>
    </form>
  );
}
