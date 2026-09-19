package com.interviewai.service.settings.impl;

import com.interviewai.dto.settings.*;
import com.interviewai.entity.User;
import com.interviewai.entity.UserSettings;
import com.interviewai.mapper.SettingsMapper;
import com.interviewai.repository.UserRepository;
import com.interviewai.repository.UserSettingsRepository;
import com.interviewai.security.CurrentUserService;
import com.interviewai.service.settings.UserSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserSettingsServiceImpl implements UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;
    private final SettingsMapper settingsMapper;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;

    @Override
    @Transactional
    public UserSettingsResponse getSettings() {
        UserSettings settings = getOrCreateSettings();
        return settingsMapper.toResponse(settings);
    }

    @Override
    @Transactional
    public UserSettingsResponse updateAppearance(AppearanceUpdateRequest request) {
        UserSettings settings = getOrCreateSettings();
        settings.setTheme(request.getTheme());
        return settingsMapper.toResponse(userSettingsRepository.save(settings));
    }

    @Override
    @Transactional
    public UserSettingsResponse updateAiPreferences(AiPreferencesUpdateRequest request) {
        UserSettings settings = getOrCreateSettings();
        settings.setAiModel(request.getAiModel());
        settings.setAiTone(request.getAiTone());
        settings.setResponseLength(request.getResponseLength());
        settings.setDefaultInterviewDifficulty(request.getDefaultInterviewDifficulty());
        settings.setPreferredLanguage(request.getPreferredLanguage());
        return settingsMapper.toResponse(userSettingsRepository.save(settings));
    }

    @Override
    @Transactional
    public UserSettingsResponse updateNotifications(NotificationsUpdateRequest request) {
        UserSettings settings = getOrCreateSettings();
        settings.setEmailNotifications(request.getEmailNotifications());
        settings.setInterviewReminders(request.getInterviewReminders());
        settings.setWeeklyReports(request.getWeeklyReports());
        settings.setProductUpdates(request.getProductUpdates());
        return settingsMapper.toResponse(userSettingsRepository.save(settings));
    }

    @Override
    @Transactional
    public void updatePassword(PasswordUpdateRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }

        User currentUser = currentUserService.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteAccount() {
        User currentUser = currentUserService.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
    }

    private UserSettings getOrCreateSettings() {
        User currentUser = currentUserService.getCurrentUser();
        return userSettingsRepository.findByUserId(currentUser.getId()).orElseGet(() -> {
            User user = userRepository.findById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            UserSettings newSettings = UserSettings.builder()
                    .user(user)
                    .build();
            return userSettingsRepository.save(newSettings);
        });
    }
}
