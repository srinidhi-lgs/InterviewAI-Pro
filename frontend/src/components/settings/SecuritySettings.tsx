'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@#$%^&+=!]/, 'Password must contain at least one special character (@#$%^&+=!)'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SecuritySettings() {
  const { toast } = useToast();
  
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const newPasswordValue = watch('newPassword') || '';

  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[@#$%^&+=!]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(newPasswordValue);
  const strengthColor = strength < 3 ? 'bg-red-500' : strength < 5 ? 'bg-yellow-500' : 'bg-green-500';

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      setIsSaving(true);
      // Wait, updatePassword isn't exposed properly? No it's in settingsApi.ts, wait updatePassword is not in useSettingsStore. 
      // Ah, I need to call settingsApi directly or add it to store. I added it to store?
      // No, wait, in useSettingsStore I didn't add updatePassword. I will import it from API.
      const settingsApi = await import('../../lib/settingsApi');
      await settingsApi.updatePassword(data);
      
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      reset();
    } catch (err) {
      const error = err as any;
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password',
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
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          Security
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update your password and secure your account.
        </p>
      </div>
      <div className="h-px bg-gray-200 dark:bg-gray-800" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        
        {/* Current Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register('currentPassword')}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword.message}</p>}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register('newPassword')}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
          
          {/* Strength Meter */}
          {newPasswordValue && (
            <div className="pt-2 space-y-1">
              <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 rounded-full ${level <= strength ? strengthColor : 'bg-gray-200 dark:bg-gray-800'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {strength < 3 ? 'Weak' : strength < 5 ? 'Fair' : 'Strong'}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
