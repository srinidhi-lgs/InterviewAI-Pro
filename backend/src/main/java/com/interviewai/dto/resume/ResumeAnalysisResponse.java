package com.interviewai.dto.resume;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeAnalysisResponse {
    private UUID resumeId;
    private String fileName;
    
    // Summary
    private String candidateName;
    private String email;
    private String phone;
    private String education;
    private Instant createdAt;
    private Long fileSize;

    // Scores
    private int atsScore;
    private int grammarScore;
    private int formattingScore;
    private int keywordMatchScore;
    private int completenessScore;
    private int jobMatchPercentage;

    // Stats
    private int experienceYears;
    private int projectsCount;
    private int certificatesCount;

    // Skills
    private List<String> technicalSkills;
    private List<String> softSkills;
    private List<String> tools;
    private List<String> frameworks;
    private List<String> databases;
    private List<String> cloud;

    // Match Analysis
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private List<String> missingSkills;
    private List<String> matchedSkills;

    private List<String> missingSections;
    private List<String> suggestions;
}
