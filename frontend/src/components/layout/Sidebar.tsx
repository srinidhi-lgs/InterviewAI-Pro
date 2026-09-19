'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  FileText,
  PenTool,
  Video,
  Mic,
  MessageSquare,
  History,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Resume Analyzer', href: '/dashboard/analyzer', icon: FileText },
  { name: 'AI Resume Builder', href: '/dashboard/resume-builder', icon: PenTool },
  { name: 'Mock Interview', href: '/dashboard/interview/setup', icon: Video },
  { name: 'AI HR Interview', href: '/dashboard/ai-hr-interview/setup', icon: Mic },
  { name: 'AI Chat', href: '/dashboard/ai-chat', icon: MessageSquare },
  { name: 'Interview History', href: '/dashboard/interviews', icon: History },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black hidden md:flex flex-col h-screen sticky top-0 z-40">
      <div className="flex h-16 items-center px-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
            <span className="font-bold">AI</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">InterviewAI</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-zinc-950 dark:text-white'
                  : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 rounded-lg bg-zinc-100 dark:bg-zinc-900"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="relative h-5 w-5 z-10" />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
          suppressHydrationWarning
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
