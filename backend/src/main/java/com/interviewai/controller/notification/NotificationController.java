package com.interviewai.controller.notification;

import com.interviewai.dto.ApiResponse;
import com.interviewai.dto.notification.NotificationResponse;
import com.interviewai.dto.notification.UnreadCountResponse;
import com.interviewai.service.notification.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "User Notification Management APIs")
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "Get user notifications", description = "Returns all notifications for the authenticated user, ordered by newest first.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUserNotifications() {
        return ResponseEntity.ok(
                ApiResponse.<List<NotificationResponse>>builder()
                        .success(true)
                        .message("Notifications retrieved successfully")
                        .data(notificationService.getUserNotifications())
                        .build()
        );
    }

    @Operation(summary = "Get unread count", description = "Returns the count of unread notifications for the authenticated user.")
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<UnreadCountResponse>> getUnreadCount() {
        return ResponseEntity.ok(
                ApiResponse.<UnreadCountResponse>builder()
                        .success(true)
                        .message("Unread count retrieved successfully")
                        .data(notificationService.getUnreadCount())
                        .build()
        );
    }

    @Operation(summary = "Mark notification as read", description = "Marks a specific notification as read.")
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(@PathVariable UUID id) {
        return ResponseEntity.ok(
                ApiResponse.<NotificationResponse>builder()
                        .success(true)
                        .message("Notification marked as read")
                        .data(notificationService.markAsRead(id))
                        .build()
        );
    }

    @Operation(summary = "Mark all notifications as read", description = "Marks all unread notifications for the authenticated user as read.")
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("All notifications marked as read")
                        .data(null)
                        .build()
        );
    }
}
