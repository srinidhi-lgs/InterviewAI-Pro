'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'next/navigation';

const schema = z.object({
  confirmText: z.string().refine((val) => val === 'DELETE', {
    message: "You must type DELETE to confirm",
  }),
});

export default function DangerZone() {
  const { toast } = useToast();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async () => {
    try {
      setIsDeleting(true);
      const settingsApi = await import('../../lib/settingsApi');
      await settingsApi.deleteAccount();
      
      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted.',
      });
      
      logout();
      router.push('/login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete account',
        variant: 'destructive',
      });
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2 text-red-600 dark:text-red-500">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Irreversible and destructive actions.
        </p>
      </div>
      <div className="h-px bg-red-200 dark:bg-red-900/30" />

      <div className="p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50 dark:bg-red-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-2xl">
        <div>
          <h4 className="text-sm font-medium text-red-900 dark:text-red-400">Delete Account</h4>
          <p className="text-sm text-red-700 dark:text-red-500/80 mt-1">
            Permanently remove your account and all associated data. This action cannot be undone.
          </p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
        >
          Delete Account
        </button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-medium">Delete Account</h3>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </p>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-sm text-red-800 dark:text-red-300">
              Please type <strong>DELETE</strong> to confirm.
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="DELETE"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 uppercase"
                  {...register('confirmText')}
                />
                {errors.confirmText && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmText.message as string}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
