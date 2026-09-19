package com.interviewai.dto.settings;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationsUpdateRequest {
    @NotNull(message = "emailNotifications flag cannot be null")
    private Boolean emailNotifications;
    
    @NotNull(message = "interviewReminders flag cannot be null")
    private Boolean interviewReminders;
    
    @NotNull(message = "weeklyReports flag cannot be null")
    private Boolean weeklyReports;
    
    @NotNull(message = "productUpdates flag cannot be null")
    private Boolean productUpdates;
}
