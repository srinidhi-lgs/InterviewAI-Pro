'use client';

import Link from 'next/link';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, logout, email } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/70 backdrop-blur-md dark:border-zinc-800 dark:bg-black/70 transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
            <span className="font-bold">AI</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">InterviewAI</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-zinc-500 sm:block">{email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
