import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as settingsApi from '../lib/settingsApi';
import { UserSettingsResponse } from '../lib/settingsApi';

interface SettingsState {
  settings: UserSettingsResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateAppearance: (data: settingsApi.AppearanceUpdateRequest) => Promise<void>;
  updateAiPreferences: (data: settingsApi.AiPreferencesUpdateRequest) => Promise<void>;
  updateNotifications: (data: settingsApi.NotificationsUpdateRequest) => Promise<void>;
  clearSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: null,
      isLoading: false,
      error: null,
      
      fetchSettings: async () => {
        set({ isLoading: true, error: null });
        try {
          const settings = await settingsApi.getSettings();
          set({ settings, isLoading: false });
        } catch (err) {
          const error = err as any;
          set({ error: error.message || 'Failed to fetch settings', isLoading: false });
        }
      },
      
      updateAppearance: async (data) => {
        try {
          const settings = await settingsApi.updateAppearance(data);
          set({ settings });
        } catch (err) {
          const error = err as any;
          throw new Error(error.response?.data?.message || 'Failed to update appearance');
        }
      },
      
      updateAiPreferences: async (data) => {
        try {
          const settings = await settingsApi.updateAiPreferences(data);
          set({ settings });
        } catch (err) {
          const error = err as any;
          throw new Error(error.response?.data?.message || 'Failed to update AI preferences');
        }
      },
      
      updateNotifications: async (data) => {
        try {
          const settings = await settingsApi.updateNotifications(data);
          set({ settings });
        } catch (err) {
          const error = err as any;
          throw new Error(error.response?.data?.message || 'Failed to update notification settings');
        }
      },

      clearSettings: () => {
        set({ settings: null, error: null, isLoading: false });
      }
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({ settings: state.settings }), // Persist only settings
    }
  )
);
