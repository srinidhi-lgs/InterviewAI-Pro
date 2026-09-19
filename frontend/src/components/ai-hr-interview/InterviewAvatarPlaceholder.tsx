'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

interface InterviewAvatarPlaceholderProps {
  status: 'idle' | 'speaking' | 'listening' | 'thinking';
}

export default function InterviewAvatarPlaceholder({ status }: InterviewAvatarPlaceholderProps) {
  // Define animation states based on status
  const getAnimation = () => {
    switch (status) {
      case 'listening':
        return {
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
          transition: { repeat: Infinity, duration: 1.5 }
        };
      case 'speaking':
        return {
          scale: [1, 1.02, 1],
          opacity: [0.9, 1, 0.9],
          transition: { repeat: Infinity, duration: 0.5 }
        };
      case 'thinking':
        return {
          rotate: [0, 5, -5, 0],
          transition: { repeat: Infinity, duration: 2 }
        };
      default: // idle
        return {
          scale: 1,
          opacity: 0.8
        };
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'listening': return 'text-red-500 border-red-500 bg-red-500/10';
      case 'speaking': return 'text-indigo-500 border-indigo-500 bg-indigo-500/10';
      case 'thinking': return 'text-amber-500 border-amber-500 bg-amber-500/10';
      default: return 'text-zinc-500 border-zinc-500 bg-zinc-500/10';
    }
  };
  
  const getStatusLabel = () => {
    switch (status) {
      case 'listening': return 'Listening...';
      case 'speaking': return 'Speaking...';
      case 'thinking': return 'Thinking...';
      default: return 'Idle';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6">
      <div className="relative mb-6">
        {/* Pulsing background ring for active states */}
        {(status === 'listening' || status === 'speaking') && (
          <motion.div 
            className={`absolute -inset-4 rounded-full border-2 ${getStatusColor()} opacity-20`}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ repeat: Infinity, duration: status === 'speaking' ? 1 : 2 }}
          />
        )}
        
        <motion.div 
          className={`relative flex h-48 w-48 items-center justify-center rounded-full border-2 ${getStatusColor()} backdrop-blur-sm overflow-hidden`}
          animate={getAnimation()}
        >
          {/* This is where a real 3D avatar would go in the future */}
          <BrainCircuit className="h-24 w-24" />
        </motion.div>
      </div>
      
      <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor()} flex items-center gap-2`}>
        {status !== 'idle' && (
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getStatusColor().split(' ')[0]} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${getStatusColor().split(' ')[0].replace('text', 'bg')}`}></span>
          </span>
        )}
        {getStatusLabel()}
      </div>
      
      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 text-center max-w-[200px]">
        Future home of the animated AI Avatar with lip-sync and emotion analysis.
      </p>
    </div>
  );
}
