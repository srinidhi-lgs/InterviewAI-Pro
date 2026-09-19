import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-2xl bg-white p-6 shadow-xl shadow-zinc-200/50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none ${className}`}>
      {children}
    </div>
  );
}
