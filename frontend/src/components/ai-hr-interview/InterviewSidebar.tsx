'use client';

import React from 'react';
import InterviewAvatarPlaceholder from './InterviewAvatarPlaceholder';

interface InterviewSidebarProps {
  status: 'idle' | 'speaking' | 'listening' | 'thinking';
}

export default function InterviewSidebar({ status }: InterviewSidebarProps) {
  return (
    <div className="flex h-full w-full flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex-1">
        <InterviewAvatarPlaceholder status={status} />
      </div>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 text-center">
        AI Avatar Module (Placeholder)
      </div>
    </div>
  );
}
