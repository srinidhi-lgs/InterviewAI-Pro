package com.interviewai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 50)
    @Builder.Default
    private String theme = "system";

    @Column(name = "ai_model", length = 100)
    @Builder.Default
    private String aiModel = "gemini-2.5-flash";

    @Column(name = "ai_tone", length = 50)
    @Builder.Default
    private String aiTone = "professional";

    @Column(name = "response_length", length = 50)
    @Builder.Default
    private String responseLength = "medium";

    @Column(name = "default_interview_difficulty", length = 50)
    @Builder.Default
    private String defaultInterviewDifficulty = "medium";

    @Column(name = "preferred_language", length = 50)
    @Builder.Default
    private String preferredLanguage = "English";

    @Column(name = "email_notifications")
    @Builder.Default
    private Boolean emailNotifications = true;

    @Column(name = "interview_reminders")
    @Builder.Default
    private Boolean interviewReminders = true;

    @Column(name = "weekly_reports")
    @Builder.Default
    private Boolean weeklyReports = true;

    @Column(name = "product_updates")
    @Builder.Default
    private Boolean productUpdates = false;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Long version = 0L;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
