package com.interviewai.entity;

import com.interviewai.entity.converter.JsonListConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "resume_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysisEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "resume_id", nullable = false, unique = true)
    private Resume resume;

    @Column(name = "job_description", columnDefinition = "TEXT")
    private String jobDescription;

    // Extracted info
    @Column(name = "candidate_name")
    private String candidateName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "education", columnDefinition = "TEXT")
    private String education;

    @Column(name = "experience_text", columnDefinition = "TEXT")
    private String experienceText;

    @Column(name = "projects_text", columnDefinition = "TEXT")
    private String projectsText;

    @Column(name = "certifications_text", columnDefinition = "TEXT")
    private String certificationsText;

    // Statistics & Scores
    @Column(name = "ats_score", nullable = false)
    @Builder.Default
    private Integer atsScore = 0;

    @Column(name = "grammar_score", nullable = false)
    @Builder.Default
    private Integer grammarScore = 0;

    @Column(name = "formatting_score", nullable = false)
    @Builder.Default
    private Integer formattingScore = 0;

    @Column(name = "keyword_match_score", nullable = false)
    @Builder.Default
    private Integer keywordMatchScore = 0;

    @Column(name = "completeness_score", nullable = false)
    @Builder.Default
    private Integer completenessScore = 0;

    @Column(name = "job_match_percentage", nullable = false)
    @Builder.Default
    private Integer jobMatchPercentage = 0;

    @Column(name = "experience_years", nullable = false)
    @Builder.Default
    private Integer experienceYears = 0;

    @Column(name = "projects_count", nullable = false)
    @Builder.Default
    private Integer projectsCount = 0;

    @Column(name = "certificates_count", nullable = false)
    @Builder.Default
    private Integer certificatesCount = 0;

    // JSON Data
    @Convert(converter = JsonListConverter.class)
    @Column(name = "technical_skills", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> technicalSkills = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "soft_skills", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> softSkills = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "tools", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> tools = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "frameworks", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> frameworks = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "databases", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> databases = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "cloud", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> cloud = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "matched_keywords", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> matchedKeywords = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "missing_keywords", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> missingKeywords = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "missing_skills", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> missingSkills = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "matched_skills", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> matchedSkills = new ArrayList<>();

    @Convert(converter = JsonListConverter.class)
    @Column(name = "missing_sections", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> missingSections = new ArrayList<>();

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
