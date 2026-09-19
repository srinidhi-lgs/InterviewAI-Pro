'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError('');
      const response = await api.post('/auth/register', data);
      const { accessToken, refreshToken, userId, email, roles } = response.data.data;
      
      localStorage.setItem('refreshToken', refreshToken);
      setAuth({ accessToken, userId, email, roles });
      
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as any;
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-zinc-200/50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Create an account</h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Join InterviewAI and start practicing</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-300">Email address</label>
              <input
                {...register('email')}
                type="email"
                className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent dark:border-zinc-800 dark:focus:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="you@example.com"
                suppressHydrationWarning
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-300">Password</label>
              <input
                {...register('password')}
                type="password"
                className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent dark:border-zinc-800 dark:focus:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
                suppressHydrationWarning
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-300">Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent dark:border-zinc-800 dark:focus:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
                suppressHydrationWarning
              />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-md bg-zinc-950 h-10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              suppressHydrationWarning
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Already have an account? </span>
            <Link href="/login" className="font-medium text-zinc-950 hover:underline dark:text-white">
              Sign in
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
