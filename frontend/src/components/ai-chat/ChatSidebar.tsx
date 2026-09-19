import React, { useState, useMemo } from 'react';
import { useChatStore, ChatSession } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { Search, Plus, MessageSquare, Pin, MoreVertical, Trash2, Edit2, Check, X } from 'lucide-react';

export default function ChatSidebar() {
  const { accessToken } = useAuthStore();
  const { 
    sessions, 
    activeSessionId, 
    setActiveSessionId, 
    createSession, 
    searchSessions,
    renameSession,
    deleteSession,
    pinSession
  } = useChatStore();

  const [searchInput, setSearchInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (accessToken) searchSessions(accessToken, searchInput);
    }
  };

  const handleNewChat = async () => {
    if (accessToken) {
      // By default use Career Mentor
      await createSession(accessToken, 'Career Mentor');
    }
  };

  const handleRenameSave = async (id: string) => {
    if (accessToken && editTitle.trim()) {
      await renameSession(accessToken, id, editTitle);
    }
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (accessToken && window.confirm('Are you sure you want to delete this chat?')) {
      await deleteSession(accessToken, id);
    }
  };

  const handlePin = async (id: string, isPinned: boolean) => {
    if (accessToken) {
      await pinSession(accessToken, id, isPinned);
    }
  };

  // Grouping logic
  const groupedSessions = useMemo(() => {
    const groups: { [key: string]: ChatSession[] } = {
      Pinned: [],
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      'Previous Month': [],
      Older: []
    };

    const now = new Date();
    const todayStr = now.toDateString();
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    sessions.forEach(session => {
      if (session.isPinned) {
        groups.Pinned.push(session);
        return;
      }
      
      const sessionDate = new Date(session.updatedAt);
      if (sessionDate.toDateString() === todayStr) {
        groups.Today.push(session);
      } else if (sessionDate.toDateString() === yesterdayStr) {
        groups.Yesterday.push(session);
      } else if (sessionDate > sevenDaysAgo) {
        groups['Previous 7 Days'].push(session);
      } else if (sessionDate > thirtyDaysAgo) {
        groups['Previous Month'].push(session);
      } else {
        groups.Older.push(session);
      }
    });

    return groups;
  }, [sessions]);

  return (
    <div className="w-64 flex flex-col bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 h-full">
      <div className="p-4 space-y-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-6 pb-4 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
        {Object.entries(groupedSessions).map(([groupName, groupSessions]) => (
          groupSessions.length > 0 && (
            <div key={groupName}>
              <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 px-2">
                {groupName}
              </h3>
              <div className="space-y-0.5">
                {groupSessions.map(session => (
                  <div
                    key={session.id}
                    className={`group relative flex items-center gap-2.5 px-2 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      activeSessionId === session.id
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-900'
                    }`}
                    onClick={() => setActiveSessionId(session.id)}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    
                    {editingId === session.id ? (
                      <div className="flex-1 flex items-center gap-1">
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRenameSave(session.id)}
                          className="flex-1 bg-white dark:bg-zinc-950 text-sm border-zinc-300 dark:border-zinc-700 rounded px-1 w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button onClick={(e) => { e.stopPropagation(); handleRenameSave(session.id); }} className="text-green-500 hover:text-green-600">
                          <Check className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="text-red-500 hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="flex-1 truncate text-sm font-medium">
                        {session.title}
                      </span>
                    )}

                    {!editingId && (
                      <div className="hidden group-hover:flex items-center gap-1 absolute right-2 bg-gradient-to-l from-zinc-200 dark:from-zinc-800 to-transparent pl-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePin(session.id, !session.isPinned);
                          }}
                          className={`p-1 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors ${session.isPinned ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500'}`}
                          title={session.isPinned ? 'Unpin' : 'Pin'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditTitle(session.title);
                            setEditingId(session.id);
                          }}
                          className="p-1 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-500 transition-colors"
                          title="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(session.id);
                          }}
                          className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
