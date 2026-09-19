'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useToast } from '@/hooks/use-toast';
import { Bot } from 'lucide-react';

const schema = z.object({
  aiModel: z.string().min(1, 'Model is required'),
  aiTone: z.string().min(1, 'Tone is required'),
  responseLength: z.string().min(1, 'Response length is required'),
  defaultInterviewDifficulty: z.string().min(1, 'Difficulty is required'),
  preferredLanguage: z.string().min(1, 'Language is required'),
});

type AiFormValues = z.infer<typeof schema>;

export default function AiPreferences() {
  const { settings, updateAiPreferences } = useSettingsStore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AiFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      aiModel: settings?.aiModel || 'gemini-2.5-flash',
      aiTone: settings?.aiTone || 'professional',
      responseLength: settings?.responseLength || 'medium',
      defaultInterviewDifficulty: settings?.defaultInterviewDifficulty || 'medium',
      preferredLanguage: settings?.preferredLanguage || 'English',
    },
  });

  const onSubmit = async (data: AiFormValues) => {
    try {
      setIsSaving(true);
      await updateAiPreferences(data);
      toast({
        title: 'Preferences Updated',
        description: 'Your AI configuration has been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update preferences',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-600" />
          AI Preferences
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configure how the AI assistant interacts with you across the application.
        </p>
      </div>
      <div className="h-px bg-gray-200 dark:bg-gray-800" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Model */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Default AI Model</label>
            <select
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register('aiModel')}
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              <option value="gpt-4o">GPT-4o (Coming Soon)</option>
            </select>
            {errors.aiModel && <p className="text-sm text-red-500">{errors.aiModel.message}</p>}
          </div>

          {/* AI Tone */}
          <div className="space-y-2">
            <label className="text-sm font-medium">AI Tone</label>
            <select
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register('aiTone')}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="strict">Strict Interviewer</option>
            </select>
            {errors.aiTone && <p className="text-sm text-red-500">{errors.aiTone.message}</p>}
          </div>

          {/* Response Length */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Response Length</label>
            <select
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register('responseLength')}
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="detailed">Detailed</option>
            </select>
            {errors.responseLength && <p className="text-sm text-red-500">{errors.responseLength.message}</p>}
          </div>

          {/* Default Difficulty */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Interview Difficulty</label>
            <select
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register('defaultInterviewDifficulty')}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            {errors.defaultInterviewDifficulty && <p className="text-sm text-red-500">{errors.defaultInterviewDifficulty.message}</p>}
          </div>

          {/* Preferred Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Language</label>
            <select
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register('preferredLanguage')}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Hindi">Hindi</option>
            </select>
            {errors.preferredLanguage && <p className="text-sm text-red-500">{errors.preferredLanguage.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
}
