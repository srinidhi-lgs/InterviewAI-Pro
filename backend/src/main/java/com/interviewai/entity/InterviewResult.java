package com.interviewai.entity;

import com.interviewai.entity.converter.JsonListConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "interview_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "interview_id", nullable = false, unique = true)
    private Interview interview;

    @Column(name = "overall_score", nullable = false)
    private Integer overallScore;

    @Column(name = "technical_score", nullable = false)
    private Integer technicalScore;

    @Column(name = "communication_score", nullable = false)
    private Integer communicationScore;

    @Convert(converter = JsonListConverter.class)
    @Column(name = "strengths", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> strengths = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "weaknesses", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> weaknesses = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "suggestions", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> suggestions = new ArrayList<>();

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
