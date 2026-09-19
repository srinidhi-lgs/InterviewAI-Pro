import { api } from './api';

export interface UserSettingsResponse {
  theme: string;
  aiModel: string;
  aiTone: string;
  responseLength: string;
  defaultInterviewDifficulty: string;
  preferredLanguage: string;
  emailNotifications: boolean;
  interviewReminders: boolean;
  weeklyReports: boolean;
  productUpdates: boolean;
}

export interface AppearanceUpdateRequest {
  theme: string;
}

export interface AiPreferencesUpdateRequest {
  aiModel: string;
  aiTone: string;
  responseLength: string;
  defaultInterviewDifficulty: string;
  preferredLanguage: string;
}

export interface NotificationsUpdateRequest {
  emailNotifications: boolean;
  interviewReminders: boolean;
  weeklyReports: boolean;
  productUpdates: boolean;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data.data as UserSettingsResponse;
};

export const updateAppearance = async (data: AppearanceUpdateRequest) => {
  const response = await api.put('/settings/appearance', data);
  return response.data.data as UserSettingsResponse;
};

export const updateAiPreferences = async (data: AiPreferencesUpdateRequest) => {
  const response = await api.put('/settings/ai', data);
  return response.data.data as UserSettingsResponse;
};

export const updateNotifications = async (data: NotificationsUpdateRequest) => {
  const response = await api.put('/settings/notifications', data);
  return response.data.data as UserSettingsResponse;
};

export const updatePassword = async (data: PasswordUpdateRequest) => {
  const response = await api.put('/settings/password', data);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete('/settings/account');
  return response.data;
};
