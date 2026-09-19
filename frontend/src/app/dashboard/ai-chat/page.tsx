'use client';

import React, { useEffect } from 'react';
import ChatSidebar from '@/components/ai-chat/ChatSidebar';
import ChatWindow from '@/components/ai-chat/ChatWindow';
import ChatContextPanel from '@/components/ai-chat/ChatContextPanel';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';

export default function AiChatPage() {
  const { accessToken } = useAuthStore();
  const { fetchSessions } = useChatStore();

  useEffect(() => {
    if (accessToken) {
      fetchSessions(accessToken);
    }
  }, [accessToken, fetchSessions]);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
      {/* 3-Column Layout */}
      <ChatSidebar />
      <div className="flex-1 flex flex-col relative h-full">
        <ChatWindow />
      </div>
      <ChatContextPanel />
    </div>
  );
}
