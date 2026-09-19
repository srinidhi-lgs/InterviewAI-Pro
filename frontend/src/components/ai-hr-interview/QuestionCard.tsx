'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  category: string;
  difficulty: string;
}

export default function QuestionCard({ questionNumber, questionText, category, difficulty }: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionNumber}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center h-full p-8 text-center"
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
            {category}
          </span>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            difficulty.toLowerCase() === 'hard' 
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
              : difficulty.toLowerCase() === 'medium'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          }`}>
            {difficulty}
          </span>
        </div>
        
        <h2 className="text-xl font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
          Question {questionNumber}
        </h2>
        
        <p className="text-3xl sm:text-4xl font-bold leading-tight text-zinc-950 dark:text-white max-w-3xl">
          "{questionText}"
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
