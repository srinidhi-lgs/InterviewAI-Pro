package com.interviewai.controller.settings;

import com.interviewai.dto.ApiResponse;
import com.interviewai.dto.settings.*;
import com.interviewai.service.settings.UserSettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
@Tag(name = "User Settings", description = "User Settings and Preferences APIs")
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    @Operation(summary = "Get user settings", description = "Returns the authenticated user's settings. Creates default settings if they don't exist.")
    @GetMapping
    public ResponseEntity<ApiResponse<UserSettingsResponse>> getSettings() {
        return ResponseEntity.ok(
                ApiResponse.<UserSettingsResponse>builder()
                        .success(true)
                        .message("Settings retrieved successfully")
                        .data(userSettingsService.getSettings())
                        .build()
        );
    }

    @Operation(summary = "Update appearance settings", description = "Updates theme preferences.")
    @PutMapping("/appearance")
    public ResponseEntity<ApiResponse<UserSettingsResponse>> updateAppearance(@Valid @RequestBody AppearanceUpdateRequest request) {
        return ResponseEntity.ok(
                ApiResponse.<UserSettingsResponse>builder()
                        .success(true)
                        .message("Appearance updated successfully")
                        .data(userSettingsService.updateAppearance(request))
                        .build()
        );
    }

    @Operation(summary = "Update AI preferences", description = "Updates default AI model, tone, and language.")
    @PutMapping("/ai")
    public ResponseEntity<ApiResponse<UserSettingsResponse>> updateAiPreferences(@Valid @RequestBody AiPreferencesUpdateRequest request) {
        return ResponseEntity.ok(
                ApiResponse.<UserSettingsResponse>builder()
                        .success(true)
                        .message("AI preferences updated successfully")
                        .data(userSettingsService.updateAiPreferences(request))
                        .build()
        );
    }

    @Operation(summary = "Update notification preferences", description = "Updates email and push notification settings.")
    @PutMapping("/notifications")
    public ResponseEntity<ApiResponse<UserSettingsResponse>> updateNotifications(@Valid @RequestBody NotificationsUpdateRequest request) {
        return ResponseEntity.ok(
                ApiResponse.<UserSettingsResponse>builder()
                        .success(true)
                        .message("Notification preferences updated successfully")
                        .data(userSettingsService.updateNotifications(request))
                        .build()
        );
    }

    @Operation(summary = "Change password", description = "Validates current password and updates to a new one.")
    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(@Valid @RequestBody PasswordUpdateRequest request) {
        userSettingsService.updatePassword(request);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Password updated successfully")
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Delete account", description = "Soft deletes the user account.")
    @DeleteMapping("/account")
    public ResponseEntity<ApiResponse<Void>> deleteAccount() {
        userSettingsService.deleteAccount();
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Account deleted successfully")
                        .data(null)
                        .build()
        );
    }
}
