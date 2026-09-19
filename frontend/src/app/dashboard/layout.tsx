'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/layout/Sidebar';
import { Loader2, Search } from 'lucide-react';
import NotificationDropdown from '@/components/layout/NotificationDropdown';
import axios from 'axios';
import { API_URL } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setAuth, email, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        setIsLoading(false);
        return;
      }
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        router.push('/login');
        return;
      }

      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken, userId, email: userEmail, roles } = res.data.data;
        
        localStorage.setItem('refreshToken', newRefreshToken);
        setAuth({ accessToken, userId, email: userEmail, roles });
        setIsLoading(false);
      } catch (error) {
        logout();
        router.push('/login');
      }
    };

    checkAuth();
  }, [isAuthenticated, router, setAuth, logout]);

  const pathname = usePathname();
  const isActiveInterview = pathname?.match(/\/dashboard\/interview\/[0-9a-fA-F-]+$/) && !pathname?.includes('/report');

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-950 dark:text-white" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (isActiveInterview) {
    return (
      <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/70 px-4 sm:px-8 backdrop-blur-md dark:border-zinc-800 dark:bg-black/70">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Search className="h-5 w-5" />
            <span className="hidden sm:inline-block text-sm">Search anywhere...</span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="flex items-center gap-3 border-l border-zinc-200 pl-4 dark:border-zinc-800">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-zinc-950 dark:text-white">{email?.split('@')[0]}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{email}</span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-white dark:bg-white dark:text-black">
                <span className="text-sm font-medium">{email?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
