package com.interviewai.service.settings;

import com.interviewai.dto.settings.*;

public interface UserSettingsService {
    UserSettingsResponse getSettings();
    
    UserSettingsResponse updateAppearance(AppearanceUpdateRequest request);
    
    UserSettingsResponse updateAiPreferences(AiPreferencesUpdateRequest request);
    
    UserSettingsResponse updateNotifications(NotificationsUpdateRequest request);
    
    void updatePassword(PasswordUpdateRequest request);
    
    void deleteAccount();
}
