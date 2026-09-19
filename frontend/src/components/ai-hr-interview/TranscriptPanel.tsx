'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface TranscriptEntry {
  role: 'ai' | 'user';
  text: string;
}

interface TranscriptPanelProps {
  entries: TranscriptEntry[];
  interimTranscript?: string;
}

export default function TranscriptPanel({ entries, interimTranscript }: TranscriptPanelProps) {
  const endOfListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfListRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Live transcript will appear here once the interview starts.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-4 overflow-y-auto custom-scrollbar">
      <div className="space-y-4">
        {entries.map((entry, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: entry.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                entry.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-bl-none'
              }`}
            >
              <div className="font-semibold text-xs mb-1 opacity-75">
                {entry.role === 'user' ? 'You' : 'AI Assistant'}
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{entry.text}</p>
            </div>
          </motion.div>
        ))}
        {interimTranscript && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-end"
          >
            <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-indigo-600/50 text-white rounded-br-none">
              <div className="font-semibold text-xs mb-1 opacity-75">
                You (Listening...)
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{interimTranscript}</p>
            </div>
          </motion.div>
        )}
        <div ref={endOfListRef} className="h-4" />
      </div>
    </div>
  );
}
