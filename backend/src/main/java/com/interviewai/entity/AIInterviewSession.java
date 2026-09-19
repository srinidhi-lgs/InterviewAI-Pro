package com.interviewai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ai_interview_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIInterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "job_role", nullable = false)
    private String jobRole;

    @Column(name = "experience_level", nullable = false, length = 50)
    private String experienceLevel;

    @Column(name = "interview_type", nullable = false, length = 50)
    private String interviewType;

    @Column(name = "difficulty", nullable = false, length = 50)
    private String difficulty;

    @Column(name = "num_questions", nullable = false)
    private Integer numQuestions;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "score")
    private Integer score;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    @OrderBy("questionOrder ASC")
    private List<AIInterviewQuestion> questions = new ArrayList<>();

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
