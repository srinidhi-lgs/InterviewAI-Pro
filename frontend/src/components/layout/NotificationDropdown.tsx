'use client';

import React, { useEffect, useRef } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Bell, Check, FileText, MonitorPlay, Settings, ShieldAlert, CheckCircle2, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationDropdown() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    isOpen, 
    fetchNotifications, 
    fetchUnreadCount, 
    markAsRead, 
    markAllAsRead, 
    togglePanel, 
    closePanel 
  } = useNotificationStore();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closePanel();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closePanel]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'RESUME': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'INTERVIEW': return <MonitorPlay className="h-5 w-5 text-purple-500" />;
      case 'ATS': return <CheckSquare className="h-5 w-5 text-green-500" />;
      case 'SECURITY': return <ShieldAlert className="h-5 w-5 text-red-500" />;
      default: return <Settings className="h-5 w-5 text-zinc-500" />;
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 172800) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={togglePanel}
        className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-black">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden z-50"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
              <h3 className="font-semibold text-zinc-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center space-y-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full animate-bounce delay-150"></div>
                  </div>
                  <span className="text-sm text-zinc-500">Loading notifications...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="rounded-full bg-zinc-100 dark:bg-zinc-900 p-3 mb-3">
                    <CheckCircle2 className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <p className="font-medium text-zinc-900 dark:text-white">You're all caught up!</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">No new notifications.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-default ${!notification.isRead ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm font-medium truncate ${!notification.isRead ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                            {notification.title}
                          </p>
                          <span className="text-xs text-zinc-500 whitespace-nowrap flex-shrink-0">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 line-clamp-2 ${!notification.isRead ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-500 dark:text-zinc-400'}`}>
                          {notification.message}
                        </p>
                        {!notification.isRead && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mt-2 flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" /> Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
