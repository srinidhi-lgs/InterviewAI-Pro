package com.interviewai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ai_interview_questions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"session_id", "question_order"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIInterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private AIInterviewSession session;

    @Column(name = "question_order", nullable = false)
    private Integer questionOrder;

    @Column(name = "category", nullable = false, length = 100)
    private String category;
    
    @Column(name = "difficulty", length = 50)
    private String difficulty;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(name = "expected_answer", columnDefinition = "TEXT")
    private String expectedAnswer;

    @Column(name = "user_answer", columnDefinition = "TEXT")
    private String userAnswer;
    
    @Column(name = "time_taken")
    private Integer timeTaken;

    @Column(name = "score")
    private Integer score;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

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
