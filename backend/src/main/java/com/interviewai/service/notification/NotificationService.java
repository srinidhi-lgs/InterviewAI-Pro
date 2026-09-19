package com.interviewai.service.notification;

import com.interviewai.dto.notification.NotificationResponse;
import com.interviewai.dto.notification.UnreadCountResponse;
import com.interviewai.entity.User;
import com.interviewai.entity.enums.NotificationType;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    List<NotificationResponse> getUserNotifications();
    UnreadCountResponse getUnreadCount();
    NotificationResponse markAsRead(UUID notificationId);
    void markAllAsRead();
    void createNotification(User user, String title, String message, NotificationType type);
}
