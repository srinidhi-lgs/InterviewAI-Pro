package com.interviewai.dto.aiinterview;

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
public class AIInterviewReportResponse {
    private UUID sessionId;
    private String jobRole;
    private String interviewType;
    private String difficulty;
    
    // Scores
    private Integer overallScore;
    private Integer technicalScore;
    private Integer communicationScore;
    private Integer confidenceScore;
    private Integer fluencyScore;
    private Integer grammarScore;
    private Integer responseQualityScore;
    
    // Summary Metrics
    private Integer interviewDurationSeconds;
    private Integer questionsAnswered;
    private Integer totalQuestions;
    
    // Recommendations & Feedback
    private String hiringRecommendation;
    private String overallFeedback;
    private List<String> strengths;
    private List<String> areasForImprovement;
    
    private List<QuestionReport> questions;
    private Instant completedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionReport {
        private UUID id;
        private String question;
        private String expectedAnswer;
        private String candidateAnswer;
        private Integer score;
        private String aiFeedback;
        private String suggestedBetterAnswer;
    }
}
