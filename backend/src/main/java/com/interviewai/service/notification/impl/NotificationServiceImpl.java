package com.interviewai.service.notification.impl;

import com.interviewai.dto.notification.NotificationResponse;
import com.interviewai.dto.notification.UnreadCountResponse;
import com.interviewai.entity.Notification;
import com.interviewai.entity.User;
import com.interviewai.entity.UserSettings;
import com.interviewai.entity.enums.NotificationType;
import com.interviewai.exception.ResourceNotFoundException;
import com.interviewai.repository.NotificationRepository;
import com.interviewai.repository.UserSettingsRepository;
import com.interviewai.security.CurrentUserService;
import com.interviewai.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final CurrentUserService currentUserService;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications() {
        User user = currentUserService.getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount() {
        User user = currentUserService.getCurrentUser();
        long count = notificationRepository.countByUserIdAndIsReadFalse(user.getId());
        return new UnreadCountResponse(count);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(UUID notificationId) {
        User user = currentUserService.getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to modify this notification");
        }
        
        if (!notification.getIsRead()) {
            notification.setIsRead(true);
            notification.setReadAt(Instant.now());
            notification = notificationRepository.save(notification);
        }
        
        return mapToResponse(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        User user = currentUserService.getCurrentUser();
        notificationRepository.markAllAsReadByUserId(user.getId(), Instant.now());
    }

    @Override
    @Transactional
    public void createNotification(User user, String title, String message, NotificationType type) {
        // Check settings to see if this type of notification is enabled
        UserSettings settings = userSettingsRepository.findByUserId(user.getId()).orElse(null);
        if (settings != null) {
            if (type == NotificationType.INTERVIEW && Boolean.FALSE.equals(settings.getInterviewReminders())) {
                log.debug("Skipping INTERVIEW notification due to user settings. User: {}", user.getId());
                return;
            }
            // For ATS, RESUME, SYSTEM, SECURITY, we generally don't have a specific setting to disable them,
            // or they are important enough to always deliver (unless productUpdates covers some).
        }
        
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
                
        notificationRepository.save(notification);
        log.debug("Created notification of type {} for user {}", type, user.getId());
    }
    
    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }
}
