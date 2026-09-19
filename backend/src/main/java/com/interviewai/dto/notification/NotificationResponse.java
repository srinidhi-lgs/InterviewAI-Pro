package com.interviewai.dto.notification;

import com.interviewai.entity.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private UUID id;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean isRead;
    private Instant createdAt;
    private Instant readAt;
}
