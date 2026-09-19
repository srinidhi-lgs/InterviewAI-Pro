package com.interviewai.dto.interview;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;
import java.time.Instant;

@Data
@Builder
public class InterviewResponse {
    private UUID id;
    private String jobRole;
    private String experienceLevel;
    private String interviewType;
    private String difficulty;
    private Integer numQuestions;
    private String status;
    private Instant createdAt;
}
