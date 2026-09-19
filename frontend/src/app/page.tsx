'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Code, LineChart } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-zinc-50 to-white dark:from-zinc-900 dark:via-black dark:to-black"></div>
        <div className="absolute top-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-200/50 via-transparent to-transparent dark:from-zinc-800/30 blur-3xl opacity-50 -z-10"></div>

        <section className="w-full max-w-5xl px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              InterviewAI V2 is now live
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white mb-8 leading-tight"
          >
            Ace your next interview with <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-600 to-zinc-950 dark:from-zinc-400 dark:to-white">AI-Powered precision.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed"
          >
            Practice real-world coding questions, system design problems, and behavioral interviews with an intelligent agent that gives you instant feedback.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-xl shadow-zinc-950/20 dark:shadow-white/10"
            >
              Start Practicing Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-zinc-900 border border-zinc-200 transition-all hover:bg-zinc-50 hover:scale-105 active:scale-95 dark:bg-black dark:text-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              Sign In
            </Link>
          </motion.div>
        </section>

        <section className="w-full max-w-6xl px-6 pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Code className="h-6 w-6 text-blue-500" />,
                title: "Live Code Execution",
                description: "Write and execute code in real-time across 15+ languages with our secure execution engine."
              },
              {
                icon: <Bot className="h-6 w-6 text-purple-500" />,
                title: "AI Interviewer",
                description: "Experience dynamic conversations that adapt to your skill level and answers."
              },
              {
                icon: <LineChart className="h-6 w-6 text-emerald-500" />,
                title: "Detailed Analytics",
                description: "Track your progress, identify weak spots, and benchmark against top candidates."
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm dark:bg-zinc-950 dark:border-zinc-800/50 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="h-12 w-12 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 mb-2">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
