'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

const schema = z.object({
  emailNotifications: z.boolean(),
  interviewReminders: z.boolean(),
  weeklyReports: z.boolean(),
  productUpdates: z.boolean(),
});

type NotificationFormValues = z.infer<typeof schema>;

export default function NotificationSettings() {
  const { settings, updateNotifications } = useSettingsStore();
  const { toast } = useToast();

  const { register, watch } = useForm<NotificationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailNotifications: settings?.emailNotifications ?? true,
      interviewReminders: settings?.interviewReminders ?? true,
      weeklyReports: settings?.weeklyReports ?? true,
      productUpdates: settings?.productUpdates ?? false,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const formValues = watch();

  // Auto-save effect
  React.useEffect(() => {
    const saveSettings = async () => {
      // Don't save if settings haven't loaded yet
      if (!settings) return;
      
      try {
        await updateNotifications(formValues);
      } catch (err) {
        const error = err as any;
        toast({
          title: 'Error',
          description: error.message || 'Failed to update notification settings',
          variant: 'destructive',
        });
      }
    };
    
    const timeoutId = setTimeout(saveSettings, 1000);
    return () => clearTimeout(timeoutId);
  }, [formValues, updateNotifications, toast, settings]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          Notifications
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Choose what you want to be notified about. Changes save automatically.
        </p>
      </div>
      <div className="h-px bg-gray-200 dark:bg-gray-800" />

      <div className="space-y-6 max-w-xl">
        
        {/* Toggle Items */}
        {[
          { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive important account updates via email.' },
          { id: 'interviewReminders', label: 'Interview Reminders', description: 'Get reminded about your upcoming mock interviews.' },
          { id: 'weeklyReports', label: 'Weekly Progress Reports', description: 'Receive a summary of your performance every week.' },
          { id: 'productUpdates', label: 'Product Updates', description: 'Be the first to know about new features and tools.' },
        ].map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                {item.label}
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id={item.id}
                  className="sr-only peer"
                  {...register(item.id as keyof NotificationFormValues)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
