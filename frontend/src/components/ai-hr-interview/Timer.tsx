'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  isRunning: boolean;
}

export default function Timer({ isRunning }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 font-mono text-lg font-medium text-zinc-700 dark:text-zinc-300">
      <Clock className="h-5 w-5 text-zinc-400" />
      {formatTime(seconds)}
    </div>
  );
}
