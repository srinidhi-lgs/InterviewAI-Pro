import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '@/lib/api';

export interface ChatSession {
  id: string;
  title: string;
  chatMode: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'USER' | 'AI' | 'SYSTEM';
  message: string;
  messageType: 'TEXT' | 'CODE' | 'MARKDOWN';
  createdAt: string;
}

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: ChatMessage[];
  selectedMode: string;
  isLoading: boolean;
  isSending: boolean;
  searchKeyword: string;
  
  // Actions
  setSelectedMode: (mode: string) => void;
  setActiveSessionId: (id: string | null) => void;
  setSearchKeyword: (keyword: string) => void;
  
  // API Actions
  fetchSessions: (token: string) => Promise<void>;
  searchSessions: (token: string, keyword: string) => Promise<void>;
  createSession: (token: string, mode: string) => Promise<string>;
  fetchMessages: (token: string, sessionId: string) => Promise<void>;
  sendMessage: (token: string, sessionId: string, message: string, useResume: boolean, useProfile: boolean) => Promise<void>;
  renameSession: (token: string, sessionId: string, title: string) => Promise<void>;
  deleteSession: (token: string, sessionId: string) => Promise<void>;
  pinSession: (token: string, sessionId: string, isPinned: boolean) => Promise<void>;
  clearSession: (token: string, sessionId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  messages: [],
  selectedMode: 'Career Mentor',
  isLoading: false,
  isSending: false,
  searchKeyword: '',

  setSelectedMode: (mode) => set({ selectedMode: mode }),
  setActiveSessionId: (id) => set({ activeSessionId: id, messages: [] }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  fetchSessions: async (token) => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`${API_URL}/chat/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ sessions: res.data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },

  searchSessions: async (token, keyword) => {
    try {
      if (!keyword.trim()) {
        await get().fetchSessions(token);
        return;
      }
      set({ isLoading: true });
      const res = await axios.get(`${API_URL}/chat/search?keyword=${encodeURIComponent(keyword)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ sessions: res.data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },

  createSession: async (token, mode) => {
    try {
      const res = await axios.post(`${API_URL}/chat/session`, { chatMode: mode }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({ 
        sessions: [res.data, ...state.sessions],
        activeSessionId: res.data.id,
        messages: [],
        selectedMode: mode
      }));
      return res.data.id;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  fetchMessages: async (token, sessionId) => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`${API_URL}/chat/session/${sessionId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ messages: res.data, isLoading: false });
      
      // Sync selected mode from session if possible, though backend doesn't return session here directly.
      // But we can find it in sessions array
      const session = get().sessions.find(s => s.id === sessionId);
      if (session) {
        set({ selectedMode: session.chatMode });
      }
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },

  sendMessage: async (token, sessionId, message, useResume, useProfile) => {
    try {
      set({ isSending: true });
      
      // Optimistic update for user message
      const tempUserMsg: ChatMessage = {
        id: Date.now().toString(),
        sessionId,
        sender: 'USER',
        message,
        messageType: 'TEXT',
        createdAt: new Date().toISOString()
      };
      
      set((state) => ({ messages: [...state.messages, tempUserMsg] }));

      const res = await axios.post(`${API_URL}/chat/session/${sessionId}/message`, {
        message,
        useResumeContext: useResume,
        useProfileContext: useProfile,
        messageType: 'TEXT'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Note: We might need to refresh titles if it's the first message
      // and we just echo the AI response
      const aiResponse = res.data;
      
      set((state) => ({ 
        messages: [...state.messages, aiResponse],
        isSending: false 
      }));
      
      // Trigger a re-fetch of sessions in background to update title if it changed
      get().fetchSessions(token);

    } catch (err) {
      console.error(err);
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + "-error",
        sessionId,
        sender: 'AI',
        message: "Sorry, I couldn't generate a response. Please try again.",
        messageType: 'TEXT',
        createdAt: new Date().toISOString()
      };
      
      set((state) => ({ 
        messages: [...state.messages, errorMessage],
        isSending: false 
      }));
    }
  },

  renameSession: async (token, sessionId, title) => {
    try {
      const res = await axios.put(`${API_URL}/chat/session/${sessionId}/rename?title=${encodeURIComponent(title)}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        sessions: state.sessions.map(s => s.id === sessionId ? res.data : s)
      }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteSession: async (token, sessionId) => {
    try {
      await axios.delete(`${API_URL}/chat/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        sessions: state.sessions.filter(s => s.id !== sessionId),
        activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
        messages: state.activeSessionId === sessionId ? [] : state.messages
      }));
    } catch (err) {
      console.error(err);
    }
  },

  pinSession: async (token, sessionId, isPinned) => {
    try {
      const res = await axios.put(`${API_URL}/chat/session/${sessionId}/pin?isPinned=${isPinned}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        sessions: state.sessions.map(s => s.id === sessionId ? res.data : s)
      }));
    } catch (err) {
      console.error(err);
    }
  },

  clearSession: async (token, sessionId) => {
    try {
      await axios.post(`${API_URL}/chat/session/${sessionId}/clear`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (get().activeSessionId === sessionId) {
        set({ messages: [] });
      }
    } catch (err) {
      console.error(err);
    }
  }

}));
