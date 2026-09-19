package com.interviewai.dto.aiinterview;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class AIInterviewSessionResponse {
    private UUID id;
    private String jobRole;
    private String experienceLevel;
    private String interviewType;
    private String difficulty;
    private Integer numQuestions;
    private String status;
    private Integer score;
    private String feedback;
    private Instant startedAt;
    private Instant completedAt;
}
