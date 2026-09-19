'use client';

import React, { useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useAuthStore } from '@/store/authStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, fetchSettings } = useSettingsStore();
  const { accessToken } = useAuthStore();

  // Fetch settings on initial load if authenticated
  useEffect(() => {
    if (accessToken) {
      fetchSettings().catch(console.error);
    }
  }, [fetchSettings, accessToken]);

  useEffect(() => {
    const theme = settings?.theme || 'system';
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'dark') {
      applyTheme(true);
    } else if (theme === 'light') {
      applyTheme(false);
    } else {
      // system
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };
      
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings?.theme]);

  return <>{children}</>;
}
