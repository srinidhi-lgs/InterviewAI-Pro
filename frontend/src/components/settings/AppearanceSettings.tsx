'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
});

type AppearanceFormValues = z.infer<typeof schema>;

export default function AppearanceSettings() {
  const { settings, updateAppearance } = useSettingsStore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const { register, handleSubmit, watch } = useForm<AppearanceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      theme: (settings?.theme as 'system' | 'light' | 'dark') || 'system',
    },
  });

  const selectedTheme = watch('theme');

  const onSubmit = async (data: AppearanceFormValues) => {
    try {
      setIsSaving(true);
      await updateAppearance(data);
      // Depending on the app, you'd apply the theme to document element here.
      if (data.theme === 'dark' || (data.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      toast({
        title: 'Appearance Updated',
        description: 'Your theme preference has been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update appearance',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Customize how the application looks on your device.
        </p>
      </div>
      <div className="h-px bg-gray-200 dark:bg-gray-800" />
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-medium">Theme</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
            {/* System Theme */}
            <label
              className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center gap-3 transition-colors ${
                selectedTheme === 'system'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 hover:border-indigo-200 dark:border-gray-800 dark:hover:border-indigo-800'
              }`}
            >
              <input type="radio" value="system" className="sr-only" {...register('theme')} />
              <Monitor className={`w-8 h-8 ${selectedTheme === 'system' ? 'text-indigo-600' : 'text-gray-500'}`} />
              <span className="font-medium text-sm">System</span>
            </label>

            {/* Light Theme */}
            <label
              className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center gap-3 transition-colors ${
                selectedTheme === 'light'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 hover:border-indigo-200 dark:border-gray-800 dark:hover:border-indigo-800'
              }`}
            >
              <input type="radio" value="light" className="sr-only" {...register('theme')} />
              <Sun className={`w-8 h-8 ${selectedTheme === 'light' ? 'text-indigo-600' : 'text-gray-500'}`} />
              <span className="font-medium text-sm">Light</span>
            </label>

            {/* Dark Theme */}
            <label
              className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center gap-3 transition-colors ${
                selectedTheme === 'dark'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 hover:border-indigo-200 dark:border-gray-800 dark:hover:border-indigo-800'
              }`}
            >
              <input type="radio" value="dark" className="sr-only" {...register('theme')} />
              <Moon className={`w-8 h-8 ${selectedTheme === 'dark' ? 'text-indigo-600' : 'text-gray-500'}`} />
              <span className="font-medium text-sm">Dark</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Appearance'}
        </button>
      </form>
    </div>
  );
}
