'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CompletionDialogProps {
  isOpen: boolean;
  sessionId: string;
  isProcessing?: boolean;
}

export default function CompletionDialog({ isOpen, sessionId, isProcessing = false }: CompletionDialogProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        >
          <div className="p-8 text-center flex flex-col items-center">
            {isProcessing ? (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20 mb-6">
                  <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-2">
                  Generating Report...
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Our AI is analyzing your responses. This will only take a moment.
                </p>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 mb-6">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-2">
                  Interview Completed!
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                  Great job! Your AI HR interview has been successfully completed and analyzed.
                </p>
                <button
                  onClick={() => router.push(`/dashboard/ai-hr-interview/report/${sessionId}`)}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  View Detailed Report
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
