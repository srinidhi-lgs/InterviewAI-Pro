import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  email: string | null;
  roles: string[];
  isAuthenticated: boolean;
  setAuth: (data: { accessToken: string; userId: string; email: string; roles: string[] }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userId: null,
  email: null,
  roles: [],
  isAuthenticated: false,
  setAuth: (data) =>
    set({
      accessToken: data.accessToken,
      userId: data.userId,
      email: data.email,
      roles: data.roles,
      isAuthenticated: true,
    }),
  logout: () => {
    localStorage.removeItem('refreshToken');
    set({
      accessToken: null,
      userId: null,
      email: null,
      roles: [],
      isAuthenticated: false,
    });
  },
}));
