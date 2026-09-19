'use client';

import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / total) * 100));

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
        <span>Progress</span>
        <span>{current} of {total}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
