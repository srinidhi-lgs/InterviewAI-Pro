package com.interviewai.dto.settings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsResponse {
    private String theme;
    private String aiModel;
    private String aiTone;
    private String responseLength;
    private String defaultInterviewDifficulty;
    private String preferredLanguage;
    private Boolean emailNotifications;
    private Boolean interviewReminders;
    private Boolean weeklyReports;
    private Boolean productUpdates;
}
